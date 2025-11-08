from flask_migrate import Migrate
from sqlalchemy import text
import os
import subprocess
from datetime import datetime

def init_migrations(app, db):
    """Inicializa el sistema de migraciones"""
    return Migrate(app, db)

def create_backup(app, database_uri):
    """Crea un backup de la base de datos"""
    try:
        # Crear directorio de backups si no existe
        backup_dir = os.path.join(app.instance_path, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # Nombre del archivo de backup
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = os.path.join(backup_dir, f'backup_{timestamp}.sql')
        
        # Extraer credenciales de DATABASE_URI
        from urllib.parse import urlparse
        url = urlparse(database_uri)
        db_name = url.path[1:]  # Remover el slash inicial
        username = url.username
        password = url.password
        host = url.hostname
        port = url.port or 3306
        
        # Comando mysqldump
        cmd = [
            'mysqldump',
            f'-h{host}',
            f'-P{port}',
            f'-u{username}',
            f'-p{password}',
            '--databases',
            db_name,
            '--add-drop-database',
            '--add-drop-table',
            '--triggers',
            '--routines',
            '--events',
            '--single-transaction',
            f'--result-file={backup_file}'
        ]
        
        # Ejecutar backup
        subprocess.run(cmd, check=True)
        
        app.logger.info(f'Backup creado exitosamente: {backup_file}')
        return True
        
    except Exception as e:
        app.logger.error(f'Error creando backup: {str(e)}')
        return False

def restore_backup(app, backup_file, database_uri):
    """Restaura un backup de la base de datos"""
    try:
        # Verificar que el archivo existe
        if not os.path.exists(backup_file):
            raise FileNotFoundError(f'Archivo de backup no encontrado: {backup_file}')
        
        # Extraer credenciales
        from urllib.parse import urlparse
        url = urlparse(database_uri)
        username = url.username
        password = url.password
        host = url.hostname
        port = url.port or 3306
        
        # Comando mysql
        cmd = [
            'mysql',
            f'-h{host}',
            f'-P{port}',
            f'-u{username}',
            f'-p{password}',
        ]
        
        # Ejecutar restore
        with open(backup_file, 'r') as f:
            subprocess.run(cmd, stdin=f, check=True)
        
        app.logger.info(f'Backup restaurado exitosamente desde: {backup_file}')
        return True
        
    except Exception as e:
        app.logger.error(f'Error restaurando backup: {str(e)}')
        return False

def optimize_tables(db):
    """Optimiza las tablas de la base de datos"""
    try:
        # Obtener lista de tablas
        result = db.session.execute(text('SHOW TABLES'))
        tables = [row[0] for row in result]
        
        # Optimizar cada tabla
        for table in tables:
            db.session.execute(text(f'OPTIMIZE TABLE {table}'))
        
        db.session.commit()
        return True
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error optimizando tablas: {str(e)}')
        return False

def check_database_health(db):
    """Verifica la salud de la base de datos"""
    try:
        results = {
            'status': 'healthy',
            'issues': []
        }
        
        # Verificar conexión
        db.session.execute(text('SELECT 1'))
        
        # Verificar tablas
        table_check = db.session.execute(text('CHECK TABLE users, empresas, postulaciones'))
        for result in table_check:
            if result.Msg_type == 'error':
                results['issues'].append({
                    'type': 'table_error',
                    'table': result.Table,
                    'message': result.Msg_text
                })
                results['status'] = 'issues_found'
        
        # Verificar índices
        for table in ['users', 'empresas', 'postulaciones']:
            indexes = db.session.execute(text(f'SHOW INDEX FROM {table}'))
            if not any(idx.Key_name == 'PRIMARY' for idx in indexes):
                results['issues'].append({
                    'type': 'missing_primary_key',
                    'table': table
                })
                results['status'] = 'issues_found'
        
        return results
        
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def create_database_indexes(db):
    """Crea índices optimizados en la base de datos"""
    try:
        # Índices para búsqueda de usuarios
        db.session.execute(text('''
            CREATE INDEX IF NOT EXISTS idx_usuarios_busqueda 
            ON Usuarios (nombre, apellido, correo)
        '''))
        
        # Índices para postulaciones
        db.session.execute(text('''
            CREATE INDEX IF NOT EXISTS idx_postulaciones_usuario 
            ON Postulaciones (id_usuario, fecha_postulacion)
        '''))
        
        # Índices para empresas
        db.session.execute(text('''
            CREATE INDEX IF NOT EXISTS idx_empresas_busqueda 
            ON Empresas (nombre_empresa, rubro, estado_empresa)
        '''))
        
        db.session.commit()
        return True
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creando índices: {str(e)}')
        return False