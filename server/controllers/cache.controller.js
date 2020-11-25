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

const postCache = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.postCache(cache);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const postCacheCollect = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.postCacheCollect(cache);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const postCacheComment = async (req, res, next) => {
    const comment = req.body
    try {
        await cacheService.postCacheComment(comment);
        res.sendStatus(201);
        next();        
    } catch (error) {
        next(error);
    }
}

const postCacheTag = async (req, res, next) => {
    const tag = req.body
    try {
        await cacheService.postCacheTag(tag);
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

const deleteCache = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.deleteCache(cache);
        res.sendStatus(200);
        next();        
    } catch (error) {
        next(error);
    }
}

const deleteCacheComment = async (req, res, next) => {
    const comment = req.body
    try {
        await cacheService.deleteCacheComment(comment);
        res.sendStatus(200);
        next();        
    } catch (error) {
        next(error);
    }
}

const deleteCacheTags = async (req, res, next) => {
    const cache = req.body
    try {
        await cacheService.deleteCacheTags(cache);
        res.sendStatus(200);
        next();        
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getCaches, getCacheImages, getCacheComments, getCacheCollected,
    postCache, postCacheCollect, postCacheComment, postCacheTag,
    patchCache, patchCacheComment,
    deleteCache, deleteCacheComment, deleteCacheTags
}