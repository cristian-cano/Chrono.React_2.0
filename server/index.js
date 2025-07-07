require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'SENA123',
    database: process.env.DB_NAME || 'ChronoDB_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware de autenticación simplificado
const checkAuth = (req, res, next) => {
    const { usuario } = req.body;
    if (!usuario) {
    return res.status(401).json({ error: 'No autorizado' });
}
    next();
};

// Registrar nuevo usuario (con MD5)
app.post('/registro', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    const [existingUser] = await pool.execute(
      'SELECT ID_Usuario FROM Usuarios WHERE Correo = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    const [result] = await pool.execute(
      'INSERT INTO Usuarios (Nombre, Apellido, Correo, Contraseña, ID_Rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, hashedPassword, rol]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuario (comparando con MD5)
app.post('/login', async (req, res) => {
  try {
    console.log('Datos recibidos en login:', req.body); // <-- agrega esto
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      `SELECT u.ID_Usuario, u.Nombre, u.Apellido, u.Correo, u.Contraseña, r.tipo AS Rol
       FROM Usuarios u
       JOIN Roles r ON u.ID_Rol = r.ID_Rol
       WHERE u.Correo = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    if (hashedPassword !== user.Contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const userData = {
      id: user.ID_Usuario,
      nombre: user.Nombre,
      apellido: user.Apellido,
      correo: user.Correo,
      rol: user.Rol
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta protegida de ejemplo para admin
app.post('/admin/dashboard', checkAuth, async (req, res) => {
  try {
    if (req.body.usuario.rol !== 'Admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json({ mensaje: 'Bienvenido al panel de administración' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta protegida de ejemplo para usuario normal
app.post('/usuario/dashboard', checkAuth, async (req, res) => {
  try {
    res.json({ mensaje: 'Bienvenido al panel de usuario' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error("Error global:", err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 5170;
console.log('Antes de app.listen');
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
console.log('Después de app.listen');
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
console.log('Después de app.listen');
