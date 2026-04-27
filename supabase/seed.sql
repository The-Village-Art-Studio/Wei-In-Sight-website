-- WEI IN SIGHT: Full Seed Data
-- Syncs all mockContent.ts data into the database so the CMS admin can edit it.

-- ========================================
-- 1. SECTIONS (top-level nav)
-- ========================================
INSERT INTO sections (section_key, title, subtitle, seo_description) VALUES
('sight', 'Sight', 'Visual Arts', 'The visual atlas of creation.'),
('sound', 'Sound', 'Music & Audio', 'Auditory landscapes and sonic architecture.'),
('touch', 'Touch', 'Mixed Media & Process', 'Tactile experiments.'),
('voice', 'Voice', 'Poems & Lyrics', 'Written word.'),
('dream', 'Dream', 'Novel & Story World', 'The story world.'),
('heart', 'Heart', 'About / Philosophy / Journey', 'The inner compass.'),
('pulse', 'Pulse', 'Buy Art / Commissions / Contact', 'Connect and collect.')
ON CONFLICT (section_key) DO NOTHING;

-- ========================================
-- 2. PAGES (sub-route metadata)
-- ========================================
INSERT INTO pages (section_key, slug, title, subtitle, hero_image_url, sort_order) VALUES

-- SIGHT
('sight', 'paintings',     'The Inner Landscape',         'A series of atmospheric oil abstractions exploring memory and spatial resonance.',  '/assets/art/sight_paintings_hero_1776626955531.png', 0),
('sight', 'photography',   'Architectural Silence',        'High-contrast studies of brutalist geometry and the play of light.',                  '/assets/art/sight_photography_preview_1776626984989.png', 1),
('sight', 'sculpture',     'Frozen Motion',                'Brutalist mixed media forms exploring the tension between glass and steel.',           '/assets/art/sight_sculpture_preview_1776627004575.png', 2),
('sight', 'collections',   'Digital Arts Archive',         'Curated series of digital artifacts and mixed media studies.',                        '/assets/art/sight_collections_preview_1776627027864.png', 3),

-- SOUND
('sound', 'streaming-platforms', 'Digital Resonance',     'Where to experience my cinematic soundscapes and audio explorations.',               '/assets/art/sight_photography_preview_1776626984989.png', 0),
('sound', 'audio-visual-work',   'Audio-Visual Work',     'Cinematic scores and experimental video pieces.',                                     '/assets/art/sight_sculpture_preview_1776627004575.png', 1),
('sound', 'music-archive',       'Music Archive',          'A historical catalog of past audio experiments.',                                    '/assets/art/sight_photography_2_1776627429953.png', 2),

-- TOUCH
('touch', 'mixed-media',           'Mixed Media',          'Exploring the intersection of physical and digital materials.',                       '/assets/art/sight_paintings_2_1776627384437.png', 0),
('touch', 'material-experiments',  'Fabric & Friction',    'Tactile studies on organic textiles and mineral pigments.',                          'https://images.unsplash.com/photo-1544256718-3bcf237f3974', 1),
('touch', 'watchmaking',           'Watchmaking',          'Precision, time, and micro-mechanics.',                                              '/assets/art/sight_photography_1_1776627407211.png', 2),
('touch', 'fashion',               'Fashion',              'Wearable art and textile exploration.',                                               '/assets/art/sight_sculpture_1_1776627480388.png', 3),

-- VOICE
('voice', 'poems',  'Syllables of Light',  'Selected poetry from the 2023-2025 journals.',     '/assets/art/sight_paintings_hero_1776626955531.png', 0),
('voice', 'lyrics', 'Lyrics',              'The skeletal remains of songs.',                   'https://images.unsplash.com/photo-1511379938547-c1f69419868d', 1),

-- DREAM
('dream', 'novels', 'Novels',  'Insights into the ongoing novel project.',    '/assets/art/sight_paintings_hero_1776626955531.png', 0),
('dream', 'quotes', 'Quotes',  'Voices from the world of Wei.',               'https://images.unsplash.com/photo-1516979187457-637abb4f9353', 1),

-- HEART
('heart', 'about',                'The Artist',            'Jacky Ho''s journey through multidisciplinarity.',           '/assets/art/sight_photography_preview_1776626984989.png', 0),
('heart', 'philosophy',           'Philosophy',            'The inner compass of a multidisciplinary search.',           NULL, 1),
('heart', 'journey',              'The Journey',           'Milestones of a creative odyssey.',                          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 2),
('heart', 'exhibitions-features', 'Exhibitions & Features','Official record of public displays and recognitions.',       NULL, 3)

ON CONFLICT (section_key, slug) DO NOTHING;

-- ========================================
-- 3. ALBUMS (folders within pages)
-- ========================================
-- sight/paintings
WITH p AS (SELECT id FROM pages WHERE section_key='sight' AND slug='paintings')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'atmospheric-studies', 'Atmospheric Studies', 'Large scale oil works focusing on light and depth.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

WITH p AS (SELECT id FROM pages WHERE section_key='sight' AND slug='paintings')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'memory-fragments', 'Memory Fragments', 'Small format sketches and process artifacts.', 1 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- sight/photography
WITH p AS (SELECT id FROM pages WHERE section_key='sight' AND slug='photography')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'brutalist-rhythms', 'Brutalist Rhythms', 'Monolithic studies in shadow and structure.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- sight/sculpture
WITH p AS (SELECT id FROM pages WHERE section_key='sight' AND slug='sculpture')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'glass-steel', 'Glass & Steel', 'Exploring transparency and weight.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- sight/collections
WITH p AS (SELECT id FROM pages WHERE section_key='sight' AND slug='collections')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'digital-studies', 'Digital Studies', 'New media interventions.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- touch/material-experiments
WITH p AS (SELECT id FROM pages WHERE section_key='touch' AND slug='material-experiments')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'linen-clay', 'Linen & Clay', 'Tactile experiments with organic materials.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- touch/mixed-media
WITH p AS (SELECT id FROM pages WHERE section_key='touch' AND slug='mixed-media')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'synthetic-nature', 'Synthetic Nature', 'Blending organic forms with artificial materials.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- touch/watchmaking
WITH p AS (SELECT id FROM pages WHERE section_key='touch' AND slug='watchmaking')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'mechanical-precision', 'Mechanical Precision', 'Macro studies of custom gears, bridges, and escapements.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

WITH p AS (SELECT id FROM pages WHERE section_key='touch' AND slug='watchmaking')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'horological-sculpture', 'Horological Sculpture', 'Finished timepieces and case architecture.', 1 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- touch/fashion
WITH p AS (SELECT id FROM pages WHERE section_key='touch' AND slug='fashion')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'textile-narratives', 'Textile Narratives', 'Explorations in fabric manipulation and organic dyes.', 0 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

WITH p AS (SELECT id FROM pages WHERE section_key='touch' AND slug='fashion')
INSERT INTO albums (page_id, slug, title, description, sort_order)
SELECT p.id, 'avant-garde-forms', 'Avant-Garde Forms', 'Structural garments and conceptual silhouettes.', 1 FROM p
ON CONFLICT (page_id, slug) DO NOTHING;

-- ========================================
-- 4. ALBUM ITEMS
-- ========================================
-- Atmospheric Studies items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='sight' AND p.slug='paintings' AND al.slug='atmospheric-studies')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_paintings_1_1776627360680.png', 'Nocturne in Gold', '2024', 'Oil and Gold Leaf on Canvas', 'An exploration of urban light at midnight, translated through heavy impasto.', 0 FROM a;

WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='sight' AND p.slug='paintings' AND al.slug='atmospheric-studies')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_paintings_2_1776627384437.png', 'Ethereal Drift', '2023', 'Mixed Media on Wood', 'The tension between atmospheric haze and structured geometry.', 1 FROM a;

-- Memory Fragments items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='sight' AND p.slug='paintings' AND al.slug='memory-fragments')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_paintings_hero_1776626955531.png', 'Shattered Mirror', '2024', 'Acrylic and Charcoal', 'Capturing the fragmented nature of childhood memories.', 0 FROM a;

-- Brutalist Rhythms items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='sight' AND p.slug='photography' AND al.slug='brutalist-rhythms')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_photography_1_1776627407211.png', 'Concrete Echo', '2024', 'Digital Photography', 'The silent pulse of a brutalist facade.', 0 FROM a;

-- Glass & Steel items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='sight' AND p.slug='sculpture' AND al.slug='glass-steel')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_sculpture_1_1776627480388.png', 'Tension III', '2024', 'Oxidized Steel and Blown Glass', 'A study in material fragility versus industrial strength.', 0 FROM a;

-- Digital Studies items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='sight' AND p.slug='collections' AND al.slug='digital-studies')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_collections_1_1776627530672.png', 'Data Flux', '2025', 'Generative Art', 'Visualizing memory as a decaying digital stream.', 0 FROM a;

-- Linen & Clay items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='material-experiments' AND al.slug='linen-clay')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1544256718-3bcf237f3974', 'Earthbound I', '2024', 'Clay Pigment on Linen', 'A study of mineral absorption into organic fibers.', 0 FROM a;

-- Synthetic Nature items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='mixed-media' AND al.slug='synthetic-nature')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, '/assets/art/sight_paintings_2_1776627384437.png', 'Resin & Wood', '2023', 'Mixed Media', 'Exploration of natural wood textures encased in synthetic resin.', 0 FROM a;

-- Mechanical Precision items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='watchmaking' AND al.slug='mechanical-precision')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5', 'Escapement Wheel', '2024', 'Macro Photography', 'The heartbeat of a mechanical movement.', 0 FROM a;

WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='watchmaking' AND al.slug='mechanical-precision')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 'Tourbillon Cage', '2024', 'Technical Render', 'Gravity-defying precision.', 1 FROM a;

-- Horological Sculpture items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='watchmaking' AND al.slug='horological-sculpture')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7', 'Obsidian Chronograph', '2025', 'Mixed Media', 'A study in light absorption and time.', 0 FROM a;

-- Textile Narratives items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='fashion' AND al.slug='textile-narratives')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17', 'Shattered Silk', '2024', 'Distressed Fabric', 'A study in material decay and beauty.', 0 FROM a;

WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='fashion' AND al.slug='textile-narratives')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3', 'Indigo Void', '2024', 'Hand-dyed Wool', 'Depth achieved through 40 layers of indigo.', 1 FROM a;

-- Avant-Garde Forms items
WITH a AS (SELECT al.id FROM albums al JOIN pages p ON al.page_id=p.id WHERE p.section_key='touch' AND p.slug='fashion' AND al.slug='avant-garde-forms')
INSERT INTO album_items (album_id, media_url, title, year, medium, description, sort_order)
SELECT a.id, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b', 'Monolith Cloak', '2025', 'Technical Canvas', 'Architectural protection for the urban voyager.', 0 FROM a;

-- ========================================
-- 5. PAGE GALLERY ITEMS (flat galleries: music-archive, poems, lyrics, novels, quotes, journey, audio-visual)
-- ========================================

-- sound/music-archive
WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='music-archive')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', 'Lost Tapes Vol. 1', '2023', 'Analog Cassette', 'Early electronic sketches.', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='music-archive')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', 'Studio Sessions', '2024', 'Digital', 'Live performance outtakes.', 1 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='music-archive')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1514525253344-781472993a4a', 'Synthesizer Study', '2023', 'Modular Synth', 'Patch bay experiments.', 2 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='music-archive')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1459749411177-042180ce673c', 'Acoustic Fragments', '2025', 'Piano', 'Unfinished compositions.', 3 FROM p;

-- sound/audio-visual-work (YouTube videos)
WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='audio-visual-work')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Resonance in Void', '2025', 'Video', 'An exploration of sound and isolated space.', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='audio-visual-work')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://www.youtube.com/embed/jNQXAC9IVRw', 'Neon Pulse', '2024', 'Video', 'Synthwave visualizer and original score.', 1 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='sound' AND slug='audio-visual-work')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://www.youtube.com/embed/ScMzIvxBSi4', 'Echoes of the Atlas', '2025', 'Video', 'Concept trailer for the novel project.', 2 FROM p;

-- voice/poems
WITH p AS (SELECT id FROM pages WHERE section_key='voice' AND slug='poems')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371', 'Syllables of Light', '2024', 'Ink on Vellum', 'Original manuscript page.', 'https://jackyho.com/poems/syllables', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='voice' AND slug='poems')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1455390582262-044cdead277a', 'Nocturne III', '2024', 'Typewritten', 'Captured during the midnight watch.', 'https://jackyho.com/poems/nocturne', 1 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='voice' AND slug='poems')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f', 'The Void', '2023', 'Digital', 'Minimalist layout study.', 'https://jackyho.com/poems/void', 2 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='voice' AND slug='poems')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3', 'Transience', '2025', 'Journal Entry', 'A study on fading ink.', 'https://jackyho.com/poems/transience', 3 FROM p;

-- voice/lyrics
WITH p AS (SELECT id FROM pages WHERE section_key='voice' AND slug='lyrics')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', 'Shattered Rhythm', '2024', 'Digital Note', 'Scrawled in the back of a taxi.', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='voice' AND slug='lyrics')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9', 'Neon Ghost', '2025', 'Typewritten', 'A study in urban isolation.', 1 FROM p;

-- dream/novels
WITH p AS (SELECT id FROM pages WHERE section_key='dream' AND slug='novels')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', 'The Atlas Architecture', '2025', 'Concept Art', 'Visualizing the floating archives.', 'https://jackyho.com/novels/atlas', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='dream' AND slug='novels')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 'Mountain Pass', '2024', 'Digital Matte Painting', 'The journey to the North Spires.', 'https://jackyho.com/novels/mountain', 1 FROM p;

-- dream/quotes
WITH p AS (SELECT id FROM pages WHERE section_key='dream' AND slug='quotes')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353', 'The First Law', '2024', 'Stone Inscription', 'To see is to forget.', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='dream' AND slug='quotes')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f', 'On Memory', '2025', 'Digital Scroll', 'We are the sum of what we lose.', 1 FROM p;

-- heart/journey
WITH p AS (SELECT id FROM pages WHERE section_key='heart' AND slug='journey')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 'The Crossing', '2023', 'Photography', 'Leaving the familiar behind.', 'https://jackyho.com/journey/crossing', 0 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='heart' AND slug='journey')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', 'Quiet Peak', '2024', 'Digital Study', 'The height of creative isolation.', 'https://jackyho.com/journey/peak', 1 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='heart' AND slug='journey')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', 'Deep Woods', '2024', 'Concept Art', 'Losing one''s way to find the path.', 'https://jackyho.com/journey/woods', 2 FROM p;

WITH p AS (SELECT id FROM pages WHERE section_key='heart' AND slug='journey')
INSERT INTO page_gallery_items (page_id, media_url, title, year, medium, description, link, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', 'Return', '2025', 'Photography', 'Carrying the world back with you.', 'https://jackyho.com/journey/return', 3 FROM p;

-- ========================================
-- 6. EXHIBITIONS
-- ========================================
INSERT INTO exhibitions (year, title, location, is_award, sort_order) VALUES
('2026', 'The Great Outdoors by Northern Contemporary Gallery', 'Toronto, Canada', false, 0),
('2025', 'Miami Art Weeks 2025', 'Miami, USA', false, 1),
('2025', 'Trace by PDA at Avant Garde Gallery', 'Toronto, Canada', false, 2),
('2025', 'Natalie Solo Show by La Gloria Mexican Coffee', 'Toronto, Canada', false, 3),
('2025', 'Featured Artist in 101 Artbook Landscape Edition by Arts to Hearts Magazine', 'Worldwide', true, 4);
-- ========================================
-- 7. ADMIN USER SEEDING (Local Dev only)
-- ========================================
-- Create the admin user (password123)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'jackyho@weiinsight.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'jackyho@weiinsight.com'
);

-- Link identity
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at,
    provider_id
)
SELECT
    uuid_generate_v4(),
    id,
    format('{"sub":"%s","email":"%s"}', id, email)::jsonb,
    'email',
    now(),
    now(),
    now(),
    id
FROM auth.users
WHERE email = 'jackyho@weiinsight.com'
AND NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = auth.users.id
);

-- Ensure public.admin_users record
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('jackyho@weiinsight.com', 'Jacky Ho', 'owner')
ON CONFLICT (email) DO NOTHING;

