const jwt = require('jsonwebtoken');

const checkAuthenticated = async (req, res, next) => {
    if(req.hasToken) {
        if(req.tokenValid){
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
}

const checkToken = async (req, res, next) => {
    const cookie = req.cookies.token;
    if (cookie) {
        req.hasToken = true;
        try {
            const { user_id } = await jwt.verify(cookie, process.env.JWT_SECRET);
            const token = await genToken(user_id);
            req.user_id = user_id;
            req.tokenValid = true;
            res.cookie('token', token, {httpOnly: true});
        } catch (error) {
            req.tokenValid = false;
        }
    } else {
        req.hasToken = false;
    }
    next();
}

const delToken = async (res) => {
    res.cookie('token', 'deleted', {expires: 0});
}

const genToken = async (user_id) => {
    return await jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {expiresIn: "10m"});
}

module.exports = {
    checkAuthenticated,
    checkToken,
    delToken,
    genToken
}