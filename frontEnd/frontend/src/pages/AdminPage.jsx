import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Card,
  Space,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/usercontext";
import axios from "axios";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [annonces, setAnnonces] = useState([]);
  const [loadingAnnonces, setLoadingAnnonces] = useState(false);

  const navigate = useNavigate();
  const { setUserContext } = useUserContext();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(res.data);
    } catch {
      message.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnonces = async () => {
    setLoadingAnnonces(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/annonces");
      setAnnonces(res.data);
    } catch {
      message.error("Erreur lors du chargement des annonces");
    } finally {
      setLoadingAnnonces(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAnnonces();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    if (setUserContext) setUserContext(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div className="logo" style={{ color: "#fff", padding: 16, fontSize: 18 }}>
          Admin Dashboard
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Utilisateurs
          </Menu.Item>
          <Menu.Item key="2" icon={<HomeOutlined />}>
            Annonces
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} onClick={logout}>
            Déconnexion
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Panneau d'administration
        </Header>

        <Content style={{ margin: "24px", overflow: "auto" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Utilisateurs */}
            <Card title="Gestion des utilisateurs" bordered>
              <Table
                dataSource={users}
                columns={[
                  { title: "Nom", dataIndex: "name", key: "name" },
                  { title: "Email", dataIndex: "email", key: "email" },
                  { title: "Rôle", dataIndex: "role", key: "role" },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingUser(record);
                            setIsModalVisible(true);
                          }}
                          disabled={record.role === "admin"}
                        >
                          Modifier
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
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
                      </Space>
                    ),
                  },
                ]}
                rowKey="id"
                loading={loading}
              />
            </Card>

            {/* Annonces */}
            <Card title="Gestion des annonces" bordered>
              <Table
                dataSource={annonces}
                columns={[
                  { title: "Titre", dataIndex: "titre", key: "titre" },
                  { title: "Utilisateur", dataIndex: ["user", "name"], key: "user" },
                  { title: "Ville", dataIndex: "ville", key: "ville" },
                  { title: "Prix", dataIndex: "prix", key: "prix" },
                  {
                    title: "Statut",
                    dataIndex: "statut",
                    key: "statut",
                    render: (statut) => (
                      <Tag color={statut === "vendue" ? "red" : "orange"}>{statut}</Tag>
                    ),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                          Modal.confirm({
                            title: "Supprimer cette annonce ?",
                            okText: "Oui",
                            cancelText: "Non",
                            onOk: async () => {
                              try {
                                await axios.delete(
                                  `http://127.0.0.1:8000/api/admin/annonces/${record.id}`
                                );
                                message.success("Annonce supprimée");
                                fetchAnnonces();
                              } catch {
                                message.error("Erreur lors de la suppression");
                              }
                            },
                          });
                        }}
                      >
                        Supprimer
                      </Button>
                    ),
                  },
                ]}
                rowKey="id"
                loading={loadingAnnonces}
              />
            </Card>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;