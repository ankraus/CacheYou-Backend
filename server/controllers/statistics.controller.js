const {
    statisticsService
} = require('../services');

const getCacheStats = async (req, res, next) => {
    try {
        const cacheStats = await statisticsService.getCacheStats();
        res.json({
            cacheStats: cacheStats
        });
    } catch (error) {
        next(error);
    }
}

const getImageStats = async (req, res, next) => {
    try {
        const imageStats = await statisticsService.getImageStats();
        res.json({
            imageStats: imageStats
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCacheStats,
    getImageStats
}