// client/src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Création du Contexte
const CartContext = createContext();

// 2. Création du "Provider"
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (productToAdd) => {
    setCartItems(prevItems => {
      // On vérifie si le produit est déjà dans le panier
      const existingItem = prevItems.find(item => item.id === productToAdd.id);

      if (existingItem) {
        // Si oui, on met à jour sa quantité
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si non, on l'ajoute avec une quantité de 1
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem.quantity === 1) {
        // Si la quantité est 1, on filtre l'article du panier
        return prevItems.filter(item => item.id !== productId);
      } else {
        // Sinon, on décrémente juste la quantité
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };
  
  const deleteFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // On peut aussi ajouter une valeur calculée pour le total
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);


  const value = {
    cartItems,
    addToCart,
    removeFromCart, // <-- Exposer la nouvelle fonction
    deleteFromCart, // <-- Exposer la nouvelle fonction
    cartTotal,      // <-- Exposer la valeur calculée
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Création d'un hook personnalisé pour utiliser le contexte plus facilement
export function useCart() {
  return useContext(CartContext);
}