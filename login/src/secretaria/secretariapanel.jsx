import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCHG from '../components/img/logoCHGcircul.png';
import './secretariapanel.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function SecretariaPanel() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  // Validación de sesión y rol secretaria
  const idUsuario = localStorage.getItem("id_usuario");
  const rolUsuario = localStorage.getItem("rol_usuario");
  if (!idUsuario || rolUsuario !== "2" ) {
    navigate("/", { replace: true });
  }
  fetchEmpleados();
  fetchNotificaciones();
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

  const fetchNotificaciones = async () => {
    try {
      const response = await fetch("http://localhost:5170/notificaciones_admin");
      const data = await response.json();
      setNotificaciones(data);
    } catch (error) {
      alert("Error al obtener notificaciones: " + error.message);
    }
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

        {/* Sección de notificaciones */}
        <section className="mb-5">
          <h2>Notificaciones</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID Notificación</th>
                <th>Fecha Solicitud</th>
                <th>ID Usuario</th>
                <th>ID Tipo Permiso</th>
                <th>Tipo</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">No hay notificaciones</td>
                </tr>
              ) : (
                notificaciones.map((n) => (
                  <tr key={n.ID_notificacion}>
                    <td>{n.ID_notificacion}</td>
                    <td>{n.Fecha_Solicitud}</td>
                    <td>{n.ID_Usuario}</td>
                    <td>{n.ID_tipoPermiso}</td>
                    <td>{n.tipo}</td>
                    <td>{n.Correo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      <footer className="bg-dark text-center text-white py-3">
        <p>&copy; 2024 ChronoGuard. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default SecretariaPanel;
