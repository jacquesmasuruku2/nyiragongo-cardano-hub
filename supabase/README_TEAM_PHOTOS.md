# Team Photos Bucket Setup Guide

## 📋 Overview
Ce guide explique comment configurer le bucket `team-photos` pour gérer les photos de profil des membres de l'équipe dans votre panel admin.

## 🔧 Configuration Supabase

### 1. Exécuter le script SQL
```bash
# Dans votre dashboard Supabase, allez dans:
# SQL Editor > New Query > Copiez-collez le contenu de team_photos_bucket_setup.sql
```

### 2. Bucket créé
- **Nom**: `team-photos`
- **Public**: ✅ Oui (accessible publiquement)
- **Taille max**: 5MB par fichier
- **Formats**: JPEG, PNG, WebP, GIF

## 🛡️ Politiques de Sécurité

### Storage Policies (team-photos)
1. **Upload**: Authentifiés peuvent uploader
2. **Update**: Authentifiés peuvent modifier
3. **Select**: Public peut voir les photos
4. **Delete**: Authentifiés peuvent supprimer

### Table Policies (team_members)
1. **Select**: Authentifiés + Public (actifs seulement)
2. **Insert**: Authentifiés peuvent créer
3. **Update**: Authentifiés peuvent modifier
4. **Delete**: Authentifiés peuvent supprimer

## 📊 Structure de la table team_members

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| name | TEXT | Nom du membre |
| role | TEXT | Rôle/Position |
| bio | TEXT | Biographie |
| email | TEXT | Email professionnel |
| photo_url | TEXT | URL de la photo |
| linkedin_url | TEXT | Profil LinkedIn |
| twitter_url | TEXT | Profil Twitter |
| github_url | TEXT | Profil GitHub |
| website_url | TEXT | Site personnel |
| is_active | BOOLEAN | Membre actif |
| order_index | INTEGER | Ordre d'affichage |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de modification |

## 🚀 Utilisation dans le Panel Admin

### Upload de photo
```typescript
// Le code dans votre panel admin gère déjà:
// 1. Upload vers team-photos bucket
// 2. Génération URL publique
// 3. Sauvegarde dans team_members table
```

### URL publique des photos
```
https://[votre-projet].supabase.co/storage/v1/object/public/team-photos/[nom-fichier]
```

## 🧪 Test et Vérification

### 1. Vérifier le bucket
```sql
SELECT * FROM storage.buckets WHERE id = 'team-photos';
```

### 2. Vérifier les politiques
```sql
SELECT * FROM pg_policies WHERE table_name IN ('storage.objects', 'team_members');
```

### 3. Vérifier la table
```sql
SELECT * FROM team_members ORDER BY order_index;
```

## 📝 Notes importantes

1. **Permissions**: Les politiques permettent l'accès authentifié et public selon les besoins
2. **Sécurité**: Les uploads sont limités aux formats d'images
3. **Performance**: Index créés pour optimiser les requêtes
4. **Maintenance**: Trigger automatique pour updated_at

## 🔍 Dépannage

### Si l'upload ne fonctionne pas:
1. Vérifiez que vous êtes connecté (authentifié)
2. Vérifiez la taille du fichier (< 5MB)
3. Vérifiez le format (JPEG, PNG, WebP, GIF)
4. Vérifiez les politiques RLS

### Si les photos ne s'affichent pas:
1. Vérifiez que le bucket est public
2. Vérifiez les URLs dans la table team_members
3. Vérifiez les permissions de lecture

## 🎯 Prochaines étapes

1. Exécutez le script SQL dans Supabase
2. Testez l'upload dans le panel admin
3. Vérifiez l'affichage des photos sur le site public
4. Ajustez les politiques si nécessaire
