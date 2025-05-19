import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  container: {
    padding: 32,
    background: "#f7fafc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  title: {
    color: "#2e7d32",
    fontSize: "2.2rem",
    marginBottom: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  filtresSection: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(44, 62, 80, 0.08)",
    padding: "20px 24px",
    marginBottom: 32,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  input: {
    border: "1px solid #bdbdbd",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: "1rem",
    outline: "none",
    marginRight: 10,
    transition: "border 0.2s",
  },
  select: {
    border: "1px solid #bdbdbd",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: "1rem",
    outline: "none",
    marginRight: 10,
    transition: "border 0.2s",
  },
  button: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 18px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  buttonSecondary: {
    background: "#fff",
    color: "#2e7d32",
    border: "1px solid #2e7d32",
    borderRadius: 5,
    padding: "6px 14px",
    marginRight: 8,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
  },
  biensList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  bienItem: {
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 1px 6px rgba(44, 62, 80, 0.07)",
    marginBottom: 18,
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  bienTitle: {
    margin: "0 0 4px 0",
    color: "#1565c0",
    fontSize: "1.2rem",
  },
  bienText: {
    margin: 0,
    color: "#444",
  },
};

const AcheteurPage = () => {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState({
    ville: "",
    type: "",
    prixMax: "",
  });

  useEffect(() => {
    fetchBiens();
  }, []);

  const fetchBiens = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/biens", {
        params: filtres,
      });
      setBiens(response.data);
    } catch (error) {
      console.error("Erreur récupération biens :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFiltres({ ...filtres, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchBiens();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue Acheteur</h1>

      <div style={styles.filtresSection}>
        <h3 style={{ margin: 0, marginRight: 16 }}>Filtrer les biens</h3>
        <input
          name="ville"
          placeholder="Ville"
          value={filtres.ville}
          onChange={handleChange}
          style={styles.input}
        />
        <select
          name="type"
          value={filtres.type}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Type</option>
          <option value="achat">Achat</option>
          <option value="location">Location</option>
        </select>
        <input
          name="prixMax"
          placeholder="Prix max"
          type="number"
          value={filtres.prixMax}
          onChange={handleChange}
          style={styles.input}
        />
        <button style={styles.button} onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : biens.length === 0 ? (
        <p>Aucun bien trouvé.</p>
      ) : (
        <ul style={styles.biensList}>
          {biens.map((bien) => (
            <li key={bien.id} style={styles.bienItem}>
              <h4 style={styles.bienTitle}>{bien.titre}</h4>
              <p style={styles.bienText}>Ville : {bien.ville}</p>
              <p style={styles.bienText}>Type : {bien.type}</p>
              <p style={styles.bienText}>Prix : {bien.prix} €</p>
              <div>
                <button style={styles.buttonSecondary}>Voir détails</button>
                <button style={styles.buttonSecondary}>Ajouter aux favoris</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcheteurPage;