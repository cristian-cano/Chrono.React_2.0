import pymysql
from config import Config

# Conexión global reutilizable
connection = pymysql.connect(
    host=Config.MYSQL_HOST,
    user=Config.MYSQL_USER,
    password=Config.MYSQL_PASSWORD,
    db=Config.MYSQL_DB,
    cursorclass=pymysql.cursors.DictCursor
)
