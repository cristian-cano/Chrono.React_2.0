import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelopeOpenText, FaSignOutAlt, FaClock, FaCalendarAlt, FaBell } from "react-icons/fa";
import logoCHG from "../../components/img/logoCHGcircul.png";
import { useEffect } from "react";


function DashboardUsuario() {
  const navigate = useNavigate();

  useEffect(() => {
  const idUsuario = localStorage.getItem("id_usuario");
  if (!idUsuario) {
    navigate("/", { replace: true }); // Redirige si no hay sesión activa
  }
}, []);

  const location = useLocation();
  

  const styles = {
    root: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(to right, #e0f2ff, #f5faff)", // Estilo suave como el login
    },
    sidebar: {
      width: "260px",
      backgroundColor: "#0077b6",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem 1rem",
      boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    },
    logo: {
      width: "80px",
      height: "80px",
      marginBottom: "1rem",
      borderRadius: "50%",
      backgroundColor: "#fff",
      padding: "5px",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "2rem",
    },
    menu: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    menuItem: (isActive) => ({
      backgroundColor: isActive ? "#023e8a" : "#0096c7",
      border: isActive ? "2px solid #ffffffcc" : "none",
      padding: "12px 20px",
      color: "#FFFCE8",
      borderRadius: "12px",
      textAlign: "left",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.3s",
      fontWeight: isActive ? "bold" : "normal",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }),
    content: {
      flex: 1,
      padding: "3rem 2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "transparent",
    },
    header: {
      fontSize: "32px",
      fontWeight: "600",
      marginBottom: "2rem",
    },
    cardGrid: {
      width: "100%",
      maxWidth: "1000px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "2rem",
      justifyItems: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "transform 0.2s",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    cardText: {
      fontSize: "15px",
      marginBottom: "1.2rem",
      color: "#333",
    },

    logoutButton: {
      marginTop: "auto", // Empuja el botón hacia abajo
      backgroundColor: "#ef4444",
      padding: "12px 20px",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "background-color 0.3s",
    },

    button: (color) => ({
      padding: "10px 16px",
      fontSize: "14px",
      backgroundColor: color,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    }),
  };

  const menuItems = [
    { label: "Solicitudes", path: "/empleado/solicitudes", icon: <FaEnvelopeOpenText />, color: "#2563eb" },
    { label: "Horarios", path: "/empleado/horarios", icon: <FaClock />, color: "#10b981" },
    { label: "Turnos", path: "/empleado/turnos", icon: <FaCalendarAlt />, color: "#0ea5e9" },
    { label: "Notificaciones", path: "/empleado/notificaciones", icon: <FaBell />, color: "#f59e0b" },
  ];

  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <img src={logoCHG} alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>ChronoGuard</h2>
        <div style={styles.menu}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={idx}
                style={styles.menuItem(isActive)}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

            <button
              style={styles.logoutButton}
              onClick={() => {
                localStorage.clear(); // Borra todo (o usa removeItem si prefieres)
                navigate("/", { replace: true }); // Replace evita volver con la flecha atrás
              }}
            >
              <FaSignOutAlt />
              Salir
            </button>

      </aside>

      <main style={styles.content}>
        <h2 style={styles.header}>Panel del Usuario</h2>
        <div style={styles.cardGrid}>
          {menuItems.map((item, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.cardTitle}>{item.label}</div>
              <div style={styles.cardText}>
                {item.label === "Solicitudes" && "Solicita permisos o justificaciones."}
                {item.label === "Horarios" && "Consulta tu horario de trabajo."}
                {item.label === "Turnos" && "Revisa tus turnos asignados."}
                {item.label === "Notificaciones" && "Mantente informado de tus solicitudes."}
              </div>
              <button
                style={styles.button(item.color)}
                onClick={() => navigate(item.path)}
              >
                Ver {item.label}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardUsuario;
