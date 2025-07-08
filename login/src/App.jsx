import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import DashboardUsuario from "./empleado/pages/DashboardUsuario";
import Solicitudes from "./empleado/pages/Solicitudes";
import Turnos from "./empleado/pages/Turnos";
import Horarios from "./empleado/pages/Horarios";
import Notificaciones from "./empleado/pages/Notificaciones";
import AdminIndex from './admin/jsx/index';
import Login from './components/jsx/login';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  return (
    
    

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminIndex />} />

        {/* Panel de Usuario */}
        <Route path="/empleado" element={<DashboardUsuario />} />
        <Route path="/empleado/solicitudes" element={<Solicitudes />} />
        <Route path="/empleado/horarios" element={<Horarios />} />
        <Route path="/empleado/turnos" element={<Turnos />} />
        <Route path="/empleado/notificaciones" element={<Notificaciones />} />
      </Routes>
    </Router>
  );
}

export default App;

