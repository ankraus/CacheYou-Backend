const { userDb } = require('../db');
const bcrypt = require('bcrypt');
const {authUtils} = require('../utils');


const getUsers = async () => {
    try {
        return await userDb.getUsers();
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserByEmail = async (email) => {
    try {
        return await userDb.getUserByEmail(email);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserByUsername = async (username) => {
    try {
        return await userDb.getUserByUsername(username);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserById = async (user_id) => {
    try {
        return await userDb.getUserById(user_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserFollows = async (user_id) => {
    try {
        return await userDb.getUserFollows(user_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserCollected = async (user_id) => {
    try {
        return await userDb.getUserCollected(user_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserCreated = async (user_id) => {
    try {
        return await userDb.getUserCreated(user_id);
    } catch (error) {
        throw new Error(error.message)
    }
}

const getUserCollections = async (user_id) => {
    try {
        return await userDb.getUserCollections(user_id);
    } catch (error) {
        throw new Error(error.message);
    }
}

const postRegisterUser = async (newUser) => {
    try {
        newUser.pw_hash = await bcrypt.hash(newUser.password, 10)
        return await userDb.postRegisterUser(newUser)
    } catch (error) {
        throw new Error(error.message);
    }
}

const postLoginUser = async (email, password) => {
    try {
        const user = await userDb.getUserByEmail(email);
        if(!user){
            throw new Error();
        }
        const { pw_hash } = await userDb.getUserPwHash(user.user_id);
        const match = await bcrypt.compare(password, pw_hash);
        await userDb.setUserHasLoggedOut(user.user_id, false);
        if(match) {
            return await authUtils.genToken(user.user_id);
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error('Wrong email or password');
    }
}

const postLogoutUser = async (user_id) => {
    await userDb.setUserHasLoggedOut(user_id, true);
}

module.exports = {
    getUsers,
    getUserByEmail,
    getUserByUsername,
    getUserById,
    getUserFollows,
    getUserCollected,
    getUserCreated,
    getUserCollections,
    postRegisterUser,
    postLoginUser,
    postLogoutUser
}