const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'ia5',
    host: 'database',
    database: 'testdatabase',
    password: '9$raT8*HNvyzJ@j!b^Gl8qoCIG&qu7Tj',
    port: 5432,
});

const app = express();

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    var routes = [];
    app._router.stack.forEach(element => {
        if (element.route && element.route.path) {
            routes.push(element.route.path);
        }
    });
    res.json({
        routes: routes
    });
});

app.get('/users', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT user_id, email, username, points, image_id
            FROM users
        `);
        res.json({
            users: db_resp.rows
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/users/:user_id/follows', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT u.user_id, u.username 
            FROM follows f 
            JOIN users u USING (user_id) 
            WHERE f.follower_id = $1::uuid`, [req.params.user_id]);
        res.json({
            follows: db_resp.rows
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/caches', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, array_agg(t.name) AS tags
            FROM caches c
            JOIN caches_tags ct USING (cache_id)
            JOIN users u USING (user_id)
            JOIN tags t USING (tag_id)
            GROUP BY c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at
        `);

        var caches = [];
        db_resp.rows.forEach((db_row) => {
            caches.push({
                cache_id: db_row.cache_id,
                latitue: db_row.latitue,
                longitude: db_row.longitude,
                title: db_row.title,
                description: db_row.description,
                link: db_row.link,
                tags: db_row.tags,
                creator: {
                    username: db_row.username,
                    user_id: db_row.user_id
                },
                created_at: db_row.created_at
            });
        });

        res.json({
            caches: caches
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/caches/:cache_id/images', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT array_agg(image_id) AS image_ids
            FROM caches_images 
            WHERE cache_id = $1::uuid`, [req.params.cache_id]);
        res.json({
            image_ids: db_resp.rows[0].image_ids
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/images/:image_id', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT image
            FROM images 
            WHERE image_id = $1::uuid`, [req.params.image_id]);
        res.type('png');
        res.end(db_resp.rows[0].image, 'binary');
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/caches/:cache_id/comments', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT c.comment_id, c.content, c.created_at, u.username, u.user_id 
            FROM comments c 
            JOIN caches ca USING (cache_id) 
            JOIN users u ON u.user_id = c.user_id
            WHERE cache_id = $1`, [req.params.cache_id]);
        var comments = [];
        db_resp.rows.forEach((db_row) => {
            comments.push({
                comment_id: db_row.comment_id,
                user: {
                    username: db_row.username,
                    user_id: db_row.user_id
                },
                content: db_row.content,
                created_at: db_row.created_at
            });
        });
        res.json({
            comments: comments
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/caches/:cache_id/collected', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at, array_agg(t.name) AS tags
            FROM collected col 
            JOIN users u USING (user_id) 
            JOIN caches c USING (cache_id) 
            JOIN caches_tags ct USING (cache_id)
            JOIN tags t USING (tag_id)
            WHERE c.cache_id = $1
            GROUP BY u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at`, [req.params.cache_id]);
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
        res.json({
            collected: collected
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/users/:user_id/collected', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at, array_agg(t.name) AS tags
            FROM collected col 
            JOIN users u USING (user_id) 
            JOIN caches c USING (cache_id) 
            JOIN caches_tags ct USING (cache_id)
            JOIN tags t USING (tag_id)
            WHERE u.user_id = $1
            GROUP BY u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at`, [req.params.user_id]);
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
        res.json({
            collected: collected
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/users/:user_id/created', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT u.user_id, c.cache_id, c.title, c.created_at, array_agg(t.name) AS tags
            FROM caches c 
            JOIN users u USING (user_id)
            JOIN caches_tags ct USING (cache_id)
            JOIN tags t USING (tag_id)
            WHERE u.user_id = $1
            GROUP BY u.user_id, c.cache_id, c.title, c.created_at`, [req.params.user_id]);

        var caches = [];
        db_resp.rows.forEach((db_row) => {
            caches.push({
                cache_id: db_row.cache_id,
                tags: db_row.tags,
                title: db_row.title,
                created_at: db_row.created_at
            });
        });
        res.json({
            caches: caches
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/collections', async (req, res) => {
    try {
        const db_resp = await pool.query(`SELECT * FROM collections`);
        res.json({
            collections: db_resp.rows
        });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/collections/:collection_id', async (req, res) => {
    try {
        const db_resp = await pool.query(`
            SELECT c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, array_agg(t.name) AS tags
            FROM caches c
            JOIN caches_tags ct USING (cache_id)
            JOIN users u USING (user_id)
            JOIN tags t USING (tag_id)
            JOIN caches_collections cc USING (cache_id)
            WHERE cc.collection_id = $1
            GROUP BY c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at`, [req.params.collection_id]);
        const db_collection_resp = await pool.query(`
            SELECT co.title, co.user_id, u.username 
            FROM collections co 
            JOIN users u USING (user_id) 
            WHERE co.collection_id = $1`, [req.params.collection_id]);
        res.json({
                title: db_collection_resp.rows[0].title,
                creator: {
                    user_id: db_collection_resp.rows[0].user_id,
                    username: db_collection_resp.rows[0].username
                },
                caches: db_resp.rows
            });
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

app.get('/users/:user_id/collections', async (req, res) => {
    try {
        const db_resp = await pool.query(`SELECT collection_id, public, title FROM collections WHERE user_id = $1`, [req.params.user_id]);
        res.json({
            collections: db_resp.rows
        });        
    } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
    }
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});