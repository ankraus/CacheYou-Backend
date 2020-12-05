const db = require('./db_connection');

const getImage = async (imageId) => {
    const db_resp = await db.query(`
        SELECT image, mimetype
        FROM images 
        WHERE image_id = $1::uuid`, [imageId]);
    return db_resp.rows[0];
}

const getImageByImageHash = async (imageHash) => {
    const db_resp = await db.query(`
        SELECT image_id
        FROM images
        WHERE image_hash = $1
    `, [imageHash]);
    return db_resp.rows[0].image_id;
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
        await removeCoverImage(cacheId);
    }
    await db.query(`
        INSERT INTO caches_images(cache_id, image_id, is_cover_image) 
        VALUES ($1, $2, $3)`, [cacheId, imageId, isCoverImage]);
    return {image_id: imageId};
}

const setCoverImage = async (imageId, cacheId) => {
    await removeCoverImage(cacheId);
    await db.query(`
        UPDATE caches_images
        SET is_cover_image = true
        WHERE cache_id = $1 AND image_id = $2
    `, [cacheId, imageId]);
}

const deleteImage = async (imageId) => {
    const cacheIds = (await db.query(`
        SELECT cache_id
        FROM caches_images
        WHERE image_id = $1 AND is_cover_image
    `, [imageId])).rows;
    await db.query(`
        DELETE FROM images
        WHERE image_id = $1`, [imageId]);
    if(cacheIds.length != 0){
        for(let id in cacheIds) {
            const firstImg = (await db.query(`
                SELECT image_id
                FROM caches_images
                WHERE cache_id = $1
                LIMIT 1
            `, [cacheIds[id].cache_id])).rows[0];
            if(firstImg){
                await db.query(`
                    UPDATE caches_images
                    SET is_cover_image = true
                    WHERE image_id = $1
                `, [firstImg.image_id]);
            }
        }
    }
}

const removeCoverImage = async (cacheId) => {
    await db.query(`
            UPDATE caches_images
            SET is_cover_image = false
            WHERE cache_id = $1`, [cacheId]);
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
    getImageByImageHash,
    postCacheImage,
    setCoverImage,
    deleteImage,
    postProfilePicture
}