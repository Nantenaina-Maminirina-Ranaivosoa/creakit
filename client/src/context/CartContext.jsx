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
    console.log("Panier mis à jour :", cartItems);
  };

  // 3. On définit la "valeur" que le contexte va fournir à ses enfants
  const value = {
    cartItems,
    addToCart,
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