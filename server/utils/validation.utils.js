// const schemas = require('./validation.schemas');
// const eym = require('express-yup-middleware');

const eym = require('express-yup').validate;
const schemas = require('../utils/validation.schemas');

const validateLogin = eym(schemas.loginSchema);
const validateRegistration = eym(schemas.registerSchema);
const validateCreateCache = eym(schemas.createCacheSchema);
const validateComment = eym(schemas.commentSchema);
const validateUpdateUser = eym(schemas.updateUserSchema);
const validateUpdateUserPassword = eym(schemas.updateUserPasswordSchema);
const validateCollection = eym(schemas.collectionSchema);
const validateUpdateCollection = eym(schemas.updateCollectionSchema);

module.exports = {
    validateLogin,
    validateRegistration,
    validateCreateCache,
    validateComment,
    validateUpdateUser,
    validateUpdateUserPassword,
    validateCollection,
    validateUpdateCollection
}