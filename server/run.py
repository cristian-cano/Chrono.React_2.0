import pymysql
from flask import Flask
from flask_cors import CORS
from config import Config
from controllers.user_controller import user_bp
from db_connection import connection  # Usamos la conexión existente

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)


# Conexión a base de datos
def conectar_bd():
    return pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )

app.connection = conectar_bd()


# Registrar rutas
app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(debug=True)
