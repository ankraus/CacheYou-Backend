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

--Create Tables

CREATE TABLE IF NOT EXISTS images (
    image_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    image BYTEA NOT NULL,
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
    cache_id uuid REFERENCES caches(cache_id) ON DELETE RESTRICT,
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

CREATE VIEW v_caches AS
    SELECT c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, i.image_id AS cover_image_id, array_agg(t.name) AS tags
    FROM caches c
    JOIN caches_tags ct USING (cache_id)
    JOIN users u USING (user_id)
    JOIN tags t USING (tag_id)
    LEFT JOIN caches_images ci USING (cache_id)
    LEFT JOIN images i ON ci.image_id = i.image_id AND ci.is_cover_image
    GROUP BY c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, i.image_id;

CREATE VIEW v_caches_image_array AS 
    SELECT c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, array_agg(DISTINCT t.name) AS tags, array_agg(i.image_id ORDER BY is_cover_image DESC) AS image_ids
    FROM caches c
    JOIN caches_tags ct USING (cache_id)
    JOIN users u USING (user_id)
    JOIN tags t USING (tag_id)
    LEFT JOIN caches_images ci USING (cache_id)
    LEFT JOIN images i ON ci.image_id = i.image_id
    GROUP BY c.cache_id, c.public, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at, t.name;

CREATE VIEW v_caches_comments AS 
    SELECT c.comment_id, c.content, c.created_at, ca.cache_id, u.username, u.user_id, u.image_id 
    FROM comments c 
    JOIN caches ca USING (cache_id) 
    JOIN users u ON u.user_id = c.user_id;

CREATE VIEW v_caches_collected AS
    SELECT u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at, array_agg(t.name) AS tags
    FROM collected col 
    JOIN users u USING (user_id) 
    JOIN caches c USING (cache_id) 
    JOIN caches_tags ct USING (cache_id)
    JOIN tags t USING (tag_id)
    GROUP BY u.user_id, u.username, c.cache_id, c.title, col.liked, col.created_at;

CREATE VIEW v_caches_collections AS
    SELECT cc.collection_id, c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username AS creator_username, u.user_id AS creator_id, c.created_at, array_agg(t.name) AS tags
    FROM caches c
    JOIN caches_tags ct USING (cache_id)
    JOIN users u USING (user_id)
    JOIN tags t USING (tag_id)
    JOIN caches_collections cc USING (cache_id)
    GROUP BY cc.collection_id, c.cache_id, c.latitude, c.longitude, c.title, c.description, c.link, u.username, u.user_id, c.created_at;

CREATE VIEW v_user_collected AS
    SELECT u.user_id, u.username, c.cache_id, c.longitude, c.latitude, c.title, ci.image_id, col.liked, col.created_at AS collected_at, array_agg(t.name) AS tags
    FROM collected col 
    JOIN users u USING (user_id) 
    JOIN caches c USING (cache_id) 
    JOIN caches_tags ct USING (cache_id)
    JOIN tags t USING (tag_id)
    JOIN caches_images ci USING (cache_id)
    WHERE ci.is_cover_image
    GROUP BY u.user_id, u.username, c.cache_id, c.longitude, c.latitude, c.title, ci.image_id, col.liked, col.created_at;

CREATE VIEW v_users_extended AS
    SELECT user_id, email, username, image_id, terms_of_use, privacy_policy, license, array_agg(t.name) AS interests 
    FROM users 
    LEFT JOIN users_interests USING(user_id) 
    LEFT JOIN tags t USING(tag_id) 
    GROUP BY user_id, email, username, image_id, terms_of_use, privacy_policy, license;

CREATE VIEW v_users AS
    SELECT user_id, username, image_id, array_agg(t.name) AS interests 
    FROM users 
    LEFT JOIN users_interests USING(user_id) 
    LEFT JOIN tags t USING(tag_id) 
    GROUP BY user_id, username, image_id;
 

CREATE VIEW v_image_info AS
    SELECT i.image_id, ui.user_id, u.username, i.created_at, i.mimetype
    FROM images i
    JOIN users_images ui USING (image_id)
    JOIN users u USING (user_id);

--Insert dummy data

INSERT INTO images(image_id, image) VALUES
    (
        '166fc680-8dc3-4707-8f49-dfd223e58e2c'::uuid,
        pg_read_binary_file('/test_pic1.png')
    ),
    (
        'a258475f-88de-4f20-a98b-b3b0d830b66e'::uuid,
        pg_read_binary_file('/test_pic2.png')
    ),
    (
        '36a9575e-fd78-4a8d-927b-1fba938854ea'::uuid,
        pg_read_binary_file('/test_pic_cache.png')
    ),
    (
        '4b3c7735-cec5-40ef-b416-27dcdad3a646'::uuid,
        pg_read_binary_file('/test_pic_cache2.png')
    ),
    (
        '2155e963-6f90-4370-af16-f2b3d4f05f5a'::uuid,
        pg_read_binary_file('/test_pic_cache3.png')
    );    

INSERT INTO users(user_id, email, username, pw_hash, image_id) VALUES 
    (
        '05200483-43b9-4fe4-b96f-1cc173bb8109'::uuid,
        'test@example.com',
        'TestyMcTestersson',
        '$2y$10$Z49xJvZ/k9N7ANLaYoSzy.fOnSoVQZF6em2O4JQgTxGDCg7BVAYDO',
        '166fc680-8dc3-4707-8f49-dfd223e58e2c'
    ),
    (
        '94eff975-1414-4fe4-8d5d-8871dc23c4f4'::uuid,
        'dummy@example.com',
        'dummy789',
        '$2y$10$cI6j/HIm/w2lhV8Cq2q37e9l451ODbEnmzSPgbpHkZF.B1nGSE4rW',
        'a258475f-88de-4f20-a98b-b3b0d830b66e'
    );

INSERT INTO users_images (image_id, user_id) VALUES
    (
        '166fc680-8dc3-4707-8f49-dfd223e58e2c'::uuid,
        '05200483-43b9-4fe4-b96f-1cc173bb8109'::uuid
    ),
    (
        'a258475f-88de-4f20-a98b-b3b0d830b66e'::uuid,
        '94eff975-1414-4fe4-8d5d-8871dc23c4f4'::uuid
    ),
    (
        '36a9575e-fd78-4a8d-927b-1fba938854ea'::uuid,
        '94eff975-1414-4fe4-8d5d-8871dc23c4f4'::uuid
    ),
    (
        '4b3c7735-cec5-40ef-b416-27dcdad3a646'::uuid,
        '05200483-43b9-4fe4-b96f-1cc173bb8109'::uuid
    ),
    (
        '2155e963-6f90-4370-af16-f2b3d4f05f5a'::uuid,
        '94eff975-1414-4fe4-8d5d-8871dc23c4f4'::uuid
    );

INSERT INTO follows(follower_id, user_id)
    SELECT u1.user_id, u2.user_id 
    FROM users u1, users u2 
    WHERE u1.username='dummy789' 
        AND u2.username='TestyMcTestersson';

INSERT INTO tags(name) VALUES 
    ('streetart'),
    ('kurios'),
    ('kultur'),
    ('wassersystem');

INSERT INTO caches(cache_id, latitude, longitude, public, title, description, link, user_id, created_at) 
        SELECT
            '2967319e-5ee6-4ed0-a251-aaa1fa9deb56'::uuid,
            48.371770, 
            10.889295, 
            TRUE,
            'Wandgemälde bei der Esso Tankstelle', 
            'Dies ist ein großes Wandgemälde an einer großen Wand gemalt wurde.',
            NULL,
            u.user_id,
            now() - INTERVAL '27 days 15 hours'
        FROM users u
        WHERE u.username='dummy789'
    UNION
        SELECT
            'd80ee03b-90df-4541-8567-e4932198848a'::uuid,
            48.372271, 
            10.900162,
            TRUE,
            'Unterer Brunnenturm', 
            'Dies ist ein alter Wasserturm. In ihm türmte sich früher mal Wasser.',
            'https://de.wikipedia.org/wiki/Augsburgs_historische_Wasserwirtschaft',
            u.user_id,
            TIMESTAMP WITH TIME ZONE '2020-08-11 10:23:54+02'
        FROM users u
        WHERE u.username='dummy789'
    UNION
        SELECT
            'e6d4abc1-a627-4d78-8f82-0bfd81a582f0'::uuid,
            48.365816, 
            10.895103,
            TRUE,
            'Zur Brezn', 
            'Absolutes Kulturgut, darf man nicht verpassen, wenn man Augsburg besucht.',
            NULL,
            u.user_id,
            now() - INTERVAL '3 days 2 hours'
        FROM users u
        WHERE u.username='TestyMcTestersson';
    
INSERT INTO caches_tags(cache_id, tag_id)
        SELECT c.cache_id, t.tag_id 
        FROM caches c, tags t 
        WHERE c.title='Wandgemälde bei der Esso Tankstelle' 
            AND t.name='streetart'
    UNION
        SELECT c.cache_id, t.tag_id 
        FROM caches c, tags t 
        WHERE c.title='Unterer Brunnenturm' 
            AND t.name='wassersystem'
    UNION
        SELECT c.cache_id, t.tag_id 
        FROM caches c, tags t 
        WHERE c.title='Zur Brezn' 
            AND t.name='kultur';

INSERT INTO collected(user_id, cache_id, liked)
        SELECT u.user_id, c.cache_id, TRUE
        FROM users u, caches c
        WHERE u.username='TestyMcTestersson'
            AND c.title='Wandgemälde bei der Esso Tankstelle'
    UNION
        SELECT u.user_id, c.cache_id, TRUE
        FROM users u, caches c
        WHERE u.username='TestyMcTestersson'
            AND c.title='Unterer Brunnenturm'
    UNION
        SELECT u.user_id, c.cache_id, FALSE
        FROM users u, caches c
        WHERE u.username='dummy789'
            AND c.title='Zur Brezn';

INSERT INTO comments(user_id, cache_id, content)
        SELECT u.user_id, c.cache_id,
            'Ganz schön groß, dieses Gemälde!'
        FROM users u, caches c
        WHERE u.username='TestyMcTestersson'
            AND c.title='Wandgemälde bei der Esso Tankstelle'
    UNION
        SELECT u.user_id, c.cache_id,
            'Hier kann man sich echt Geld sparen :/'
        FROM users u, caches c
        WHERE u.username='dummy789'
            AND c.title='Zur Brezn';

INSERT INTO caches_images(cache_id, image_id, is_cover_image)
        SELECT c.cache_id, '36a9575e-fd78-4a8d-927b-1fba938854ea'::uuid, TRUE
        FROM caches c
        WHERE c.title='Unterer Brunnenturm'
    UNION
        SELECT c.cache_id, '4b3c7735-cec5-40ef-b416-27dcdad3a646'::uuid, TRUE
        FROM caches c
        WHERE c.title='Zur Brezn'
    UNION
        SELECT c.cache_id, '2155e963-6f90-4370-af16-f2b3d4f05f5a'::uuid, TRUE
        FROM caches c
        WHERE c.title='Wandgemälde bei der Esso Tankstelle';

INSERT INTO collections(collection_id, user_id, public, title) VALUES
    (
        'fae23c30-eea9-45be-9080-64eccf69c85f'::uuid,
        '05200483-43b9-4fe4-b96f-1cc173bb8109'::uuid,
        TRUE,
        'Alle Augsburger Caches'
    ),
    (
        'f32144f3-892b-4adc-9dd1-49a2e2c8b0ca'::uuid,
        '94eff975-1414-4fe4-8d5d-8871dc23c4f4'::uuid,
        FALSE,
        'Kneipentour'
    );

INSERT INTO caches_collections (collection_id, cache_id) VALUES
    (
        'fae23c30-eea9-45be-9080-64eccf69c85f'::uuid,
        '2967319e-5ee6-4ed0-a251-aaa1fa9deb56'::uuid
    ),(
        'fae23c30-eea9-45be-9080-64eccf69c85f'::uuid,
        'd80ee03b-90df-4541-8567-e4932198848a'::uuid
    ),(
        'fae23c30-eea9-45be-9080-64eccf69c85f'::uuid,
        'e6d4abc1-a627-4d78-8f82-0bfd81a582f0'::uuid
    ),(
        'f32144f3-892b-4adc-9dd1-49a2e2c8b0ca'::uuid,
        'e6d4abc1-a627-4d78-8f82-0bfd81a582f0'::uuid
    );
    
INSERT INTO users_interests (user_id, tag_id)
    SELECT '05200483-43b9-4fe4-b96f-1cc173bb8109'::uuid, tag_id FROM tags WHERE name = 'kurios'
    UNION
    SELECT '05200483-43b9-4fe4-b96f-1cc173bb8109'::uuid, tag_id FROM tags WHERE name = 'streetart';
