// client/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
    const { cartItems } = useCart();

    // On calcule le nombre total d'articles (en tenant compte des quantités)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="app-header">
            <div className="header-container">
                <Link to="/" className="logo">CréaKit</Link>
                <nav>
                    <Link to="/panier" className="nav-link">
                        Panier ({totalItems})
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;