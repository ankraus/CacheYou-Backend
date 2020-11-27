const authUtils = require("./auth.utils");
const { TokenInvalidError, WrongCredentialsError, NoCredentialsInRequestError, NotFoundError, AlreadyExistsError } = require("./errors");
const ValidationError = require('yup').ValidationError;


const errorLogger = (err, req, res, next) => {
    const dateString = new Date().toLocaleString();
    const errorMessage = err.message;
    if(errorMessage) {
        console.log(`[ERROR][${dateString}] ${errorMessage}`);
    }
    next(err);
}

const authenticationErrorHandler = (err, req, res, next) => {
    switch (true) {
        case err instanceof TokenInvalidError:
            authUtils.delToken(res);
            res.status(403).send('Token invalid');
            break;
        case err instanceof WrongCredentialsError:
            authUtils.delToken(res);
            res.status(401).send('Wrong username or password');
            break;
        case err instanceof NoCredentialsInRequestError:
            res.status(401).send('No token in request');
            break;
        default:
            next(err);
            break;
    }
}

const validationErrorHandler = (err, req, res, next) => {
    if(err instanceof ValidationError){
        res.status(400).send('Validation Error: ' + err.message);
    } else {
        next(err);
    }
}

const generalErrorHandler = (err, req, res, next) => {
    switch (true) {
        case err instanceof NotFoundError:
            res.status(404).send('Not found');
            break;
        case err instanceof AlreadyExistsError:
            res.status(400).send('Already exists');
            break;
        case err instanceof SyntaxError:
            res.status(400).send('Invalid syntax: ' + err.message);
            break;
        default:
            res.status(500).send(err.name) && next(err);
            break;
    }
}

module.exports = {
    errorLogger,
    authenticationErrorHandler,
    validationErrorHandler,
    generalErrorHandler
};