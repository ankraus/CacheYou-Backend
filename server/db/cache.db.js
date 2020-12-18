const db = require('./db_connection')
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError
} = require('../utils/errors');
const pgformat = require('pg-format');

const getCaches = async (user_id) => {
    const db_resp = await db.query(`
            SELECT * FROM v_caches
            WHERE (public OR user_id = $1)
        `, [user_id]);

    var caches = [];
    db_resp.rows.forEach((db_row) => {
        caches.push({
            cache_id: db_row.cache_id,
            cover_image_id: db_row.cover_image_id,
            latitude: db_row.latitude,
            longitude: db_row.longitude,
            title: db_row.title,
            description: db_row.description,
            link: db_row.link,
            tags: db_row.tags,
            creator: {
                username: db_row.username,
                user_id: db_row.user_id
            },
            public: db_row.public,
            created_at: db_row.created_at
        });
    });

    return caches;
};

const getRecommendedCaches = async (latitude, longitude, user_id, radius) => {
    const scoreQuery = `
        SELECT *
        FROM v_caches
            JOIN (
                WITH interests AS (
                    SELECT t.name 
                    FROM tags t JOIN users_interests ui USING (tag_id) 
                                JOIN users USING (user_id) 
                    WHERE user_id = %L::uuid
                    ),
                    distances AS (
                        SELECT 
                        c.cache_id,
                        ROUND(earth_distance(
                            ll_to_earth(c.latitude, c.longitude),
                            ll_to_earth(%L, %L)
                        )::numeric, 2) AS distance
                        FROM caches c
                    ) 
                SELECT c.cache_id,
                    d.distance,
                    ((RANK () OVER (ORDER BY (ROUND(d.distance / 500, 0) * 500) DESC))*0.5 + COUNT(t.name)) as score
                FROM interests i JOIN tags t ON i.name = t.name
                                JOIN caches_tags ct USING (tag_id)
                                JOIN caches c USING (cache_id)
                                JOIN distances d USING (cache_id)
                                WHERE distance <= %L
                                GROUP BY c.cache_id, d.distance
            ) dummy
        USING (cache_id)
        ORDER BY score DESC
    `
    const queryString = pgformat(scoreQuery, user_id, latitude, longitude, radius);
    const db_resp = await db.query(queryString);
    return db_resp.rows;
}

const getCloseCaches = async (latitude, longitude, radius) => {
    const scoreQuery = `
        WITH distances AS (
                SELECT 
                c.cache_id,
                ROUND(earth_distance(
                    ll_to_earth(c.latitude, c.longitude),
                    ll_to_earth(%L, %L)
                )::numeric, 2) AS distance
                FROM caches c
            ) 
        SELECT c.title, 
               d.distance
        FROM caches c 
            JOIN distances d USING (cache_id)
        WHERE distance <= %L
        GROUP BY c.title, d.distance
        ORDER BY d.distance ASC
    `
    const queryString = pgformat(scoreQuery, latitude, longitude, radius);
    const db_resp = await db.query(queryString);
    return db_resp.rows;
}

const getCacheById = async (cache_id, user_id) => {
    const db_resp = await db.query(`
        SELECT * 
        FROM v_caches_image_array
        WHERE cache_id = $1
        AND (public OR user_id = $2)
    `, [cache_id, user_id]);
    if (db_resp.rows.length < 1) {
        throw new NotFoundError();
    }
    const db_row = db_resp.rows[0];
    const cache = {
        cache_id: db_row.cache_id,
        latitude: db_row.latitude,
        longitude: db_row.longitude,
        title: db_row.title,
        description: db_row.description,
        link: db_row.link,
        tags: db_row.tags,
        image_ids: ((db_row.image_ids[0] == null) ? []:db_row.image_ids),
        creator: {
            username: db_row.username,
            user_id: db_row.user_id
        },
        public: db_row.public,
        created_at: db_row.created_at
    }
    return cache;
}

const getCacheImages = async (cache_id) => {
    const db_resp = await db.query(`
        SELECT array_agg(image_id) AS image_ids
        FROM caches_images 
        WHERE cache_id = $1::uuid`, [cache_id]);
    return db_resp.rows[0].image_ids;
}

const getCacheComments = async (cache_id) => {
    const db_resp = await db.query(`
        SELECT *
        FROM v_caches_comments
        WHERE cache_id = $1`, [cache_id]);
    var comments = [];
    db_resp.rows.forEach((db_row) => {
        comments.push({
            comment_id: db_row.comment_id,
            user: {
                username: db_row.username,
                user_id: db_row.user_id,
                image_id: db_row.image_id
            },
            content: db_row.content,
            created_at: db_row.created_at
        });
    });
    return comments;
}

const getCacheCollected = async (cache_id) => {
    const db_resp = await db.query(`
            SELECT *
            FROM v_caches_collected
            WHERE cache_id = $1`, [cache_id]);
    var collected = [];
    db_resp.rows.forEach((db_row) => {
        collected.push({
            user: {
                user_id: db_row.user_id,
                username: db_row.username
            },
            cache: {
                cache_id: db_row.cache_id,
                tags: db_row.tags,
                title: db_row.title
            },
            liked: db_row.liked,
            created_at: db_row.created_at
        })
    });
    return collected;
}

const getCommentById = async (comment_id) => {
    const db_resp = await db.query(`
        SELECT comment_id, user_id, cache_id, created_at, content
        FROM   comments
        WHERE  comment_id = $1::uuid`, [comment_id]);
    if (db_resp.rows.length < 1) {
        throw new NotFoundError();
    }
    return db_resp.rows[0]
}

const getTags = async () => {
    const db_resp = await db.query(`
        SELECT * FROM tags
    `);
    const tags = db_resp.rows.map(tag => tag.name);
    return tags;
}

const postCache = async (cache, user_id) => {
    const tags = cache.tags;
    await legitTags(tags);
    const db_resp = await db.query(`
        INSERT INTO caches (latitude, longitude, public, title, description, link, user_id) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING cache_id`,
        [cache.latitude, cache.longitude, cache.public, cache.title, cache.description, cache.link, user_id]);
    const cache_id = db_resp.rows[0].cache_id;
    insertTags(tags, cache_id);
    return cache_id;    
}

const postCacheCollect = async (cache_id, user_id) => {
    await db.query(`
        INSERT INTO collected (user_id, cache_id) VALUES
        ($1, $2)`
        , [user_id, cache_id]);
    return;
}

const postCacheLike = async (cache_id, user_id) => {
    const db_resp = await db.query(`
        SELECT *
        FROM collected
        WHERE user_id = $1 AND cache_id = $2
    `, [user_id, cache_id]);
    console.log(db_resp.rows, db_resp.rowCount);
    if(db_resp.rowCount != 1) {
        throw new ForbiddenError();
    }
    if(!db_resp.rows[0].liked) {
        await db.query(`
            UPDATE collected
            SET liked = TRUE
            WHERE user_id = $1 AND cache_id = $2
        `, [user_id, cache_id]);
    }
}

const postCacheComment = async (comment, cache_id, user_id) => {
    /*
    Nur Kommentieren wenn eingesammelt ?

    const collected = await db.query(`
        SELECT *
        FROM collected
        WHERE cache_id = $1 AND user_id = $2`
        , [cache_id, user_id]
    )
    if (collected.rows.length < 1){
        throw new ForbiddenError();
    } else {
        */
        const db_resp = await db.query(`
            INSERT INTO comments (user_id, cache_id, content) VALUES
            ($1, $2, $3)
            RETURNING comment_id`,
            [user_id, cache_id, comment]);
        const comment_id = db_resp.rows[0].comment_id;
        return comment_id;
    //}
}

const putCache = async (cache, user_id) => {
    const tags = cache.tags;
    await legitTags(tags);
    await authorizedUserForCache(cache.cache_id, user_id);
    await db.query(`
        UPDATE caches SET
        latitude = $1, 
        longitude = $2, 
        public = $3, 
        title = $4, 
        description = $5, 
        link = $6 
        WHERE cache_id = $7`
        , [cache.latitude, cache.longitude, cache.public, cache.title, cache.description, cache.link, cache.cache_id]);
    await insertTags(tags, cache.cache_id);
}

const putCacheComment = async (comment, user_id, comment_id) => {
    await authorizedUserForComment(comment_id, user_id);
    await db.query(`
        UPDATE comments 
        SET content = $1
        WHERE  comment_id = $2`
        , [comment, comment_id]);
}

const deleteCache = async (user_id, cache_id) => {
    await authorizedUserForCache(cache_id, user_id);
    await db.query(`
        DELETE FROM caches
        WHERE cache_id = $1`
        , [cache_id]);
}

const deleteCacheComment = async (user_id, comment_id) => {
    await authorizedUserForComment(comment_id, user_id);
    await db.query(`
        DELETE FROM comments
        WHERE comment_id = $1`
        , [comment_id]);   
}

const deleteCacheLike = async (cache_id, user_id) => {
    const db_resp = await db.query(`
        SELECT *
        FROM collected
        WHERE user_id = $1 AND cache_id = $2
    `, [user_id, cache_id]);
    if(db_resp.rows[0].liked) {
        await db.query(`
            UPDATE collected
            SET liked = FALSE
            WHERE user_id = $1 AND cache_id = $2
        `, [user_id, cache_id]);
    }
}

const deleteTags = async (cache_id) => {
    await db.query(`
        DELETE FROM caches_tags
        WHERE cache_id = $1
    `, [cache_id]);
}

const insertTags = async (tags, cache_id) => {
    await deleteTags(cache_id);
    await db.query(`
        INSERT INTO caches_tags(tag_id, cache_id)(
            SELECT tag_id, $1 as cache_id
            FROM tags t
            WHERE t.name IN (
                SELECT UNNEST($2::varchar[])
            )
        )`, [cache_id, tags]);
}

const legitTags = async (tags) => {
    const all_tags_not_in_db = await db.query(`
        SELECT name
        FROM (
            SELECT UNNEST($1::varchar[]) as name
        ) as tags_input
        WHERE tags_input.name NOT IN (
            SELECT name FROM tags
        )`, [tags]);
    if (all_tags_not_in_db.rows.length != 0) {
        const notFoundTags = all_tags_not_in_db.rows.map(x => x.name);
        throw new BadRequestError('One or more tags do not exist: ' + JSON.stringify(notFoundTags));
    }
}

const authorizedUserForComment = async (comment_id, user_id) => {
    const authorizedUserId = await db.query(`
        SELECT user_id
        FROM comments
        WHERE comment_id = $1`
        , [comment_id]);
    if (authorizedUserId.rows[0].user_id != user_id){
        throw new ForbiddenError('User isnt the creator of the this Comment');
    }
}

const authorizedUserForCache = async (cache_id, user_id) => {
    const authorizedUserId = await db.query(`
        SELECT user_id
        FROM caches
        WHERE cache_id = $1::uuid`
        , [cache_id]);
    if (!authorizedUserId.rows[0] || authorizedUserId.rows[0].user_id != user_id){
        throw new ForbiddenError('User isnt the creator of the this Cache');
    }
}


module.exports = {
    getCaches,
    getRecommendedCaches,
    getCloseCaches,
    getCacheById,
    getCacheImages,
    getCacheComments,
    getCacheCollected,
    getTags,
    getCommentById,
    postCache,
    postCacheCollect,
    postCacheLike,
    postCacheComment,
    putCache,
    putCacheComment,
    deleteCache,
    deleteCacheComment,
    deleteCacheLike
}