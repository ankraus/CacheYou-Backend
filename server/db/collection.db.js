const db = require('./db_connection');

const getCollections = async () => {
    const db_resp = await db.query(`SELECT * FROM collections`);
    return db_resp.rows;
}

const getCollection = async (collection_id) => {
    const db_resp = await db.query(`
            SELECT c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, array_agg(t.name) AS tags
            FROM caches c
            JOIN caches_tags ct USING (cache_id)
            JOIN users u USING (user_id)
            JOIN tags t USING (tag_id)
            JOIN caches_collections cc USING (cache_id)
            WHERE cc.collection_id = $1
            GROUP BY c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at`, [collection_id]);
    const db_collection_resp = await db.query(`
        SELECT co.title, co.user_id, u.username 
        FROM collections co 
        JOIN users u USING (user_id) 
        WHERE co.collection_id = $1`, [collection_id]);
    const collection = {
            title: db_collection_resp.rows[0].title,
            creator: {
                user_id: db_collection_resp.rows[0].user_id,
                username: db_collection_resp.rows[0].username
            },
            caches: db_resp.rows
        };
    return collection;
}

module.exports = {
    getCollections, getCollection
}