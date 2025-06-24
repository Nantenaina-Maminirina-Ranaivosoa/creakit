// client/src/layouts/RootLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function RootLayout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet /> {/* Les pages (App, ProductDetail...) s'afficheront ici */}
            </main>
        </div>
    );
}
export default RootLayout;