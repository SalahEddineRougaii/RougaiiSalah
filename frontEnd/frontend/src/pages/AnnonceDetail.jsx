import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(39, 174, 96, 0.10)",
    padding: 32,
    position: "relative",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  contact: {
    position: "absolute",
    top: 32,
    right: 32,
    background: "#e8f6ef",
    padding: "18px 28px",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(39, 174, 96, 0.10)",
    minWidth: 220,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#219653",
    marginBottom: 12,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginBottom: 30,
  },
  label: {
    fontWeight: 600,
    color: "#1e824c",
  },
  value: {
    color: "#333",
    fontWeight: 500,
  },
  desc: {
    fontSize: 18,
    margin: "18px 0 30px",
    color: "#444",
    lineHeight: 1.6,
  },
  carousel: {
    marginTop: 40,
    overflowX: "auto",
    display: "flex",
    gap: 18,
    paddingBottom: 12,
  },
  media: {
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(39, 174, 96, 0.10)",
    width: 260,
    height: 180,
    objectFit: "cover",
    background: "#f6fff9",
    flexShrink: 0,
  },
  video: {
    width: 260,
    height: 180,
    borderRadius: 10,
    background: "#000",
    objectFit: "cover",
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#219653",
    margin: "30px 0 18px",
  },
};

const AnnonceDetail = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/admin/annonces/${id}`)
      .then(res => setAnnonce(res.data))
      .catch(() => setAnnonce(null));
  }, [id]);

  if (!annonce) return <div style={{textAlign:"center",marginTop:80}}>Chargement...</div>;

  const user = annonce.user || {};

  return (
    <div style={styles.container}>
      {/* Contact vendeur */}
      <div style={styles.contact}>
        <div style={{fontWeight:700, color:"#219653", fontSize:18, marginBottom:6}}>Contact vendeur</div>
        <div style={{fontWeight:600, fontSize:16}}>{user.nom || user.name || "Nom inconnu"}</div>
        <div style={{marginTop:4, color:"#555"}}>{user.email || "Email non disponible"}</div>
        {user.telephone && (
          <div style={{marginTop:4, color:"#555"}}>{user.telephone}</div>
        )}
      </div>

      {/* Titre */}
      <h1 style={styles.title}>{annonce.titre}</h1>

      {/* Infos principales */}
      <div style={styles.infoGrid}>
        <div>
          <span style={styles.label}>Prix : </span>
          <span style={styles.value}>{annonce.prix} DH</span>
        </div>
        <div>
          <span style={styles.label}>Ville : </span>
          <span style={styles.value}>{annonce.ville}</span>
        </div>
        <div>
          <span style={styles.label}>Adresse : </span>
          <span style={styles.value}>{annonce.adresse}</span>
        </div>
        <div>
          <span style={styles.label}>Type : </span>
          <span style={styles.value}>{annonce.type_bien}</span>
        </div>
        <div>
          <span style={styles.label}>Nombre de pièces : </span>
          <span style={styles.value}>{annonce.nombre_pieces}</span>
        </div>
        <div>
          <span style={styles.label}>Surface : </span>
          <span style={styles.value}>{annonce.surface} m²</span>
        </div>
        <div>
          <span style={styles.label}>Année : </span>
          <span style={styles.value}>{annonce.annee_construction}</span>
        </div>
        <div>
          <span style={styles.label}>Disponibilité : </span>
          <span style={styles.value}>{annonce.disponibilite}</span>
        </div>
        <div>
          <span style={styles.label}>Latitude : </span>
          <span style={styles.value}>{annonce.latitude}</span>
        </div>
        <div>
          <span style={styles.label}>Longitude : </span>
          <span style={styles.value}>{annonce.longitude}</span>
        </div>
        <div>
          <span style={styles.label}>Statut : </span>
          <span style={styles.value}>{annonce.statut}</span>
        </div>
      </div>

      {/* Description */}
      <div style={styles.sectionTitle}>Description</div>
      <div style={styles.desc}>{annonce.description}</div>

      {/* Carrousel images/vidéos */}
      <div style={styles.sectionTitle}>Galerie</div>
      <div style={styles.carousel}>
        {/* Images */}
        {annonce.images && annonce.images.length > 0 &&
          annonce.images.map(img => (
            <img
              key={img.id}
              src={`http://127.0.0.1:8000/storage/${img.image_path}`}
              alt="Image du bien"
              style={styles.media}
            />
          ))
        }
        {/* Vidéos */}
        {annonce.videos && annonce.videos.length > 0 &&
          annonce.videos.map(video => (
            <video
              key={video.id}
              src={`http://127.0.0.1:8000/storage/${video.video_path}`}
              controls
              style={styles.video}
            />
          ))
        }
        {/* Si rien */}
        {(!annonce.images || annonce.images.length === 0) &&
         (!annonce.videos || annonce.videos.length === 0) && (
          <div style={{color:"#888", fontSize:18, margin:"auto"}}>Aucune image ou vidéo</div>
        )}
      </div>
    </div>
  );
};

export default AnnonceDetail;