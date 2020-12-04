const {
    imageDb
} = require('../db');
const {
    DatabaseError
} = require('../utils/errors');
const crypto = require('crypto')

const getImage = async (image_id) => {
    try {
        return await imageDb.getImage(image_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postProfilePicture = async (imageData, mimeType, userId) => {
    try {
        let imageHash = crypto.createHash('md5').update(imageData).digest("hex");
        return await imageDb.postProfilePicture(imageData, mimeType, userId, imageHash);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

module.exports = {
    getImage,
    postProfilePicture
}