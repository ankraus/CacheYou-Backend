const { cacheService } = require('../services');

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

const postCreateCache = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.postCreateCache(cache);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const postCollectCache = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.postCollectCache(cache);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const postCommentCache = async (req, res, next) => {
    const comment = req.body
    try {
        await cacheService.postCommentCache(comment);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const postTagCache = async (req, res, next) => {
    const tag = req.body
    try {
        await cacheService.postTagCache(tag);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const patchCache = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.patchCache(cache);
        res.sendStatus(200);
        next();        
    } catch (error) {
        next(error);
    }
}

const patchCacheComment = async (req, res, next) => {
    const comment = req.body
    try {
        await cacheService.patchCacheComment(comment);
        res.sendStatus(200);
        next();        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCaches, getCacheImages, getCacheComments, getCacheCollected,
    postCreateCache, postCollectCache, postCommentCache, postTagCache,
    patchCache, patchCacheComment
}