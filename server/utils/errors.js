class TokenInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = "TokenInvalidError"
    }
}

class WrongCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.name = "WrongCredentialsError";
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}

class HashingError extends Error {
    constructor(message) {
        super(message);
        this.name = "HashingError";
    }
}

class NoCredentialsInRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "NoCredentialsInRequestError";
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
    }
}

class AlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyExistsError";
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
    }
}

module.exports = {
    TokenInvalidError,
    WrongCredentialsError,
    NotFoundError,
    DatabaseError,
    HashingError,
    NoCredentialsInRequestError,
    ForbiddenError,
    AlreadyExistsError,
    BadRequestError
}