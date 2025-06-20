// server/index.js

// 1. Import des modules nécessaires
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// 2. Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3001; // On utilisera le port 3001 pour le backend

// 3. Connexion à la base de données SQLite
// Le fichier 'creakit.db' sera créé s'il n'existe pas.
const db = new sqlite3.Database('./creakit.db', (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données", err.message);
  } else {
    console.log("Connecté à la base de données SQLite 'creakit'.");
  }
});

// 4. Création de la table 'kits' si elle n'existe pas
// C'est ici que nous utilisons nos compétences SQL.
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS kits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT
  )`, (err) => {
    if (err) {
      console.error("Erreur lors de la création de la table 'kits'", err.message);
    } else {
      console.log("Table 'kits' créée ou déjà existante.");
    }
  });
});

// 5. Création d'une route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('<h1>Bienvenue sur le serveur de CréaKit !</h1>');
});

// 6. Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});