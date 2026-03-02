# Configuration Storage Supabase pour Cardano Nyiragongo Hub

## 🎯 Objectif
Configurer les buckets storage nécessaires pour l'upload d'images dans le Panel Admin.

## 📦 Buckets requis

1. **`event-images`** : Images des événements
2. **`team-photos`** : Photos des membres d'équipe
3. **`blog-images`** : Images des articles de blog

## 🚀 Instructions d'installation

### Méthode 1: Via l'interface Supabase (Recommandé)

1. **Aller dans Supabase Dashboard** → Storage
2. **Créer les 3 buckets manuellement** :
   - Cliquer sur "New bucket"
   - Nom : `event-images` (Public: Oui)
   - Nom : `team-photos` (Public: Oui)
   - Nom : `blog-images` (Public: Oui)
3. **Configurer les RLS Policies** pour chaque bucket :

#### Pour event-images :
```sql
-- Lecture publique
CREATE POLICY "Public read access for event-images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Accès admin
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
-- Lecture publique
CREATE POLICY "Public read access for team-photos" ON storage.objects
FOR SELECT USING (bucket_id = 'team-photos');

-- Accès admin
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
-- Lecture publique
CREATE POLICY "Public read access for blog-images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Accès admin
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

### Méthode 2: Via migrations SQL

1. **Copier les fichiers de migration** :
   ```
   supabase/migrations/20260228193000_storage_buckets.sql
   supabase/migrations/20260228193500_fix_storage_buckets.sql
   ```

2. **Exécuter dans Supabase Dashboard** :
   - Aller dans Settings → Database
   - Cliquer sur "SQL Editor"
   - Copier-coller le contenu des fichiers
   - Exécuter dans l'ordre

## ✅ Vérification

Utiliser le script `check_storage.sql` pour vérifier :
- Les buckets sont créés
- Les politiques sont appliquées
- Les permissions sont correctes

## 🔧 Dépannage

### Si l'upload échoue avec "Bucket not found" :

1. **Vérifier les noms** : Doivent être exactement
   - `event-images` (pas `event_images`)
   - `team-photos` (pas `team_photos`)
   - `blog-images` (pas `blog_images`)

2. **Vérifier les politiques** :
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

3. **Vérifier RLS** :
   ```sql
   SELECT relrowsecurity FROM pg_class WHERE relname = 'objects';
   ```

### Si erreur de permission :

1. **Vérifier le rôle utilisateur** :
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'VOTRE_USER_ID';
   ```

2. **S'assurer d'être admin** :
   ```sql
   SELECT role FROM user_roles WHERE user_id = auth.uid();
   ```

## 📝 Notes importantes

- Les buckets doivent être **publics** pour que les images soient accessibles
- Les politiques RLS doivent permettre la **lecture publique**
- Seuls les **admins** peuvent uploader/modifier/supprimer
- La taille limite est de **50MB** par fichier

## 🎯 Résultat attendu

Une fois configuré, vous devriez pouvoir :
- ✅ Uploader des images d'événements
- ✅ Uploader des photos de membres
- ✅ Uploader des images d'articles
- ✅ Voir les images publiques sur le site
