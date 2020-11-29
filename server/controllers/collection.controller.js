const {
    collectionService
} = require('../services');

const getCollections = async (req, res, next) => {
    try {
        const collections = await collectionService.getCollections();
        res.json({
            collections: collections
        });
    } catch (error) {
        next(error);
    }
}

const getCollection = async (req, res, next) => {
    try {
        const collection = await collectionService.getCollection(req.params.collection_id);
        res.json({
            collection: collection
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCollections,
    getCollection
}