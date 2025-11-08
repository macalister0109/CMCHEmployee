from flask import Blueprint, request, session, jsonify
from models.postulaciones import db, Postulaciones
from models.empresas import PuestoDeTrabajo
from datetime import date

postulaciones_bp = Blueprint('postulaciones', __name__)

@postulaciones_bp.route('/postular/<int:job_id>', methods=['POST'])
def postular(job_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    job = PuestoDeTrabajo.query.get(job_id)
    if not job:
        return jsonify({'error': 'Puesto no encontrado'}), 404
    
    # Verificar si ya postuló
    existing = Postulaciones.query.filter_by(id_trabajo=job_id, id_usuario=user_id).first()
    if existing:
        return jsonify({'error': 'Ya has postulado a esta oferta'}), 400
    
    try:
        nueva = Postulaciones(
            id_trabajo=job_id,
            id_usuario=user_id,
            fecha_postulacion=date.today(),
            estado='Enviado'
        )
        db.session.add(nueva)
        db.session.commit()
        return jsonify({'success': True, 'id_postulacion': nueva.id_postulacion})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@postulaciones_bp.route('/mis_postulaciones')
def mis_postulaciones():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    try:
        postulaciones = Postulaciones.query.filter_by(id_usuario=user_id).all()
        return jsonify([{
            'id_postulacion': p.id_postulacion,
            'id_trabajo': p.id_trabajo,
            'fecha_postulacion': p.fecha_postulacion.isoformat(),
            'estado': p.estado
        } for p in postulaciones])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@postulaciones_bp.route('/api/puesto/<int:id>/postulantes', methods=['GET'])
def ver_postulantes(id):
    """Permite a una empresa ver los postulantes a uno de sus puestos"""
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return jsonify({'error': 'No autorizado'}), 401
    
    puesto = PuestoDeTrabajo.query.get(id)
    if not puesto or puesto.Empresas_id_empresa != empresa_id:
        return jsonify({'error': 'Puesto no encontrado o no autorizado'}), 404
    
    try:
        from models.usuarios import Usuarios
        from models.perfiles import Alumnos
        
        postulaciones = Postulaciones.query.filter_by(id_trabajo=id).all()
        postulantes = []
        
        for post in postulaciones:
            usuario = Usuarios.query.get(post.id_usuario)
            if usuario:
                alumno = Alumnos.query.get(usuario.id_usuario)
                postulantes.append({
                    'id_postulacion': post.id_postulacion,
                    'fecha_postulacion': post.fecha_postulacion.isoformat(),
                    'estado': post.estado,
                    'usuario': {
                        'id_usuario': usuario.id_usuario,
                        'nombre': usuario.nombre,
                        'apellido': usuario.apellido,
                        'correo': usuario.correo,
                        'telefono': usuario.telefono,
                        'carrera': alumno.carrera if alumno else None,
                        'anio_ingreso': alumno.anio_ingreso if alumno else None,
                        'experiencia_laboral': alumno.experiencia_laboral if alumno else None
                    }
                })
        
        return jsonify({
            'success': True,
            'puesto': {
                'id_trabajo': puesto.id_trabajo,
                'area_trabajo': puesto.area_trabajo,
                'descripcion_trabajo': puesto.descripcion_trabajo
            },
            'total_postulantes': len(postulantes),
            'postulantes': postulantes
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@postulaciones_bp.route('/api/postulacion/<int:id>', methods=['PUT'])
def cambiar_estado_postulacion(id):
    """Permite a una empresa cambiar el estado de una postulación"""
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return jsonify({'error': 'No autorizado'}), 401
    
    data = request.get_json() if request.is_json else request.form
    nuevo_estado = data.get('estado')
    
    if not nuevo_estado:
        return jsonify({'error': 'Estado requerido'}), 400
    
    estados_validos = ['Enviado', 'En Revisión', 'Aceptado', 'Rechazado', 'En Proceso']
    if nuevo_estado not in estados_validos:
        return jsonify({'error': f'Estado debe ser uno de: {", ".join(estados_validos)}'}), 400
    
    try:
        postulacion = Postulaciones.query.get(id)
        if not postulacion:
            return jsonify({'error': 'Postulación no encontrada'}), 404
        
        # Verificar que la empresa sea dueña del puesto
        puesto = PuestoDeTrabajo.query.get(postulacion.id_trabajo)
        if not puesto or puesto.Empresas_id_empresa != empresa_id:
            return jsonify({'error': 'No autorizado'}), 403
        
        postulacion.estado = nuevo_estado
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Estado actualizado a: {nuevo_estado}',
            'postulacion': {
                'id_postulacion': postulacion.id_postulacion,
                'estado': postulacion.estado
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500