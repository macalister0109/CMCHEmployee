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
    'STATIC_FOLDER': STATIC_FOLDER
}