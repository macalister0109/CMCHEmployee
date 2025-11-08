from database import db
from datetime import datetime
import os

class Archivo(db.Model):
    __tablename__ = 'Archivos'
    id_archivo = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), nullable=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), nullable=True)
    tipo = db.Column(db.String(50), nullable=False)  # cv, foto_perfil, certificado, logo
    nombre_original = db.Column(db.String(255), nullable=False)
    nombre_sistema = db.Column(db.String(255), nullable=False)  # UUID + extensión
    mimetype = db.Column(db.String(100), nullable=False)
    tamanio = db.Column(db.Integer, nullable=False)  # en bytes
    fecha_subida = db.Column(db.DateTime, default=datetime.utcnow)
    metadata = db.Column(db.JSON, nullable=True)  # datos adicionales como dimensiones para imágenes
    ruta_almacenamiento = db.Column(db.String(500), nullable=False)
    hash_archivo = db.Column(db.String(64), nullable=False)  # SHA-256 para verificar integridad
    activo = db.Column(db.Boolean, default=True)

    def ruta_completa(self):
        """Retorna la ruta completa del archivo en el sistema"""
        from flask import current_app
        return os.path.join(current_app.config['UPLOAD_FOLDER'], self.ruta_almacenamiento, self.nombre_sistema)