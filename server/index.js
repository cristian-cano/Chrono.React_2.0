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
    password: process.env.DB_PASSWORD || '1000991521',
    database: process.env.DB_NAME || 'ChronoDB_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT u.ID_Usuario, u.Nombre, u.Correo, r.tipo AS Rol
             FROM Usuarios u
             JOIN Roles r ON u.ID_Rol = r.ID_Rol`
        );
        console.log("Usuarios enviados al frontend:", rows);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: error.message });
    }
});


// Obtener datos de un solo empleado por su ID
app.get('/empleado/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT u.ID_Usuario as id, u.Nombre as nombre, u.Correo as correo, r.tipo AS rol
       FROM Usuarios u
       JOIN Roles r ON u.ID_Rol = r.ID_Rol
       WHERE u.ID_Usuario = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener solicitudes del usuario
app.get('/empleado/solicitudes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(
            `SELECT tp.tipo, tp.mensaje, tp.Fecha_Solicitud, tp.ID_Usuario, tp.id_departamento, tp.ID_tipoPermiso,
                    'Pendiente' AS estado, d.tipo AS departamento
             FROM TipoPermiso tp
             LEFT JOIN Departamento d ON tp.id_departamento = d.id_departamento
             WHERE tp.ID_Usuario = ?
             ORDER BY tp.Fecha_Solicitud DESC`,
            [id]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ error: error.message });
    }
});

// Registrar nuevo usuario
app.post('/admin', async (req, res) => {
    try {
        console.log("Datos recibidos en /admin:", req.body);

        const { nombre, email, password, rol, numero_de_documento} = req.body;

        if (!nombre || !email || !password || !rol || !numero_de_documento) {
            console.log("Faltan datos en el registro:", req.body);
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const [existingUser] = await pool.execute(
            'SELECT ID_Usuario FROM Usuarios WHERE Correo = ?',
            [email]
        );
        if (existingUser.length > 0) {
            console.log("Correo ya registrado:", email);
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        const [result] = await pool.execute(
            'INSERT INTO Usuarios (Nombre, Correo, Contraseña, ID_Rol, Numero_de_Documento) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, hashedPassword, rol, numero_de_documento]
        );

        console.log("Resultado del INSERT:", result);

        if (result.affectedRows === 1) {
            console.log(`Usuario registrado: ${nombre} (${email} ${rol} ${numero_de_documento})`);
            const responseJson = {
                mensaje: 'Usuario registrado exitosamente',
                id: result.insertId
            };
            console.log("JSON enviado al frontend:", responseJson);
            res.status(201).json(responseJson);
        } else {
            console.error("No se pudo insertar el usuario:", req.body);
            res.status(500).json({ error: 'No se pudo insertar el usuario' });
        }
    } catch (error) {
        console.error("Error en /admin:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/empleado/solicitud', async (req, res) => {
    try {
        const { ID_Usuario, id_departamento, tipo, mensaje, Fecha_Solicitud } = req.body;
        if (!ID_Usuario || !id_departamento || !tipo || !mensaje || !Fecha_Solicitud) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // Insertar en TipoPermiso
        const [result] = await pool.execute(
            `INSERT INTO TipoPermiso (ID_Usuario, id_departamento, tipo, mensaje, Fecha_Solicitud)
             VALUES (?, ?, ?, ?, ?)`,
            [ID_Usuario, id_departamento, tipo, mensaje, Fecha_Solicitud]
        );
        const id_tipo_permiso = result.insertId;

        // Obtener correo del usuario
        const [userRows] = await pool.execute(
            "SELECT Correo FROM Usuarios WHERE ID_Usuario = ?",
            [ID_Usuario]
        );
        const correo = userRows[0]?.Correo || '';

        // Insertar en Notificaciones_ADMIN
        await pool.execute(
            `INSERT INTO Notificaciones_ADMIN (Fecha_Solicitud, ID_Usuario, ID_tipoPermiso, tipo, Correo)
             VALUES (?, ?, ?, ?, ?)`,
            [Fecha_Solicitud, ID_Usuario, id_tipo_permiso, tipo, correo]
        );

        // Obtener el ID del estado "Pendiente"
        const [estadoRows] = await pool.execute(
            `SELECT ID_EstadoPermiso FROM EstadoPermisos WHERE Estado = 'Pendiente'`
        );
        const id_estado_permiso = estadoRows[0]?.ID_EstadoPermiso;

        if (!id_estado_permiso) {
            throw new Error("No se encontró el ID_EstadoPermiso para 'Pendiente'");
        }

        // Insertar en Notificaciones (para el empleado)
        await pool.execute(
            `INSERT INTO Notificaciones (ID_Usuario, ID_EstadoPermiso, Mensaje, FechaEnvio, Estado)
             VALUES (?, ?, ?, ?, ?)`,
            [ID_Usuario, id_estado_permiso, mensaje, Fecha_Solicitud, 'Pendiente']
        );

        res.status(201).json({ success: 'Solicitud enviada correctamente' });
    } catch (error) {
        console.error("Error al guardar solicitud:", error);
        res.status(500).json({ error: error.message });
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    try {
        console.log('Datos recibidos en /login:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan datos de login' });
        }

        const [rows] = await pool.execute(
            `SELECT u.ID_Usuario, u.Correo, u.Contraseña, r.tipo AS Rol
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
            correo: user.Correo,
            rol: user.Rol,
            numero_de_documento: user.numero_de_documento
        };

        console.log("Usuario logueado:", userData);
        res.json(userData);
    } catch (error) {
        console.error("Error en /login:", error);
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
});

const PORT = process.env.PORT || 5170;
console.log('Antes de app.listen');
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
console.log('Después de app.listen');


