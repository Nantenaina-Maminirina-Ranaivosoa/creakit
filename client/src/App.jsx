// client/src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';
import ProductCard from './components/ProductCard'; // <-- 1. Importer le nouveau composant

function App() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/kits')
      .then(response => response.json())
      .then(data => {
        setKits(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des kits:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des kits...</p>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Découvrez nos Kits Créatifs</h1>
      </header>
      <main>
        {/* 2. On utilise une classe pour le conteneur de notre grille */}
        <div className="kits-grid">
          {kits.map(kit => (
            // 3. On utilise notre composant ProductCard ici
            <ProductCard key={kit.id} kit={kit} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;