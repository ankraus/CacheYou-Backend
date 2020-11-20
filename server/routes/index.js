const express = require('express');
const { routerUtils, authUtils } = require('../utils');

const router = express.Router();

const { cacheController, userController, imageController, collectionController } = require('../controllers');

//check all requests for tokens, sets user_id in req object if token is valid
router.use(authUtils.checkToken);

router.get('/', (req, res) => {res.json({routes: routerUtils.listRegisteredRoutes(router)})});

router.get('/caches', cacheController.getCaches);
router.get('/caches/:cache_id/images', cacheController.getCacheImages);
router.get('/caches/:cache_id/comments', cacheController.getCacheComments);
router.get('/caches/:cache_id/collected', cacheController.getCacheCollected);

router.get('/users', userController.getUsers);
router.get('/users/current', authUtils.checkAuthenticated, userController.getCurrentUser);
router.get('/users/isLoggedIn', userController.getIsLoggedIn);
router.post('/users', userController.postRegisterUser);
router.post('/login', userController.postLoginUser);
router.post('/logout', userController.postLogoutUser);

router.get('/users/:user_id/follows', userController.getUserFollows);
router.get('/users/:user_id/collected', userController.getUserCollected);
router.get('/users/:user_id/created', userController.getUserCreated);
router.get('/users/:user_id/collections', userController.getUserCollections);

router.get('/images/:image_id', imageController.getImage);

router.get('/collections', collectionController.getCollections);
router.get('/collections/:collection_id', collectionController.getCollection);



module.exports = router;