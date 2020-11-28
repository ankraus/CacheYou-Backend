const {
    cacheDb
} = require('../db');
const {
    DatabaseError,
    NotFoundError
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
        if(error instanceof NotFoundError){
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

const postCache = async (cache, user_id) => {
    try {
        return await cacheDb.postCache(cache, user_id);
    } catch (error) {
        if(error instanceof NotFoundError) {
            throw error
        } else {
            throw new DatabaseError(error.message);
        }
    }
}

const postCacheCollect = async (cache) => {
    try {
        await cacheDb.postCacheCollect(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCacheComment = async (comment) => {
    try {
        await cacheDb.postCacheComment(comment);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCacheTags = async (tag) => {
    try {
        await cacheDb.postCacheTags(tag);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const putCache = async (cache) => {
    try {
        await cacheDb.getCacheById(cache.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.putCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const putCacheComment = async (comment) => {
    try {
        await cacheDb.getCommentById(comment.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.putCacheComment(comment);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteCache = async (cache) => {
    try {
        await cacheDb.getCacheById(cache.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.deleteCache(cache.id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteCacheComment = async (comment) => {
    try {
        await cacheDb.getCommentById(comment.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.deleteCacheComment(comment.id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const deleteCacheTags = async (cache) => {
    try {
        await cacheDb.getCacheById(cache.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.deleteCacheTags(cache.id);
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