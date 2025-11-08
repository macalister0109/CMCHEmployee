from flask import Blueprint, request, render_template, redirect, url_for, flash, jsonify, current_app
from models.usuarios import Usuarios
from models.empresas import Empresas
from models.tokens import Token
from utils.email_service import send_email, get_reset_password_template, get_verification_email_template
from werkzeug.security import generate_password_hash
from datetime import datetime
from database import db

recovery_bp = Blueprint('recovery', __name__)

@recovery_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Inicia el proceso de recuperación de contraseña"""
    data = request.get_json() if request.is_json else request.form
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email requerido'}), 400
        
    # Buscar usuario o empresa
    usuario = Usuarios.query.filter_by(correo=email).first()
    empresa = None if usuario else Empresas.query.filter_by(correo_empresa=email).first()
    
    if not usuario and not empresa:
        return jsonify({'error': 'Email no encontrado'}), 404
        
    try:
        # Generar token
        token = Token.generar_token(
            usuario_id=usuario.id_usuario if usuario else None,
            empresa_id=empresa.id_empresa if empresa else None,
            tipo='reset_password',
            horas_validez=1
        )
        
        # Enviar email
        nombre = usuario.nombre if usuario else empresa.nombre_empresa
        template = get_reset_password_template(token, nombre)
        
        if send_email(email, 'Recuperación de Contraseña', template):
            return jsonify({
                'success': True,
                'message': 'Se ha enviado un email con instrucciones'
            })
        else:
            return jsonify({'error': 'Error enviando email'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error en recuperación: {str(e)}")
        return jsonify({'error': 'Error procesando solicitud'}), 500

@recovery_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    """Maneja el reseteo de contraseña"""
    if request.method == 'GET':
        # Verificar token
        token_obj = Token.verificar_token(token, 'reset_password')
        if not token_obj:
            flash('El enlace ha expirado o no es válido', 'error')
            return redirect(url_for('auth.login'))
        return render_template('reset_password.html', token=token)
    
    else:  # POST
        data = request.get_json() if request.is_json else request.form
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        if not password or not confirm_password:
            return jsonify({'error': 'Todos los campos son requeridos'}), 400
            
        if password != confirm_password:
            return jsonify({'error': 'Las contraseñas no coinciden'}), 400
            
        if len(password) < 8:
            return jsonify({'error': 'La contraseña debe tener al menos 8 caracteres'}), 400
        
        # Verificar token
        token_obj = Token.verificar_token(token, 'reset_password')
        if not token_obj:
            return jsonify({'error': 'Token inválido o expirado'}), 400
        
        try:
            # Actualizar contraseña
            if token_obj.usuario_id:
                usuario = Usuarios.query.get(token_obj.usuario_id)
                usuario.password = generate_password_hash(password)
            else:
                empresa = Empresas.query.get(token_obj.empresa_id)
                empresa.password_empresa = generate_password_hash(password)
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Contraseña actualizada correctamente'
            })
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error actualizando contraseña: {str(e)}")
            return jsonify({'error': 'Error actualizando contraseña'}), 500

@recovery_bp.route('/verify-email/<token>')
def verify_email(token):
    """Verifica el email de un usuario"""
    token_obj = Token.verificar_token(token, 'verify_email')
    if not token_obj:
        flash('El enlace ha expirado o no es válido', 'error')
        return redirect(url_for('auth.login'))
    
    try:
        if token_obj.usuario_id:
            usuario = Usuarios.query.get(token_obj.usuario_id)
            usuario.email_verificado = True
            usuario.fecha_verificacion_email = datetime.utcnow()
        else:
            empresa = Empresas.query.get(token_obj.empresa_id)
            empresa.email_verificado = True
            empresa.fecha_verificacion_email = datetime.utcnow()
        
        db.session.commit()
        flash('Email verificado correctamente', 'success')
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error verificando email: {str(e)}")
        flash('Error verificando email', 'error')
    
    return redirect(url_for('auth.login'))