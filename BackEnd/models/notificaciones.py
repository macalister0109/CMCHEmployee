from database import db
from datetime import datetime

class Notificacion(db.Model):
    __tablename__ = 'Notificaciones'
    id_notificacion = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), nullable=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), nullable=True)
    tipo = db.Column(db.String(50), nullable=False)  # email, sistema, push
    titulo = db.Column(db.String(200), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_lectura = db.Column(db.DateTime, nullable=True)
    leida = db.Column(db.Boolean, default=False)
    datos_adicionales = db.Column(db.JSON, nullable=True)

class NotificacionConfig(db.Model):
    __tablename__ = 'NotificacionesConfig'
    id_config = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), nullable=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), nullable=True)
    notif_email = db.Column(db.Boolean, default=True)
    notif_sistema = db.Column(db.Boolean, default=True)
    notif_push = db.Column(db.Boolean, default=True)
    tipos_notificacion = db.Column(db.JSON, default=lambda: {
        "cambio_estado_postulacion": True,
        "nueva_oferta": True,
        "mensaje_nuevo": True,
        "actualizacion_perfil": True
    })