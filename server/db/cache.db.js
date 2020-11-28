const db = require('./db_connection')
const {
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
        FROM v_caches
        WHERE cache_id = $1
    `, [cache_id]);
    if(db_resp.rows.length < 1) {
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
        SELECT comment_id, content, created_at
        FROM   comments
        WHERE  comment_id = $1::uuid`, [comment_id]);
    return db_resp.rows[0]
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
        throw new NotFoundError('One or more tags do not exist: ' + JSON.stringify(notFoundTags));
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

const postCacheCollect = async (cache) => {
    await db.query(``);
    return;
}

const postCacheComment = async (comment) => {
    await db.query(``);
    return;
}

const postCacheTags = async (tag) => {
    await db.query(``);
    return;
}

const putCache = async (cache) => {
    await db.query(``);
    return;
}

const putCacheComment = async (comment) => {
    await db.query(``);
    return;
}

const deleteCache = async (cache_id) => {
    await db.query(``);
    return;
}

const deleteCacheComment = async (comment_id) => {
    await db.query(``);
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