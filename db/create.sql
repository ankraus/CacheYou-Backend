DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS caches CASCADE;
DROP TABLE IF EXISTS collected CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS caches_tags CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS caches_images CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS caches_collections CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS users_images CASCADE;
DROP TABLE IF EXISTS users_interests CASCADE;

--Add support for uuids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

--Create Tables

CREATE TABLE IF NOT EXISTS images (
    image_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    image BYTEA NOT NULL,
    image_large BYTEA,
    image_medium BYTEA,
    image_small BYTEA,
    image_icon BYTEA,
    mimetype VARCHAR(25) DEFAULT 'image/png' NOT NULL,
    image_hash CHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    pw_hash CHAR(60) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    image_id uuid REFERENCES images(image_id) ON DELETE CASCADE,
    has_logged_out BOOLEAN DEFAULT TRUE NOT NULL,
    terms_of_use BOOLEAN DEFAULT FALSE NOT NULL,
    privacy_policy BOOLEAN DEFAULT FALSE NOT NULL,
    license BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS users_images (
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    image_id uuid REFERENCES images(image_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, image_id)
);

CREATE TABLE IF NOT EXISTS users_interests (
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, tag_id)
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, user_id)
);


CREATE TABLE IF NOT EXISTS caches (
    cache_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    latitude DECIMAL(15,10) NOT NULL,
    longitude DECIMAL(15,10) NOT NULL,
    public BOOLEAN DEFAULT FALSE NOT NULL,
    title VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    user_id uuid REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS caches_tags (
    cache_id uuid REFERENCES caches(cache_id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (cache_id, tag_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE SET NULL,
    cache_id uuid REFERENCES caches(cache_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS caches_images (
    image_id uuid REFERENCES images(image_id) ON DELETE CASCADE,
    cache_id uuid REFERENCES caches(cache_id) ON DELETE CASCADE,
    is_cover_image BOOLEAN DEFAULT FALSE NOT NULL,
    PRIMARY KEY (image_id, cache_id)
);

CREATE TABLE IF NOT EXISTS collected (
    user_id uuid REFERENCES users(user_id) ON DELETE SET NULL,
    cache_id uuid REFERENCES caches(cache_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    liked BOOLEAN DEFAULT FALSE NOT NULL,
    PRIMARY KEY (user_id, cache_id)
);

CREATE TABLE IF NOT EXISTS collections (
    collection_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    public BOOLEAN DEFAULT FALSE NOT NULL,
    title VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS caches_collections (
    collection_id uuid REFERENCES collections(collection_id) ON DELETE CASCADE,
    cache_id uuid REFERENCES caches(cache_id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, cache_id)
);

--Create views

DROP VIEW IF EXISTS v_caches;
DROP VIEW IF EXISTS v_caches_comments;
DROP VIEW IF EXISTS v_caches_collected;
DROP VIEW IF EXISTS v_user_collected;
DROP VIEW IF EXISTS v_caches_collections;
DROP VIEW IF EXISTS v_users_extended;
DROP VIEW IF EXISTS v_users;
DROP VIEW IF EXISTS v_image_info;

CREATE OR REPLACE VIEW v_caches AS
    SELECT c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, i.image_id AS cover_image_id, array_agg(t.name) AS tags
    FROM caches c
    JOIN caches_tags ct USING (cache_id)
    JOIN users u USING (user_id)
    JOIN tags t USING (tag_id)
    LEFT JOIN caches_images ci ON ci.cache_id = c.cache_id AND ci.is_cover_image
    LEFT JOIN images i ON ci.image_id = i.image_id
    GROUP BY c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, i.image_id;

CREATE OR REPLACE VIEW v_caches_image_array AS 
    SELECT c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, array_agg(DISTINCT t.name) AS tags, array_agg(DISTINCT i.image_id) AS image_ids
    FROM caches c
    JOIN caches_tags ct USING (cache_id)
    JOIN users u USING (user_id)
    JOIN tags t USING (tag_id)
    LEFT JOIN caches_images ci USING (cache_id)
    LEFT JOIN images i ON ci.image_id = i.image_id
    GROUP BY c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at;

CREATE OR REPLACE VIEW v_caches_comments AS 
    SELECT c.comment_id, c.content, c.created_at, ca.cache_id, u.username, u.user_id, u.image_id 
    FROM comments c 
    JOIN caches ca USING (cache_id) 
    JOIN users u ON u.user_id = c.user_id;

CREATE OR REPLACE VIEW v_caches_collected AS
    SELECT u.user_id, u.username, c.cache_id, c.public, c.title, col.liked, col.created_at, array_agg(t.name) AS tags
    FROM collected col 
    JOIN users u USING (user_id) 
    JOIN caches c USING (cache_id) 
    JOIN caches_tags ct USING (cache_id)
    JOIN tags t USING (tag_id)
    GROUP BY u.user_id, u.username, c.cache_id, c.public, c.title, col.liked, col.created_at;

CREATE OR REPLACE VIEW v_caches_collections AS
    SELECT cc.collection_id, c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username AS creator_username, u.user_id AS creator_id, c.created_at, array_agg(t.name) AS tags
    FROM caches c
    JOIN caches_tags ct USING (cache_id)
    JOIN users u USING (user_id)
    JOIN tags t USING (tag_id)
    JOIN caches_collections cc USING (cache_id)
    GROUP BY cc.collection_id, c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at;

CREATE OR REPLACE VIEW v_user_collected AS
    SELECT u.user_id, u.username, c.cache_id, c.public, c.longitude, c.latitude, c.title, ci.image_id, col.liked, col.created_at AS collected_at, array_agg(t.name) AS tags
    FROM collected col 
    JOIN users u USING (user_id) 
    JOIN caches c USING (cache_id) 
    JOIN caches_tags ct USING (cache_id)
    JOIN tags t USING (tag_id)
    JOIN caches_images ci USING (cache_id)
    WHERE ci.is_cover_image
    GROUP BY u.user_id, u.username, c.cache_id, c.public, c.longitude, c.latitude, c.title, ci.image_id, col.liked, col.created_at;

CREATE OR REPLACE VIEW v_users_extended AS
    SELECT user_id, email, username, image_id, terms_of_use, privacy_policy, license, is_admin, array_agg(t.name) AS interests 
    FROM users 
    LEFT JOIN users_interests USING(user_id) 
    LEFT JOIN tags t USING(tag_id) 
    GROUP BY user_id, email, username, image_id, terms_of_use, privacy_policy, license, is_admin;

CREATE OR REPLACE VIEW v_users AS
    SELECT user_id, username, image_id, array_agg(t.name) AS interests 
    FROM users 
    LEFT JOIN users_interests USING(user_id) 
    LEFT JOIN tags t USING(tag_id) 
    GROUP BY user_id, username, image_id;
 

CREATE OR REPLACE VIEW v_image_info AS
    SELECT i.image_id, ui.user_id, u.username, i.created_at, i.mimetype
    FROM images i
    JOIN users_images ui USING (image_id)
    JOIN users u USING (user_id);

CREATE OR REPLACE VIEW v_stats_caches_per_month AS 
    SELECT date_trunc('month', created_at) AS month, count(date_trunc('month', created_at)) 
    FROM CACHES 
    GROUP BY month 
    ORDER BY month;

CREATE OR REPLACE VIEW v_stats_images_per_month AS 
    SELECT date_trunc('month', created_at) AS month, count(date_trunc('month', created_at)) 
    FROM images 
    GROUP BY month 
    ORDER BY month;