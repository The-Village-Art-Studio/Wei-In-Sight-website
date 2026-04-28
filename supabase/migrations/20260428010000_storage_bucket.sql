-- Create a 'media' bucket for images and videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public media access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin media upload" ON storage.objects FOR INSERT USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin media update" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin media delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
