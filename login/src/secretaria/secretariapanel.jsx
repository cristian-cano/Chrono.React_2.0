import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCHG from '../components/img/logoCHGcircul.png';
import './secretariapanel.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SecretariaPanel() {
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [showAsistencia, setShowAsistencia] = useState(false);
  const [formAsistencia, setFormAsistencia] = useState({
    id: "",
    nombre: "",
    entrada: "",
    salida: "",
    estado: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Validación de sesión y rol secretaria
    const idUsuario = localStorage.getItem("id_usuario");
    const rolUsuario = localStorage.getItem("rol_usuario");
    if (!idUsuario || !(rolUsuario === "2" || rolUsuario === 2)) {
      navigate("/", { replace: true });
    }
    fetchEmpleados();
    fetchAsistencias();
  }, [navigate]);

  const fetchEmpleados = async () => {
    try {
      const response = await fetch("http://localhost:5170/usuarios");
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      alert("Error al obtener empleados: " + error.message);
    }
  };

  const fetchAsistencias = async () => {
    // Aquí puedes hacer un fetch real a tu endpoint de asistencias si existe
    setAsistencias([]); // Inicializa vacío si no tienes endpoint aún
  };

  const handleAsistenciaChange = (e) => {
    const { id, value } = e.target;
    setFormAsistencia((prev) => ({
      ...prev,
      [id.replace('input', '').replace('Asistencia', '').toLowerCase()]: value
    }));
  };

  const handleAsistenciaSubmit = (e) => {
    e.preventDefault();
    setAsistencias([...asistencias, formAsistencia]);
    setShowAsistencia(false);
    setFormAsistencia({
      id: "",
      nombre: "",
      entrada: "",
      salida: "",
      estado: ""
    });
  };

  return (
    <div className="contenedor">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <img src={logoCHG} alt="Logo" style={{ width: 40, marginRight: 10 }} />
          <a className="navbar-brand" href="#">ChronoGuard</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  style={{ color: 'white', textDecoration: 'none' }}
                  onClick={() => {
                    localStorage.removeItem("id_usuario");
                    localStorage.removeItem("rol_usuario");
                    navigate("/", { replace: true });
                  }}
                >
                  Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h1 className="text-center mb-4"
          style={{
            color: 'black',
            background: 'linear-gradient(135deg, #36dee4c2 0%,rgb(46, 145, 175) 100%)',
            padding: '10px',
            borderRadius: '5px'
          }}>Panel de Secretaria</h1>

        {/* Sección de empleados (solo vista) */}
        <section className="mb-5">
          <h2>Empleados</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Rol</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map(emp => (
                <tr key={emp.ID_Usuario}>
                  <td>{emp.ID_Usuario}</td>
                  <td>{emp.Nombre}</td>
                  <td>{emp.Departamento || "N/A"}</td>
                  <td>{emp.Rol === 1 ? "Administrador" : emp.Rol === 2 ? "Secretaria" : "Empleado"}</td>
                  <td>{emp.Correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Sección de control de asistencia */}
        <section className="mb-5">
          <h2>Control de Asistencia</h2>
          <button className="btn btn-success mb-3" onClick={() => setShowAsistencia(true)}>Registrar Asistencia</button>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID Empleado</th>
                <th>Nombre</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((as, i) => (
                <tr key={i}>
                  <td>{as.id}</td>
                  <td>{as.nombre}</td>
                  <td>{as.entrada}</td>
                  <td>{as.salida}</td>
                  <td>{as.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Modal para el registro de asistencia */}
        {showAsistencia && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Registrar Asistencia</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAsistencia(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAsistenciaSubmit}>
                    <div className="mb-3">
                      <label className="form-label">ID Empleado</label>
                      <input type="text" className="form-control" id="inputIdAsistencia" value={formAsistencia.id} onChange={handleAsistenciaChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" id="inputNombreAsistencia" value={formAsistencia.nombre} onChange={handleAsistenciaChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Hora de Entrada</label>
                      <input type="time" className="form-control" id="inputEntradaAsistencia" value={formAsistencia.entrada} onChange={handleAsistenciaChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Hora de Salida</label>
                      <input type="time" className="form-control" id="inputSalidaAsistencia" value={formAsistencia.salida} onChange={handleAsistenciaChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select className="form-select" id="inputEstadoAsistencia" value={formAsistencia.estado} onChange={handleAsistenciaChange} required>
                        <option value="">Seleccione estado</option>
                        <option value="Puntual">Puntual</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Ausente">Ausente</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Registrar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-dark text-center text-white py-3">
        <p>&copy; 2024 ChronoGuard. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default SecretariaPanel;
