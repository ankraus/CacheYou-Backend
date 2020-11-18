const { userService } = require('../services');

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();
        res.json({
            users: users
        });
    } catch (error) {
        res.sendStatus(500) && next(error);
    }
}

const getUserFollows = async (req, res, next) => {
    try {
        const follows = await userService.getUserFollows(req.params.user_id);
        res.json({
            follows: follows
        });
    } catch (error) {
        res.sendStatus(500) && next(error);
    }
}

const getUserCollected = async (req, res, next) => {
    try {
        const collected = await userService.getUserCollected(req.params.user_id);
        res.json({
            collected: collected
        });
    } catch (error) {
        res.sendStatus(500) && next(error);
    }
}

const getUserCreated = async (req, res, next) => {
    try {
        const created = await userService.getUserCreated(req.params.user_id);
        res.json({
            created: created
        });
    } catch (error) {
        res.sendStatus(500) && next(error);
    }
}

const getUserCollections = async (req, res, next) => {
    try {
        const collections = await userService.getUserCollections(req.params.user_id);
        res.json({
            collections: collections
        });
    } catch (error) {
        res.sendStatus(500) && next(error);
    }
}

module.exports = {
    getUsers,
    getUserFollows,
    getUserCollected,
    getUserCreated,
    getUserCollections
}