from flask import Blueprint, jsonify, request, current_app
from flask_mail import Mail, Message
from models.notificaciones import Notificacion, NotificacionConfig
from models.usuarios import Usuarios
from models.empresas import Empresas
from database import db
from datetime import datetime
import json

notificaciones_bp = Blueprint('notificaciones', __name__)

# Configuración de email
mail = Mail()

def enviar_email(destinatario, asunto, contenido):
    try:
        msg = Message(
            asunto,
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[destinatario]
        )
        msg.body = contenido
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Error enviando email: {str(e)}")
        return False

def crear_notificacion(tipo, titulo, mensaje, usuario_id=None, empresa_id=None, datos_adicionales=None):
    try:
        # Crear notificación en sistema
        notif = Notificacion(
            usuario_id=usuario_id,
            empresa_id=empresa_id,
            tipo=tipo,
            titulo=titulo,
            mensaje=mensaje,
            datos_adicionales=datos_adicionales
        )
        db.session.add(notif)
        
        # Obtener configuración de notificaciones
        if usuario_id:
            config = NotificacionConfig.query.filter_by(usuario_id=usuario_id).first()
            destinatario = Usuarios.query.get(usuario_id)
        else:
            config = NotificacionConfig.query.filter_by(empresa_id=empresa_id).first()
            destinatario = Empresas.query.get(empresa_id)
        
        # Si no hay config, usar valores por defecto
        if not config:
            config = NotificacionConfig(
                usuario_id=usuario_id,
                empresa_id=empresa_id
            )
            db.session.add(config)
        
        # Enviar email si está habilitado
        if config.notif_email and destinatario:
            email = destinatario.correo if usuario_id else destinatario.correo_empresa
            if email:
                enviar_email(email, titulo, mensaje)
        
        db.session.commit()
        return notif
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creando notificación: {str(e)}")
        return None

@notificaciones_bp.route('/notificaciones', methods=['GET'])
def obtener_notificaciones():
    """Obtiene las notificaciones del usuario/empresa actual"""
    from flask import session
    
    user_id = session.get('user_id')
    empresa_id = session.get('empresa_id')
    
    if not user_id and not empresa_id:
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        if user_id:
            notifs = Notificacion.query.filter_by(usuario_id=user_id)
        else:
            notifs = Notificacion.query.filter_by(empresa_id=empresa_id)
            
        notifs = notifs.order_by(Notificacion.fecha_creacion.desc()).all()
        
        return jsonify({
            'success': True,
            'notificaciones': [{
                'id': n.id_notificacion,
                'tipo': n.tipo,
                'titulo': n.titulo,
                'mensaje': n.mensaje,
                'fecha': n.fecha_creacion.isoformat(),
                'leida': n.leida,
                'datos': n.datos_adicionales
            } for n in notifs]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notificaciones_bp.route('/notificaciones/configuracion', methods=['GET', 'PUT'])
def configuracion_notificaciones():
    """Obtiene o actualiza la configuración de notificaciones"""
    from flask import session
    
    user_id = session.get('user_id')
    empresa_id = session.get('empresa_id')
    
    if not user_id and not empresa_id:
        return jsonify({'error': 'No autorizado'}), 401
        
    if request.method == 'GET':
        config = NotificacionConfig.query.filter_by(
            usuario_id=user_id,
            empresa_id=empresa_id
        ).first()
        
        if not config:
            config = NotificacionConfig(
                usuario_id=user_id,
                empresa_id=empresa_id
            )
            db.session.add(config)
            db.session.commit()
        
        return jsonify({
            'success': True,
            'config': {
                'email': config.notif_email,
                'sistema': config.notif_sistema,
                'push': config.notif_push,
                'tipos': config.tipos_notificacion
            }
        })
    
    else:  # PUT
        try:
            data = request.get_json()
            config = NotificacionConfig.query.filter_by(
                usuario_id=user_id,
                empresa_id=empresa_id
            ).first()
            
            if not config:
                config = NotificacionConfig(
                    usuario_id=user_id,
                    empresa_id=empresa_id
                )
                db.session.add(config)
            
            if 'email' in data:
                config.notif_email = data['email']
            if 'sistema' in data:
                config.notif_sistema = data['sistema']
            if 'push' in data:
                config.notif_push = data['push']
            if 'tipos' in data:
                config.tipos_notificacion.update(data['tipos'])
            
            db.session.commit()
            return jsonify({'success': True})
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@notificaciones_bp.route('/notificaciones/marcar-leida/<int:id>', methods=['PUT'])
def marcar_leida(id):
    """Marca una notificación como leída"""
    from flask import session
    
    user_id = session.get('user_id')
    empresa_id = session.get('empresa_id')
    
    if not user_id and not empresa_id:
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        notif = Notificacion.query.get(id)
        if not notif:
            return jsonify({'error': 'Notificación no encontrada'}), 404
            
        # Verificar propiedad
        if (user_id and notif.usuario_id != user_id) or \
           (empresa_id and notif.empresa_id != empresa_id):
            return jsonify({'error': 'No autorizado'}), 403
        
        notif.leida = True
        notif.fecha_lectura = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500