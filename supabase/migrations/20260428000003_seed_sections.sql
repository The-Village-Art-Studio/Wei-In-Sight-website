-- WEI IN SIGHT: Seed Core Sections
-- This ensures the foreign key constraints in the 'pages' table are satisfied.

INSERT INTO sections (section_key, title, subtitle)
VALUES 
  ('sight', 'SIGHT', 'Visual Arts'),
  ('sound', 'SOUND', 'Music & Audio'),
  ('touch', 'TOUCH', 'Mixed Media & Process'),
  ('voice', 'VOICE', 'Poems & Lyrics'),
  ('dream', 'DREAM', 'Novel & Story World'),
  ('heart', 'HEART', 'About / Philosophy / Journey'),
  ('pulse', 'PULSE', 'Buy Art / Commissions / Contact')
ON CONFLICT (section_key) DO NOTHING;
