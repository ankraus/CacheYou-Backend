const jwt = require('jsonwebtoken');
const { userDb } = require('../db');

const checkAuthenticated = async (req, res, next) => {
    if(req.hasToken) {
        if(req.tokenValid){
            next();
        } else {
            res.status(403).send('token invalid');
        }
    } else {
        res.status(401).send('no token in request');
    }
}

const checkToken = async (req, res, next) => {
    const cookie = req.cookies.token;
    if (cookie) {
        req.hasToken = true;
        try {
            const { user_id } = await jwt.verify(cookie, process.env.JWT_SECRET);
            const hasLoggedOut = await userDb.getUserHasLoggedOut(user_id);
            if(hasLoggedOut){
                throw new Error();
            }
            req.user_id = user_id;
            req.tokenValid = true;
        } catch (error) {
            req.tokenValid = false;
        }
    } else {
        req.hasToken = false;
    }
    next();
}

const delToken = async (res) => {
    res.cookie('token', 'deleted', {expires: 0, secure: true});
}

const genToken = async (user_id) => {
    return await jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {expiresIn: "20m"});
}

module.exports = {
    checkAuthenticated,
    checkToken,
    delToken,
    genToken
}
