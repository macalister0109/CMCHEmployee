from flask import Blueprint, request, current_app, send_file, jsonify
from werkzeug.utils import secure_filename
from models.archivos import Archivo, db
import os
import uuid
import hashlib
from PIL import Image
import magic
import shutil

archivos_bp = Blueprint('archivos', __name__)

ALLOWED_EXTENSIONS = {
    'imagen': {'png', 'jpg', 'jpeg', 'gif'},
    'documento': {'pdf', 'doc', 'docx'},
    'cv': {'pdf', 'doc', 'docx'},
    'certificado': {'pdf'}
}

def allowed_file(filename, tipo):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS.get(tipo, set())

def get_file_hash(file_path):
    """Calcula el hash SHA-256 de un archivo"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def process_image(file_path, max_size=(800, 800)):
    """Procesa una imagen para optimizarla"""
    try:
        with Image.open(file_path) as img:
            # Convertir a RGB si es necesario
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Redimensionar si es más grande que max_size
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size)
            
            # Guardar con optimización
            img.save(file_path, 'JPEG', quality=85, optimize=True)
            return True
    except Exception as e:
        current_app.logger.error(f"Error procesando imagen: {str(e)}")
        return False

@archivos_bp.route('/upload/<tipo>', methods=['POST'])
def upload_file(tipo):
    """Sube un archivo al sistema"""
    from flask import session
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not allowed_file(file.filename, tipo):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        # Crear nombre único para el archivo
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        nuevo_nombre = f"{uuid.uuid4()}.{ext}"
        
        # Crear estructura de directorios
        año_mes = datetime.now().strftime('%Y/%m')
        ruta_relativa = os.path.join(tipo, año_mes)
        ruta_absoluta = os.path.join(current_app.config['UPLOAD_FOLDER'], ruta_relativa)
        os.makedirs(ruta_absoluta, exist_ok=True)
        
        # Guardar archivo temporalmente
        temp_path = os.path.join(ruta_absoluta, 'temp_' + nuevo_nombre)
        file.save(temp_path)
        
        # Verificar tipo MIME
        mime = magic.Magic(mime=True)
        file_type = mime.from_file(temp_path)
        
        if not file_type.startswith(('image/', 'application/pdf', 'application/msword')):
            os.remove(temp_path)
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Procesar imagen si es necesario
        if file_type.startswith('image/'):
            process_image(temp_path)
        
        # Mover a ubicación final
        ruta_final = os.path.join(ruta_absoluta, nuevo_nombre)
        shutil.move(temp_path, ruta_final)
        
        # Calcular hash y tamaño
        file_hash = get_file_hash(ruta_final)
        file_size = os.path.getsize(ruta_final)
        
        # Crear registro en base de datos
        archivo = Archivo(
            usuario_id=session.get('user_id'),
            empresa_id=session.get('empresa_id'),
            tipo=tipo,
            nombre_original=filename,
            nombre_sistema=nuevo_nombre,
            mimetype=file_type,
            tamanio=file_size,
            ruta_almacenamiento=ruta_relativa,
            hash_archivo=file_hash,
            metadata={
                'subido_por': 'usuario' if session.get('user_id') else 'empresa'
            }
        )
        
        db.session.add(archivo)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'archivo': {
                'id': archivo.id_archivo,
                'nombre': archivo.nombre_original,
                'tipo': archivo.tipo,
                'fecha': archivo.fecha_subida.isoformat()
            }
        })
        
    except Exception as e:
        db.session.rollback()
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        current_app.logger.error(f"Error en upload: {str(e)}")
        return jsonify({'error': str(e)}), 500

@archivos_bp.route('/download/<int:id>')
def download_file(id):
    """Descarga un archivo del sistema"""
    from flask import session
    
    try:
        archivo = Archivo.query.get_or_404(id)
        
        # Verificar permisos
        if archivo.usuario_id and archivo.usuario_id != session.get('user_id'):
            return jsonify({'error': 'No autorizado'}), 403
        if archivo.empresa_id and archivo.empresa_id != session.get('empresa_id'):
            return jsonify({'error': 'No autorizado'}), 403
        
        # Verificar integridad
        actual_hash = get_file_hash(archivo.ruta_completa())
        if actual_hash != archivo.hash_archivo:
            return jsonify({'error': 'Archivo corrupto'}), 500
        
        return send_file(
            archivo.ruta_completa(),
            download_name=archivo.nombre_original,
            as_attachment=True,
            mimetype=archivo.mimetype
        )
        
    except Exception as e:
        current_app.logger.error(f"Error en download: {str(e)}")
        return jsonify({'error': str(e)}), 500

@archivos_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_file(id):
    """Elimina un archivo del sistema"""
    from flask import session
    
    try:
        archivo = Archivo.query.get_or_404(id)
        
        # Verificar permisos
        if archivo.usuario_id and archivo.usuario_id != session.get('user_id'):
            return jsonify({'error': 'No autorizado'}), 403
        if archivo.empresa_id and archivo.empresa_id != session.get('empresa_id'):
            return jsonify({'error': 'No autorizado'}), 403
        
        # Eliminar archivo físico
        if os.path.exists(archivo.ruta_completa()):
            os.remove(archivo.ruta_completa())
        
        # Marcar como inactivo en la base de datos
        archivo.activo = False
        db.session.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error en delete: {str(e)}")
        return jsonify({'error': str(e)}), 500