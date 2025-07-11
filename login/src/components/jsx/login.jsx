import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';

function Login({ show, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const text = await response.text();
       console.log("Texto recibido del backend:", text); 
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
        console.log("JSON parseado:", data); 
      } catch {
        setError('Respuesta inválida del servidor');
        setSuccessMessage('');
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setSuccessMessage('');
        return;
      }

      setSuccessMessage(`¡Bienvenido, ${data.nombre} (${data.rol})!`);
      setError('');

      //  Corrección aquí: guardar correctamente el ID recibido como "data.id"
      localStorage.setItem("id_usuario", data.id);
      localStorage.setItem("rol_usuario", String(data.rol));

      
      // Navegar según el rol
      if (data.rol === 'admin' || data.rol === 1) {
        navigate('/admin');
      } else if (data.rol === 'empleado' || data.rol ===  3) {
        navigate('/empleado');
      } else if (data.rol === 'secretaria' || data.rol === 2) {
        navigate('/secretaria');
      } else {
        setError('Rol no reconocido');
      }

    } catch (err) {
      setError('Error en la conexión con el servidor');
      setSuccessMessage('');
      console.error(err);
    }
  };

  return (
    <div className="login-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="cont"
          onClick={(e) => e.stopPropagation()}
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgb(0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
          }}
        >
          <form className="formulari" onSubmit={handleSubmit}>
            <h2 className="inic">Inicio De Sesión</h2>

            {successMessage && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                border: '1px solid #c3e6cb'
              }}>
                {successMessage}
              </div>
            )}

            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                padding: '0.5rem',
                marginBottom: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
              placeholder="Correo Electrónico"
            />

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                padding: '0.5rem',
                marginBottom: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
              placeholder="Contraseña"
            />

            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg,rgb(116, 158, 235) 0%,rgb(172, 229, 229) 100%)',
                color: 'rgba(0, 0, 0, 0.86)',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Iniciar Sesión
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: '10px',
                padding: '0.5rem 1rem',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
