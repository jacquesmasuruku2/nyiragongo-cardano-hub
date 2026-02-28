-- Script de vérification des buckets storage
-- À exécuter dans l'éditeur SQL Supabase pour vérifier la configuration

-- Vérifier les buckets existants
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id IN ('event-images', 'team-photos', 'blog-images')
ORDER BY id;

-- Vérifier les politiques existantes pour chaque bucket
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- Test d'upload simple (à décommenter pour tester)
/*
-- Test pour event-images
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('event-images', 'test-upload.jpg', 'test-user', '{"size": 1024}');

-- Test pour team-photos
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('team-photos', 'test-photo.jpg', 'test-user', '{"size": 1024}');

-- Test pour blog-images
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES ('blog-images', 'test-blog.jpg', 'test-user', '{"size": 1024}');
*/
