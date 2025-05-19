import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Form, Input, Button, Select } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useUserContext } from "./context/usercontext"; // Contexte utilisateur
import cactusLogo from "./assets/images/logo-cactus.png";

const Connexion = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserContext } = useUserContext() || {};
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp(!isSignUp);

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    if (isSignUp && values.password !== values.password_confirmation) {
      message.error("Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    try {
      const url = isSignUp
        ? "http://127.0.0.1:8000/api/register"
        : "http://127.0.0.1:8000/api/login";

      const response = await axios.post(url, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

if (isSignUp) {
  message.success("Inscription réussie !");
  setTimeout(() => setIsSignUp(false), 1500);
} else if (response.data?.token) {
  const { token, user } = response.data;

  setAuthHeader(token);
  setUserContext &&
    setUserContext({
      token,
      name: user.name,
      role: user.role,
      id: user.id,
      a_paye: user.a_paye,
      annonces_restantes: user.annonces_restantes,
    });

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  console.log("USER CONNECTÉ :", user); // Ajoute ceci

  // Redirection selon le paiement
if (
  user.role === "vendeur" &&
  (!user.a_paye || Number(user.a_paye) === 0 || Number(user.annonces_restantes) === 0)
) {
  navigate("/paiement-vendeur", { state: { user } });
} else {
  navigate(`/${user.role}`);
}
  message.success("Connexion réussie !");
}
    } catch (err) {
      console.error("Erreur API :", err.response?.data);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        message.error(errorMessages);
      } else if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Une erreur est survenue !");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <img src={cactusLogo} alt="Cactus Logo" style={styles.logo} />

        <h2>{isSignUp ? "Créer un compte" : "Se connecter"}</h2>

        <Form style={styles.form} onFinish={handleSubmit}>
          {isSignUp && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Nom requis !" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nom complet" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email requis !" },
              { type: "email", message: "Email invalide !" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Mot de passe requis !" },
              { min: 8, message: "Mot de passe minimum 8 caractères !" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          {isSignUp && (
            <>
              <Form.Item
                name="password_confirmation"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Veuillez confirmer votre mot de passe !" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Les mots de passe ne correspondent pas !")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirmer le mot de passe" />
              </Form.Item>

              <Form.Item
                name="role"
                rules={[{ required: true, message: "Rôle requis !" }]}
              >
                <Select placeholder="Sélectionner un rôle">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="acheteur">Acheteur</Select.Option>
                  <Select.Option value="vendeur">Vendeur</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            style={styles.button}
            loading={loading}
          >
            {isSignUp ? "Créer le compte" : "Se connecter"}
          </Button>
        </Form>

        <div style={styles.toggleContainer}>
          <span>{isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}</span>
          <Button
            type="link"
            onClick={toggleForm}
            style={styles.toggleButton}
          >
            {isSignUp ? "Se connecter" : "S'inscrire"}
          </Button>
        </div>

        <div className={`circle ${isSignUp ? "circleSignUp" : "circleSignIn"}`} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f7f7",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    position: "relative",
  },
  logo: {
    width: "120px",
    marginBottom: "20px",
  },
  form: {
    width: "100%",
  },
  button: {
    width: "100%",
    height: "45px",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#2C9C6C",
    borderColor: "#2C9C6C",
    color: "white",
  },
  toggleContainer: { marginTop: "15px" },
    toggleButton: {
    padding: "0",
    fontWeight: "bold",
    },
    };
    
    export default Connexion;