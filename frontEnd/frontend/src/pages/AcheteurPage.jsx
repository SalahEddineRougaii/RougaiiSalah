import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div style={{ padding: 20 }}>
      <h1>Bienvenue Acheteur</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>Filtrer les biens</h3>
        <input
          name="ville"
          placeholder="Ville"
          value={filtres.ville}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <select name="type" value={filtres.type} onChange={handleChange} style={{ marginRight: 10 }}>
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
          style={{ marginRight: 10 }}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : biens.length === 0 ? (
        <p>Aucun bien trouvé.</p>
      ) : (
        <ul>
          {biens.map((bien) => (
            <li key={bien.id}>
              <h4>{bien.titre}</h4>
              <p>Ville : {bien.ville}</p>
              <p>Type : {bien.type}</p>
              <p>Prix : {bien.prix} €</p>
              <button>Voir détails</button>
              <button>Ajouter aux favoris</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcheteurPage;
