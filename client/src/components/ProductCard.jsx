// client/src/components/ProductCard.jsx

import React from 'react';
import './ProductCard.css'; // Nous créerons ce fichier CSS juste après

// Le composant reçoit un objet 'kit' en prop
function ProductCard({ kit }) {
  // On déstructure l'objet kit pour un accès plus facile à ses propriétés
  const { name, price, imageUrl, description } = kit;

  return (
    <div className="kit-card">
      <img src={imageUrl} alt={name} className="kit-card-image" />
      <div className="kit-card-content">
        <h2 className="kit-card-title">{name}</h2>
        <p className="kit-card-description">{description}</p>
        <p className="kit-card-price">{price.toFixed(2)} €</p>
      </div>
    </div>
  );
}

export default ProductCard;