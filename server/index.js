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

// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                u.ID_Usuario, 
                u.Nombre, 
                u.Correo, 
                u.Numero_de_Documento, 
                u.ID_Rol AS Rol,
                d.tipo AS Departamento
            FROM Usuarios u
            LEFT JOIN Departamento d ON u.id_departamento = d.id_departamento`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar nuevo usuario
app.post('/admin', async (req, res) => {
    try {
        const { nombre, email, password, rol, numero_de_documento, departamento } = req.body;

        if (!nombre || !email || !password || !rol || !numero_de_documento) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const [existingUser] = await pool.execute(
            'SELECT ID_Usuario FROM Usuarios WHERE Correo = ?',
            [email]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        // Buscar el id_departamento si el departamento viene informado
        let id_departamento = null;
        if (departamento) {
            const [depRows] = await pool.execute(
                'SELECT id_departamento FROM Departamento WHERE tipo = ?',
                [departamento]
            );
            if (depRows.length > 0) {
                id_departamento = depRows[0].id_departamento;
            }
        }

        const [result] = await pool.execute(
            'INSERT INTO Usuarios (Nombre, Correo, Contraseña, ID_Rol, Numero_de_Documento, id_departamento) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, email, hashedPassword, rol, numero_de_documento, id_departamento]
        );

        if (result.affectedRows === 1) {
            res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: result.insertId });
        } else {
            res.status(500).json({ error: 'No se pudo insertar el usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editar usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { nombre, email, rol, numero_de_documento, departamento } = req.body;
        const { id } = req.params;

        // Buscar el id_departamento si el departamento viene informado
        let id_departamento = null;
        if (departamento) {
            const [depRows] = await pool.execute(
                'SELECT id_departamento FROM Departamento WHERE tipo = ?',
                [departamento]
            );
            if (depRows.length > 0) {
                id_departamento = depRows[0].id_departamento;
            }
        }

        await pool.execute(
            'UPDATE Usuarios SET Nombre=?, Correo=?, ID_Rol=?, Numero_de_Documento=?, id_departamento=? WHERE ID_Usuario=?',
            [nombre, email, rol, numero_de_documento, id_departamento, id]
        );
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan datos de login' });
        }

        const [rows] = await pool.execute(
            `SELECT u.ID_Usuario, u.Nombre, u.Correo, u.Contraseña, u.Numero_de_Documento, u.ID_Rol AS Rol
             FROM Usuarios u
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
            rol: user.Rol, // numérico: 1, 2, 3
            numero_de_documento: user.Numero_de_Documento
        };
        res.json(userData);
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
});

const PORT = process.env.PORT || 5170;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
