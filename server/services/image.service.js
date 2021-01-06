const {
    imageDb, userDb
} = require('../db');
const {
    DatabaseError,
    NotFoundError,
    ForbiddenError
} = require('../utils/errors');
const crypto = require('crypto')
const sharp = require('sharp');

const getImage = async (imageId, size) => {
    try {
        return await imageDb.getImage(imageId, size);
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
        const resizedImages = (await generateResizedImages(imageData));
        return await imageDb.postProfilePicture(resizedImages, mimeType, userId, imageHash);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCacheImage = async (imageData, mimeType, userId, cacheId, isCoverImage) => {
    try {
        const imageHash = hashImage(imageData);
        const resizedImages = (await generateResizedImages(imageData));
        return await imageDb.postCacheImage(resizedImages, mimeType, userId, imageHash, cacheId, isCoverImage);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteImage = async (imageId, user_id) => {
    let imageCreatorId;
    let userIsAdmin;
    try {
        imageCreatorId = (await imageDb.getImageInfo(imageId)).user_id;
        userIsAdmin = await userDb.getUserIsAdmin(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if(!(userIsAdmin || imageCreatorId == user_id)){
        throw new ForbiddenError();
    }
    try {
        await imageDb.deleteImage(imageId);
    } catch (error) {        
        throw new DatabaseError(error.message);
    }
}

const hashImage = (imageData) => crypto.createHash('md5').update(imageData).digest("hex");

const imageSizes = {icon: [64,64], small: [256], medium: [512], large: [1024]};

const generateResizedImages = async (imageData) => {
    let resizedImages = {};
    for(let size in imageSizes) {
        resizedImages[size] = await resizeImage(imageData, imageSizes[size]);
    }
    resizedImages['full'] = imageData;
    return resizedImages;
}

const resizeImage = async (imageData, size) => {
    let resizedImage;
    await sharp(imageData)
        .resize(...size)
        .toBuffer()
        .then(data => resizedImage = data)
        .catch(err => console.log(err));
    return resizedImage;
}

module.exports = {
    getImage,
    getImageInfo,
    postProfilePicture,
    postCacheImage,
    deleteImage
}