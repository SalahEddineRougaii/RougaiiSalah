import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, InputNumber, Button, message } from "antd";

const PaiementVendeur = () => {
  const [loading, setLoading] = useState(false);
  const [activites, setActivites] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  // Récupère l'utilisateur depuis la navigation ou le contexte
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const handlePaiement = async () => {
    setLoading(true);
    try {
      // Appel API pour mettre à jour annonces_restantes
      const response = await axios.post("http://127.0.0.1:8000/api/paiement", {
        user_id: user.id,
        annonces_restantes: activites,
      });
            const updatedUser = { ...user, annonces_restantes: activites };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      message.success("Paiement confirmé !");
      navigate("/vendeur");
    } catch (err) {
      message.error("Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Paiement pour activités</h2>
      <Form>
        <Form.Item label="Nombre d'activités à acheter">
          <InputNumber min={1} value={activites} onChange={setActivites} />
        </Form.Item>
        <Button type="primary" loading={loading} onClick={handlePaiement}>
          Confirmer le paiement
        </Button>
      </Form>
    </div>
  );
};

export default PaiementVendeur;