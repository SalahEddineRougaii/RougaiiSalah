import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDollarSign,
  FaHome,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaUpload,
  FaRulerCombined,
  FaCalendarAlt,
  FaGlobe,
  FaVideo,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VendeurPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [annoncesRestantes, setAnnoncesRestantes] = useState(user?.annonces_restantes || 0);
  const [annonces, setAnnonces] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    prix: "",
    ville: "",
    adresse: "",
    type_bien: "",
    nombre_pieces: "",
    surface: "",
    annee_construction: "",
    disponibilite: "",
    latitude: "",
    longitude: "",
    statut: "",
    images: [],
    videos: [],
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userLS = JSON.parse(localStorage.getItem("user"));
    setAnnoncesRestantes(userLS?.annonces_restantes || 0);
    fetchAnnonces();
    // eslint-disable-next-line
  }, []);

  async function fetchAnnonces() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/vendeur/annonces", {
        params: { user_id: userId },
      });
      setAnnonces(response.data);
    } catch (err) {
      setError("Erreur récupération annonces : " + err.message);
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm((f) => ({ ...f, images: files }));
    } else if (name === "videos") {
      setForm((f) => ({ ...f, videos: files }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function resetForm() {
    setForm({
      titre: "",
      description: "",
      prix: "",
      ville: "",
      adresse: "",
      type_bien: "",
      nombre_pieces: "",
      surface: "",
      annee_construction: "",
      disponibilite: "",
      latitude: "",
      longitude: "",
      statut: "",
      images: [],
      videos: [],
    });
    setEditId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await handleUpdate();
      return;
    }
    if (annoncesRestantes <= 0) {
      setError("Vous n'avez plus d'annonces disponibles. Veuillez acheter un nouveau pack.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      Object.keys(form).forEach((key) => {
        if (key !== "images" && key !== "videos") formData.append(key, form[key]);
      });
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          formData.append("images[]", form.images[i]);
        }
      }
      if (form.videos && form.videos.length > 0) {
        for (let i = 0; i < form.videos.length; i++) {
          formData.append("videos[]", form.videos[i]);
        }
      }
      await axios.post("http://127.0.0.1:8000/api/vendeur/annonces", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      fetchAnnonces();
      setAnnoncesRestantes((prev) => {
        const newRestantes = prev - 1;
        const updatedUser = { ...user, annonces_restantes: newRestantes };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return newRestantes;
      });
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout : " + (err.response?.data?.message || err.message));
    }
  }

  function handleEdit(annonce) {
    setEditId(annonce.id);
    setForm({
      titre: annonce.titre,
      description: annonce.description,
      prix: annonce.prix,
      ville: annonce.ville,
      adresse: annonce.adresse,
      type_bien: annonce.type_bien,
      nombre_pieces: annonce.nombre_pieces,
      surface: annonce.surface,
      annee_construction: annonce.annee_construction,
      disponibilite: annonce.disponibilite,
      latitude: annonce.latitude,
      longitude: annonce.longitude,
      statut: annonce.statut,
      images: [],
      videos: [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUpdate() {
    try {
      const formData = new FormData();
Object.keys(form).forEach((key) => {
  if (key !== "images" && key !== "videos") {
if (
  ["prix", "nombre_pieces", "surface", "annee_construction", "latitude", "longitude"].includes(key)
) {
  if (form[key] !== "" && form[key] !== null && form[key] !== undefined) {
    formData.append(key, Number(form[key]));
  }
} else {
      formData.append(key, form[key]);
    }
  }
});
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          formData.append("images[]", form.images[i]);
        }
      }
      if (form.videos && form.videos.length > 0) {
        for (let i = 0; i < form.videos.length; i++) {
          formData.append("videos[]", form.videos[i]);
        }
      }
      await axios.post(
        `http://127.0.0.1:8000/api/vendeur/annonces/${editId}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      resetForm();
      fetchAnnonces();
      setError("");
    } catch (err) {
      setError("Erreur lors de la modification : " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/vendeur/annonces/${id}`);
      setAnnonces((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
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
      position: "relative",
    },
    imagesWrapper: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      padding: 6,
      background: "#f8f8f8",
    },
    annonceImage: {
      width: 100,
      height: 70,
      objectFit: "cover",
      borderRadius: 6,
      border: "1px solid #b2f7cc",
      background: "#f6fff9",
      flexShrink: 0,
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
    actions: {
      display: "flex",
      gap: 10,
      marginTop: 12,
    },
    actionBtn: {
      border: "none",
      background: "#f5f5f5",
      borderRadius: 6,
      padding: 8,
      cursor: "pointer",
      fontSize: 16,
      transition: "background 0.2s",
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
      <div style={{ marginBottom: 20, fontWeight: "bold", color: annoncesRestantes > 0 ? "#27ae60" : "#e74c3c" }}>
        Annonces restantes : {annoncesRestantes}
      </div>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.annoncesGrid}>
        {annonces.length > 0 ? (
          annonces.map((a) => (
            <div key={a.id} style={styles.annonceCard}>
              <div style={styles.imagesWrapper}>
                {a.images && a.images.length > 0 ? (
                  a.images.map((img) => (
                    <img
                      key={img.id}
                      src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                      alt={a.titre}
                      style={styles.annonceImage}
                    />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/100x70?text=Pas+de+photo"
                    alt="Pas de photo"
                    style={styles.annonceImage}
                  />
                )}
              </div>
              <div style={styles.annonceContent}>
                <h3 style={styles.annonceTitle}>{a.titre}</h3>
                <div style={styles.infoRow}>
                  <FaDollarSign /> {a.prix} DH
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
                <div style={styles.infoRow}>
                  <FaRulerCombined /> {a.surface} m²
                </div>
                <div style={styles.infoRow}>
                  <FaCalendarAlt /> {a.annee_construction}
                </div>
                <div style={styles.infoRow}>
                  <FaGlobe /> {a.latitude}, {a.longitude}
                </div>
                <div
                  style={{
                    ...styles.statutBadge,
                    backgroundColor: a.statut === "vendue" ? "#e74c3c" : "#f39c12",
                  }}
                >
                  {a.statut}
                </div>
                <div style={styles.actions}>
                  <button
                    style={styles.actionBtn}
                    title="Voir détails"
                    onClick={() => navigate(`/annonce/${a.id}`)}
                  >
                    <FaEye color="#2980b9" />
                  </button>
                  <button
                    style={styles.actionBtn}
                    title="Modifier"
                    onClick={() => handleEdit(a)}
                  >
                    <FaEdit color="#f39c12" />
                  </button>
                  <button
                    style={styles.actionBtn}
                    title="Supprimer"
                    onClick={() => handleDelete(a.id)}
                  >
                    <FaTrash color="#e74c3c" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucune annonce trouvée.</p>
        )}
      </div>

      <div style={styles.formContainer}>
        <h2>{editId ? "Modifier l'annonce" : "Ajouter une annonce"}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Titre</label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prix</label>
            <input
              type="number"
              name="prix"
              value={form.prix}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ville</label>
            <input
              type="text"
              name="ville"
              value={form.ville}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type de bien</label>
            <select
              name="type_bien"
              value={form.type_bien}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Sélectionner</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de pièces</label>
            <input
              type="number"
              name="nombre_pieces"
              value={form.nombre_pieces}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Surface (m²)</label>
            <input
              type="number"
              name="surface"
              value={form.surface}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Année de construction</label>
            <input
              type="number"
              name="annee_construction"
              value={form.annee_construction}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Disponibilité</label>
            <input
              type="date"
              name="disponibilite"
              value={form.disponibilite}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Latitude</label>
            <input
              type="number"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              style={styles.input}
              step="any"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Longitude</label>
            <input
              type="number"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              style={styles.input}
              step="any"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Statut</label>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Sélectionner</option>
              <option value="vente">Vente</option>
              <option value="vendue">Vendue</option>
              <option value="location">Location</option>
              <option value="louée">Louée</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Images (plusieurs possibles)</label>
            <label style={styles.fileInputWrapper}>
              <FaUpload />
              <span>
                {form.images && form.images.length > 0
                  ? `${form.images.length} image(s) sélectionnée(s)`
                  : "Choisir des images"}
              </span>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Vidéos (plusieurs possibles)</label>
            <label style={styles.fileInputWrapper}>
              <FaVideo />
              <span>
                {form.videos && form.videos.length > 0
                  ? `${form.videos.length} vidéo(s) sélectionnée(s)`
                  : "Choisir des vidéos"}
              </span>
              <input
                type="file"
                name="videos"
                accept="video/*"
                multiple
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <button type="submit" style={styles.button}>
            {editId ? "Enregistrer les modifications" : "Publier l’annonce"}
          </button>
          {editId && (
            <button
              type="button"
              style={{ ...styles.button, backgroundColor: "#888", marginTop: 8 }}
              onClick={resetForm}
            >
              Annuler la modification
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VendeurPage;