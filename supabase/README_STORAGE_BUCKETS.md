# 📦 Configuration des Buckets Storage

## 🗄️ Buckets créés (7 au total)

### 1. **event-images** - Images des événements
- **Taille limite** : 5MB
- **Formats** : JPEG, PNG, WebP, GIF
- **URL publique** : `/storage/v1/object/public/event-images/`
- **Usage** : Photos des événements, bannières d'événements

### 2. **team-photos** - Photos des membres de l'équipe
- **Taille limite** : 5MB
- **Formats** : JPEG, PNG, WebP, GIF
- **URL publique** : `/storage/v1/object/public/team-photos/`
- **Usage** : Photos de profil des membres de l'équipe

### 3. **blog-images** - Images des articles de blog
- **Taille limite** : 5MB
- **Formats** : JPEG, PNG, WebP, GIF
- **URL publique** : `/storage/v1/object/public/blog-images/`
- **Usage** : Images d'illustration des articles

### 4. **gallery-photos** - Photos de la galerie
- **Taille limite** : 10MB (plus grand)
- **Formats** : JPEG, PNG, WebP, GIF
- **URL publique** : `/storage/v1/object/public/gallery-photos/`
- **Usage** : Photos de la galerie d'événements et activités

### 5. **avatars** - Avatars des utilisateurs
- **Taille limite** : 2MB (plus petit)
- **Formats** : JPEG, PNG, WebP, GIF
- **URL publique** : `/storage/v1/object/public/avatars/`
- **Usage** : Photos de profil des utilisateurs

### 6. **documents** - Documents et fichiers divers
- **Taille limite** : 10MB
- **Formats** : Images, PDF, Texte
- **URL publique** : `/storage/v1/object/public/documents/`
- **Usage** : Documents administratifs, PDF, etc.

### 7. **branding** - Logos et bannières
- **Taille limite** : 5MB
- **Formats** : Images, SVG
- **URL publique** : `/storage/v1/object/public/branding/`
- **Usage** : Logo du site, bannières, éléments de branding

## 🔧 Configuration technique

### **Sécurité**
- ✅ **Tous les buckets sont publics** (pour l'affichage sur le site)
- ✅ **Types MIME validés** pour éviter les uploads malveillants
- ✅ **Tailles limitées** pour optimiser les performances

### **Performance**
- ✅ **Tailles optimisées** par type d'usage
- ✅ **Formats web modernes** (WebP supporté)
- ✅ **Compression recommandée** avant upload

## 🚀 Instructions d'installation

### 1. Dans Supabase Dashboard
1. **Settings** → **Database** → **SQL Editor**
2. **Coller** tout le contenu du script `20260228199500_complete_storage_buckets.sql`
3. **Exécuter** (RUN)

### 2. Vérification automatique
Le script affiche :
- ✅ **Buckets créés** avec leur statut
- ✅ **URLs publiques** pour chaque bucket
- ✅ **Résumé final** de la configuration

## 📋 Utilisation dans le code

### **Exemple pour les événements**
```javascript
const { data, error } = await supabase.storage
  .from('event-images')
  .upload('event-123.jpg', file);

// URL publique
const publicUrl = supabase.storage
  .from('event-images')
  .getPublicUrl('event-123.jpg').data.publicUrl;
```

### **Exemple pour l'équipe**
```javascript
const { data, error } = await supabase.storage
  .from('team-photos')
  .upload('member-456.jpg', file);

// URL publique
const publicUrl = supabase.storage
  .from('team-photos')
  .getPublicUrl('member-456.jpg').data.publicUrl;
```

## 🎯 Conformité avec le site

### **Pages utilisant les buckets**
- **EventsPage.tsx** → `event-images`
- **EventDetailPage.tsx** → `event-images`
- **AdminPage.tsx** → Tous les buckets
- **TeamPage.tsx** → `team-photos`
- **BlogPage.tsx** → `blog-images`
- **GalleryPage.tsx** → `gallery-photos`
- **ProfilePage.tsx** → `avatars`

### **Tailles optimisées**
- **Avatars** : 2MB (petits, rapides)
- **Standard** : 5MB (images, photos)
- **Galerie/Documents** : 10MB (haute qualité)

## 💡 Bonnes pratiques

1. **Compresser** les images avant upload
2. **Utiliser** WebP pour meilleure compression
3. **Nommer** les fichiers de manière descriptive
4. **Nettoyer** régulièrement les fichiers non utilisés
5. **Surveiller** l'espace de stockage utilisé

## 🎉 Résultat

Une configuration complète et sécurisée des buckets storage pour tous les besoins du site Cardano Nyiragongo Hub !

**Tous les buckets sont prêts pour les uploads immédiats !** 🚀
