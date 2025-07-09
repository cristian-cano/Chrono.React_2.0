import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from "react-icons/fa";
import { enviarSolicitud, obtenerSolicitudes } from '../api/empleadoAPI';

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState({ tipo: '', mensaje: '', id_departamento: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const usuarioID = parseInt(localStorage.getItem("id_usuario"));
  const departamentoID = 4; // Simulado (Transporte)
  const nombreDepartamento = 'Transporte';

  useEffect(() => {
    async function fetchSolicitudes() {
      try {
        const data = await obtenerSolicitudes(usuarioID);
        setSolicitudes(data);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      } finally {
        setLoading(false);
      }
    }
    if (usuarioID) {
      fetchSolicitudes();
    }
  }, [usuarioID]);

  const handleNuevaSolicitud = async () => {
    if (!nuevo.tipo || !nuevo.mensaje.trim()) {
      alert("Debes completar todos los campos.");
      return;
    }

    const solicitud = {
      ID_Usuario: usuarioID,
      id_departamento: departamentoID,
      tipo: nuevo.tipo,
      mensaje: nuevo.mensaje,
      Fecha_Solicitud: new Date().toISOString().slice(0, 10)
    };

    try {
      const res = await enviarSolicitud(solicitud);
      if (res.success) {
        setSolicitudes([...solicitudes, { ...solicitud, departamento: nombreDepartamento, estado: 'Pendiente' }]);
        setShowModal(false);
        setNuevo({ tipo: '', mensaje: '', id_departamento: '' });
      } else {
        alert("Ocurrió un error al guardar la solicitud.");
        console.error(res);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al guardar la solicitud.");
    }
  };

  const estadoIcono = (estado) => {
    switch (estado) {
      case 'Pendiente': return <FaClock color="#facc15" />;
      case 'Aprobado': return <FaCheckCircle color="#22c55e" />;
      case 'Rechazado': return <FaTimesCircle color="#ef4444" />;
      default: return null;
    }
  };

  const styles = {
    container: {
      padding: "2rem",
      background: "linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: "900px",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1e293b",
      letterSpacing: "1px",
    },
    newButton: {
      background: "linear-gradient(90deg, #0077b6 0%, #0096c7 100%)",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: "bold",
      fontSize: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      transition: "background 0.2s",
    },
    backButton: {
      background: "#64748b",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "2rem",
      fontWeight: "bold",
      fontSize: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    tableWrapper: {
      width: "100%",
      maxWidth: "900px",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      background: "linear-gradient(90deg, #0077b6 0%, #0096c7 100%)",
      color: "#fff",
      padding: "1rem",
      textAlign: "left",
      fontWeight: "bold",
      fontSize: "1rem",
      borderBottom: "2px solid #e0e7ef",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #e0e7ef",
      fontSize: "1rem",
      color: "#334155",
    },
    modalOverlay: {
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.25)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      background: "#fff",
      borderRadius: "16px",
      padding: "2.5rem 2rem",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      color: "#0077b6",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "1.2rem",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "1rem",
      background: "#f8fafc",
      color: "#334155",
      outline: "none",
      transition: "border 0.2s",
    },
    btnGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
      width: "100%",
    },
    btn: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      transition: "background 0.2s",
    },
    saveBtn: {
      background: "linear-gradient(90deg, #10b981 0%, #22d3ee 100%)",
      color: "#fff",
    },
    cancelBtn: {
      background: "#ef4444",
      color: "#fff",
    }
  };
  const waterBg = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 0,
  background: `linear-gradient(180deg, #e0f2fe 0%, #b6e0fe 100%)`,
  overflow: "hidden"
};
const svgStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100vw",
  height: "300px",
  zIndex: 1,
  pointerEvents: "none"
};

   return (
    <>
      <div style={waterBg}>
        <svg style={svgStyle} viewBox="0 0 1440 320">
          <path fill="#0096c7" fillOpacity="0.4" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          <path fill="#0077b6" fillOpacity="0.3" d="M0,288L60,272C120,256,240,224,360,197.3C480,171,600,149,720,154.7C840,160,960,192,1080,197.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      <div style={{ ...styles.container, position: "relative", zIndex: 2 }}>
        <button style={styles.backButton} onClick={() => navigate('/empleado')}>
          <FaArrowLeft /> Regresar
        </button>

        <div style={styles.header}>
          <div style={styles.title}>Mis Solicitudes</div>
          <button style={styles.newButton} onClick={() => setShowModal(true)}>
            <FaPlus /> Nueva Solicitud
          </button>
        </div>

        {loading ? (
          <p>Cargando solicitudes...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Departamento</th>
                  <th style={styles.th}>Mensaje</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{s.tipo}</td>
                    <td style={styles.td}>{s.departamento || nombreDepartamento}</td>
                    <td style={styles.td}>{s.mensaje}</td>
                    <td style={styles.td}>{s.Fecha_Solicitud || s.fecha}</td>
                    <td style={styles.td}>{estadoIcono(s.estado || 'Pendiente')} {s.estado || 'Pendiente'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalTitle}>Nueva Solicitud</div>
              <select
                style={styles.input}
                value={nuevo.tipo}
                onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
              >
                <option value="">Seleccionar tipo de permiso</option>
                <option value="calamidad domestica">Calamidad doméstica</option>
                <option value="Cita Medica">Cita Médica</option>
                <option value="Permiso Personal">Permiso Personal</option>
                <option value="Permiso por citacion legal o judicial">Citación legal o judicial</option>
                <option value="eventos familiares">Eventos familiares</option>
              </select>
              <textarea
                style={styles.input}
                rows="4"
                placeholder="Escribe el motivo o mensaje..."
                value={nuevo.mensaje}
                onChange={(e) => setNuevo({ ...nuevo, mensaje: e.target.value })}
              />
              <div style={styles.btnGroup}>
                <button style={{ ...styles.btn, ...styles.cancelBtn }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button style={{ ...styles.btn, ...styles.saveBtn }} onClick={handleNuevaSolicitud}>Enviar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Solicitudes;
