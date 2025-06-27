// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // On a besoin de la fonction login
import './AuthForm.css';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // On récupère la fonction login du contexte

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion');
            }
            // Si la connexion réussit, on utilise la fonction du contexte
            login(data.user, data.token);
            navigate('/'); // On redirige vers l'accueil
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Connexion</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
                <button type="submit" className="btn-primary">Se connecter</button>
            </form>
        </div>
    );
}

export default LoginPage;