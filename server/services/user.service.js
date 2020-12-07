const {
    userDb
} = require('../db');
const bcrypt = require('bcrypt');
const {
    authUtils
} = require('../utils');
const {
    NotFoundError,
    DatabaseError,
    HashingError,
    WrongCredentialsError,
    AlreadyExistsError
} = require('../utils/errors');


const getUsers = async () => {
    try {
        return await userDb.getUsers();
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getSelf = async (userId) => {
    try {
        return await userDb.getSelf(userId);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getUserByEmail = async (email) => {
    var user;
    try {
        user = await userDb.getUserByEmail(email);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if (!user) {
        throw new NotFoundError();
    }
    return user;
}

const getUserByUsername = async (username) => {
    var user;
    try {
        user = await userDb.getUserByUsername(username);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if (!user) {
        throw new NotFoundError();
    }
    return user;
}

const getUserById = async (user_id) => {
    var user;
    try {
        user = await userDb.getUserById(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if (!user) {
        throw new NotFoundError();
    }
    return user;
}

const getUserFollows = async (user_id) => {
    try {
        return await userDb.getUserFollows(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getUserCollected = async (user_id) => {
    try {
        return await userDb.getUserCollected(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getUserCreated = async (user_id) => {
    try {
        return await userDb.getUserCreated(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getUserCollections = async (user_id) => {
    try {
        return await userDb.getUserCollections(user_id);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postRegisterUser = async (newUser) => {
    await checkIfAlreadyExists(newUser, "");
    newUser.pw_hash = await bcrypt.hash(newUser.password, 10).catch((err) => {
        throw new HashingError(err.message)
    });
    try {
        return await userDb.postRegisterUser(newUser);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const postLoginUser = async (email, password) => {
    const user = await userDb.getUserByEmail(email).catch((err) => {
        throw new DatabaseError(err.message)
    });
    var pw_hash;
    if (!user) {
        throw new WrongCredentialsError();
    }
    try {
        pw_hash = (await userDb.getUserPwHash(user.user_id)).pw_hash;
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if (!pw_hash) {
        throw new WrongCredentialsError();
    }
    const match = await bcrypt.compare(password, pw_hash).catch((err) => {
        throw new HashingError(err.message)
    });
    try {
        await userDb.setUserHasLoggedOut(user.user_id, false);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    if (match) {
        return authUtils.genToken(user.user_id);
    } else {
        throw new WrongCredentialsError();
    }
}

const postLogoutUser = async (user_id) => {
    try {
        await userDb.setUserHasLoggedOut(user_id, true);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const putUpdateUser = async (user, user_id) => {
    await checkIfAlreadyExists(user, user_id);
    try {
        //if a new password was provided, hash it and store it in user.pw_hash. Else, get old pw_hash from db and use that.
        if(user.password) {
            user.pw_hash = await bcrypt.hash(user.password, 10).catch((err) => {
                throw new HashingError(err.message)
            });
        } else {
            user.pw_hash = (await userDb.getUserPwHash(user_id)).pw_hash;
        }
        //get user from db to fill fields that were not provided
        const dbUser = await userDb.getUserById(user_id);
        if(!user.username) {
            user.username = dbUser.username;
        }
        if(!user.email) {
            user.email = dbUser.email;
        }
        return await userDb.putUpdateUser(user, user_id);
    } catch (error) {
        throw new DatabaseError();
    }
}

const checkIfAlreadyExists = async (user, user_id) => {
    var userByEmail;
    var userByUsername;
    try {
        userByEmail = await userDb.getUserByEmail(user.email);
        userByUsername = await userDb.getUserByUsername(user.username);
    } catch (error) {
        throw new DatabaseError(error.message);
    }
    //if email or username exist on a different user, throw error
    if ((userByEmail && userByEmail.user_id != user_id)) {
        throw new AlreadyExistsError('email');
    } else if ((userByUsername && userByUsername.user_id != user_id)) {
        throw new AlreadyExistsError('username');
    }
}

module.exports = {
    getUsers,
    getSelf,
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
    putUpdateUser
}