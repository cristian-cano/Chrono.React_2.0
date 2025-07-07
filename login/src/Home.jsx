import logoCHG from './components/img/logoCHGcircul.png'
import React, { useState } from 'react';
import Login from './components/jsx/login';
import cart1 from './components/img/pngwing.com (5).png'
import cart2 from './components/img/pngwing.com (8).png'
import cart3 from './components/img/pngwing.com (9).png'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className='contenedor'>
      <header className="text-center text-white d-flex align-items-center justify-content-center">
        <div className='ti'>
          <h1>LAVANDERIA MILENIO BOGOTÁ</h1>
          <br />
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <div className="titulo1">
                <img src={logoCHG} alt="" />
              </div>
              <a className="navbar-brand" href="#">ChronoGuard</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Inicio</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Servicios</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Contacto</a>
                  </li>
                </ul>
                <div className="botones">
                  <div className="bot">
                    <svg 
                      onClick={() => setShowLogin(true)}
                      style={{ cursor: 'pointer', width: '40px', height: '40px' }}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                    </svg>
                    <Login show={showLogin} onClose={() => setShowLogin(false)} />
                  </div>
                </div>
                {showLogin && <Login />}
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className="container"></div>
      <div className="tarjetas" id="mascotas">
        <div className="card">
          <div className="fila1">
            <img src={cart1} alt="" />
          </div>
          <div className="fila2">
            <h2>Alcanzando Nuevas Alturas</h2>
            <p>En la lavandería Milenio Bogotá, valoramos el talento humano como nuestro recurso más valioso. Presentamos <strong>ChronoGuard</strong>, un software innovador para gestionar nuestros recursos humanos.</p>
          </div>
        </div>
        <div className="card">
          <div className="fila1">
            <img src={cart2} alt="" />
          </div>
          <div className="fila2">
            <h2>Entorno Laboral Eficiente</h2>
            <p>Con <strong>ChronoGuard</strong>, buscamos crear un entorno laboral más eficiente y motivador, alineado con nuestros objetivos de crecimiento y excelencia en la empresa.</p>
          </div>
        </div>
        <div className="card">
          <div className="fila1">
            <img src={cart3} alt="" />
          </div>
          <div className="fila2">
            <h2>Creciendo Juntos Con ChronoGuard</h2>
            <p>Juntos, alcanzaremos nuevas alturas, asegurando que cada paso esté respaldado por una gestión de recursos humanos sólida y confiable en nuestra organización.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;