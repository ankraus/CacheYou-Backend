const {
    imageService
} = require('../services');

const getImage = async (req, res, next) => {
    const defaultImageSize = 'large';
    try {
        const imageSize = req.params.image_size ? req.params.image_size : defaultImageSize;
        const {image, mimetype} = await imageService.getImage(req.params.image_id, imageSize);
        res.type(mimetype);
        res.end(image, 'binary');
    } catch (error) {
        next(error);
    }
}

const getImageInfo = async (req, res, next) => {
    try {
        const imageInfo = await imageService.getImageInfo(req.params.image_id);
        res.status(200).json(imageInfo);
    } catch (error) {
        next(error);
    }
}

const postProfilePicture = async (req, res, next) => {
    try {
        const imageData = req.body;
        const mimeType = req.header('Content-Type');
        const userId = req.user_id;
        const imageId = await imageService.postProfilePicture(imageData, mimeType, userId);
        res.status(200).json(imageId);
    } catch (error) {
        next(error);
    }
}

const postCacheImage = async (req, res, next) => {
    try {
        const imageData = req.body;
        const mimeType = req.header('Content-Type');
        const userId = req.user_id;
        const isCoverImage = req.route.path === '/images/caches/:cache_id/cover'
        const cacheId = req.params.cache_id;
        const imageId = await imageService.postCacheImage(imageData, mimeType, userId, cacheId, isCoverImage);
        res.status(200).json(imageId);
    } catch (error) {
        next(error);
    }
}

const deleteImage = async (req, res, next) => {
    try {
        const imageId = req.params.image_id;
        const userId = req.user_id;
        await imageService.deleteImage(imageId, userId);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getImage,
    getImageInfo,
    postProfilePicture,
    postCacheImage,
    deleteImage
}