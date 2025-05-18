import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Connexion from "./connexion";
import AcheteurPage from "./pages/AcheteurPage";
import VendeurPage from "./pages/VendeurPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/acheteur" element={<AcheteurPage />} />
        <Route path="/vendeur" element={<VendeurPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
