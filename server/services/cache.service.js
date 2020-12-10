const {
    cacheDb
} = require('../db');
const {
    DatabaseError,
    NotFoundError,
    BadRequestError
} = require('../utils/errors');

const getCaches = async () => {
    try {
        return await cacheDb.getCaches();
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getCacheById = async (cache_id) => {
    try {
        return await cacheDb.getCacheById(cache_id);
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

const postCacheComment = async (comment, cache_id, user_id) => {
    try {
        return await cacheDb.postCacheComment(comment, cache_id, user_id);
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const postCacheTags = async (cache_id, tags) => {
    try {
        await cacheDb.postCacheTags(cache_id, tags);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const putCache = async (cache) => {
    try {
        await cacheDb.getCacheById(cache.cache_id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.putCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const putCacheComment = async (comment, cache_id, user_id, comment_id) => {
    try {
        await cacheDb.getCommentById(comment_id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.putCacheComment(comment, cache_id, user_id);
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

const deleteCacheComment = async (comment_id) => {
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

const deleteCacheTags = async (cache_id) => {
    try {
        await cacheDb.getCacheById(cache_id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.deleteCacheTags(cache_id);
    } catch (error) {
        throw new DatabaseError(error.message);
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