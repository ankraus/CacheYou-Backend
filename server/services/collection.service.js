const {
    collectionDb
} = require('../db');
const {
    DatabaseError,
    NotFoundError
} = require('../utils/errors')

const getCollections = async () => {
    try {
        return await collectionDb.getCollections();
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getCollection = async (collection_id) => {
    var collection = undefined
    try {
        collection = await collectionDb.getCollection(collection_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if (!collection) {
        throw new NotFoundError();
    }
    return collection;
}

module.exports = {
    getCollections,
    getCollection
}