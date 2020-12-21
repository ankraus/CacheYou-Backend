const { NotFoundError } = require('../utils/errors');
const db = require('./db_connection');
const pgformat = require('pg-format');

const getImage = async (imageId, size) => {
    const imageSize = 'image' + (size != 'full' ? '_' + size : '');
    const queryString = pgformat(`SELECT %I AS image, mimetype
                                  FROM images 
                                  WHERE image_id = $1::uuid`,
                                  imageSize);
    const db_resp = await db.query(queryString, [imageId]);
    if(db_resp.rowCount != 1){
        throw new NotFoundError();
    } else if(!db_resp.rows[0].image) {
        throw new NotFoundError('Image not found in specified size. Try \'full\'.');
    }
    return db_resp.rows[0];
}

const getImageInfo = async (imageId) => {
    const db_resp = await db.query(`
        SELECT *
        FROM v_image_info
        WHERE image_id = $1::uuid`, [imageId]);
    if(db_resp.rowCount != 1){
        throw new NotFoundError();
    }
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

const postProfilePicture = async (images, mimeType, userId, imageHash) => {
    const imageId = await insertImage(images, mimeType, userId, imageHash);
    await db.query(`
        UPDATE users
        SET image_id = $1
        WHERE user_id = $2`, [imageId, userId]);
    return {image_id: imageId};
}

const postCacheImage = async (images, mimeType, userId, imageHash, cacheId, isCoverImage) => {
    const imageId = await insertImage(images, mimeType, userId, imageHash);
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

const insertImage = async (images, mimeType, userId, imageHash) => {
    const db_resp = await db.query(`
        INSERT INTO images(image, image_large, image_medium, image_small, image_icon, mimetype, image_hash) VALUES (
        $1, $2, $3, $4, $5, $6, $7
        ) RETURNING image_id
    `, [images['full'], images['large'], images['medium'], images['small'], images['icon'], mimeType, imageHash]);
    const imageId = db_resp.rows[0].image_id;
    await db.query(`
        INSERT INTO users_images(user_id, image_id) VALUES (
        $1::uuid, $2::uuid
    )`, [userId, imageId]);
    return imageId;
}

module.exports = {
    getImage,
    getImageInfo,
    getImageByImageHash,
    postCacheImage,
    setCoverImage,
    deleteImage,
    postProfilePicture
}