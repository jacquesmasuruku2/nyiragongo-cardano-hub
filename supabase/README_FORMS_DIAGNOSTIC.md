# 🔍 Diagnostic des Formulaires - Guide Complet

## 🚨 Problème identifié
Les formulaires n'envoient pas de messages dans la base de données. Voici le diagnostic complet.

## 📋 Script de diagnostic

**Fichier** : `check_forms.sql`

### Étapes de vérification

#### 1. **Vérification des tables**
```sql
-- Vérifie si les tables requises existent
SELECT table_name, table_type, status
FROM information_schema.tables 
WHERE table_name IN ('contact_submissions', 'newsletter_subscriptions', 'event_reservations', 'event_comments', 'article_comments')
```

#### 2. **Vérification des politiques RLS**
```sql
-- Vérifie les politiques de sécurité
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE tablename IN ('contact_submissions', 'newsletter_subscriptions', 'event_reservations', 'event_comments', 'article_comments')
```

#### 3. **Vérification des données existantes**
```sql
-- Compte les enregistrements dans chaque table
SELECT table_name, record_count, oldest_record, newest_record
FROM [tables de formulaires]
```

#### 4. **Test d'insertion**
```sql
-- Teste l'insertion dans chaque table
DO $$
BEGIN
    INSERT INTO contact_submissions (name, email, subject, message)
    VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test Message');
    RAISE NOTICE 'Test insertion réussie';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur: %', SQLERRM;
END $$;
```

#### 5. **Vérification des permissions**
```sql
-- Vérifie les permissions de l'utilisateur anonyme
SELECT tablename, can_insert, can_select, can_update, can_delete
FROM information_schema.tables 
WHERE table_name IN ([tables de formulaires])
```

## 🚀 Instructions d'exécution

### 1. Dans Supabase Dashboard
1. **Settings** → **Database** → **SQL Editor**
2. **Coller** tout le contenu de `check_forms.sql`
3. **Exécuter** (RUN)

### 2. Analyse des résultats

#### ✅ **Si tout est correct**
- Tables existent : ✓
- Permissions INSERT : ✓
- Tests d'insertion : ✓
- Données s'accumulent : ✓

#### ❌ **Problèmes possibles**

##### **Problème 1: Tables manquantes**
**Symptôme** : `0 rows returned` pour les tables
**Solution** : Exécuter `20260228199000_complete_database_setup.sql`

##### **Problème 2: Permissions RLS**
**Symptôme** : `can_insert = false` pour l'utilisateur anonyme
**Solution** : Ajuster les politiques RLS

##### **Problème 3: Politiques manquantes**
**Symptôme** : `0 rows returned` pour pg_policies
**Solution** : Recréer les politiques RLS

##### **Problème 4: Erreurs d'insertion**
**Symptôme** : Messages d'erreur dans les tests
**Solution** : Vérifier les contraintes et types

## 🔧 Solutions rapides

### Solution 1: Recréer les tables
```sql
-- Exécuter le script complet
-- 20260228199000_complete_database_setup.sql
```

### Solution 2: Corriger les permissions
```sql
-- Politiques pour insertions publiques
CREATE POLICY "Public insert contact" ON contact_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert newsletter" ON newsletter_subscriptions
FOR INSERT WITH CHECK (true);

-- etc. pour chaque table
```

### Solution 3: Désactiver RLS temporairement
```sql
-- Pour tester uniquement
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions DISABLE ROW LEVEL SECURITY;
-- etc.
```

## 📊 Vérification côté client

### Vérifier les appels Supabase
```javascript
// Dans le navigateur (F12 → Console)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

// Tester une insertion manuelle
const { data, error } = await supabase
  .from('contact_submissions')
  .insert({
    name: 'Test',
    email: 'test@example.com',
    subject: 'Test',
    message: 'Test message'
  });

console.log('Result:', data, error);
```

### Vérifier les erreurs réseau
```javascript
// Dans Network tab (F12)
// Chercher les requêtes vers Supabase
// Vérifier les codes de réponse (200, 400, 401, 403, 500)
```

## 🎯 Actions recommandées

### 1. **Diagnostic immédiat**
- Exécuter `check_forms.sql`
- Analyser les résultats
- Identifier le problème exact

### 2. **Correction ciblée**
- Si tables manquantes : Exécuter le script de création
- Si permissions incorrectes : Ajuster les politiques RLS
- Si erreurs côté client : Vérifier la configuration

### 3. **Test final**
- Soumettre un formulaire de test
- Vérifier les données dans Supabase
- Confirmer le fonctionnement

## ⚠️ Points à vérifier

1. **Variables d'environnement** : `.env` correctement configuré
2. **URL Supabase** : Accessible et valide
3. **Clé publique** : Correcte et non expirée
4. **RLS activé** : Politiques correctes
5. **Types de données** : Correspondent aux formulaires

## 🎉 Résultat attendu

Après correction :
- ✅ Formulaires fonctionnent
- ✅ Données sauvegardées
- ✅ Aucune erreur console
- ✅ Base de données mise à jour

**Exécutez d'abord le diagnostic pour identifier la cause exacte !** 🔍
