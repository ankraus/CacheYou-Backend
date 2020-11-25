const { cacheDb } = require('../db');
const { DatabaseError } = require('../utils/errors');

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

const postCommentCache = async (cache) => {
    try {
        await cacheDb.postCommentCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postTagCache = async (cache) => {
    try {
        await cacheDb.postTagCache(cache);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

module.exports = {
    getCaches, getCacheImages, getCacheComments, getCacheCollected,
    postCreateCache, postCollectCache, postCommentCache, postTagCache
}