const { userDb } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            throw new Error('Wrong email or password');
        }
        const { pw_hash } = await userDb.getUserPwHash(user.user_id);
        const match = await bcrypt.compare(password, pw_hash);
        if(match) {
            const token = await genToken(user.user_id);
            return token;
        } else {
            return;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const validateToken = async (cookie) => {
    try {
        console.log('validate: ' + cookie);
        const {user_id} = await jwt.verify(cookie, process.env.JWT_SECRET);
        const token = await genToken(user_id);
        return {user_id: user_id, token: token};
    } catch (error) {
        throw new Error('Token not valid');
    }
}

async function genToken(user_id) {
    return await jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {expiresIn: "5m"});
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
    validateToken
}