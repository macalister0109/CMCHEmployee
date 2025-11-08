from flask import current_app
from flask_mail import Mail, Message
import secrets
import datetime

mail = Mail()

def send_email(to, subject, template):
    """Envía un email usando la configuración de Flask-Mail"""
    try:
        msg = Message(
            subject,
            recipients=[to],
            html=template,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Error enviando email: {str(e)}")
        return False

def generate_token(expiration=3600):
    """Genera un token seguro con expiración"""
    return secrets.token_urlsafe(32)

def get_reset_password_template(token, username):
    """Template HTML para email de recuperación de contraseña"""
    reset_url = f"{current_app.config['SITE_URL']}/reset-password/{token}"
    return f"""
    <h2>Recuperación de Contraseña - CMCHEmployee</h2>
    <p>Hola {username},</p>
    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
    <p>Para continuar, haz clic en el siguiente enlace (válido por 1 hora):</p>
    <p><a href="{reset_url}">{reset_url}</a></p>
    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    <p>Saludos,<br>Equipo CMCHEmployee</p>
    """

def get_verification_email_template(token, username):
    """Template HTML para email de verificación"""
    verify_url = f"{current_app.config['SITE_URL']}/verify-email/{token}"
    return f"""
    <h2>Verifica tu Email - CMCHEmployee</h2>
    <p>¡Bienvenido/a {username}!</p>
    <p>Gracias por registrarte. Para verificar tu cuenta, haz clic en el siguiente enlace:</p>
    <p><a href="{verify_url}">{verify_url}</a></p>
    <p>Este enlace expirará en 24 horas.</p>
    <p>Saludos,<br>Equipo CMCHEmployee</p>
    """