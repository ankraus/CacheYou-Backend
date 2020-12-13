const {
    cacheDb
} = require('../db');
const {
    DatabaseError,
    NotFoundError,
    BadRequestError,
    ForbiddenError
} = require('../utils/errors');

const getCaches = async (user_id) => {
    try {
        return await cacheDb.getCaches(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getCacheById = async (cache_id, user_id) => {
    try {
        return await cacheDb.getCacheById(cache_id, user_id);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const getCacheImages = async (cache_id) => {
    try {
        return await cacheDb.getCacheImages(cache_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getCacheComments = async (cache_id) => {
    try {
        return await cacheDb.getCacheComments(cache_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getCacheCollected = async (cache_id) => {
    try {
        return await cacheDb.getCacheCollected(cache_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getTags = async () => {
    try {
        return await cacheDb.getTags();
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCache = async (cache, user_id) => {
    try {
        return await cacheDb.postCache(cache, user_id);
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const postCacheCollect = async (cache_id, user_id) => {
    try {
        await cacheDb.postCacheCollect(cache_id, user_id);
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const postCacheLike = async (cache_id, user_id) => {
    try {
        await cacheDb.postCacheLike(cache_id, user_id);
    } catch (error) {
        if(error instanceof ForbiddenError){
            throw error;
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const postCacheComment = async (comment, cache_id, user_id) => {
    try {
        const content = comment.content;
        return await cacheDb.postCacheComment(content, cache_id, user_id);
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const putCache = async (cache, user_id) => {
    try {
        const dbCache = await cacheDb.getCacheById(cache.cache_id)
        cache.latitude = cache.latitude || dbCache.latitude,
        cache.longitude = cache.longitude || dbCache.longitude,
        cache.title = cache.title || dbCache.title,
        cache.description = cache.description || dbCache.description,
        cache.link = cache.link || dbCache.link,
        cache.tags = cache.tags || dbCache.tags
        cache.public = (cache.public != undefined ? cache.public : dbCache.public);
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.putCache(cache, user_id);
    } catch (error) {
        if(error instanceof ForbiddenError) {
            throw error;
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const putCacheComment = async (comment, user_id, comment_id) => {
    try {
        await cacheDb.getCommentById(comment_id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.putCacheComment(comment, user_id, comment_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteCache = async (user_id, cache_id) => {
    try {
        await cacheDb.getCacheById(cache_id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.deleteCache(user_id, cache_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteCacheComment = async (user_id, comment_id) => {
    try {
        await cacheDb.getCommentById(comment_id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.deleteCacheComment(user_id, comment_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteCacheLike = async (cache_id, user_id) => {
    try {
        await cacheDb.deleteCacheLike(cache_id, user_id);
    } catch (error) {
        if(error instanceof ForbiddenError){
            throw error;
        } else {
            throw new DatabaseError(error.message);
        }
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
    postCacheLike,
    postCacheComment,
    putCache,
    putCacheComment,
    deleteCache,
    deleteCacheComment,
    deleteCacheLike
}