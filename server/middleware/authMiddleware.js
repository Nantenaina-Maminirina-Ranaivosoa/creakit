// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

// On se reconnecte à la DB car ce fichier est séparé
const db = new sqlite3.Database('./creakit.db');

const protect = (req, res, next) => {
    let token;

    // Le token est envoyé dans l'en-tête "Authorization" sous la forme "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. On extrait le token de l'en-tête
            token = req.headers.authorization.split(' ')[1];

            // 2. On vérifie la validité du token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. On récupère l'utilisateur depuis la DB sans le mot de passe
            const sql = `SELECT id, username, email FROM users WHERE id = ?`;
            db.get(sql, [decoded.user.id], (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé.' });
                }
                // 4. On attache l'objet user à la requête pour les routes suivantes
                req.user = user;
                next(); // On passe au prochain middleware ou à la route finale
            });

        } catch (error) {
            res.status(401).json({ message: 'Non autorisé, token invalide.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, pas de token fourni.' });
    }
};

module.exports = { protect };