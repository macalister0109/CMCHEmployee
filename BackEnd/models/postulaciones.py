from database import db
from .empresas import PuestoDeTrabajo

class Postulaciones(db.Model):
    __tablename__ = 'Postulaciones'
    id_postulacion = db.Column(db.Integer, primary_key=True)
    id_trabajo = db.Column(db.Integer, db.ForeignKey('PuestoDeTrabajo.id_trabajo'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), nullable=False)
    fecha_postulacion = db.Column(db.Date, nullable=False)
    estado = db.Column(db.String(20))