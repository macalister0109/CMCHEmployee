from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://**:**@localhost/**' 
#'mysql+pymysql://usuario:contraseña@localhost/nombre_bd' Ejemplo  (Cambiar luego)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Alumnos(db.Model):
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	rut = db.Column(db.String(12), unique=True, nullable=False)
	nombre = db.Column(db.String(100), nullable=False)
	apellido = db.Column(db.String(100), nullable=False)

@app.route('/')
def index():
	return 'Todo Funcando'

if __name__ == '__main__':
	app.run(debug=True)
