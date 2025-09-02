from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://**:**@localhost/**' 
#'mysql+pymysql://usuario:contraseña@localhost/nombre_bd' Ejemplo  (Cambiar luego)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configuración de rutas de templates y estáticos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_PAGES = os.path.join(BASE_DIR, '../FrontEnd/pages')
STATIC_FOLDER = os.path.join(FRONTEND_PAGES, 'assets')

app = Flask(__name__, template_folder=FRONTEND_PAGES, static_folder=STATIC_FOLDER)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:2218@localhost/CMCHEmployee'
#'mysql+pymysql://usuario:contraseña@localhost/nombre_bd' Ejemplo  (Cambiar luego)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Alumnos(db.Model):
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	rut = db.Column(db.String(12), unique=True, nullable=False)
	nombre = db.Column(db.String(100), nullable=False)
	apellido = db.Column(db.String(100), nullable=False)
	password = db.Column(db.String(100), nullable=False)


# Ruta principal
@app.route('/')
def main():
	return render_template('main.html')

# Pagina de login
@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		# Aca iria la logica de autenticacion
		return redirect(url_for('main'))
	return render_template('login.html')

# Pagina de registro
@app.route('/register', methods=['GET', 'POST'])
def register():
	if request.method == 'POST':
		# aca iria la logica de registro
		return redirect(url_for('login'))
	return render_template('register.html')

# Definir carpeta de archivos estáticos
@app.route('/assets/<path:filename>')
def assets_files(filename):
	return send_from_directory(STATIC_FOLDER, filename)

if __name__ == '__main__':
	app.run(debug=True)
