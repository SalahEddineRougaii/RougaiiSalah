import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/usercontext"; // adapte selon ton chemin

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();
  const { setUserContext } = useUserContext();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(res.data);
    } catch (error) {
      message.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const logout = () => {
    // Supprimer token localStorage
    localStorage.removeItem("token");

    // Nettoyer contexte utilisateur
    if (setUserContext) setUserContext(null);

    // Supprimer header Authorization global axios (si utilisé)
    delete axios.defaults.headers.common["Authorization"];

    // Rediriger vers login
    navigate("/");
  };

  // ... (reste du code inchangé)

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard Admin - Gestion des utilisateurs</h1>

      <Button type="primary" danger onClick={logout} style={{ marginBottom: 16 }}>
        Déconnexion
      </Button>

      <Table
        dataSource={users}
        columns={[
          {
            title: "Nom",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Rôle",
            dataIndex: "role",
            key: "role",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingUser(record);
                    setIsModalVisible(true);
                  }}
                  disabled={record.role === "admin"}
                >
                  Modifier
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: "Supprimer cet utilisateur ?",
                      okText: "Oui",
                      cancelText: "Non",
                      onOk: async () => {
                        try {
                          await axios.delete(
                            `http://127.0.0.1:8000/api/users/${record.id}`
                          );
                          message.success("Utilisateur supprimé");
                          fetchUsers();
                        } catch {
                          message.error("Erreur lors de la suppression");
                        }
                      },
                    });
                  }}
                  disabled={record.role === "admin"}
                >
                  Supprimer
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Modifier utilisateur"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {editingUser && (
          <Form
            initialValues={{
              name: editingUser.name,
              email: editingUser.email,
              role: editingUser.role,
            }}
            onFinish={async (values) => {
              try {
                await axios.put(
                  `http://127.0.0.1:8000/api/users/${editingUser.id}`,
                  values
                );
                message.success("Utilisateur mis à jour");
                setIsModalVisible(false);
                fetchUsers();
              } catch {
                message.error("Erreur lors de la mise à jour");
              }
            }}
            layout="vertical"
          >
            <Form.Item
              label="Nom"
              name="name"
              rules={[{ required: true, message: "Nom requis" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email requis" },
                { type: "email", message: "Email invalide" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Rôle"
              name="role"
              rules={[{ required: true, message: "Rôle requis" }]}
            >
              <Select disabled={editingUser.role === "admin"}>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="acheteur">Acheteur</Select.Option>
                <Select.Option value="vendeur">Vendeur</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminPage;
