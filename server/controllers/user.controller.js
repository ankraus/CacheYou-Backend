const {
    userService
} = require('../services');
const {
    authUtils
} = require('../utils');

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();
        res.json({
            users: users
        });
    } catch (error) {
        next(error);
    }
}

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user_id);
        res.json({
            user: user
        });
    } catch (error) {
        next(error);
    }
}

const getUserByEmail = async (req, res, next) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        res.json({
            user: user
        });
    } catch (error) {
        next(error);
    }
}

const getUserByUsername = async (req, res, next) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        res.json({
            user: user
        });
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.user_id);
        res.json({
            user: user
        });
    } catch (error) {
        next(error);
    }
}


const getUserFollows = async (req, res, next) => {
    try {
        const follows = await userService.getUserFollows(req.params.user_id);
        res.json({
            follows: follows
        });
    } catch (error) {
        next(error);
    }
}

const getUserCollected = async (req, res, next) => {
    try {
        const collected = await userService.getUserCollected(req.params.user_id);
        res.json({
            collected: collected
        });
    } catch (error) {
        next(error);
    }
}

const getUserCreated = async (req, res, next) => {
    try {
        const created = await userService.getUserCreated(req.params.user_id);
        res.json({
            created: created
        });
    } catch (error) {
        next(error);
    }
}

const getUserCollections = async (req, res, next) => {
    try {
        const collections = await userService.getUserCollections(req.params.user_id);
        res.json({
            collections: collections
        });
    } catch (error) {
        next(error);
    }
}

const postRegisterUser = async (req, res, next) => {
    const user = req.body
    try {
        await userService.postRegisterUser(user);
        res.sendStatus(201);
        next();
    } catch (error) {
        next(error);
    }
}

const postLoginUser = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    try {
        const token = await userService.postLoginUser(email, password);
        res.cookie('token', token, authUtils.cookieOptions);
        res.sendStatus(200);
    } catch (error) {
        next(error)
    }
}

const postLogoutUser = async (req, res, next) => {
    try {
        await userService.postLogoutUser(req.user_id);
        authUtils.delToken(res);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

const getIsLoggedIn = async (req, res) => {
    res.json({
        isLoggedIn: req.hasToken && req.tokenValid
    });
}

module.exports = {
    getUsers,
    getCurrentUser,
    getUserByEmail,
    getUserByUsername,
    getUserById,
    getUserFollows,
    getUserCollected,
    getUserCreated,
    getUserCollections,
    postRegisterUser,
    postLoginUser,
    postLogoutUser,
    getIsLoggedIn
}