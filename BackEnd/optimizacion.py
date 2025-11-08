from functools import wraps
from flask import request, current_app, jsonify
from flask_caching import Cache
from werkzeug.contrib.cache import RedisCache
import gzip
import json

# Configuración de caché
cache = Cache(config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_HOST': 'localhost',
    'CACHE_REDIS_PORT': 6379,
    'CACHE_REDIS_DB': 1,
    'CACHE_DEFAULT_TIMEOUT': 300
})

def init_cache(app):
    """Inicializa el sistema de caché"""
    cache.init_app(app)
    return cache

class Paginator:
    def __init__(self, query, page=1, per_page=20, max_per_page=100):
        self.query = query
        self.page = max(1, page)
        self.per_page = min(per_page, max_per_page)
        self.max_per_page = max_per_page
        
    def paginate(self):
        """Pagina una consulta SQLAlchemy"""
        total = self.query.count()
        items = self.query.offset((self.page - 1) * self.per_page) \
                         .limit(self.per_page) \
                         .all()
                         
        return {
            'items': items,
            'total': total,
            'page': self.page,
            'per_page': self.per_page,
            'pages': (total + self.per_page - 1) // self.per_page
        }

def paginate(schema=None):
    """Decorador para paginar resultados"""
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            page = int(request.args.get('page', 1))
            per_page = min(
                int(request.args.get('per_page', 20)),
                current_app.config.get('MAX_PER_PAGE', 100)
            )
            
            result = f(*args, **kwargs)
            
            if isinstance(result, tuple):
                query = result[0]
                extra_args = result[1:]
            else:
                query = result
                extra_args = tuple()
                
            paginator = Paginator(query, page, per_page)
            pagination = paginator.paginate()
            
            if schema:
                items = schema.dump(pagination['items'], many=True)
            else:
                items = pagination['items']
                
            response = {
                'items': items,
                'meta': {
                    'total': pagination['total'],
                    'page': pagination['page'],
                    'per_page': pagination['per_page'],
                    'pages': pagination['pages']
                }
            }
            
            if extra_args:
                response.update(extra_args[0])
                
            return jsonify(response)
        return wrapped
    return decorator

def compress_response(f):
    """Decorador para comprimir respuestas"""
    @wraps(f)
    def wrapped(*args, **kwargs):
        response = f(*args, **kwargs)
        
        # Verificar si el cliente acepta gzip
        if not request.headers.get('Accept-Encoding', '').find('gzip') > -1:
            return response
            
        # No comprimir respuestas pequeñas
        if len(response.data) < 500:
            return response
            
        gzip_buffer = io.BytesIO()
        with gzip.GzipFile(mode='wb', fileobj=gzip_buffer) as gz:
            gz.write(response.data)
            
        response.data = gzip_buffer.getvalue()
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Vary'] = 'Accept-Encoding'
        response.headers['Content-Length'] = len(response.data)
        
        return response
    return wrapped

def cache_key():
    """Genera una clave de caché basada en la URL y argumentos"""
    args = request.args.copy()
    args.pop('page', None)  # Ignorar página para caché
    key = request.path + '?' + urllib.parse.urlencode(sorted(args.items()))
    return key

def cached(timeout=5 * 60, key_prefix='view/%s'):
    """Decorador para cachear vistas"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            cache_key = key_prefix % request.path
            rv = cache.get(cache_key)
            if rv is not None:
                return rv
            rv = f(*args, **kwargs)
            cache.set(cache_key, rv, timeout=timeout)
            return rv
        return decorated_function
    return decorator