from flask import Blueprint, request, jsonify, current_app
import pymysql
import hashlib

user_bp = Blueprint('user_bp', __name__, url_prefix='/usuario')


# Crear un nuevo empleado
@user_bp.route('/crear', methods=['POST'])
def crear_empleado():
    data = request.get_json()

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    rol = data.get('rol', 2)
    area = data.get('area')
    departamento = data.get('departamento', 'Recepcion')

    if departamento == "Producción":
        if area not in ["Lavado", "Planchado", "Ruta", "Recepción"]:
            return jsonify({"error": "El valor de 'Area' no es válido"}), 400
    else:
        area = None

    if not all([nombre, apellido, correo, contraseña, rol, departamento]):
        return jsonify({"error": "Faltan datos"}), 400

    conn = current_app.connection
    try:
        conn.ping(reconnect=True)
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO Usuarios (nombre, apellido, correo, contraseña, rol)
                VALUES (%s, %s, %s, %s, %s)
            """, (nombre, apellido, correo, contraseña, rol))
            conn.commit()

            id_usuario = cursor.lastrowid

            cursor.execute("""
                INSERT INTO Personal (ID_Usuario, Area, Departamento)
                VALUES (%s, %s, %s)
            """, (id_usuario, area, departamento))
            conn.commit()

            return jsonify({"success": "Empleado creado exitosamente"}), 201

    except pymysql.err.InterfaceError:
        return jsonify({"error": "Error de conexión a la base de datos"}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

# Editar empleado
@user_bp.route('/editar/<int:id_usuario>', methods=['PUT'])
def editar_empleado(id_usuario):
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    correo = data.get('correo')
    departamento = data.get('departamento')
    area = data.get('area')

    if not all([nombre, apellido, correo, departamento]):
        return jsonify({"error": "Faltan datos"}), 400

    conn = current_app.connection
    try:
        conn.ping(reconnect=True)
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE Usuarios 
                SET nombre = %s, apellido = %s, correo = %s
                WHERE ID_Usuario = %s
            """, (nombre, apellido, correo, id_usuario))

            cursor.execute("""
                UPDATE Personal 
                SET Departamento = %s, Area = %s
                WHERE ID_Usuario = %s
            """, (departamento, area, id_usuario))

            conn.commit()
            return jsonify({"success": "Empleado actualizado correctamente"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

# Eliminar empleado
@user_bp.route('/eliminar/<int:id_usuario>', methods=['DELETE'])
def eliminar_empleado(id_usuario):
    conn = current_app.connection
    try:
        conn.ping(reconnect=True)
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Personal WHERE ID_Usuario = %s", (id_usuario,))
            cursor.execute("DELETE FROM Usuarios WHERE ID_Usuario = %s", (id_usuario,))
            conn.commit()
            return jsonify({"success": "Empleado eliminado correctamente"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500


@user_bp.route('/login', methods=['POST'])
def login_usuario():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Correo y contraseña son obligatorios"}), 400

    conn = current_app.connection
    if not conn or conn.open is False:
        return jsonify({"error": "No hay conexión con la base de datos"}), 500

    try:
        conn.ping(reconnect=True)
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT u.ID_Usuario, u.Nombre, u.Correo, u.Contraseña, r.tipo AS rol
                FROM Usuarios u
                JOIN Roles r ON u.ID_Rol = r.ID_Rol
                WHERE u.Correo = %s
            """, (email,))

            usuario = cursor.fetchone()

            if not usuario:
                return jsonify({"error": "Usuario no encontrado"}), 404

            # Convertir la contraseña ingresada a MD5
            hashed_input = hashlib.md5(password.encode()).hexdigest()

            # Comparar con la contraseña en BD
            if usuario['Contraseña'] != hashed_input:
                return jsonify({"error": "Contraseña incorrecta"}), 401

            rol_texto = usuario['rol'].lower()

            return jsonify({
                "id": usuario['ID_Usuario'],
                "nombre": usuario['Nombre'],
                "correo": usuario['Correo'],
                "rol": rol_texto
            }), 200

    except Exception as e:
        print("Error en login:", e)
        return jsonify({"error": "Error al procesar la solicitud"}), 500
