const jwt = require('jsonwebtoken');
const {
    userDb
} = require('../db');
const {
    NoCredentialsInRequestError,
    TokenInvalidError,
    DatabaseError
} = require('./errors');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.ENVIRONMENT == 'prod',
    sameSite: 'none'
};

const cookieOptionsDeleted = {
    expires: 0,
    secure: process.env.ENVIRONMENT == 'prod',
    sameSite: 'none'
};

const checkAuthenticated = async (req, res, next) => {
    if (req.hasToken) {
        if (req.tokenValid) {
            next();
        } else {
            next(new TokenInvalidError());
        }
    } else {
        next(new NoCredentialsInRequestError());
    }
}

const checkToken = async (req, res, next) => {
    const cookie = req.cookies.token;
    if (cookie) {
        req.hasToken = true;
        try {
            const {
                user_id
            } = jwt.verify(cookie, process.env.JWT_SECRET);
            const hasLoggedOut = await userDb.getUserHasLoggedOut(user_id).catch((err) => {
                next(new DatabaseError(err.message))
            });
            if (hasLoggedOut) {
                req.tokenValid = false;
            } else {
                req.user_id = user_id;
                req.tokenValid = true;
            }
        } catch (error) {
            req.tokenValid = false;
        }
    } else {
        req.hasToken = false;
    }
    next();
}

const delToken = (res) => {
    res.cookie('token', 'deleted', cookieOptionsDeleted);
}

const genToken = (user_id) => {
    return jwt.sign({
        user_id: user_id
    }, process.env.JWT_SECRET, {
        expiresIn: "20m"
    });
}

module.exports = {
    cookieOptions,
    cookieOptionsDeleted,
    checkAuthenticated,
    checkToken,
    delToken,
    genToken
}