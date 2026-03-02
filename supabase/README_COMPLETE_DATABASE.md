# 🗄️ Script Complet de Base de Données

## 📋 Tables créées

### 1. **user_roles** - Rôles des utilisateurs
- `id` : UUID primaire
- `user_id` : Référence à auth.users
- `role` : 'admin' ou 'user'
- `created_at` : Date de création

### 2. **events** - Événements
- `id` : UUID primaire
- `title` : Titre de l'événement
- `slug` : URL unique
- `description` : Description courte
- `full_content` : Contenu complet
- `date_start/date_end` : Dates de l'événement
- `location` : Lieu
- `moderator` : Modérateur
- `total_seats/reserved_seats` : Places
- `is_upcoming` : Événement à venir
- `image_url` : Image
- `external_link` : Lien externe

### 3. **event_reservations** - Réservations d'événements
- `id` : UUID primaire
- `event_id` : Référence à events
- `full_name` : Nom complet
- `email` : Email
- `created_at` : Date de réservation

### 4. **event_comments** - Commentaires d'événements
- `id` : UUID primaire
- `event_id` : Référence à events
- `author_name` : Nom de l'auteur
- `author_email` : Email de l'auteur
- `content` : Contenu du commentaire
- `created_at` : Date de création
- `is_approved` : Approuvé ou non

### 5. **team_members** - Membres de l'équipe
- `id` : UUID primaire
- `name` : Nom
- `role` : Rôle dans l'équipe
- `bio` : Biographie
- `email` : Email
- `photo_url` : Photo
- `linkedin_url` : LinkedIn
- `twitter_url` : Twitter

### 6. **articles** - Articles de blog
- `id` : UUID primaire
- `title` : Titre
- `slug` : URL unique
- `excerpt` : Résumé
- `content` : Contenu complet
- `author` : Auteur
- `category` : Catégorie
- `image_url` : Image
- `published` : Publié ou non

### 7. **article_comments** - Commentaires d'articles
- `id` : UUID primaire
- `article_id` : Référence à articles
- `author_name` : Nom de l'auteur
- `author_email` : Email de l'auteur
- `content` : Contenu du commentaire
- `created_at` : Date de création
- `is_approved` : Approuvé ou non

### 8. **gallery_photos** - Galerie de photos
- `id` : UUID primaire
- `title` : Titre
- `description` : Description
- `image_url` : URL de l'image
- `category` : Catégorie
- `created_at` : Date d'ajout

### 9. **newsletter_subscriptions** - Inscriptions newsletter
- `id` : UUID primaire
- `email` : Email (unique)
- `name` : Nom optionnel
- `subscribed_at` : Date d'inscription
- `is_active` : Actif ou non

### 10. **contact_submissions** - Messages du formulaire de contact
- `id` : UUID primaire
- `name` : Nom
- `email` : Email
- `subject` : Sujet
- `message` : Message
- `created_at` : Date d'envoi
- `is_read` : Lu ou non

### 11. **profiles** - Profils utilisateurs
- `id` : UUID primaire
- `user_id` : Référence à auth.users
- `display_name` : Nom d'affichage
- `avatar_url` : Avatar
- `bio` : Biographie
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

## 🔐 Politiques RLS configurées

### Accès public
- **Lecture** : événements, membres équipe, galerie, articles publiés
- **Insertion** : réservations, commentaires, newsletter, contact

### Accès utilisateurs authentifiés
- **Profil propre** : lecture et mise à jour
- **Rôle propre** : lecture

### Accès administrateurs
- **Gestion complète** : toutes les tables
- **Modération** : commentaires, réservations

## 🚀 Instructions d'installation

### 1. Copier le script
```sql
-- Copier tout le contenu de :
-- 20260228199000_complete_database_setup.sql
```

### 2. Dans Supabase Dashboard
1. **Settings** → **Database** → **SQL Editor**
2. **Coller** tout le contenu du script
3. **Exécuter** (RUN)

### 3. Vérification
Le script affiche automatiquement :
- ✅ Nombre de tables créées
- ✅ Nombre de politiques RLS créées
- ✅ Message de succès

## 🎯 Fonctionnalités disponibles

Après exécution :
- ✅ **Gestion des événements** avec réservations et commentaires
- ✅ **Blog** avec articles et commentaires
- ✅ **Équipe** avec profils et réseaux sociaux
- ✅ **Galerie** de photos
- ✅ **Newsletter** avec inscriptions
- ✅ **Formulaire de contact** avec messages
- ✅ **Rôles utilisateurs** (admin/user)
- ✅ **Profils** personnalisés

## 💡 Notes importantes

1. **RLS activé** sur toutes les tables pour la sécurité
2. **Index optimisés** pour les performances
3. **Fonctions utilitaires** pour la gestion des utilisateurs
4. **Données initiales** : Baudouin MUVUNGA comme Leader
5. **Politiques granulaires** pour chaque type d'accès

## 🎉 Résultat

Une base de données complète, sécurisée et optimisée pour le site Cardano Nyiragongo Hub !
