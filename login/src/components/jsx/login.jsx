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
<<<<<<< HEAD
       const response = await fetch('/usuario/login', {
=======
      const response = await fetch('http://localhost:5170/login', {
>>>>>>> cf9c4e96f49c5d0fc768ae56067e5ece1a6313d1
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Lee el texto de la respuesta primero
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
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
      // Si login exitoso, redirige al index de admin
<<<<<<< HEAD
      if (data.rol === 'admin') {
        navigate('/admin');
        } else if (data.rol === 'empleado') {
        navigate('/empleado'); // Asegúrate de tener esta ruta
        } else {
        setError('Rol no reconocido');
      }

=======
      navigate('/admin');
>>>>>>> cf9c4e96f49c5d0fc768ae56067e5ece1a6313d1
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
            backgroundcolor: 'rgb(0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
          }}
        >
          <form className="formulari" onSubmit={handleSubmit}>
            <h2 className="inic">Inicio De Sesión</h2>

            {/* ✅ Mensaje de éxito */}
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

            {/* ⚠️ Mensaje de error */}
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

            {/* Botón para cerrar modal */}
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
