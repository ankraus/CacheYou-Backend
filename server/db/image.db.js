const db = require('./db_connection');

const getImage = async (image_id) => {
    const db_resp = await db.query(`
        SELECT image, mimetype
        FROM images 
        WHERE image_id = $1::uuid`, [image_id]);
    return db_resp.rows[0];
}

const postProfilePicture = async (imageData, mimeType, userId, imageHash) => {
    const imageId = await insertImage(imageData, mimeType, userId, imageHash);
    await db.query(`
        UPDATE users
        SET image_id = $1
        WHERE user_id = $2`, [imageId, userId]);
    return imageId;
}

const postCacheImage = async (imageData, mimeType, userId, imageHash, cacheId, isCoverImage) => {
    const imageId = await insertImage(imageData, mimeType, userId, imageHash);
    if(isCoverImage) {
        await db.query(`
            UPDATE caches_images
            SET is_cover_image = false
            WHERE cache_id = $1`, [cacheId]);
    }
    await db.query(`
        INSERT INTO caches_images(cache_id, image_id, is_cover_image) 
        VALUES ($1, $2, $3)`, [cacheId, imageId, isCoverImage]);
    return {image_id: imageId};
}

const insertImage = async (imageData, mimeType, userId, imageHash) => {
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
    return imageId;
}

module.exports = {
    getImage,
    postCacheImage,
    postProfilePicture
}