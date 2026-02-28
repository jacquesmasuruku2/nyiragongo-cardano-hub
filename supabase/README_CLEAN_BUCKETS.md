# 🧹 Script de Nettoyage et Création des Buckets

## 🚨 Correction de l'erreur précédente

L'erreur `syntax error at or near "/"` était causée par les URLs dans les SELECT qui contenaient des slashes. Ce script corrige ce problème et ajoute le nettoyage des buckets existants.

## 🔄 Processus en 2 étapes

### ÉTAPE 1: Nettoyage (Suppression des buckets existants)
Le script vérifie et supprime automatiquement :
- ✅ **event-images** avec tout son contenu
- ✅ **team-photos** avec tout son contenu
- ✅ **blog-images** avec tout son contenu
- ✅ **gallery-photos** avec tout son contenu
- ✅ **avatars** avec tout son contenu
- ✅ **documents** avec tout son contenu
- ✅ **branding** avec tout son contenu

### ÉTAPE 2: Création (Nouveaux buckets propres)
Recréation complète avec :
- ✅ **Configuration propre**
- ✅ **Tailles optimisées**
- ✅ **Types MIME validés**
- ✅ **Accès public**

## 📋 Buckets créés

| Bucket | Taille | Usage |
|--------|--------|-------|
| event-images | 5MB | Images des événements |
| team-photos | 5MB | Photos de l'équipe |
| blog-images | 5MB | Images des articles |
| gallery-photos | 10MB | Photos de galerie |
| avatars | 2MB | Avatars utilisateurs |
| documents | 10MB | Documents divers |
| branding | 5MB | Logos et bannières |

## 🚀 Instructions d'exécution

### 1. Dans Supabase Dashboard
1. **Settings** → **Database** → **SQL Editor**
2. **Coller** tout le contenu du script `20260228199600_clean_and_create_buckets.sql`
3. **Exécuter** (RUN)

### 2. Résultat attendu
Le script affichera :
- ✅ **Messages de suppression** des anciens buckets
- ✅ **Liste des nouveaux buckets** créés
- ✅ **URLs publiques** pour chaque bucket
- ✅ **Résumé final** de succès

## 🔧 Corrections apportées

### Problèmes résolus
- ❌ **Erreur de syntaxe** avec les URLs dans SELECT
- ❌ **Buckets existants** qui causaient des conflits
- ✅ **Syntaxe SQL valide** pour toutes les requêtes
- ✅ **Nettoyage complet** avant création

### Améliorations
- ✅ **DO $$ blocks** pour suppression conditionnelle
- ✅ **RAISE NOTICE** pour le suivi du nettoyage
- ✅ **URLs formatées** correctement dans les SELECT
- ✅ **Messages clairs** de statut

## 📊 Vérification automatique

Le script inclut 3 niveaux de vérification :

### 1. Vérification des buckets créés
```sql
SELECT id, name, public, file_size_limit, created_at, status
FROM storage.buckets 
WHERE name IN ('event-images', 'team-photos', ...)
```

### 2. Informations des URLs
```sql
SELECT bucket_name, url_prefix, size_limit, usage
-- Format propre sans slashes dans les SELECT
```

### 3. Résumé final
```sql
SELECT message, buckets_created, status, cleanup_status
```

## 🎯 Avantages de cette version

1. **Nettoyage complet** : Supprime les anciens buckets et leur contenu
2. **Création propre** : Nouveaux buckets sans conflits
3. **Syntaxe valide** : Plus d'erreurs SQL
4. **Vérification automatique** : Confirmation du succès
5. **Messages clairs** : Suivi du processus

## ⚠️ Important

- **Le script supprime** le contenu existant des buckets
- **Assurez-vous** d'avoir des sauvegardes si nécessaire
- **Exécutez** dans un environnement de test d'abord si possible

## 🎉 Résultat final

Une configuration propre et fonctionnelle des buckets storage pour Cardano Nyiragongo Hub !

**Tous les buckets sont prêts pour les uploads immédiats !** 🚀
