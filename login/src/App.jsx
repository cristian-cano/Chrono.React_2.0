import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminIndex from './admin/jsx/index'
import Home from './Home'
import Login from './components/jsx/login'; // Ajusta la ruta si es necesario

function App() {
  return (
    
    

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminIndex />} />
      </Routes>
    </Router>
  );
}

export default App;