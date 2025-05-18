import React, { useState, useEffect } from "react";
import axios from "axios";

const VendeurPage = () => {
  const userId = 1; // Simule un vendeur connecté avec id=1, à remplacer par ta logique d'authentification

  const [annonces, setAnnonces] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    prix: "",
    ville: "",
    adresse: "",
    type_bien: "",
    nb_pieces: "",
    statut: "",
    image: null,
  });
  const [error, setError] = useState("");

  // Charger les annonces du vendeur au montage
  useEffect(() => {
    fetchAnnonces();
  }, []);

  async function fetchAnnonces() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/annonces/miennes", {
        params: { user_id: userId },
      });
      setAnnonces(response.data);
    } catch (err) {
      setError("Erreur récupération annonces : " + err.message);
      console.error(err);
    }
  }

  // Mise à jour du formulaire
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  // Soumission formulaire
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("titre", form.titre);
      formData.append("description", form.description);
      formData.append("prix", form.prix);
      formData.append("ville", form.ville);
      formData.append("adresse", form.adresse);
      formData.append("type_bien", form.type_bien);
      formData.append("nb_pieces", form.nb_pieces);
      formData.append("statut", form.statut);
      if (form.image) {
        formData.append("image", form.image);
      }

      await axios.post("http://127.0.0.1:8000/api/annonces", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        titre: "",
        description: "",
        prix: "",
        ville: "",
        adresse: "",
        type_bien: "",
        nb_pieces: "",
        statut: "",
        image: null,
      });

      fetchAnnonces(); // Recharger la liste après ajout
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout : " + err.message);
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Mes annonces</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {annonces.map((a) => (
          <li key={a.id}>
            <strong>{a.titre}</strong> - {a.ville} - {a.prix} €
          </li>
        ))}
      </ul>

      <h2>Déposer une annonce</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="prix"
          placeholder="Prix"
          value={form.prix}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="ville"
          placeholder="Ville"
          value={form.ville}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="adresse"
          placeholder="Adresse"
          value={form.adresse}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="type_bien"
          placeholder="Type de bien"
          value={form.type_bien}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="nb_pieces"
          placeholder="Nombre de pièces"
          value={form.nb_pieces}
          onChange={handleChange}
          required
        />
        <br />
        <select name="statut" value={form.statut} onChange={handleChange} required>
          <option value="">-- Statut --</option>
          <option value="vente">Vente</option>
          <option value="location">Location</option>
        </select>
        <br />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <br />
        <button type="submit">Ajouter l'annonce</button>
      </form>
    </div>
  );
};

export default VendeurPage;
