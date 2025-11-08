from database import db

# Sistema de usuarios
class Pais(db.Model):
    __tablename__ = 'Pais'
    id_pais = db.Column(db.Integer, primary_key=True)
    nombre_pais = db.Column(db.String(100), nullable=False)

class UsuarioAutorizado(db.Model):
    __tablename__ = 'UsuarioAutorizado'
    id_usuario_autorizado = db.Column(db.Integer, primary_key=True)
    tipo_documento = db.Column(db.String(20), nullable=False)
    numero_documento = db.Column(db.String(30), unique=True, nullable=False)

class Usuarios(db.Model):
    __tablename__ = 'Usuarios'
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(70), nullable=False)
    password = db.Column(db.String(300), nullable=False)
    correo = db.Column(db.String(100), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=False)
    Pais_id_pais = db.Column(db.Integer, db.ForeignKey('Pais.id_pais'), nullable=False)
    Rut_usuario = db.Column(db.String(30), db.ForeignKey('UsuarioAutorizado.numero_documento'), nullable=False)
    UsuarioAutorizado_ID = db.Column(db.Integer, db.ForeignKey('UsuarioAutorizado.id_usuario_autorizado'), nullable=False)