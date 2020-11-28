const db = require('./db_connection');

const getCollections = async () => {
    const db_resp = await db.query(`SELECT * FROM collections`);
    return db_resp.rows;
}

const getCollection = async (collection_id) => {
    const db_resp = await db.query(`
            SELECT * 
            FROM v_caches_collections 
            WHERE collection_id = $1
            `, [collection_id]);
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