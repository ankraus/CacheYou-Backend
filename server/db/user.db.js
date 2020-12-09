const db = require('./db_connection');

const getUsers = async () => {
    const db_resp = await db.query(`
        SELECT *
        FROM v_users
    `);
    return db_resp.rows;
};

const getSelf = async (userId) => {
    const db_resp = await db.query(`
        SELECT *
        FROM v_users_with_email
        WHERE user_id = $1
    `, [userId]);
    return db_resp.rows[0];
}

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
        SELECT *
        FROM   v_users_with_email 
        WHERE  email = $1`, [email]);
    return db_resp.rows[0]
}

const getUserByUsername = async (username) => {
    const db_resp = await db.query(`
        SELECT *
        FROM   v_users 
        WHERE  username = $1`, [username]);
    return db_resp.rows[0]
}

const getUserById = async (user_id) => {
    const db_resp = await db.query(`
        SELECT *
        FROM   v_users 
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
    const db_resp = await db.query(`INSERT INTO users(email, username, pw_hash) 
                    VALUES ($1, $2, $3) RETURNING user_id`, [newUser.email, newUser.username, newUser.pw_hash]);
    await insertInterests(db_resp.rows[0].user_id, newUser.interests);
    return;
}

const putUpdateUser = async (user, user_id) => {
    await db.query(`UPDATE users 
                    SET username = $1, 
                        email = $2, 
                        pw_hash = $3 
                    WHERE user_id = $4`, [user.username, user.email, user.pw_hash, user_id]);
    await db.query(`DELETE FROM users_interests WHERE user_id = $1`, [user_id]);
    await insertInterests(user_id, user.interests);
    
}

const insertInterests = async (userId, interests) => {
    await db.query(`
    INSERT INTO users_interests(tag_id, user_id)(
        SELECT tag_id, $1 as user_id
        FROM tags t
        WHERE t.name IN (
            SELECT UNNEST($2::varchar[])
        )
    )`, [userId, interests]);
}

module.exports = {
    getUsers,
    getSelf,
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
    postRegisterUser,
    putUpdateUser
}