const db = require('./db_connection')
const {
    BadRequestError,
    NotFoundError
} = require('../utils/errors');

const getCaches = async () => {
    const db_resp = await db.query(`
            SELECT * FROM v_caches
        `);

    var caches = [];
    db_resp.rows.forEach((db_row) => {
        caches.push({
            cache_id: db_row.cache_id,
            cover_image_id: db_row.image_id,
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
            created_at: db_row.created_at
        });
    });

    return caches;
};

const getCacheById = async (cache_id) => {
    const db_resp = await db.query(`
        SELECT * 
        FROM v_caches_image_array
        WHERE cache_id = $1
    `, [cache_id]);
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
        image_ids: db_row.image_ids,
        creator: {
            username: db_row.username,
            user_id: db_row.user_id
        },
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
                user_id: db_row.user_id
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
    const all_tags_not_in_db = await db.query(`
        SELECT name
        FROM (
            SELECT UNNEST($1::varchar[]) as name
        ) as tags_input
        WHERE tags_input.name NOT IN (
            SELECT name FROM tags
        )`, [cache.tags]);
    if (all_tags_not_in_db.rows.length != 0) {
        const notFoundTags = all_tags_not_in_db.rows.map(x => x.name);
        throw new BadRequestError('One or more tags do not exist: ' + JSON.stringify(notFoundTags));
    }
    const db_resp = await db.query(`
        INSERT INTO caches (latitude, longitude, public, title, description, link, user_id) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING cache_id`,
        [cache.latitude, cache.longitude, cache.public, cache.title, cache.description, cache.link, user_id]);
    const cache_id = db_resp.rows[0].cache_id;
    await db.query(`
        INSERT INTO caches_tags(tag_id, cache_id)(
            SELECT tag_id, $1 as cache_id
            FROM tags t
            WHERE t.name IN (
                SELECT UNNEST($2::varchar[])
            )
        )`, [cache_id, cache.tags]);
    return cache_id;
}

// Erstes post: Eintrag in collect; Sonst: Liken oder Entliken    oder lieber neue Route zum liken?
const postCacheCollect = async (cache_id, user_id) => {
    const alreadyLiked = await db.query(`
        SELECT liked
        FROM   collected
        WHERE  user_id = $1 AND cache_id = $2`
        , [user_id, cache_id]);
    if (alreadyLiked.rows.length == 0){
        await db.query(`
            INSERT INTO collected (user_id, cache_id) VALUES
            ($1, $2)`
            , [user_id, cache_id]);
    } else if (!alreadyLiked.rows[0].liked) {        // geht das?
        await db.query(`
            UPDATE collected 
            SET liked = TRUE
            WHERE  user_id = $1 AND cache_id = $2`
            , [user_id, cache_id]);
    } else {
        await db.query(`
            UPDATE collected 
            SET liked = FALSE
            WHERE  user_id = $1 AND cache_id = $2`
            , [user_id, cache_id]);
    }
    return;
}

const postCacheComment = async (comment, cache_id, user_id) => {
    const db_resp = await db.query(`
        INSERT INTO comments (user_id, cache_id, content) VALUES
        ($1, $2, $3)
        RETURNING comment_id`,
        [user_id, cache_id, comment]);
    const comment_id = db_resp.rows[0].comment_id;
    return comment_id;
}

// Brauchen wir nicht ?
const postCacheTags = async (tag) => {
    await db.query(``);
    return;
}

const putCache = async (cache) => {
    await db.query(`
        
    `);
    return;
}

const putCacheComment = async (comment, cache_id, user_id) => {
    await db.query(`
        UPDATE comments 
        SET content = $1
        WHERE  cache_id = $2 AND user_id = $3`
        , [comment, cache_id, user_id]);
    return;
}

const deleteCache = async (cache_id) => {
    await db.query(``);
    return;
}

const deleteCacheComment = async (comment_id) => {
    await db.query(`
        DELETE FROM comments
        WHERE comment_id = $1`
        , [comment_id]);
    return;
}

const deleteCacheTags = async (cache_id) => {
    await db.query(``);
    return;
}



module.exports = {
    getCaches,
    getCacheById,
    getCacheImages,
    getCacheComments,
    getCacheCollected,
    getTags,
    getCommentById,
    postCache,
    postCacheCollect,
    postCacheComment,
    postCacheTags,
    putCache,
    putCacheComment,
    deleteCache,
    deleteCacheComment,
    deleteCacheTags
}