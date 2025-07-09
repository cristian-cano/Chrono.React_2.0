from flask import Blueprint, request, jsonify, current_app
import pymysql

empleado_bp = Blueprint('empleado_bp', __name__, url_prefix='/empleado')

# Enviar solicitud a la tabla TipoPermiso
@empleado_bp.route('/solicitud', methods=['POST'])
def crear_solicitud():
    data = request.get_json()
    id_usuario = data.get('ID_Usuario')
    id_departamento = data.get('id_departamento')
    tipo = data.get('tipo')
    mensaje = data.get('mensaje')
    fecha = data.get('Fecha_Solicitud')

    if not all([id_usuario, id_departamento, tipo, mensaje, fecha]):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = current_app.connection
    try:
        conn.ping(reconnect=True)
        with conn.cursor() as cursor:
            # Insertar en TipoPermiso
            cursor.execute("""
                INSERT INTO TipoPermiso (ID_Usuario, id_departamento, tipo, mensaje, Fecha_Solicitud)
                VALUES (%s, %s, %s, %s, %s)
            """, (id_usuario, id_departamento, tipo, mensaje, fecha))
            id_tipo_permiso = cursor.lastrowid

            # Obtener correo del usuario
            cursor.execute("SELECT Correo FROM Usuarios WHERE ID_Usuario = %s", (id_usuario,))
            correo = cursor.fetchone()[0]

            # Insertar en Notificaciones_ADMIN
            cursor.execute("""
                INSERT INTO Notificaciones_ADMIN (Fecha_Solicitud, ID_Usuario, ID_tipoPermiso, tipo, Correo)
                VALUES (%s, %s, %s, %s, %s)
            """, (fecha, id_usuario, id_tipo_permiso, tipo, correo))

            conn.commit()
            return jsonify({'success': 'Solicitud enviada correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500


# Obtener solicitudes del usuario
@empleado_bp.route('/solicitudes/<int:id_usuario>', methods=['GET'])
def obtener_solicitudes(id_usuario):
    conn = current_app.connection
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT tipo, mensaje, Fecha_Solicitud, estado, d.nombre AS departamento
                FROM TipoPermiso tp
                JOIN Departamentos d ON tp.id_departamento = d.ID_Departamento
                WHERE tp.ID_Usuario = %s
                ORDER BY Fecha_Solicitud DESC
            """, (id_usuario,))
            solicitudes = cursor.fetchall()
            return jsonify(solicitudes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Obtener turnos asignados
@empleado_bp.route('/turnos/<int:id_usuario>', methods=['GET'])
def obtener_turnos(id_usuario):
    conn = current_app.connection
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM Turnos_Asignados
                WHERE ID_Usuario = %s
            """, (id_usuario,))
            turnos = cursor.fetchall()
            return jsonify(turnos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Ver horario semanal
@empleado_bp.route('/horario/<int:id_usuario>', methods=['GET'])
def obtener_horario(id_usuario):
    conn = current_app.connection
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM Horarios
                WHERE ID_Usuario = %s
            """, (id_usuario,))
            horario = cursor.fetchall()
            return jsonify(horario), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Ver notificaciones
@empleado_bp.route('/notificaciones/<int:id_usuario>', methods=['GET'])
def obtener_notificaciones(id_usuario):
    conn = current_app.connection
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM Notificaciones
                WHERE ID_Usuario = %s
                ORDER BY Fecha DESC
            """, (id_usuario,))
            notificaciones = cursor.fetchall()
            return jsonify(notificaciones), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
