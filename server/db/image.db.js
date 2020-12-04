const db = require('./db_connection');

const getImage = async (image_id) => {
    const db_resp = await db.query(`
        SELECT image, mimetype
        FROM images 
        WHERE image_id = $1::uuid`, [image_id]);
    return db_resp.rows[0];
}

const postProfilePicture = async (imageData, mimeType, userId, imageHash) => {
    const db_resp = await db.query(`
        INSERT INTO images(image, mimetype, image_hash) VALUES (
            $1, $2, $3
        ) RETURNING image_id
    `, [imageData, mimeType, imageHash]);
    const imageId = db_resp.rows[0].image_id;
    await db.query(`
        INSERT INTO users_images(user_id, image_id) VALUES (
            $1::uuid, $2::uuid
        )`, [userId, imageId]);
    await db.query(`
        UPDATE users
        SET image_id = $1
        WHERE user_id = $2`, [imageId, userId]);
    return db_resp.rows[0];
}

module.exports = {
    getImage,
    postProfilePicture
}