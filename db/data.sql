--Insert dummy data

INSERT INTO images(image_id, image, image_large, image_medium, image_small, image_icon, mimetype, created_at) VALUES
    (
        '166fc680-8dc3-4707-8f49-dfd223e58e2c'::uuid,
        pg_read_binary_file('/img/p1_full.jpg'),
        pg_read_binary_file('/img/p1_large.jpg'),
        pg_read_binary_file('/img/p1_medium.jpg'),
        pg_read_binary_file('/img/p1_small.jpg'),
        pg_read_binary_file('/img/p1_icon.jpg'),
        'image/jpeg',
        '2020-10-12'
    ),
    (
        'a258475f-88de-4f20-a98b-b3b0d830b66e'::uuid,
        pg_read_binary_file('/img/p2_full.jpg'),
        pg_read_binary_file('/img/p2_large.jpg'),
        pg_read_binary_file('/img/p2_medium.jpg'),
        pg_read_binary_file('/img/p2_small.jpg'),
        pg_read_binary_file('/img/p2_icon.jpg'),
        'image/jpeg',
        '2020-10-15'
    ),
    (
        '36a9575e-fd78-4a8d-927b-1fba938854ea'::uuid,
        pg_read_binary_file('/img/1_full.png'),
        pg_read_binary_file('/img/1_large.png'),
        pg_read_binary_file('/img/1_medium.png'),
        pg_read_binary_file('/img/1_small.png'),
        pg_read_binary_file('/img/1_icon.png'),
        'image/png',
        '2020-11-01'
    ),
    (
        '4b3c7735-cec5-40ef-b416-27dcdad3a646'::uuid,
        pg_read_binary_file('/img/2_full.png'),
        pg_read_binary_file('/img/2_large.png'),
        pg_read_binary_file('/img/2_medium.png'),
        pg_read_binary_file('/img/2_small.png'),
        pg_read_binary_file('/img/2_icon.png'),
        'image/png',
        '2020-12-01'
    ),
    (
        '2155e963-6f90-4370-af16-f2b3d4f05f5a'::uuid,
        pg_read_binary_file('/img/3_full.png'),
        pg_read_binary_file('/img/3_large.png'),
        pg_read_binary_file('/img/3_medium.png'),
        pg_read_binary_file('/img/3_small.png'),
        pg_read_binary_file('/img/3_icon.png'),
        'image/png',
        '2020-12-02'
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
    ('wassersystem'),
    ('kunst'),
    ('natur'),
    ('statuen'),
    ('architektur'),
    ('essen'),
    ('geschichte'),
    ('sagen'),
    ('religion'),
    ('geheim'),
    ('graffity'),
    ('chillen'),
    ('lost places'),
    ('denkmal'),
    ('mahnmal'),
    ('sport'),
    ('wald'),
    ('see'),
    ('fluss'),
    ('berg'),
    ('felsen');

INSERT INTO caches(cache_id, latitude, longitude, public, title, description, link, user_id, created_at) 
        SELECT
            '2967319e-5ee6-4ed0-a251-aaa1fa9deb56'::uuid,
            48.371770, 
            10.889295, 
            TRUE,
            'Wandgemälde bei der Esso Tankstelle', 
            'Dies ist ein großes Wandgemälde, das an einer großen Wand gemalt wurde.',
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