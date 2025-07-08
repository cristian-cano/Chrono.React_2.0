from flask import Blueprint, request, jsonify, current_app
import pymysql

empleado_bp = Blueprint('empleado_bp', __name__, url_prefix='/empleado')

# Enviar solicitud
@empleado_bp.route('/solicitud', methods=['POST'])
def crear_solicitud():
    data = request.get_json()
    id_usuario = data.get('id_usuario')
    tipo = data.get('tipo')
    motivo = data.get('motivo')
    fecha = data.get('fecha')

    if not all([id_usuario, tipo, motivo, fecha]):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = current_app.connection
    try:
        conn.ping(reconnect=True)
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO Solicitudes (ID_Usuario, Tipo, Motivo, Fecha, Estado)
                VALUES (%s, %s, %s, %s, 'Pendiente')
            """, (id_usuario, tipo, motivo, fecha))
            conn.commit()
            return jsonify({'success': 'Solicitud enviada correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500

# Enviar solicitud a la tabla TipoPermiso
@empleado_bp.route('/solicitud', methods=['POST'])
def crear_solicitud():
    data = request.get_json()
    id_usuario = data.get('ID_Usuario')
    tipo = data.get('tipo')
    mensaje = data.get('mensaje')
    fecha = data.get('Fecha_Solicitud')
    id_departamento = data.get('id_departamento')

    if not all([id_usuario, tipo, mensaje, fecha, id_departamento]):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = current_app.connection
    try:
        conn.ping(reconnect=True)
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO TipoPermiso (ID_Usuario, id_departamento, tipo, mensaje, Fecha_Solicitud, estado)
                VALUES (%s, %s, %s, %s, %s, 'Pendiente')
            """, (id_usuario, id_departamento, tipo, mensaje, fecha))
            conn.commit()
            return jsonify({'success': 'Solicitud enviada correctamente'}), 201
    except Exception as e:
        conn.rollback()
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
