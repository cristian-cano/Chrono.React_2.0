import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelopeOpenText, FaSignOutAlt } from "react-icons/fa";
import logoCHG from "../../components/img/logoCHGcircul.png";

function DashboardUsuario() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const idUsuario = localStorage.getItem("id_usuario");
    if (!idUsuario) {
      navigate("/", { replace: true });
      return;
    }

    // Llamada al backend para obtener los datos del usuario
    fetch(`http://localhost:5170/empleado/${idUsuario}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((error) => console.error("Error al obtener usuario:", error));
  }, [navigate]);

  async function handleChangePassword() {
    setMsg('');
    if (!oldPass || !newPass || !confirmPass) {
      setMsg('Completa todos los campos.');
      return;
    }
    if (newPass !== confirmPass) {
      setMsg('Las contraseñas nuevas no coinciden.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5170/empleado/cambiar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuario.id,
          oldPassword: oldPass,
          newPassword: newPass
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Contraseña actualizada correctamente.');
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setMsg(data.error || 'Error al actualizar la contraseña.');
      }
    } catch {
      setMsg('Error de conexión.');
    }
  }

  const styles = {
    root: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
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
    nombreUsuario: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "0.3rem",
      textAlign: "center",
    },
    correoUsuario: {
      fontSize: "13px",
      color: "#dbeafe",
      textAlign: "center",
      marginBottom: "0.4rem",
    },
    menu: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginTop: "1.5rem",
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    mainInner: {
      flex: 1,
      width: "100%",
      padding: "3rem 4rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      fontSize: "36px",
      fontWeight: "700",
      marginBottom: "2rem",
      color: "#1e293b",
      textShadow: "1px 1px 2px #fff",
    },
    cardGrid: {
      width: "100%",
      maxWidth: "800px",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      padding: "2rem",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      textAlign: "center",
      width: "100%",
      maxWidth: "500px",
      transition: "transform 0.2s",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "0.8rem",
    },
    cardText: {
      fontSize: "16px",
      marginBottom: "1.5rem",
      color: "#333",
    },
    logoutButton: {
      marginTop: "auto",
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
    button: {
      padding: "12px 20px",
      fontSize: "15px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
    },
  };

  const menuItems = [
    { label: "Solicitudes", path: "/empleado/solicitudes", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <>
      <style>{`
        .contenedor-fondo {
          --s: 198px;
          --c1: #a3c2b5;
          --c2: #3d525c;
          --c3: #ffffff;

          background:
            repeating-conic-gradient(from 30deg, #0000 0 120deg, var(--c3) 0 50%)
              calc(var(--s) / 2) calc(var(--s) * tan(30deg) / 2),
            repeating-conic-gradient(from 30deg, var(--c1) 0 60deg, var(--c2) 0 120deg, var(--c3) 0 50%);
          background-size: var(--s) calc(var(--s) * tan(30deg));
          width: 100%;
        }
      `}</style>

      <div style={styles.root}>
        <aside style={styles.sidebar}>
          <img src={logoCHG} alt="Logo" style={styles.logo} />
          <div style={styles.nombreUsuario}>
            {usuario ? usuario.nombre : "ChronoGuard"}
          </div>
          {usuario && (
            <>
              <p style={styles.correoUsuario}>{usuario.correo}</p>
              <p style={styles.correoUsuario}>
                Rol: <span style={{ fontWeight: "bold", color: "#fff" }}>{usuario.rol}</span>
              </p>
            </>
          )}
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
            <button
              style={{
                ...styles.menuItem(false),
                backgroundColor: "#10b981",
                color: "#fff",
                marginTop: "1rem"
              }}
              onClick={() => setShowModal(true)}
            >
              Editar Contraseña
            </button>
          </div>
          <button
            style={styles.logoutButton}
            onClick={() => {
              localStorage.clear();
              navigate("/", { replace: true });
            }}
          >
            <FaSignOutAlt />
            Salir
          </button>
        </aside>

        <main style={styles.content}>
          <div className="contenedor-fondo" style={styles.mainInner}>
            <h2 style={styles.header}>Panel del Usuario</h2>
            <div style={styles.cardGrid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Solicitudes</div>
                <div style={styles.cardText}>
                  Solicita permisos o justificaciones.
                </div>
                <button
                  style={styles.button}
                  onClick={() => navigate("/empleado/solicitudes")}
                >
                  Ver Solicitudes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para cambiar contraseña */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "2rem", minWidth: "320px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#0077b6" }}>Editar Contraseña</h3>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              style={{ marginBottom: "1rem", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100%" }}
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              style={{ marginBottom: "1rem", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100%" }}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              style={{ marginBottom: "1rem", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100%" }}
            />
            {msg && <div style={{ color: msg.includes('correcta') ? "#10b981" : "#ef4444", marginBottom: "1rem" }}>{msg}</div>}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: "bold", cursor: "pointer" }}
                onClick={handleChangePassword}
              >
                Guardar
              </button>
              <button
                style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => { setShowModal(false); setMsg(''); setOldPass(''); setNewPass(''); setConfirmPass(''); }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardUsuario;