from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session
from flask_sqlalchemy import SQLAlchemy  # Solo comentar uso, no eliminar
import os
import re
import json # Eliminar cuando usemos base de datos
from werkzeug.security import generate_password_hash, check_password_hash

# Configuración de rutas de templates y estaticos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_PAGES = os.path.join(BASE_DIR, '../FrontEnd/pages')
STATIC_FOLDER = os.path.join(FRONTEND_PAGES, 'assets')

app = Flask(__name__, template_folder=FRONTEND_PAGES, static_folder=STATIC_FOLDER)
app.secret_key = 'ClaveSuperSecreta'  # Cambia esto por una clave segura



# --- Configuración de base de datos ---
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:2218@localhost/CMCHEmployee'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
# --- Configuración de base de datos ---

# Archivo JSON para almacenar datos
JSON_DB_PATH = os.path.join(BASE_DIR, 'db.json')

# Funciones para manejar el archivo JSON

def load_db():
    if not os.path.exists(JSON_DB_PATH):
        return {"alumnos": [], "empresas": []}
    with open(JSON_DB_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_db(data):
    with open(JSON_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)



# --- Modelos ---
# class Alumnos(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     rut = db.Column(db.String(12), unique=True, nullable=False)
#     nombre = db.Column(db.String(100), nullable=False)
#     apellido = db.Column(db.String(100), nullable=False)
#     password = db.Column(db.String(255), nullable=False)
#
# class Empresa(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     nombre_empresa = db.Column(db.String(100), nullable=False)
#     nombre_encargado = db.Column(db.String(100), nullable=False)
#     rut_empresa = db.Column(db.String(12), unique=True, nullable=False)
#     rut_encargado = db.Column(db.String(12))
#     direccion = db.Column(db.String(255), nullable=False)
#     email = db.Column(db.String(100), nullable=False)
#     password = db.Column(db.String(255), nullable=False)
# --- Modelos ---

#Registro empresa 
@app.route('/register_empresa', methods=['GET', 'POST'])
def register_empresa():
    if request.method == 'POST':
        nombre_empresa = request.form.get('nombre_empresa')
        nombre_encargado = request.form.get('nombre_encargado')
        rut_empresa = request.form.get('rut_empresa')
        rut_encargado = request.form.get('rut_encargado')
        direccion = request.form.get('direccion')
        email = request.form.get('email')
        rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', rut_empresa)
        rut_encargado_normalizado = re.sub(r'[^0-9kK]', '', rut_encargado) if rut_encargado else None
        # Cargar base de datos JSON
        db_data = load_db()
        # Verifica que el rut de empresa sea unico
        if any(e['rut_empresa'] == rut_empresa_normalizado for e in db_data['empresas']):
            return render_template('register_empresa.html', error='El RUT de empresa ya está registrado')
        # Verifica que el rut encargado exista en Alumnos, si no lo crea
        aviso = None
        if rut_encargado_normalizado:
            user_encargado = next((a for a in db_data['alumnos'] if a['rut'] == rut_encargado_normalizado), None)
            if not user_encargado:
                password_pred = '012345A'
                hashed_pred = generate_password_hash(password_pred)
                nuevo_usuario = {
                    "rut": rut_encargado_normalizado,
                    "nombre": nombre_encargado,
                    "apellido": "",
                    "password": hashed_pred
                }
                db_data['alumnos'].append(nuevo_usuario)
                aviso = f"Usuario encargado creado con rut {rut_encargado_normalizado} y contraseña predeterminada: 012345A. Por favor cámbiala en modo usuario."
        # La contraseña de empresa es obligatoria
        password = request.form.get('password')
        if not password or len(password) < 8:
            return render_template('register_empresa.html', error='La contraseña de empresa debe tener al menos 8 caracteres')
        hashed_password = generate_password_hash(password)
        nueva_empresa = {
            "nombre_empresa": nombre_empresa,
            "nombre_encargado": nombre_encargado,
            "rut_empresa": rut_empresa_normalizado,
            "rut_encargado": rut_encargado_normalizado,
            "direccion": direccion,
            "email": email,
            "password": hashed_password
        }
        db_data['empresas'].append(nueva_empresa)
        save_db(db_data)
        bienvenida = f"Bienvenida empresa '{nombre_empresa}'"
        return render_template('main.html', bienvenida=bienvenida, aviso=aviso)
    return render_template('register_empresa.html')

#login empresa
@app.route('/login_empresa', methods=['GET', 'POST'])
def login_empresa():
    if request.method == 'POST':
        rut_empresa = request.form.get('rut_empresa')
        password = request.form.get('password')
        rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', rut_empresa)
        db_data = load_db()
        empresa = next((e for e in db_data['empresas'] if e['rut_empresa'] == rut_empresa_normalizado), None)
        if not empresa:
            return render_template('login_empresa.html', error='RUT de empresa no registrado o incorrecto')
        if not password or not check_password_hash(empresa['password'], password):
            return render_template('login_empresa.html', error='Contraseña incorrecta')
        bienvenida = f"Bienvenida empresa '{empresa['nombre_empresa']}'"
        return render_template('main.html', bienvenida=bienvenida)
    return render_template('login_empresa.html')

# Ruta principal
@app.route('/')
def main():
    nombre = session.get('nombre')
    apellido = session.get('apellido')
    return render_template('main.html', nombre=nombre, apellido=apellido)

# Página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        rut = request.form.get('rut')
        password = request.form.get('password')
        # hace que el rut se pueda ingresar sin puntos ni guiones
        rut_normalizado = re.sub(r'[^0-9kK]', '', rut)
        db_data = load_db()
        user = next((a for a in db_data['alumnos'] if a['rut'] == rut_normalizado), None)
        if not user:
            return render_template('login.html', error='RUT no registrado o formato incorrecto')
        if not password or not check_password_hash(user['password'], password):
            return render_template('login.html', error='Contraseña incorrecta')
        session['nombre'] = user['nombre']
        session['apellido'] = user['apellido']
        return redirect(url_for('main'))
    return render_template('login.html')

# Página de registro
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        rut = request.form.get('rut')
        nombre = request.form.get('nombre')
        apellido = request.form.get('apellido')
        password = request.form.get('password')
        # hace que el rut se pueda ingresar sin puntos ni guiones
        rut_normalizado = re.sub(r'[^0-9kK]', '', rut)
        # Verifica el largo de la contraseña
        if not password or len(password) < 8:
            return render_template('register.html', error='La contraseña debe tener al menos 8 caracteres')
        db_data = load_db()
        # Verifica que el rut sea unico
        if any(a['rut'] == rut_normalizado for a in db_data['alumnos']):
            return render_template('register.html', error='El RUT ya está registrado')
        hashed_password = generate_password_hash(password)
        nuevo = {
            "rut": rut_normalizado,
            "nombre": nombre,
            "apellido": apellido,
            "password": hashed_password
        }
        db_data['alumnos'].append(nuevo)
        save_db(db_data)
        session['nombre'] = nombre
        session['apellido'] = apellido
        return redirect(url_for('main'))
    return render_template('register.html')

# Definir carpeta de archivos estaticos
@app.route('/assets/<path:filename>')
def assets_files(filename):
    return send_from_directory(STATIC_FOLDER, filename)

# Cerrar sesión
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('main'))

if __name__ == '__main__':
    app.run(debug=True)