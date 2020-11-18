const { imageService } = require('../services');

const getImage = async (req, res, next) => {
    try {
        const image = await imageService.getImage(req.params.image_id);
        res.type('png');
        res.end(image, 'binary');
    } catch (error) {
        res.sendStatus(500) && next(error);
    }
}

module.exports = {
    getImage
}