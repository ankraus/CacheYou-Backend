const authUtils = require("./auth.utils");
const {
    TokenInvalidError,
    WrongCredentialsError,
    NoCredentialsInRequestError,
    NotFoundError,
    AlreadyExistsError,
    BadRequestError,
    ForbiddenError
} = require("./errors");
const ValidationError = require('yup').ValidationError;


const errorLogger = (err, req, res, next) => {
    const dateString = new Date().toLocaleString();
    const errorMessage = err.message;
    if (errorMessage) {
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
            if(err.doLogout){
                authUtils.delToken(res);
            }
            res.status(401).send('Wrong username or password');
            break;
        case err instanceof NoCredentialsInRequestError:
            res.status(401).send('No token in request');
            break;
        case err instanceof ForbiddenError:
            res.status(403).send('Forbidden' + errMessage(err));
            break;
        default:
            next(err);
            break;
    }
}

const validationErrorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        res.status(400).send('Validation Error: ' + err.message);
    } else {
        next(err);
    }
}

const generalErrorHandler = (err, req, res, next) => {
    switch (true) {
        case err instanceof BadRequestError:
            res.status(400).send('Bad request' + errMessage(err));
            break;
        case err instanceof NotFoundError:
            res.status(404).send('Not found' + errMessage(err));
            break;
        case err instanceof AlreadyExistsError:
            res.status(400).send('Already exists' + errMessage(err));
            break;
        case err instanceof SyntaxError:
            res.status(400).send('Invalid syntax' + errMessage(err));
            break;
        case err.type === 'entity.too.large':
            var fileSize = formatFileSize(err.length);
            var fileLimit = formatFileSize(err.limit);
            res.status(400).send(`Payload too large: ${fileSize} MB, limit is ${fileLimit} MB`);
            break;
        default:
            res.status(500).send(err.name) && next(err);
            break;
    }
}

const errMessage = (err) => (err.message?': ' + err.message:'');
const formatFileSize = (fileSize) => (fileSize / (1024*1024)).toFixed(2);

module.exports = {
    errorLogger,
    authenticationErrorHandler,
    validationErrorHandler,
    generalErrorHandler
};