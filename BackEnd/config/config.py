import os

# Rutas de templates y estáticos
BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
FRONTEND_PAGES = os.path.join(BASE_DIR, '../FrontEnd/pages')
STATIC_FOLDER = os.path.join(FRONTEND_PAGES, 'assets')

# Configuración básica
SECRET_KEY = os.environ.get('SECRET_KEY', 'ClaveSuperSecreta')
DATABASE_URL = os.environ.get('DATABASE_URL', 'mysql+pymysql://root@localhost/CMCHEmployee')

# Configuración de la aplicación
config = {
    'SQLALCHEMY_DATABASE_URI': DATABASE_URL,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'TEMPLATE_FOLDER': FRONTEND_PAGES,
    'STATIC_FOLDER': STATIC_FOLDER,
    
    # Configuración de email
    'MAIL_SERVER': os.environ.get('MAIL_SERVER', 'smtp.gmail.com'),
    'MAIL_PORT': int(os.environ.get('MAIL_PORT', 587)),
    'MAIL_USE_TLS': True,
    'MAIL_USERNAME': os.environ.get('MAIL_USERNAME'),
    'MAIL_PASSWORD': os.environ.get('MAIL_PASSWORD'),
    'MAIL_DEFAULT_SENDER': os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@cmchemployee.com'),
    
    # URL del sitio para enlaces en emails
    'SITE_URL': os.environ.get('SITE_URL', 'http://localhost:5000')
}