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

  const usuarioID = 3; // Simulado
  const departamentoID = 4; // Simulado (Transporte)
  const nombreDepartamento = 'Transporte'; // Solo visual

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
    fetchSolicitudes();
  }, []);

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
      background: "linear-gradient(to right, #e0f2ff, #f5faff)",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
    },
    newButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    backButton: {
      backgroundColor: "#94a3b8",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "1.5rem",
    },
    table: {
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    th: {
      backgroundColor: "#0077b6",
      color: "#fff",
      padding: "1rem",
      textAlign: "left",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #eee",
    },
    modalOverlay: {
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      background: "#fff",
      borderRadius: "12px",
      padding: "2rem",
      width: "400px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "1rem",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    btnGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
    },
    btn: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    },
    saveBtn: {
      backgroundColor: "#10b981",
      color: "#fff",
    },
    cancelBtn: {
      backgroundColor: "#ef4444",
      color: "#fff",
    }
  };

  return (
    <div style={styles.container}>
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
  );
}

export default Solicitudes;
