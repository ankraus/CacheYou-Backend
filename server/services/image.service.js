const {
    imageDb
} = require('../db');
const {
    DatabaseError,
    NotFoundError
} = require('../utils/errors');
const crypto = require('crypto')

const getImage = async (imageId) => {
    try {
        return await imageDb.getImage(imageId);
    } catch (error) {
        if(error instanceof NotFoundError){
            throw error;
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const getImageInfo = async (imageId) => {
    try {
        return await imageDb.getImageInfo(imageId);
    } catch (error) {
        if(error instanceof NotFoundError){
            throw error;
        } else {
            throw new DatabaseError(error.message);
        }
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
    getImageInfo,
    postProfilePicture,
    postCacheImage,
    deleteImage
}