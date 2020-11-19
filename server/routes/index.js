const express = require('express');

const router = express.Router();

const { cacheController, userController, imageController, collectionController } = require('../controllers');

router.get('/caches', cacheController.getCaches);
router.get('/caches/:cache_id/images', cacheController.getCacheImages);
router.get('/caches/:cache_id/comments', cacheController.getCacheComments);
router.get('/caches/:cache_id/collected', cacheController.getCacheCollected);

router.get('/users', userController.getUsers);
router.post('/users', userController.postRegisterUser);
router.get('/users/:user_id/follows', userController.getUserFollows);
router.get('/users/:user_id/collected', userController.getUserCollected);
router.get('/users/:user_id/created', userController.getUserCreated);
router.get('/users/:user_id/collections', userController.getUserCollections);

router.get('/images/:image_id', imageController.getImage);

router.get('/collections', collectionController.getCollections);
router.get('/collections/:collection_id', collectionController.getCollection);



module.exports = router;