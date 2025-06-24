// client/src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  // On récupère tout ce dont on a besoin depuis notre contexte
  const { cartItems, addToCart, removeFromCart, deleteFromCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Votre panier est vide.</h2>
        <Link to="/" className="btn-primary">Continuer mes achats</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Votre Panier</h1>
      <div className="cart-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h2>{item.name}</h2>
              <p>Prix: {item.price.toFixed(2)} €</p>
            </div>
            <div className="cart-item-controls">
              <button onClick={() => removeFromCart(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => addToCart(item)}>+</button>
            </div>
            <div className="cart-item-subtotal">
              {(item.price * item.quantity).toFixed(2)} €
            </div>
            <button onClick={() => deleteFromCart(item.id)} className="cart-item-delete">
              &times; {/* Symbole de croix */}
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total : {cartTotal.toFixed(2)} €</h2>
        <button className="btn-primary">Passer la commande</button>
      </div>
    </div>
  );
}

export default CartPage;