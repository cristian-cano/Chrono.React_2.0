import React, { useState } from 'react';
import logoCHG from '../../components/img/logoCHGcircul.png'; // Ajusta la ruta si es necesario
import '../css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../js/index.js'; // Asegúrate de que este archivo exista y contenga la lógica necesaria

function Index() {
  const [rol, setRol] = useState('');

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
        style={{color: 'black',
          background:'white',
          

        }}>Panel de Administrador</h1>

        {/* Sección de Empleados */}
        <section id="empleados" className="mb-5">
        
          <h2>Gestión de Empleados</h2>
          <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#modalAgregarEmpleado">Agregar Empleado</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Juan Pérez</td>
                <td>Lavado</td>
                <td>
                  <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalEditarEmpleado" style={{background: 'rgba(253, 219, 66, 0.8)',
                    marginRight: '5px'
                  }}>Editar</button>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      
        {/* Modal para Agregar Empleado */}
      <div className="modal-content modal-form-empleado">
        <div className="modal fade" id="modalAgregarEmpleado" tabIndex="-1" aria-labelledby="modalAgregarEmpleadoLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content modal-form-empleado" style={{ background: 'linear-gradient(135deg, #36dee4c2 0%, #2e3b75 100%)' }}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalAgregarEmpleadoLabel" style={{ color: 'white' }}>Agregar Empleado</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form id="formAgregarEmpleado">
                  <div className="mb-3">
                    <label htmlFor="inputIdEmpleado" className="form-label">ID</label>
                    <input type="number" className="form-control" id="inputIdEmpleado" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputNombreEmpleado" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="inputNombreEmpleado" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputRolEmpleado" className="form-label">Rol</label>
                    <select
                      className="form-select"
                      id="inputRolEmpleado"
                      required
                      value={rol}
                      onChange={e => setRol(e.target.value)}
                    >
                      <option value="" disabled>Seleccione un rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Secretaria">Secretaria</option>
                      <option value="Empleado">Empleado</option>
                    </select>
                  </div>

                  {rol === "Empleado" && (
                    <div className="mb-3">
                      <label htmlFor="inputDepartamentoEmpleado" className="form-label">Departamento</label>
                      <select className="form-select" id="inputDepartamentoEmpleado" required>
                        <option value="">Seleccione un departamento</option>
                        <option value="Lavado">Lavado</option>
                        <option value="Planchado">Planchado</option>
                        <option value="Secado">Secado</option>
                        <option value="Transporte">Transporte</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="inputCorreoEmpleado" className="form-label">Correo</label>
                    <input type="email" className="form-control" id="inputCorreoEmpleado" required />
                  </div>


                  <div className="mb-3">
                    <label htmlFor="inputContraseñaEmpleado" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="inputContraseñaEmpleado" required />
                  </div>

                  <button type="submit" className="btn btn-primary">Agregar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
  </div>
        {/* Modal para Editar Empleado */}
        <div className="modal fade" id="modalEditarEmpleado" tabIndex="-1" aria-labelledby="modalEditarEmpleadoLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalEditarEmpleadoLabel">Editar Empleado</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form id="formEditarEmpleado">
                  <div className="mb-3">
                    <label htmlFor="editIdEmpleado" className="form-label">ID</label>
                    <input type="text" className="form-control" id="editIdEmpleado" readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editNombreEmpleado" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="editNombreEmpleado" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDepartamentoEmpleado" className="form-label">Departamento</label>
                    <input type="text" className="form-control" id="editDepartamentoEmpleado" required />
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Control de Asistencia */}
        <section id="asistencia" className="mb-5">
          <h2>Control de Asistencia</h2>
          <button className="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#modalRegistrarAsistencia">Registrar Asistencia</button>
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
              <tr>
                <td>1</td>
                <td>Juan Pérez</td>
                <td>08:00 AM</td>
                <td>05:00 PM</td>
                <td>Puntual</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Modal para el registro de asistencia */}
        <div className="modal fade" id="modalRegistrarAsistencia" tabIndex="-1" aria-labelledby="modalRegistrarAsistenciaLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalRegistrarAsistenciaLabel">Registrar Asistencia</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form id="formRegistrarAsistencia">
                  <div className="mb-3">
                    <label htmlFor="inputIdAsistencia" className="form-label">ID Empleado</label>
                    <input type="text" className="form-control" id="inputIdAsistencia" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputNombreAsistencia" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="inputNombreAsistencia" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputEntradaAsistencia" className="form-label">Hora de Entrada</label>
                    <input type="time" className="form-control" id="inputEntradaAsistencia" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputSalidaAsistencia" className="form-label">Hora de Salida</label>
                    <input type="time" className="form-control" id="inputSalidaAsistencia" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputEstadoAsistencia" className="form-label">Estado</label>
                    <select className="form-select" id="inputEstadoAsistencia" required>
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

        {/* Sección de Reportes */}
        <section id="reportes" className="mb-5">
          <h2>Generación de Reportes</h2>
          <p>Genera reportes personalizados sobre la asistencia del personal.</p>
          <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalGenerarReporte">Generar Reporte</button>
        </section>

        {/* Modal para Generar Reporte */}
        <div className="modal fade" id="modalGenerarReporte" tabIndex="-1" aria-labelledby="modalGenerarReporteLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalGenerarReporteLabel">Generar Reporte</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form id="formGenerarReporte">
                  <div className="mb-3">
                    <label htmlFor="inputFechaInicio" className="form-label">Fecha de Inicio</label>
                    <input type="date" className="form-control" id="inputFechaInicio" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputFechaFin" className="form-label">Fecha de Fin</label>
                    <input type="date" className="form-control" id="inputFechaFin" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputEmpleado" className="form-label">Empleado (Opcional)</label>
                    <input type="text" className="form-control" id="inputEmpleado" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputEstado" className="form-label">Estado (Opcional)</label>
                    <select className="form-select" id="inputEstado">
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
      </div>

      <footer className="bg-dark text-center text-white py-3">
        <p>&copy; 2024 ChronoGuard. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Index;