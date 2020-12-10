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

const getCacheById = async (req, res, next) => {
    try {
        const cache = await cacheService.getCacheById(req.params.cache_id);
        res.json({
            cache: cache
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

const getTags = async (req, res, next) => {
    try {
        const tags = await cacheService.getTags();
        res.json({
            tags: tags
        });
    } catch (error) {
        next(error);
    }
}

const postCache = async (req, res, next) => {
    const cache = req.body;
    try {
        const cache_id = await cacheService.postCache(cache, req.user_id);
        res.status(201).json({
            cache_id: cache_id
        });
        next();
    } catch (error) {
        next(error);
    }
}

const postCacheCollect = async (req, res, next) => {
    try {
        await cacheService.postCacheCollect(req.params.cache_id, req.user_id);
        res.sendStatus(201);
        next();
    } catch (error) {
        next(error);
    }
}

const postCacheComment = async (req, res, next) => {
    const comment = req.body;
    const cache_id = req.params.cache_id
    const user_id = req.user_id
    try {
        const comment_id = await cacheService.postCacheComment(comment, cache_id, user_id);
        res.status(201).json({
            comment_id: comment_id
        });
        next();
    } catch (error) {
        next(error);
    }
}

const postCacheTags = async (req, res, next) => {
    const tags = req.body;
    const cache_id = req.params.cache_id
    try {
        await cacheService.postCacheTags(cache_id, tags);
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
    const cache_id = req.params.cache_id
    const user_id = req.user_id
    const comment_id = req.params.comment_id
    try {
        await cacheService.putCacheComment(comment, cache_id, user_id, comment_id);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const deleteCache = async (req, res, next) => {
    const cache_id = req.params.cache_id;
    const user_id = req.user_id
    try {
        await cacheService.deleteCache(user_id, cache_id);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const deleteCacheComment = async (req, res, next) => {
    const comment_id = req.params.comment_id;
    const user_id = req.user_id
    try {
        await cacheService.deleteCacheComment(user_id, comment_id);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}

const deleteCacheTags = async (req, res, next) => {
    const cache_id = req.params.cache_id;
    try {
        await cacheService.deleteCacheTags(cache_id);
        res.sendStatus(200);
        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getCaches,
    getCacheById,
    getCacheImages,
    getCacheComments,
    getCacheCollected,
    getTags,
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