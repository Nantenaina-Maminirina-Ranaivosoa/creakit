// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import './index.css';
import { CartProvider } from './context/CartContext';
import RootLayout from './layouts/RootLayout';
import CartPage from './pages/CartPage.jsx'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "kits/:kitId",
        element: <ProductDetailPage />,
      },
      { // <-- On active la route pour le panier
        path: "panier",
        element: <CartPage />,
      },
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