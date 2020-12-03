const express = require('express');
const {
    routerUtils,
    authUtils,
    validationUtils
} = require('../utils');

const router = express.Router();

const {
    cacheController,
    userController,
    imageController,
    collectionController
} = require('../controllers');

//check all requests for tokens, sets user_id in req object if token is valid
router.use(authUtils.checkToken);

router.get('/', (req, res) => {
    res.json({
        routes: routerUtils.listRegisteredRoutes(router)
    })
});

//Cache routes
router.get('/caches', cacheController.getCaches);
router.get('/caches/tags/', cacheController.getTags);
router.get('/caches/:cache_id', validationUtils.validateIds, cacheController.getCacheById);
router.get('/caches/:cache_id/images', validationUtils.validateIds, cacheController.getCacheImages);
router.get('/caches/:cache_id/comments', validationUtils.validateIds, cacheController.getCacheComments);
router.get('/caches/:cache_id/collected', validationUtils.validateIds, cacheController.getCacheCollected);

router.post('/caches', authUtils.checkAuthenticated, validationUtils.validateCreateCache, cacheController.postCache);
router.post('/caches/:cache_id/collect', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.postCacheCollect);
router.post('/caches/:cache_id/comment', authUtils.checkAuthenticated, validationUtils.validateIds, validationUtils.validateComment, cacheController.postCacheComment);
router.post('/caches/:cache_id/tags', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.postCacheTags);

router.put('/caches/:cache_id', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.putCache);
router.put('/caches/:cache_id/comments/:comment_id', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.putCacheComment);

router.delete('/caches/:cache_id', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.deleteCache);
router.delete('/caches/:cache_id/comments/:comment_id', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.deleteCacheComment);
router.delete('/caches/:cache_id/tags', authUtils.checkAuthenticated, validationUtils.validateIds, cacheController.deleteCacheTags);

//User routes
router.get('/users', userController.getUsers);
router.get('/users/current', authUtils.checkAuthenticated, userController.getCurrentUser);
router.get('/users/isLoggedIn', userController.getIsLoggedIn);
router.get('/users/:user_id/follows', validationUtils.validateIds, userController.getUserFollows);
router.get('/users/:user_id/collected', validationUtils.validateIds, userController.getUserCollected);
router.get('/users/:user_id/created', validationUtils.validateIds, userController.getUserCreated);
router.get('/users/:user_id/collections', validationUtils.validateIds, userController.getUserCollections);

router.post('/users', validationUtils.validateRegistration, userController.postRegisterUser);
router.post('/users/login', validationUtils.validateLogin, userController.postLoginUser);
router.post('/users/logout', userController.postLogoutUser);
router.post('/users/follow/:user_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);

router.put('/users/current', authUtils.checkAuthenticated, validationUtils.validateUpdateUser, userController.putUpdateUser);

router.delete('/users/current', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);
router.delete('/users/follow/:user_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);

//image routes
router.get('/images/:image_id', validationUtils.validateIds, imageController.getImage);

router.post('/images/user/', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);
router.post('/images/cache/:cache_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);

router.delete('/images/:image_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);

//collection routes
router.get('/collections', collectionController.getCollections);
router.get('/collections/:collection_id', validationUtils.validateIds, collectionController.getCollection);

router.post('/collections', authUtils.checkAuthenticated, validationUtils.validateCollection, routerUtils.unimplementedRoute);
router.post('/collections/:collection_id/:cache_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);

router.put('/collections/:collection_id', authUtils.checkAuthenticated, validationUtils.validateIds, validationUtils.validateUpdateCollection, routerUtils.unimplementedRoute);

router.delete('/collections/:collection_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);
router.delete('/collections/:collection_id/:cache_id', authUtils.checkAuthenticated, validationUtils.validateIds, routerUtils.unimplementedRoute);


module.exports = router;