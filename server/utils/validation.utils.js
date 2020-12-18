// const schemas = require('./validation.schemas');
// const eym = require('express-yup-middleware');

const eym = require('express-yup').validate;
const schemas = require('../utils/validation.schemas');

const validateIds = eym(schemas.uuidSchema);
const validateImageSizes = eym(schemas.imageSizesSchema);
const validateCoordinates = eym(schemas.coordinatesSchema);
const validateImageTypes = eym(schemas.imageTypesSchema);
const validateLogin = eym(schemas.loginSchema);
const validateRegistration = eym(schemas.registerSchema);
const validateCreateCache = eym(schemas.createCacheSchema);
const validateComment = eym(schemas.commentSchema);
const validateUpdateUser = eym(schemas.updateUserSchema);
const validateCollection = eym(schemas.collectionSchema);
const validateUpdateCollection = eym(schemas.updateCollectionSchema);

module.exports = {
    validateIds,
    validateImageSizes,
    validateCoordinates,
    validateImageTypes,
    validateLogin,
    validateRegistration,
    validateCreateCache,
    validateComment,
    validateUpdateUser,
    validateCollection,
    validateUpdateCollection
}