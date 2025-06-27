// client/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import './Header.css';

function Header() {
    const { cartItems } = useCart();
    const { user, logout } = useAuth(); 
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="app-header">
            <div className="header-container">
                <Link to="/" className="logo">CréaKit</Link>
                <nav className="nav-links">
                    <Link to="/panier" className="nav-link">Panier ({totalItems})</Link>
                    {user ? (
                        <>
                            <span className="nav-link welcome-user">Bonjour, {user.username}</span>
                            <button onClick={logout} className="nav-link btn-logout">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Connexion</Link>
                            <Link to="/register" className="nav-link">Inscription</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
export default Header;