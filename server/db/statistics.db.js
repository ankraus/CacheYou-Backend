const db = require('./db_connection')

const getCacheStats = async () => {
    const db_resp = await db.query(`
            SELECT * FROM v_stats_caches_per_month
        `);
    return db_resp.rows;
}

const getImageStats = async () => {
    const db_resp = await db.query(`
            SELECT * FROM v_stats_images_per_month
        `);
    return db_resp.rows;
}

module.exports = {
    getCacheStats,
    getImageStats
}