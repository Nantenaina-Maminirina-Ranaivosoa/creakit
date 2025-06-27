// client/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import RootLayout from "./layouts/RootLayout";
import CartPage from "./pages/CartPage.jsx";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AccountPage from './pages/AccountPage.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />, // Le layout parent ne change pas
    children: [
      // --- Routes Publiques ---
      { index: true, element: <App /> },
      { path: "kits/:kitId", element: <ProductDetailPage />},
      { path: "panier", element: <CartPage />},
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },

      // --- Routes Protégées ---
      {
        element: <ProtectedRoute />, // Le garde se place ici
        children: [
          // Toutes les routes à l'intérieur seront protégées
          { path: "compte", element: <AccountPage /> },
          // Ex: { path: "checkout", element: <CheckoutPage /> }
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
