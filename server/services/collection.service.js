const {collectionDb} = require('../db');

const getCollections = async () => {
    try {
        return await collectionDb.getCollections();
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCollection = async (collection_id) => {
    try {
        return await collectionDb.getCollection(collection_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getCollections, getCollection
}