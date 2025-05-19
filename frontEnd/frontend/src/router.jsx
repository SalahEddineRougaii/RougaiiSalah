import { Routes, Route } from "react-router-dom";
import Connexion from "./connexion";
import AdminPage from "./pages/AdminPage";
import AcheteurPage from "./pages/AcheteurPage";
import VendeurPage from "./pages/VendeurPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Connexion />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/acheteur" element={<AcheteurPage />} />
      <Route path="/vendeur" element={<VendeurPage />} />
    </Routes>
  );
}

export default AppRouter;