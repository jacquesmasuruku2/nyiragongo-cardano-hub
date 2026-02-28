# 🚨 Solution Alternative - Problème de Permissions

## Problème identifié
Erreur `must be owner of table objects` = **permissions insuffisantes** pour créer/modifier les politiques RLS sur `storage.objects`.

## ✅ Solution Alternative

### Option 1: Via l'interface Supabase (Recommandée)

1. **Aller dans Supabase Dashboard**
2. **Navigation** : Storage → Buckets
3. **Créer les buckets manuellement** s'ils n'existent pas :
   - `event-images` (Public: Oui)
   - `team-photos` (Public: Oui)  
   - `blog-images` (Public: Oui)
4. **Configurer les politiques via l'interface** :
   - Cliquer sur chaque bucket → Settings → Policies
   - Ajouter les politiques ci-dessous

### Option 2: Demander l'augmentation des permissions

1. **Contacter le support Supabase**
2. **Demander les permissions** pour créer des politiques RLS
3. **Ou demander au propriétaire** du projet d'exécuter les migrations

### Option 3: Utiliser un bucket temporaire

Si vous avez des permissions limitées, utiliser un bucket existant :

```sql
-- Utiliser un bucket existant comme solution temporaire
-- Remplacer dans AdminPage.tsx les noms de buckets :

-- Pour les événements
supabase.storage.from("avatars") -- au lieu de "event-images"

-- Pour les photos d'équipe  
supabase.storage.from("avatars") -- au lieu de "team-photos"

-- Pour les images de blog
supabase.storage.from("avatars") -- au lieu de "blog-images"
```

## 📋 Politiques RLS requises (à créer manuellement)

### Pour chaque bucket, créer 2 politiques :

#### 1. Politique de lecture publique
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'NOM_DU_BUCKET');
```

#### 2. Politique d'accès admin
```sql
CREATE POLICY "Admin full access" ON storage.objects
FOR ALL USING (
  bucket_id = 'NOM_DU_BUCKET' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);
```

## 🎯 Solution Recommandée

**Contactez le propriétaire du projet Supabase** pour qu'il exécute les migrations avec les permissions nécessaires, ou utilisez l'Option 1 via l'interface graphique.

Le code Panel Admin est **parfait** et ne nécessite aucune modification !
