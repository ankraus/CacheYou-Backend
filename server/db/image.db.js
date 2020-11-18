const db = require('./db_connection');

const getImage = async (image_id) => {
    const db_resp = await db.query(`
        SELECT image
        FROM images 
        WHERE image_id = $1::uuid`, [image_id]);
    return db_resp.rows[0].image;
}

module.exports = {
    getImage
}