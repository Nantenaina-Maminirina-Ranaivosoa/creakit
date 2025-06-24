// client/src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // <-- Importer Link
import './ProductCard.css';

function ProductCard({ kit }) {
  const { id, name, price, imageUrl, description } = kit;

  return (
    <Link to={`/kits/${id}`} className="kit-card-link">
        <div className="kit-card">
            <img src={imageUrl} alt={name} className="kit-card-image" />
            <div className="kit-card-content">
                <h2 className="kit-card-title">{name}</h2>
                <p className="kit-card-description">{description}</p>
                <p className="kit-card-price">{price.toFixed(2)} €</p>
            </div>
        </div>
    </Link>
  );
}

export default ProductCard;