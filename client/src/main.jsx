// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import './index.css';
import { CartProvider } from './context/CartContext';
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Le layout devient l'élément parent
    children: [
      // Ces routes s'afficheront dans le <Outlet /> du layout
      {
        index: true, // "index: true" remplace "path: '/'" pour la route par défaut
        element: <App />,
      },
      {
        path: "kits/:kitId",
        element: <ProductDetailPage />,
      },
      // On prépare la future page panier
      // {
      //   path: "panier",
      //   element: <CartPage />, 
      // },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <CartProvider>

    <RouterProvider router={router} />
        </CartProvider>

  </React.StrictMode>,
)