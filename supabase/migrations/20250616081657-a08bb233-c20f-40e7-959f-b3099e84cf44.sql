
-- Create the video storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('video', 'video', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow public access to read files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'video');

-- Create a policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'video' AND auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to update files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (bucket_id = 'video' AND auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (bucket_id = 'video' AND auth.role() = 'authenticated');
