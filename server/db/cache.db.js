const db = require('./db_connection')

const getCaches = async () => {
    const db_resp = await db.query(`
            SELECT c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, array_agg(t.name) AS tags
            FROM caches c
            JOIN caches_tags ct USING (cache_id)
            JOIN users u USING (user_id)
            JOIN tags t USING (tag_id)
            GROUP BY c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at
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

const getCacheImages = async (cache_id) => {
    const db_resp = await db.query(`
        SELECT array_agg(image_id) AS image_ids
        FROM caches_images 
        WHERE cache_id = $1::uuid`, [cache_id]);
    return db_resp.rows[0].image_ids;
}

const getCacheComments = async (cache_id) => {
    const db_resp = await db.query(`
        SELECT c.comment_id, c.content, c.created_at, u.username, u.user_id 
        FROM comments c 
        JOIN caches ca USING (cache_id) 
        JOIN users u ON u.user_id = c.user_id
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
            SELECT u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at, array_agg(t.name) AS tags
            FROM collected col 
            JOIN users u USING (user_id) 
            JOIN caches c USING (cache_id) 
            JOIN caches_tags ct USING (cache_id)
            JOIN tags t USING (tag_id)
            WHERE c.cache_id = $1
            GROUP BY u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at`, [cache_id]);
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

const getCacheById = async (cache_id) => {
    const db_resp = await db.query(`
        SELECT cache_id, latitude, longitude, title, description, link
        FROM   cache 
        WHERE  cache_id = $1::uuid`, [cache_id]);
    return db_resp.rows[0]
}

const getCommentById = async (comment_id) => {
    const db_resp = await db.query(`
        SELECT comment_id, content, created_at
        FROM   comments
        WHERE  comment_id = $1::uuid`, [comment_id]);
    return db_resp.rows[0]
}

const postCreateCache = async (cache) => {
    await db.query(``);
    return;
}

const postCollectCache = async (cache) => {
    await db.query(``);
    return;
}

const postCommentCache = async (cache) => {
    await db.query(``);
    return;
}

const postTagCache = async (cache) => {
    await db.query(``);
    return;
}

const patchCache = async (cache) => {
    await db.query(``);
    return;
}

const patchCacheComment = async (cache) => {
    await db.query(``);
    return;
}



module.exports = { 
    getCaches, getCacheImages, getCacheComments, getCacheCollected, getCacheById, getCommentById,
    postCreateCache, postCollectCache, postCommentCache, postTagCache,
    patchCache, patchCacheComment 
}