const { cacheDb } = require('../db');

const getCaches = async () => {
    try {
        return await cacheDb.getCaches();
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCacheImages = async (cache_id) => {
    try {
        return await cacheDb.getCacheImages(cache_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCacheComments = async (cache_id) => {
    try {
        return await cacheDb.getCacheComments(cache_id)
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCacheCollected = async (cache_id) => {
    try {
        return await cacheDb.getCacheCollected(cache_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getCaches, getCacheImages, getCacheComments, getCacheCollected
}