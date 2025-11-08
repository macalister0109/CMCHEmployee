from database import db
from .usuarios import Usuarios

class Alumnos(db.Model):
    __tablename__ = 'Alumnos'
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario', ondelete='CASCADE'), primary_key=True)
    carrera = db.Column(db.String(100), nullable=True)
    anio_ingreso = db.Column(db.Integer, nullable=True)
    anio_egreso = db.Column(db.Integer, nullable=True)
    experiencia_laboral = db.Column(db.String(500), nullable=True)
    descripcion = db.Column(db.String(1000), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    foto_perfil = db.Column(db.String(255), nullable=True)
    ciudad = db.Column(db.String(100), nullable=True)
    region = db.Column(db.String(100), nullable=True)
    habilidades = db.Column(db.String(1000), nullable=True)
    nivel_estudios = db.Column(db.String(100), nullable=True)
    estado_profesional = db.Column(db.String(100), nullable=True)

class Docentes(db.Model):
    __tablename__ = 'Docentes'
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario', ondelete='CASCADE'), primary_key=True)
    institucional_id = db.Column(db.String(50), nullable=True)
    departamento = db.Column(db.String(100), nullable=True)
    area_academica = db.Column(db.String(100), nullable=True)
    cargo = db.Column(db.String(100), nullable=True)
    bio_academica = db.Column(db.String(2000), nullable=True)
    correo_institucional = db.Column(db.String(150), nullable=True)
    telefono_contacto = db.Column(db.String(30), nullable=True)
    oficina = db.Column(db.String(100), nullable=True)
    horario_atencion = db.Column(db.String(200), nullable=True)
    foto_perfil = db.Column(db.String(255), nullable=True)
    cv_url = db.Column(db.String(255), nullable=True)
    certificado_docente = db.Column(db.Boolean, default=False)

class Exalumnos(db.Model):
    __tablename__ = 'Exalumnos'
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario', ondelete='CASCADE'), primary_key=True)
    carrera = db.Column(db.String(100), nullable=True)
    anio_egreso = db.Column(db.Integer, nullable=True)
    estudiando = db.Column(db.Boolean, default=False, nullable=False)
    tipo_institucion = db.Column(db.String(100), nullable=True)
    casa_estudio = db.Column(db.String(250), nullable=True)
    trabajando = db.Column(db.Boolean, default=False, nullable=False)
    empresa_actual = db.Column(db.String(150), nullable=True)
    puesto_actual = db.Column(db.String(150), nullable=True)
    descripcion = db.Column(db.String(1000), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    foto_perfil = db.Column(db.String(255), nullable=True)
    ciudad = db.Column(db.String(100), nullable=True)
    region = db.Column(db.String(100), nullable=True)
    habilidades = db.Column(db.String(1000), nullable=True)