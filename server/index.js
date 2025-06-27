// server/index.js

// server/index.js
require('dotenv').config(); // Charge les variables de .env dans process.env

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Import des modules nécessaires
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// 2. Initialisation de l'application Express
const app = express();
app.use(cors());
app.use(express.json());

const { protect } = require('./middleware/authMiddleware');
const PORT = process.env.PORT || 3001; // On utilisera le port 3001 pour le backend

// 3. Connexion à la base de données SQLite
// Le fichier 'creakit.db' sera créé s'il n'existe pas.
const db = new sqlite3.Database("./creakit.db", (err) => {
  if (err) {
    console.error(
      "Erreur lors de la connexion à la base de données",
      err.message
    );
  } else {
    console.log("Connecté à la base de données SQLite 'creakit'.");
  }
});

// 4. Création de la table 'kits' si elle n'existe pas
// C'est ici que j'utilise mes compétences SQL.
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS kits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT
  )`,
    (err) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table 'kits'",
          err.message
        );
      } else {
        console.log("Table 'kits' créée ou déjà existante.");
      }
    }
  );
  db.get("SELECT COUNT(*) as count FROM kits", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row.count === 0) {
      console.log(
        "La table 'kits' est vide, insertion des données initiales..."
      );
      const stmt = db.prepare(
        "INSERT INTO kits (name, description, price, imageUrl) VALUES (?, ?, ?, ?)"
      );
      const kitsToInsert = [
        {
          name: "Kit Terrarium 'Forêt Miniature'",
          description:
            "Créez votre propre écosystème autosuffisant dans un bocal en verre. Contient tout le nécessaire.",
          price: 39.99,
          imageUrl: "/images/terrarium.jpg",
        },
        {
          name: "Kit Tricot 'Mon Écharpe Douce'",
          description:
            "Apprenez les bases du tricot et confectionnez une écharpe chaude et stylée pour l'hiver.",
          price: 29.99,
          imageUrl: "/images/tricot.jpg",
        },
        {
          name: "Kit Bougies Parfumées 'Ambiance Cosy'",
          description:
            "Fabriquez trois bougies à la cire de soja avec des parfums de vanille, cannelle et bois de santal.",
          price: 34.5,
          imageUrl: "/images/bougies.jpg",
        },
      ];

      kitsToInsert.forEach((kit) => {
        stmt.run(kit.name, kit.description, kit.price, kit.imageUrl);
      });
      stmt.finalize();
      console.log("Données initiales insérées avec succès.");
    } else {
      console.log("La table 'kits' contient déjà des données.");
    }
  });
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table 'users'",
          err.message
        );
      } else {
        console.log("Table 'users' prête.");
      }
    }
  );
});

// 5. Création d'une route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("<h1>Bienvenue sur le serveur de CréaKit !</h1>");
});
// 6. <-- NOUVEAU : Endpoint de l'API pour récupérer tous les kits
app.get("/api/kits", (req, res) => {
  const sql = "SELECT * FROM kits";
  db.all(sql, [], (err, rows) => {
    if (err) {
      // En cas d'erreur serveur, on renvoie un statut 500
      res.status(500).json({ error: err.message });
      return;
    }
    // Si tout va bien, on renvoie les données en JSON
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// 7. <-- NOUVEAU : Endpoint pour récupérer UN SEUL kit par son ID
app.get("/api/kits/:id", (req, res) => {
  // On récupère l'ID depuis les paramètres de la route
  const id = req.params.id;
  const sql = "SELECT * FROM kits WHERE id = ?";

  // db.get récupère la première ligne correspondante, contrairement à db.all
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Si 'row' existe, on le renvoie. Sinon, on renvoie une erreur 404 (Non trouvé)
    if (row) {
      res.json({
        message: "success",
        data: row,
      });
    } else {
      res.status(404).json({ message: "Kit non trouvé." });
    }
  });
});
// --- ROUTES D'AUTHENTIFICATION ---

// Inscription (Register)
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Veuillez fournir tous les champs." });
    }

    try {
        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
        db.run(sql, [username, email, password_hash], function(err) {
            if (err) {
                // Erreur de contrainte unique (username ou email déjà pris)
                return res.status(409).json({ message: "Cet utilisateur ou email existe déjà." });
            }
            res.status(201).json({ message: "Utilisateur créé avec succès.", userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// Connexion (Login)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez fournir tous les champs." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        // Comparaison du mot de passe fourni avec le hash en base de données
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        // Création du jeton JWT
        const payload = { user: { id: user.id, username: user.username } };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Le token expirera dans 1 heure
        );

        res.json({ token, user: {id: user.id, username: user.username} });
    });
});

app.get('/api/users/profile', protect, (req, res) => {
    // Grâce au middleware `protect`, on a accès à req.user ici
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    });
});



// 6. Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
