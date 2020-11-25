const { cacheDb } = require('../db');
const { DatabaseError, NotFoundError } = require('../utils/errors');

const getCaches = async () => {
    try {
        return await cacheDb.getCaches();
    } catch (error) {
        throw new DatabaseError(error.message);
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

const postCreateCache = async (cache) => {
    try {
        await cacheDb.postCreateCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCollectCache = async (cache) => {
    try {
        await cacheDb.postCollectCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postCommentCache = async (comment) => {
    try {
        await cacheDb.postCommentCache(comment);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postTagCache = async (tag) => {
    try {
        await cacheDb.postTagCache(tag);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const patchCache = async (cache) => {
    try {
        await cacheDb.getCacheById(cache.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.patchCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const patchCacheComment = async (comment) => {
    try {
        await cacheDb.getCommentById(comment.id)
    } catch (error) {
        throw new NotFoundError();
    }
    try {
        await cacheDb.patchCacheComment(comment);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

module.exports = {
    getCaches, getCacheImages, getCacheComments, getCacheCollected,
    postCreateCache, postCollectCache, postCommentCache, postTagCache,
    patchCache, patchCacheComment
}