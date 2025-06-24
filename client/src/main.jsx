// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import './index.css';

// On définit nos routes ici
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // La page d'accueil affiche la liste des produits
  },
  {
    path: "/kits/:kitId", // Route pour les détails d'un produit
    element: <ProductDetailPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)