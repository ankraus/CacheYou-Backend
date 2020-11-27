const db = require('./db_connection');

const getUsers = async () => {
    const db_resp = await db.query(`
        SELECT user_id, email, username, image_id
        FROM users
    `);
    return db_resp.rows;
};

const getUserPwHash = async (user_id) => {
    const db_resp = await db.query(`
        SELECT pw_hash
        FROM users
        WHERE user_id = $1`, [user_id]);
    return db_resp.rows[0];
}

const getUserHasLoggedOut = async (user_id) => {
    const db_resp = await db.query(`
        SELECT has_logged_out
        FROM users
        WHERE user_id = $1`, [user_id]);
    return db_resp.rows[0].has_logged_out;
}

const setUserHasLoggedOut = async (user_id, value) => {
    await db.query(`
        UPDATE users
        SET has_logged_out = $1
        WHERE user_id = $2`, [value, user_id]);
    return;
}

const getUserByEmail = async (email) => {
    const db_resp = await db.query(`
        SELECT user_id, email, username, image_id
        FROM   users 
        WHERE  email = $1`, [email]);
    return db_resp.rows[0]  
}

const getUserByUsername = async (username) => {
    const db_resp = await db.query(`
        SELECT user_id, email, username, image_id
        FROM   users 
        WHERE  username = $1`, [username]);
    return db_resp.rows[0]
}

const getUserById = async (user_id) => {
    const db_resp = await db.query(`
        SELECT user_id, email, username, image_id
        FROM   users 
        WHERE  user_id = $1::uuid`, [user_id]);
    return db_resp.rows[0]
}

const getUserFollows = async (user_id) => {
    const db_resp = await db.query(`
            SELECT u.user_id, u.username 
            FROM follows f 
            JOIN users u USING (user_id) 
            WHERE f.follower_id = $1::uuid`, [user_id]);
    return db_resp.rows;
}

const getUserCollected = async (user_id) => {
    const db_resp = await db.query(`
            SELECT *
            FROM v_user_collected
            WHERE u.user_id = $1`, [user_id]);
    var collected = [];
    db_resp.rows.forEach((db_row) => {
        collected.push({
            user: {
                user_id: db_row.user_id,
                username: db_row.username
            },
            cache: {
                cache_id: db_row.cache_id,
                tags: db_row.tags,
                title: db_row.title
            },
            liked: db_row.liked,
            created_at: db_row.created_at
        })
    });
    return collected;
}

const getUserCreated = async (user_id) => {
    const db_resp = await db.query(`
        SELECT *
        FROM v_caches
        WHERE user_id = $1`, [user_id]);

    var caches = [];
    db_resp.rows.forEach((db_row) => {
        caches.push({
            cache_id: db_row.cache_id,
            tags: db_row.tags,
            title: db_row.title,
            created_at: db_row.created_at
        });
    });
    return caches;
}

const getUserCollections = async (user_id) => {
    const db_resp = await db.query(`SELECT collection_id, public, title FROM collections WHERE user_id = $1`, [user_id]);
    const collections = db_resp.rows;
    return collections;
}

const postRegisterUser = async (newUser) => {
    await db.query(`INSERT INTO users(email, username, pw_hash) 
                    VALUES ($1, $2, $3)`, [newUser.email, newUser.username, newUser.pw_hash]);
    return;
}

module.exports = {
    getUsers,
    getUserPwHash,
    getUserHasLoggedOut,
    setUserHasLoggedOut,
    getUserByEmail,
    getUserByUsername,
    getUserById,
    getUserFollows,
    getUserCollected,
    getUserCreated,
    getUserCollections,
    postRegisterUser
}