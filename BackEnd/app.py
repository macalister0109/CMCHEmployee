from flask import Flask, request, render_template, redirect, url_for, jsonify, session, send_from_directory
import os
import re
import logging
import traceback
from datetime import datetime, date
import json
from collections import defaultdict
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, db

# Rutas de templates y estáticos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_PAGES = os.path.join(BASE_DIR, "../FrontEnd/pages")
STATIC_FOLDER = os.path.join(FRONTEND_PAGES, "assets")

def create_app():
    app = Flask(__name__, template_folder=FRONTEND_PAGES, static_folder=STATIC_FOLDER)

    # Habilitar CORS para desarrollo
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    # Configuración de la aplicación
    app.secret_key = os.environ.get("SECRET_KEY", "ClaveSuperSecreta")
    DATABASE_URL = os.environ.get("DATABASE_URL", "mysql+pymysql://root@localhost/CMCHEmployee")
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializar la base de datos
    init_db(app)

    # Configuración de logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("cmchemployee")

    return app

app = create_app()

# Importar modelos (después de inicializar app)
from models.usuarios import Usuarios, UsuarioAutorizado, Pais
from models.perfiles import Alumnos, Docentes, Exalumnos 
from models.empresas import Empresas, EmpresaNacional
from models.postulaciones import PuestoDeTrabajo, Postulaciones

# Sistema de seguimiento de IPs (en memoria)
ip_tracker = defaultdict(lambda: {"count": 0, "last_seen": None, "pages": set()})

def get_client_ip():
    """Obtiene la IP real del cliente, incluso detrás de proxies"""
    if request.headers.get("X-Forwarded-For"):
        return request.headers.get("X-Forwarded-For").split(",")[0].strip()
    elif request.headers.get("X-Real-IP"):
        return request.headers.get("X-Real-IP")
    return request.remote_addr or "Unknown"

@app.before_request
def track_visitor():
    """Registra cada visita de IP en la terminal"""
    if request.path.startswith("/assets/") or request.path.startswith("/static/"):
        return
    
    ip = get_client_ip()
    endpoint = request.endpoint or request.path
    method = request.method
    
    ip_tracker[ip]["count"] += 1
    ip_tracker[ip]["last_seen"] = datetime.now()
    ip_tracker[ip]["pages"].add(endpoint)
    
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f" [{timestamp}] {ip}  {method} {endpoint} (visita #{ip_tracker[ip]['count']})")

# Utilidades de base de datos
def test_db_connection():
    """Ejecuta una consulta ligera para probar la conexión."""
    try:
        with db.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        raise

def ensure_db_created():
    """Crea todas las tablas si no existen."""
    db.create_all()

def get_default_pais_id():
    """Return an existing Pais id for Chile or create it if it does not exist."""
    pais = Pais.query.filter_by(nombre_pais="Chile").first()
    if pais:
        return pais.id_pais
    # if no Chile, try to get any pais
    any_pais = Pais.query.first()
    if any_pais:
        return any_pais.id_pais
    # create Chile as fallback
    new_pais = Pais(nombre_pais="Chile")
    db.session.add(new_pais)
    db.session.commit()
    return new_pais.id_pais

# Importar y registrar blueprints
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.empresas import empresas_bp
from routes.usuarios import usuarios_bp
from routes.postulaciones import postulaciones_bp
from routes.busqueda import busqueda_bp

app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(auth_bp)
app.register_blueprint(empresas_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(postulaciones_bp)
app.register_blueprint(busqueda_bp)

# Manejador de errores para JSON
@app.errorhandler(404)
def not_found_error(error):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': False, 'error': 'Recurso no encontrado'}), 404
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500
    return render_template('500.html'), 500# Definir carpeta de archivos estáticos
@app.route("/assets/<path:filename>")
def assets_files(filename):
    return send_from_directory(STATIC_FOLDER, filename)

# Ruta principal
@app.route("/")
def main():
    nombre = session.get("nombre")
    apellido = session.get("apellido")
    empresa_id = session.get("empresa_id")
    
    bienvenida = None
    if empresa_id and nombre:
        bienvenida = f"Bienvenida empresa '{nombre}'"
    
    return render_template("main.html", 
                         nombre=nombre, 
                         apellido=apellido, 
                         empresa_id=empresa_id,
                         bienvenida=bienvenida)

if __name__ == "__main__":
    # Probar conexión y crear tablas antes de iniciar
    try:
        with app.app_context():
            test_db_connection()
            ensure_db_created()
        print("Conexión a la base de datos OK. Tablas creadas/comprobadas.")
    except Exception as e:
        print("ERROR: No se pudo conectar a la base de datos. Revisa DATABASE_URL y que el servidor MySQL esté activo.")
        print("Detalle:", e)
        # Modo degradado si ALLOW_NO_DB está establecido
        allow_no_db = os.environ.get("ALLOW_NO_DB", "0")
        if allow_no_db in ("1", "true", "True"):
            print("ALERT: Se iniciará la aplicación sin conexión a la base de datos por ALLOW_NO_DB.")
        else:
            raise
            
    app.run(debug=True)
