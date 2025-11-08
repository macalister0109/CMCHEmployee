from flask_sqlalchemy import SQLAlchemy

# Crear una única instancia de SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Inicializar la base de datos con la aplicación Flask"""
    db.init_app(app)
    
    # Importar modelos aquí para evitar referencias circulares
    from models.usuarios import Usuarios, UsuarioAutorizado, Pais
    from models.perfiles import Alumnos, Docentes, Exalumnos
    from models.empresas import Empresas, EmpresaNacional
    from models.postulaciones import PuestoDeTrabajo, Postulaciones
    
    with app.app_context():
        # Crear todas las tablas
        db.create_all()