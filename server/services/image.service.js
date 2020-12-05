const {
    imageDb
} = require('../db');
const {
    DatabaseError
} = require('../utils/errors');
const crypto = require('crypto')

const getImage = async (imageId) => {
    try {
        return await imageDb.getImage(imageId);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postProfilePicture = async (imageData, mimeType, userId) => {
    try {
        const imageHash = hashImage(imageData);
        return await imageDb.postProfilePicture(imageData, mimeType, userId, imageHash);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCacheImage = async (imageData, mimeType, userId, cacheId, isCoverImage) => {
    try {
        const imageHash = hashImage(imageData);
        return await imageDb.postCacheImage(imageData, mimeType, userId, imageHash, cacheId, isCoverImage);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteImage = async (imageId) => {
    try {
        await imageDb.deleteImage(imageId);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const hashImage = (imageData) => crypto.createHash('md5').update(imageData).digest("hex");

module.exports = {
    getImage,
    postProfilePicture,
    postCacheImage,
    deleteImage
}