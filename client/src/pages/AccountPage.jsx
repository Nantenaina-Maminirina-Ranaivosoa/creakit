// client/src/pages/AccountPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

function AccountPage() {
    const { user } = useAuth();

    if (!user) {
        // Sécurité supplémentaire au cas où le composant serait rendu par erreur
        return <p>Veuillez vous connecter pour voir cette page.</p>
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Mon Compte</h1>
            <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
            {/* On pourrait ici faire un appel à /api/users/profile pour avoir l'email */}
            <p>Bienvenue sur votre espace personnel !</p>
        </div>
    );
}

export default AccountPage;