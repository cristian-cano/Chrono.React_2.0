from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash

user_management_bp = Blueprint('user_management', __name__, url_prefix='/gestion-usuarios')

@user_management_bp.route('/crear', methods=['POST'])
def crear_usuario():
    data = request.json
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    id_rol = data.get('id_rol')

    if not all([nombre, apellido, correo, contraseña, id_rol]):
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    conn = current_app.connection
    with conn.cursor() as cursor:
        cursor.execute("SELECT ID FROM Usuarios WHERE Correo = %s", (correo,))
        if cursor.fetchone():
            return jsonify({'error': 'El correo ya está registrado'}), 409

        contraseña = generate_password_hash(contraseña)
        sql = "INSERT INTO Usuarios (Nombre, Apellido, Correo, Contraseña, ID_Rol) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (nombre, apellido, correo, contraseña, id_rol))
        conn.commit()

    return jsonify({'mensaje': 'Usuario creado correctamente'})
