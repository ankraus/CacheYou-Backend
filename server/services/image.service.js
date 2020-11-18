const {imageDb} = require('../db');

const getImage = async (image_id) => {
    try {
        return await imageDb.getImage(image_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getImage
}