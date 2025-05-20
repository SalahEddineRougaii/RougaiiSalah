import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBed, FaBath, FaGlobe } from "react-icons/fa";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e8f6ef 0%, #d4fc79 100%)",
    padding: "40px 0",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
  },
  title: {
    textAlign: "center",
    color: "#219653",
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 40,
    letterSpacing: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 32,
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(39, 174, 96, 0.15)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid #e0f7e9",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 16,
    border: "2px solid #b2f7cc",
    background: "#f6fff9",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#1e824c",
    marginBottom: 4,
    textAlign: "center",
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: 700,
    color: "#27ae60",
    margin: "10px 0 6px",
  },
  statut: {
    fontSize: 15,
    color: "#e74c3c",
    fontWeight: 600,
    marginBottom: 12,
  },
  iconRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
    fontSize: 14,
    color: "#333",
  },
  iconItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#219653",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.3s",
  },
  noResult: {
    textAlign: "center",
    color: "#888",
    fontSize: 20,
    marginTop: 60,
  },
  loading: {
    textAlign: "center",
    color: "#27ae60",
    fontSize: 22,
    marginTop: 60,
    fontWeight: 500,
  },
};

const AcheteurPage = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/annonces");
      setAnnonces(response.data);
    } catch (error) {
      console.error("Erreur récupération annonces :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Recommandations pour la maison</h1>
        {loading ? (
          <div style={styles.loading}>Chargement des annonces...</div>
        ) : annonces.length === 0 ? (
          <div style={styles.noResult}>Aucune annonce trouvée.</div>
        ) : (
          <div style={styles.grid}>
            {annonces.map((annonce) => (
              <div key={annonce.id} style={styles.card}>
                <img
                  src={
                    annonce.image
                      ? `http://127.0.0.1:8000/storage/${annonce.image}`
                      : "https://via.placeholder.com/260x160?text=Pas+de+photo"
                  }
                  alt={annonce.titre}
                  style={styles.image}
                />
                <div style={styles.cardTitle}>{annonce.titre}</div>
                <div style={styles.info}>{annonce.ville}</div>
                <div style={styles.statut}>{annonce.statut}</div>
                <div style={styles.price}>{annonce.prix} DH</div>
                <div style={styles.iconRow}>
                  <div style={styles.iconItem}>
                    <FaBed color="#1e824c" /> {annonce.nombre_pieces} Chambres
                  </div>
                  <div style={styles.iconItem}>
                    <FaGlobe color="#1e824c" /> {annonce.surface} m²
                  </div>
                </div>
                <button style={styles.button}>Voir détails</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcheteurPage;