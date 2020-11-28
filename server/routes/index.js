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
router.get('/caches/:cache_id', cacheController.getCacheById);
router.get('/caches/:cache_id/images', cacheController.getCacheImages);
router.get('/caches/:cache_id/comments', cacheController.getCacheComments);
router.get('/caches/:cache_id/collected', cacheController.getCacheCollected);

router.post('/caches', authUtils.checkAuthenticated, validationUtils.validateCreateCache, cacheController.postCache);
router.post('/caches/:cache_id/collect', authUtils.checkAuthenticated, cacheController.postCacheCollect);
router.post('/caches/:cache_id/comment', authUtils.checkAuthenticated, validationUtils.validateComment, cacheController.postCacheComment);
router.post('/caches/:cache_id/tags', authUtils.checkAuthenticated, cacheController.postCacheTags);

router.put('/caches/:cache_id', authUtils.checkAuthenticated, cacheController.putCache);
router.put('/caches/:cache_id/comments/:comment_id', authUtils.checkAuthenticated, cacheController.putCacheComment);

router.delete('/caches/:cache_id', authUtils.checkAuthenticated, cacheController.deleteCache);
router.delete('/caches/:cache_id/comments/:comment_id', authUtils.checkAuthenticated, cacheController.deleteCacheComment);
router.delete('/caches/:cache_id/tags', authUtils.checkAuthenticated, cacheController.deleteCacheTags);

//User routes
router.get('/users', userController.getUsers);
router.get('/users/current', authUtils.checkAuthenticated, userController.getCurrentUser);
router.get('/users/isLoggedIn', userController.getIsLoggedIn);
router.get('/users/:user_id/follows', userController.getUserFollows);
router.get('/users/:user_id/collected', userController.getUserCollected);
router.get('/users/:user_id/created', userController.getUserCreated);
router.get('/users/:user_id/collections', userController.getUserCollections);

router.post('/users', validationUtils.validateRegistration, userController.postRegisterUser);
router.post('/users/login', validationUtils.validateLogin, userController.postLoginUser);
router.post('/users/logout', userController.postLogoutUser);
router.post('/users/follow/:user_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);

router.put('/users', authUtils.checkAuthenticated, validationUtils.validateUpdateUser, routerUtils.unimplementedRoute);

router.delete('/users/current', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);
router.delete('/users/follow/:user_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);

//image routes
router.get('/images/:image_id', imageController.getImage);

router.post('/images/user/', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);
router.post('/images/cache/:cache_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);

router.delete('/images/:image_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);

//collection routes
router.get('/collections', collectionController.getCollections);
router.get('/collections/:collection_id', collectionController.getCollection);

router.post('/collections', authUtils.checkAuthenticated, validationUtils.validateCollection, routerUtils.unimplementedRoute);
router.post('/collections/:collection_id/:cache_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);

router.put('/collections/:collection_id', authUtils.checkAuthenticated, validationUtils.validateUpdateCollection, routerUtils.unimplementedRoute);

router.delete('/collections/:collection_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);
router.delete('/collections/:collection_id/:cache_id', authUtils.checkAuthenticated, routerUtils.unimplementedRoute);


module.exports = router;