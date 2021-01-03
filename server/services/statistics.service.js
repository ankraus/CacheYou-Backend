const {
    statisticsDb
} = require('../db');
const {
    DatabaseError
} = require('../utils/errors');

const getCacheStats = async () => {
    try {
        return await statisticsDb.getCacheStats();
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

const getImageStats = async () => {
    try {
        return await statisticsDb.getImageStats();
    } catch (error) {
        throw new DatabaseError(error.message);
    }
}

module.exports = {
    getCacheStats,
    getImageStats
}