from flask import current_app
from functools import wraps
from flask import request, jsonify
import jwt
from datetime import datetime, timedelta
import redis
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS

# Configuración de Rate Limiting
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Configuración de Redis para blacklist de tokens
redis_client = redis.Redis(
    host=current_app.config.get('REDIS_HOST', 'localhost'),
    port=current_app.config.get('REDIS_PORT', 6379),
    db=current_app.config.get('REDIS_DB', 0)
)

def generate_token(user_id=None, empresa_id=None, exp_minutes=30):
    """Genera un token JWT"""
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(minutes=exp_minutes),
            'iat': datetime.utcnow(),
            'sub': str(user_id) if user_id else f"emp_{empresa_id}"
        }
        return jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return None

def token_required(f):
    """Decorador para proteger rutas con JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Obtener token
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Token malformado'}), 401
                
        if not token:
            return jsonify({'error': 'Token requerido'}), 401
            
        try:
            # Verificar si el token está en la blacklist
            if redis_client.get(token):
                return jsonify({'error': 'Token inválido'}), 401
                
            # Decodificar token
            data = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256']
            )
            
            # Agregar info a la request
            if data['sub'].startswith('emp_'):
                request.empresa_id = int(data['sub'].split('_')[1])
                request.user_id = None
            else:
                request.user_id = int(data['sub'])
                request.empresa_id = None
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
            
        return f(*args, **kwargs)
    return decorated

def init_security(app):
    """Inicializa las configuraciones de seguridad"""
    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', "*"),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configurar Limiter
    limiter.init_app(app)
    
    # Headers de seguridad
    @app.after_request
    def add_security_headers(response):
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response
        
    return app

def revoke_token(token):
    """Agrega un token a la blacklist"""
    try:
        # Decodificar token para obtener tiempo de expiración
        data = jwt.decode(
            token,
            current_app.config.get('SECRET_KEY'),
            algorithms=['HS256']
        )
        
        # Calcular tiempo restante
        exp = datetime.fromtimestamp(data['exp'])
        ttl = (exp - datetime.utcnow()).total_seconds()
        
        if ttl > 0:
            # Agregar a blacklist con TTL
            redis_client.setex(token, int(ttl), 'revoked')
        return True
    except Exception:
        return False