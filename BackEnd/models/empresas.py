from database import db
from .usuarios import Usuarios

class Empresarios(db.Model):
    __tablename__ = 'Empresarios'
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), primary_key=True)
    empresa_principal = db.Column(db.String(50), nullable=False)
    cargo = db.Column(db.String(50), nullable=False)

class Empresas(db.Model):
    __tablename__ = 'Empresas'
    id_empresa = db.Column(db.Integer, primary_key=True)
    nombre_empresa = db.Column(db.String(100), nullable=False)
    rubro = db.Column(db.String(200), nullable=False)
    direccion = db.Column(db.String(150), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    correo_contacto = db.Column(db.String(100), nullable=False)
    correo_empresa = db.Column(db.String(100), nullable=True)
    cantidad_empleados = db.Column(db.Integer)
    logo = db.Column(db.String(255), nullable=False)
    sitio_web = db.Column(db.String(255), nullable=False)
    estado_empresa = db.Column(db.String(50), nullable=False)
    descripcion_empresa = db.Column(db.String(1000), nullable=False)
    tipo_empresa = db.Column(db.String(20), nullable=False)
    password_empresa = db.Column(db.String(300), nullable=False)
    Pais_id_pais = db.Column(db.Integer, db.ForeignKey('Pais.id_pais'), nullable=False)
    Empresarios_id_usuario = db.Column(db.Integer, db.ForeignKey('Empresarios.id_usuario'), nullable=False)
    email_verificado = db.Column(db.Boolean, default=False)
    fecha_verificacion_email = db.Column(db.DateTime, nullable=True)

class EmpresaNacional(db.Model):
    __tablename__ = 'EmpresaNacional'
    id_empresa = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), primary_key=True)
    rut_empresa = db.Column(db.String(12), unique=True, nullable=False)

class PuestoDeTrabajo(db.Model):
    __tablename__ = 'PuestoDeTrabajo'
    id_trabajo = db.Column(db.Integer, primary_key=True)
    Empresas_id_empresa = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), nullable=False)
    area_trabajo = db.Column(db.String(50), nullable=False)
    region_trabajo = db.Column(db.String(50), nullable=False)
    comuna_trabajo = db.Column(db.String(50), nullable=False)
    modalidad_trabajo = db.Column(db.String(30), nullable=False)
    tipo_industria = db.Column(db.String(30), nullable=False)
    tamanio_empresa = db.Column(db.String(50), nullable=False)
    descripcion_trabajo = db.Column(db.String(300), nullable=False)
    calificaciones = db.Column(db.String(1000))
    fecha_publicacion = db.Column(db.Date, nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='Activo')
    
    # Relaciones
    empresa = db.relationship('Empresas', backref='puestos')
    postulaciones = db.relationship('Postulaciones', backref='puesto', lazy='joined')