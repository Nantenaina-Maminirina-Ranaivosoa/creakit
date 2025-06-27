// client/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const { user } = useAuth();

    if (!user) {
        // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        return <Navigate to="/login" replace />;
    }

    // Si l'utilisateur est connecté, on affiche le contenu de la route demandée
    return <Outlet />;
}

export default ProtectedRoute;