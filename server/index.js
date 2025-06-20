// server/index.js

// 1. Import des modules nécessaires
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 

// 2. Initialisation de l'application Express
const app = express();
app.use(cors());
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
  db.get("SELECT COUNT(*) as count FROM kits", (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row.count === 0) {
            console.log("La table 'kits' est vide, insertion des données initiales...");
            const stmt = db.prepare("INSERT INTO kits (name, description, price, imageUrl) VALUES (?, ?, ?, ?)");
            const kitsToInsert = [
                { name: "Kit Terrarium 'Forêt Miniature'", description: "Créez votre propre écosystème autosuffisant dans un bocal en verre. Contient tout le nécessaire.", price: 39.99, imageUrl: "/images/terrarium.jpg" },
                { name: "Kit Tricot 'Mon Écharpe Douce'", description: "Apprenez les bases du tricot et confectionnez une écharpe chaude et stylée pour l'hiver.", price: 29.99, imageUrl: "/images/tricot.jpg" },
                { name: "Kit Bougies Parfumées 'Ambiance Cosy'", description: "Fabriquez trois bougies à la cire de soja avec des parfums de vanille, cannelle et bois de santal.", price: 34.50, imageUrl: "/images/bougies.jpg" }
            ];

            kitsToInsert.forEach(kit => {
                stmt.run(kit.name, kit.description, kit.price, kit.imageUrl);
            });
            stmt.finalize();
            console.log("Données initiales insérées avec succès.");
        } else {
            console.log("La table 'kits' contient déjà des données.");
        }
      });
});


// 5. Création d'une route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('<h1>Bienvenue sur le serveur de CréaKit !</h1>');
});
// 6. <-- NOUVEAU : Endpoint de l'API pour récupérer tous les kits
app.get('/api/kits', (req, res) => {
    const sql = "SELECT * FROM kits";
    db.all(sql, [], (err, rows) => {
        if (err) {
            // En cas d'erreur serveur, on renvoie un statut 500
            res.status(500).json({ "error": err.message });
            return;
        }
        // Si tout va bien, on renvoie les données en JSON
        res.json({
            "message": "success",
            "data": rows
        });
    });
});
// 6. Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});