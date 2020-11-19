const { userDb } = require('../db');
const bcrypt = require('bcrypt');

const getUsers = async () => {
    try {
        return await userDb.getUsers();
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



module.exports = {
    getUsers,
    getUserFollows,
    getUserCollected,
    getUserCreated,
    getUserCollections,
    postRegisterUser
}