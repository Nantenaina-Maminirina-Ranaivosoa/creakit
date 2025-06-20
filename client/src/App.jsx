// client/src/App.jsx
import { useState, useEffect } from 'react'; // Import des hooks
import './App.css';

function App() {
  // 1. On crée un état 'kits' pour stocker nos données, initialisé à un tableau vide.
  const [kits, setKits] = useState([]);
  // On crée un état pour gérer le chargement
  const [loading, setLoading] = useState(true);

  // 2. useEffect se déclenche après le premier rendu du composant.
  // Le tableau vide [] en second argument signifie qu'il ne se déclenchera qu'UNE SEULE fois.
  useEffect(() => {
    // 3. On utilise l'API fetch du navigateur pour appeler notre backend.
    fetch('http://localhost:3001/api/kits')
      .then(response => response.json()) // On parse la réponse en JSON
      .then(data => {
        setKits(data.data); // On met à jour l'état avec les données reçues
        setLoading(false); // On arrête le chargement
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des kits:", error);
        setLoading(false); // On arrête aussi le chargement en cas d'erreur
      });
  }, []); // Le tableau de dépendances vide est crucial !

  // 4. On affiche un message pendant le chargement des données.
  if (loading) {
    return <p>Chargement des kits...</p>;
  }

  // 5. Une fois les données chargées, on les affiche.
  return (
    <div className="App">
      <header>
        <h1>Découvrez nos Kits Créatifs</h1>
      </header>
      <main>
        <div className="kits-list">
          {/* On boucle sur le tableau 'kits' pour afficher chaque élément */}
          {kits.map(kit => (
            // La 'key' est essentielle pour que React identifie chaque élément de manière unique.
            <div key={kit.id} className="kit-card">
              <h2>{kit.name}</h2>
              <p>{kit.description}</p>
              <p>Prix : {kit.price} €</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;