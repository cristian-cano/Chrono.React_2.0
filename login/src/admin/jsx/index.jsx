import React, { useState, useEffect } from 'react';
import logoCHG from '../../components/img/logoCHGcircul.png';
import '../css/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { jsPDF } from "jspdf"; // Descomenta si usas jsPDF

function Index() {
  // Estados para empleados y formularios
  const [rol, setRol] = useState('');
  const [showAgregar, setShowAgregar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showAsistencia, setShowAsistencia] = useState(false);
  const [showReporte, setShowReporte] = useState(false);

  // Mapa de campos para handleChange
  const fieldMap = {
    inputnumero_de_documentoEmpleado: 'numero_de_documento',
    inputNombreEmpleado: 'nombre',
    inputDepartamentoEmpleado: 'departamento',
    inputemailEmpleado: 'email',
    inputpasswordEmpleado: 'password'
  };

  // Empleados y formularios
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    numero_de_documento: '',
    nombre: '',
    departamento: '',
    email: '',
    password: ''
  });

  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    departamento: ''
  });

  // Asistencias y formularios
  const [asistencias, setAsistencias] = useState([]);
  const [formAsistencia, setFormAsistencia] = useState({
    id: '',
    nombre: '',
    entrada: '',
    salida: '',
    estado: ''
  });

  // Reportes
  const [formReporte, setFormReporte] = useState({
    fechaInicio: '',
    fechaFin: '',
    empleado: '',
    estado: ''
  });

  // Función para obtener usuarios del backend
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:5170/usuarios");
      const data = await response.json();
      setEmpleados(
        data.map(u => ({
          id: u.ID_Usuario,
          nombre: u.Nombre,
          email: u.Correo,
          rol: u.Rol,
          numero_de_documento: u.Numero_de_Documento || '',
          departamento: u.Departamento || '', // Por si tienes este campo en la BD
        }))
      );
    } catch (error) {
      alert("Error al obtener usuarios: " + error.message);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- FUNCIONES DE EMPLEADOS ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "inputRolEmpleado") setRol(value);
    const field = fieldMap[id];
    if (field) {
      setForm((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const abrirModalAgregar = () => {
    setShowAgregar(true);
    setForm({
      numero_de_documento: '',
      nombre: '',
      departamento: '',
      email: '',
      password: ''
    });
    setRol('');
  };

  const cerrarModalAgregar = () => setShowAgregar(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let rolId = 3;
    if (rol === "Administrador") rolId = 1;
    else if (rol === "Secretaria") rolId = 2;

    const empleado = {
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      rol: rolId,
      numero_de_documento: form.numero_de_documento,
      departamento: form.departamento
    };

    try {
      const response = await fetch("http://localhost:5170/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Empleado registrado exitosamente");
        cerrarModalAgregar();
        fetchUsuarios(); // Refresca la lista desde la base de datos
      } else {
        alert(data.error || "Error al registrar empleado");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión con el servidor: " + error.message);
    }
  };

  // --- FUNCIONES DE EDICIÓN ---
  const abrirModalEditar = (emp) => {
    setEditForm({
      nombre: emp.nombre,
      email: emp.email,
      departamento: emp.departamento,
      numero_de_documento: emp.numero_de_documento,
      id: emp.id
    });
    setShowEditar(true);
  };

  const cerrarModalEditar = () => setShowEditar(false);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEmpleados(emps =>
      emps.map(emp =>
        emp.id === editForm.id
          ? { ...emp, nombre: editForm.nombre, email: editForm.email, departamento: editForm.departamento, numero_de_documento: editForm.numero_de_documento }
          : emp
      )
    );
    cerrarModalEditar();
    // Aquí deberías hacer la petición al backend para actualizar el usuario en la base de datos
  };

  // --- FUNCIONES DE ELIMINAR ---
  const eliminarEmpleado = (id) => {
    if (window.confirm("¿Está seguro de eliminar este empleado?")) {
      setEmpleados(emps => emps.filter(emp => emp.id !== id));
      // Aquí deberías hacer la petición al backend para eliminar el usuario en la base de datos
    }
  };

  // --- FUNCIONES DE ASISTENCIA ---
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
      id: '',
      nombre: '',
      entrada: '',
      salida: '',
      estado: ''
    });
  };

  // --- FUNCIONES DE REPORTE ---
  const handleReporteChange = (e) => {
    const { id, value } = e.target;
    setFormReporte((prev) => ({
      ...prev,
      [id.replace('input', '').replace('Reporte', '').toLowerCase()]: value
    }));
  };

  const handleReporteSubmit = (e) => {
    e.preventDefault();
    alert("Reporte generado (simulado)");
    setShowReporte(false);
    setFormReporte({
      fechaInicio: '',
      fechaFin: '',
      empleado: '',
      estado: ''
    });
  };

  // Para mostrar el texto del rol
  function getRolTexto(rolId) {
    if (rolId === 1 || rolId === "1" || rol === "Administrador") return "Administrador";
    if (rolId === 2 || rolId === "2" || rol === "Secretaria") return "Secretaria";
    if (rolId === 3 || rolId === "3" || rol === "Empleado") return "Empleado";
    return "Desconocido";
  }

  return (
    <div className='contenedor'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <img src={logoCHG} alt="Logo" style={{ width: 40, marginRight: 10 }} />
          <a className="navbar-brand" href="#">ChronoGuard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#notificacionesEmpleados">
                  <i className="fas fa-bell"></i>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#empleados">Empleados</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#asistencia">Control de Asistencia</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#reportes">Reportes</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="http://localhost:5173/">Salir</a>
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
          }}>Panel de Administrador</h1>

        {/* Sección de Empleados */}
        <section id="empleados" className="mb-5">
          <h2>Gestión de Empleados</h2>
          <button className="btn btn-primary mb-3" onClick={abrirModalAgregar}>Agregar Empleado</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Numero de Documento</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Rol</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.numero_de_documento}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.departamento || "N/A"}</td>
                  <td>{getRolTexto(emp.rol)}</td>
                  <td>{emp.email}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-1"
                      onClick={() => abrirModalEditar(emp)}
                      style={{ background: 'rgba(253, 219, 66, 0.8)' }}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => eliminarEmpleado(emp.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Modal para Agregar Empleado */}
        {showAgregar && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content modal-form-empleado" style={{ background: 'linear-gradient(135deg, #36dee4c2 0%,rgb(46, 145, 175) 100%)' }}>
                <div className="modal-header">
                  <h5 className="modal-title" style={{ color: 'white' }}>Agregar Empleado</h5>
                  <button type="button" className="btn-close" onClick={cerrarModalAgregar}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="inputnumero_de_documentoEmpleado" className="form-label">Numero de Documento</label>
                      <input type="number" min="1" className="form-control" id="inputnumero_de_documentoEmpleado" value={form.numero_de_documento} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="inputNombreEmpleado" className="form-label">Nombres</label>
                      <input type="text" className="form-control" id="inputNombreEmpleado" value={form.nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="inputRolEmpleado" className="form-label">Rol</label>
                      <select
                        className="form-select"
                        id="inputRolEmpleado"
                        required
                        value={rol}
                        onChange={handleChange}>
                        <option value="" disabled>Seleccione un rol</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Secretaria">Secretaria</option>
                        <option value="Empleado">Empleado</option>
                      </select>
                    </div>
                    {rol === "Empleado" && (
                      <div className="mb-3">
                        <label htmlFor="inputDepartamentoEmpleado" className="form-label">Departamento</label>
                        <select className="form-select" id="inputDepartamentoEmpleado" value={form.departamento} onChange={handleChange} required>
                          <option value="">Seleccione un departamento</option>
                          <option value="Lavado">Lavado</option>
                          <option value="Planchado">Planchado</option>
                          <option value="Secado">Secado</option>
                          <option value="Transporte">Transporte</option>
                        </select>
                      </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="inputemailEmpleado" className="form-label">Correo</label>
                      <input type="email" className="form-control" id="inputemailEmpleado" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="inputpasswordEmpleado" className="form-label">Contraseña</label>
                      <input type="password" className="form-control" id="inputpasswordEmpleado" value={form.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Agregar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Editar Empleado */}
        {showEditar && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ background: 'linear-gradient(135deg,rgba(125, 240, 255, 0.97) 0%,rgb(29, 113, 146)  100%)' }}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Empleado</h5>
                  <button type="button" className="btn-close" onClick={cerrarModalEditar}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditSubmit}>
                    <div className="mb-3">
                      <label htmlFor="editNombreEmpleado" className="form-label">Nombre</label>
                      <input type="text" className="form-control" id="editNombreEmpleado" value={editForm.nombre} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="editEmailEmpleado" className="form-label">Correo</label>
                      <input type="email" className="form-control" id="editEmailEmpleado" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="editDepartamentoEmpleado" className="form-label">Departamento</label>
                      <input type="text" className="form-control" id="editDepartamentoEmpleado" value={editForm.departamento} onChange={e => setEditForm(f => ({ ...f, departamento: e.target.value }))} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Control de Asistencia */}
        <section id="asistencia" className="mb-5">
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
              <div className="modal-content" style={{ background: 'linear-gradient(135deg,rgba(125, 240, 255, 0.97) 0%,rgb(29, 113, 146)  100%)' }}>
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

        {/* Sección de Reportes */}
        <section id="reportes" className="mb-5">
          <h2>Generación de Reportes</h2>
          <p>Genera reportes personalizados sobre la asistencia del personal.</p>
          <button className="btn btn-info" onClick={() => setShowReporte(true)}>Generar Reporte</button>
        </section>

        {/* Modal para Generar Reporte */}
        {showReporte && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Generar Reporte</h5>
                  <button type="button" className="btn-close" onClick={() => setShowReporte(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleReporteSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Inicio</label>
                      <input type="date" className="form-control" id="inputFechaInicio" value={formReporte.fechaInicio} onChange={handleReporteChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Fin</label>
                      <input type="date" className="form-control" id="inputFechaFin" value={formReporte.fechaFin} onChange={handleReporteChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Empleado (Opcional)</label>
                      <input type="text" className="form-control" id="inputEmpleado" value={formReporte.empleado} onChange={handleReporteChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado (Opcional)</label>
                      <select className="form-select" id="inputEstado" value={formReporte.estado} onChange={handleReporteChange}>
                        <option value="">Todos</option>
                        <option value="Puntual">Puntual</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Ausente">Ausente</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Generar</button>
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

export default Index;
