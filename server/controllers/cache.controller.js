const {
    cacheService
} = require('../services');

const getCaches = async (req, res, next) => {
    try {
        const caches = await cacheService.getCaches();
        res.json({
            caches: caches
        });
    } catch (error) {
        next(error);
    }
}

const getCacheImages = async (req, res, next) => {
    try {
        const images = await cacheService.getCacheImages(req.params.cache_id);
        res.json({
            images: images
        });
    } catch (error) {
        next(error);
    }
}

const getCacheComments = async (req, res, next) => {
    try {
        const comments = await cacheService.getCacheComments(req.params.cache_id);
        res.json({
            comments: comments
        });
    } catch (error) {
        next(error);
    }
}

const getCacheCollected = async (req, res, next) => {
    try {
        const collected = await cacheService.getCacheCollected(req.params.cache_id);
        res.json({
            collected: collected
        });
    } catch (error) {
        next(error);
    }
}

const postCache = async (req, res, next) => {
    const cache = req.body;
    try {
        const cache_id = await cacheService.postCache(cache, req.user_id);
        res.status(201).json({cache_id: cache_id});
        next();
    } catch (error) {
        next(error);
    }
}

const postCacheCollect = async (req, res, next) => {
    const cache = req.body;
    try {
        await cacheService.postCacheCollect(cache);
        res.sendStatus(201);
        next();
    } catch (error) {
        next(error);
    }
}

const postCacheComment = async (req, res, next) => {
    const comment = req.body;
    try {
        await cacheService.postCacheComment(comment);
        res.sendStatus(201);
        next();
    } catch (error) {
        next(error);
    }
}

const postCacheTags = async (req, res, next) => {
    const tag = req.body;
    try {
        await cacheService.postCacheTags(tag);
        res.sendStatus(201);
        next();
    } catch (error) {
        next(error);
    }
}

const putCache = async (req, res, next) => {
    const cache = req.body;
    try {
        await cacheService.putCache(cache);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const putCacheComment = async (req, res, next) => {
    const comment = req.body;
    try {
        await cacheService.putCacheComment(comment);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const deleteCache = async (req, res, next) => {
    const cache = req.body;
    try {
        await cacheService.deleteCache(cache);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const deleteCacheComment = async (req, res, next) => {
    const comment = req.body;
    try {
        await cacheService.deleteCacheComment(comment);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const deleteCacheTags = async (req, res, next) => {
    const cache = req.body;
    try {
        await cacheService.deleteCacheTags(cache);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getCaches,
    getCacheImages,
    getCacheComments,
    getCacheCollected,
    postCache,
    postCacheCollect,
    postCacheComment,
    postCacheTags,
    putCache,
    putCacheComment,
    deleteCache,
    deleteCacheComment,
    deleteCacheTags
}