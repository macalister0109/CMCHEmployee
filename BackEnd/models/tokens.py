from database import db
from datetime import datetime, timedelta

class Token(db.Model):
    __tablename__ = 'Tokens'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario', ondelete='CASCADE'), nullable=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa', ondelete='CASCADE'), nullable=True)
    token = db.Column(db.String(100), unique=True, nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # reset_password, verify_email
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_expiracion = db.Column(db.DateTime, nullable=False)
    usado = db.Column(db.Boolean, default=False)

    @staticmethod
    def generar_token(usuario_id=None, empresa_id=None, tipo='verify_email', horas_validez=24):
        from utils.email_service import generate_token
        
        # Eliminar tokens anteriores del mismo tipo para este usuario/empresa
        Token.query.filter_by(
            usuario_id=usuario_id,
            empresa_id=empresa_id,
            tipo=tipo,
            usado=False
        ).delete()
        
        nuevo_token = Token(
            usuario_id=usuario_id,
            empresa_id=empresa_id,
            token=generate_token(),
            tipo=tipo,
            fecha_expiracion=datetime.utcnow() + timedelta(hours=horas_validez)
        )
        db.session.add(nuevo_token)
        db.session.commit()
        return nuevo_token.token

    @staticmethod
    def verificar_token(token_str, tipo):
        token = Token.query.filter_by(
            token=token_str,
            tipo=tipo,
            usado=False
        ).first()
        
        if not token:
            return None
            
        if datetime.utcnow() > token.fecha_expiracion:
            return None
            
        token.usado = True
        db.session.commit()
        return token