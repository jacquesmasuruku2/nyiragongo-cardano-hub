# 🚨 Guide d'Installation Manuelle Storage

## Problème rencontré
Erreur `must be owner of table objects` = permissions manquantes pour créer les buckets.

## ✅ Solution Manuelle (Recommandée)

### Étape 1: Créer les buckets via l'interface Supabase

1. **Aller dans Supabase Dashboard**
2. **Navigation** : Storage → Buckets
3. **Créer les 3 buckets** un par un :

#### Bucket 1: event-images
- Cliquer sur "New bucket"
- **Name**: `event-images`
- **Public bucket**: ✅ Cocher
- **File size limit**: 52428800 (50MB)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

#### Bucket 2: team-photos
- Cliquer sur "New bucket"  
- **Name**: `team-photos`
- **Public bucket**: ✅ Cocher
- **File size limit**: 52428800 (50MB)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

#### Bucket 3: blog-images
- Cliquer sur "New bucket"
- **Name**: `blog-images`
- **Public bucket**: ✅ Cocher
- **File size limit**: 52428800 (50MB)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

### Étape 2: Configurer les politiques RLS

1. **Aller dans** : Settings → Database → SQL Editor
2. **Exécuter ces requêtes une par une** :

#### Pour event-images :
```sql
-- Activer RLS si pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politique lecture publique
CREATE POLICY "Public read access for event-images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Politique admin
CREATE POLICY "Admin full access for event-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'event-images' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);
```

#### Pour team-photos :
```sql
-- Politique lecture publique
CREATE POLICY "Public read access for team-photos" ON storage.objects
FOR SELECT USING (bucket_id = 'team-photos');

-- Politique admin
CREATE POLICY "Admin full access for team-photos" ON storage.objects
FOR ALL USING (
  bucket_id = 'team-photos' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);
```

#### Pour blog-images :
```sql
-- Politique lecture publique
CREATE POLICY "Public read access for blog-images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Politique admin
CREATE POLICY "Admin full access for blog-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);
```

### Étape 3: Vérification

Exécuter cette requête pour vérifier :
```sql
-- Vérifier les buckets
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('event-images', 'team-photos', 'blog-images')
ORDER BY id;

-- Vérifier les politiques
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
```

### Étape 4: Test

1. **Aller dans le Panel Admin** : `/admin`
2. **Tester l'upload** :
   - Ajouter un membre d'équipe (team-photos)
   - Créer un événement (event-images)
   - Publier un article (blog-images)

## 🎯 Résultat attendu

Si tout est bien configuré :
- ✅ Les 3 buckets apparaissent dans Storage
- ✅ Les 6 politiques apparaissent dans les politiques
- ✅ L'upload fonctionne dans le Panel Admin
- ✅ Les images sont accessibles publiquement

## 🔧 Si ça ne fonctionne toujours pas

1. **Vérifier les noms exacts** :
   - `event-images` (pas `event_images`)
   - `team-photos` (pas `team_photos`)
   - `blog-images` (pas `blog_images`)

2. **Vérifier votre rôle** :
   ```sql
   SELECT role FROM user_roles WHERE user_id = auth.uid();
   ```

3. **Contacter le support Supabase** si problème de permissions

Le code du Panel Admin est déjà **parfait** et ne nécessite aucune modification !
