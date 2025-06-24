// client/src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetailPage.css';

function ProductDetailPage() {
    const { kitId } = useParams(); // Récupère l'ID du kit depuis l'URL
    const [kit, setKit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/api/kits/${kitId}`)
            .then(response => response.json())
            .then(data => {
                setKit(data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du kit:", error);
                setLoading(false);
            });
    }, [kitId]); // L'effet se redéclenche si kitId change

    if (loading) {
        return <p>Chargement du produit...</p>;
    }

    if (!kit) {
        return <p>Produit non trouvé.</p>;
    }

    return (
        <div className="product-detail-container">
            <Link to="/" className="back-link">← Retour à la liste</Link>
            <div className="product-detail-content">
                <img src={kit.imageUrl} alt={kit.name} className="product-detail-image" />
                <div className="product-detail-info">
                    <h1>{kit.name}</h1>
                    <p className="product-detail-description">{kit.description}</p>
                    <p className="product-detail-price">{kit.price.toFixed(2)} €</p>
                    {/* On ajoutera un bouton "Ajouter au panier" ici plus tard */}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;