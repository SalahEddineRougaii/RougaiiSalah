import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Connexion from "./connexion";
import AcheteurPage from "./pages/AcheteurPage";
import VendeurPage from "./pages/VendeurPage";
import AdminPage from "./pages/AdminPage";
import PaiementVendeur from "./pages/PaiementVendeur";
// Ajoute ici tous les autres imports de pages nécessaires

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/paiement-vendeur" element={<PaiementVendeur />} />
        <Route path="/vendeur" element={<VendeurPage />} />
        <Route path="/acheteur" element={<AcheteurPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Ajoute ici toutes les autres routes nécessaires */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;