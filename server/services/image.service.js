const {imageDb} = require('../db');
const { DatabaseError } = require('../utils/errors');

const getImage = async (image_id) => {
    try {
        return await imageDb.getImage(image_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

module.exports = {
    getImage
}