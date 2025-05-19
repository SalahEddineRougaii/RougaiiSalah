import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDollarSign,
  FaHome,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaUpload,
} from "react-icons/fa";

const VendeurPage = () => {
  const userId = 1;

  const [annonces, setAnnonces] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    prix: "",
    ville: "",
    adresse: "",
    type_bien: "",
    nombre_pieces: "",
    statut: "",
    image: null,
  });
  const [error, setError] = useState("");

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
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

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
      formData.append("nombre_pieces", form.nombre_pieces);
      formData.append("statut", form.statut);
      if (form.image) formData.append("image", form.image);

      await axios.post("http://127.0.0.1:8000/api/annonces", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        titre: "",
        description: "",
        prix: "",
        ville: "",
        adresse: "",
        type_bien: "",
        nombre_pieces: "",
        statut: "",
        image: null,
      });

      fetchAnnonces();
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout : " + (err.response?.data?.message || err.message));
    }
  }

  const styles = {
    container: { maxWidth: 960, margin: "30px auto", padding: "0 15px" },
    header: { textAlign: "center", fontSize: 28, marginBottom: 30 },
    error: { color: "red", marginBottom: 20 },
    annoncesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 24,
    },
    annonceCard: {
      border: "1px solid #ccc",
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#fff",
    },
    annonceImage: {
      width: "100%",
      height: 180,
      objectFit: "cover",
    },
    annonceContent: {
      padding: 15,
    },
    annonceTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    statutBadge: {
      marginTop: 10,
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: 20,
      color: "#fff",
      fontWeight: "bold",
      textTransform: "capitalize",
      backgroundColor: "#27ae60",
    },
    formContainer: {
      marginTop: 40,
      background: "#f5f5f5",
      padding: 30,
      borderRadius: 16,
    },
    formGroup: { marginBottom: 16 },
    label: { display: "block", marginBottom: 6, fontWeight: "600" },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: 8,
      border: "1px solid #ccc",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: 8,
      border: "1px solid #ccc",
      minHeight: 80,
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: 8,
      border: "1px solid #ccc",
    },
    fileInputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 12,
      border: "2px dashed #aaa",
      borderRadius: 10,
      cursor: "pointer",
    },
    button: {
      marginTop: 10,
      padding: 12,
      width: "100%",
      border: "none",
      borderRadius: 10,
      backgroundColor: "#2980b9",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mes annonces</h1>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.annoncesGrid}>
        {annonces.length > 0 ? (
          annonces.map((a) => (
            <div key={a.id} style={styles.annonceCard}>
              <img
                src={`http://127.0.0.1:8000/storage/${a.image}`}
                alt={a.titre}
                style={styles.annonceImage}
              />
              <div style={styles.annonceContent}>
                <h3 style={styles.annonceTitle}>{a.titre}</h3>
                <div style={styles.infoRow}>
                  <FaDollarSign /> {a.prix} €
                </div>
                <div style={styles.infoRow}>
                  <FaMapMarkerAlt /> {a.ville}
                </div>
                <div style={styles.infoRow}>
                  <FaHome /> {a.type_bien}
                </div>
                <div style={styles.infoRow}>
                  <FaDoorOpen /> {a.nombre_pieces} pièces
                </div>
                <div
                  style={{
                    ...styles.statutBadge,
                    backgroundColor: a.statut === "vendue" ? "#e74c3c" : "#f39c12",
                  }}
                >
                  {a.statut}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucune annonce trouvée.</p>
        )}
      </div>

      <div style={styles.formContainer}>
        <h2>Ajouter une annonce</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Titre", name: "titre", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Prix", name: "prix", type: "text" },
            { label: "Ville", name: "ville", type: "text" },
            { label: "Adresse", name: "adresse", type: "text" },
            {
              label: "Type de bien",
              name: "type_bien",
              type: "select",
              options: ["Appartement", "Maison", "Studio", "Villa"],
            },
            { label: "Nombre de pièces", name: "nombre_pieces", type: "text" },
            {
              label: "Statut",
              name: "statut",
              type: "select",
              options: [
                { label: "Vendue", value: "vendue" },
                { label: "Louée", value: "louée" },
              ],
            },
          ].map(({ label, name, type, options }) => (
            <div key={name} style={styles.formGroup}>
              <label style={styles.label}>{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              ) : type === "select" ? (
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Sélectionner</option>
                  {options.map((opt) =>
                    typeof opt === "string" ? (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ) : (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  style={styles.input}
                />
              )}
            </div>
          ))}

          <div style={styles.formGroup}>
            <label style={styles.label}>Image</label>
            <label style={styles.fileInputWrapper}>
              <FaUpload />
              <span>{form.image ? form.image.name : "Choisir une image"}</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <button type="submit" style={styles.button}>
            Publier l’annonce
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendeurPage;
