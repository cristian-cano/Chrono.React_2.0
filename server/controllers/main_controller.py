from flask import Blueprint, render_template, redirect, url_for, session, request, flash, current_app
from werkzeug.security import check_password_hash

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return render_template('IndexChronoGuard.html')

@main_bp.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Buscar al usuario en la base de datos
        conn = current_app.connection
        with conn.cursor() as cur:
            cur.execute("SELECT id, password_hash, rol FROM Usuarios WHERE email=%s", (email,))
            user = cur.fetchone()

        if not user or not check_password_hash(user['password_hash'], password):
            flash('Correo o contraseña incorrectos', 'danger')
            return redirect(url_for('main.login'))

        # Credenciales válidas: guardar en sesión
        session['user_id']   = user['id']
        session['user_role'] = user['rol']  # Asume que 'rol' viene como string: e.g. 'Admin'

        # Redirigir según rol
        if user['rol'] == 'Admin':
            return redirect(url_for('admin.dashboard'))
        else:
            return redirect(url_for('main.home'))

    # GET
    return render_template('iniciosesion.html')


@main_bp.route('/registro')
def registro():
    return render_template('registro.html')

@main_bp.route('/admin')
def admin_panel():
    # Ya no lo usamos para login; mejor que todo pase por /login
    return redirect(url_for('admin.dashboard'))


# secretaria

@main_bp.route('/secretaria')
def secretaria_dashboard():
    return render_template('Secretaria/secretaria.html')

@main_bp.route('/secretaria/turnos')
def gestion_turnos():
    return render_template('Secretaria/GestionTurnos.html')

@main_bp.route('/secretaria/notificaciones')
def enviar_notificaciones():
    return render_template('Secretaria/EnviarNotificaciones.html')

@main_bp.route('/secretaria/reportes')
def generar_reportes():
    return render_template('Secretaria/GenerarInformes.html')

#empleados

@main_bp.route('/empleados')
def empleados_dashboard():
    return render_template('Empleados/RegistroAsistencia.html')

@main_bp.route('/empleados/registro')
def gestion_asistencia():
    return render_template('Empleados/RegistroAsistencia.html')

@main_bp.route('/empleados/horarios')
def gestion_horarios():
    return render_template('Empleados/ConsultarHorarios.html')

@main_bp.route('/empleados/turnos')
def Solicitudes():
    return render_template('Empleados/Solicitudes.html')

@main_bp.route('/empleados/Historial')
def historial():
    return render_template('Empleados/HistorialPersonal.html')

@main_bp.route('/empleados/Notificaciones')
def notif():
    return render_template('Empleados/Notificaciones.html')