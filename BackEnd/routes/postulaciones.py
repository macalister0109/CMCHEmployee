from flask import Blueprint, request, session, jsonify
from models.postulaciones import db, Postulaciones
from models.empresas import PuestoDeTrabajo
from datetime import date

postulaciones_bp = Blueprint('postulaciones', __name__, url_prefix='/api')

# Rutas para CRUD de puestos de trabajo
@postulaciones_bp.route('/empresa/mis-puestos', methods=['GET'])
def obtener_puestos():
    """Obtiene todos los puestos de una empresa"""
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 401

    try:
        puestos = PuestoDeTrabajo.query.filter_by(Empresas_id_empresa=empresa_id).all()
        return jsonify({
            'success': True,
            'puestos': [{
                'id_trabajo': p.id_trabajo,
                'area_trabajo': p.area_trabajo,
                'tipo_industria': p.tipo_industria,
                'region_trabajo': p.region_trabajo,
                'comuna_trabajo': p.comuna_trabajo,
                'modalidad_trabajo': p.modalidad_trabajo,
                'tamanio_empresa': p.tamanio_empresa,
                'descripcion_trabajo': p.descripcion_trabajo,
                'calificaciones': p.calificaciones,
                'total_postulaciones': len(p.postulaciones)
            } for p in puestos]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@postulaciones_bp.route('/puesto', methods=['POST'])
def crear_puesto():
    """Crea un nuevo puesto de trabajo"""
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 401

    try:
        data = request.get_json()
        nuevo_puesto = PuestoDeTrabajo(
            area_trabajo=data['area_trabajo'],
            tipo_industria=data['tipo_industria'],
            region_trabajo=data['region_trabajo'],
            comuna_trabajo=data['comuna_trabajo'],
            modalidad_trabajo=data['modalidad_trabajo'],
            tamanio_empresa=data['tamanio_empresa'],
            descripcion_trabajo=data['descripcion_trabajo'],
            calificaciones=data.get('calificaciones', ''),
            fecha_publicacion=date.today(),
            estado='Activo',
            Empresas_id_empresa=empresa_id
        )
        db.session.add(nuevo_puesto)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Puesto creado exitosamente',
            'id_trabajo': nuevo_puesto.id_trabajo
        })
    except KeyError as e:
        return jsonify({'success': False, 'error': f'Campo requerido faltante: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@postulaciones_bp.route('/puesto/<int:id>', methods=['PUT'])
def actualizar_puesto(id):
    """Actualiza un puesto de trabajo existente"""
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 401

    puesto = PuestoDeTrabajo.query.get(id)
    if not puesto or puesto.Empresas_id_empresa != empresa_id:
        return jsonify({'success': False, 'error': 'Puesto no encontrado o no autorizado'}), 404

    try:
        data = request.get_json()
        puesto.area_trabajo = data['area_trabajo']
        puesto.tipo_industria = data['tipo_industria']
        puesto.region_trabajo = data['region_trabajo']
        puesto.comuna_trabajo = data['comuna_trabajo']
        puesto.modalidad_trabajo = data['modalidad_trabajo']
        puesto.tamanio_empresa = data['tamanio_empresa']
        puesto.descripcion_trabajo = data['descripcion_trabajo']
        puesto.calificaciones = data.get('calificaciones', '')
        
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Puesto actualizado exitosamente'
        })
    except KeyError as e:
        return jsonify({'success': False, 'error': f'Campo requerido faltante: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@postulaciones_bp.route('/puesto/<int:id>', methods=['DELETE'])
def eliminar_puesto(id):
    """Elimina un puesto de trabajo"""
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return jsonify({'success': False, 'error': 'No autorizado'}), 401

    puesto = PuestoDeTrabajo.query.get(id)
    if not puesto or puesto.Empresas_id_empresa != empresa_id:
        return jsonify({'success': False, 'error': 'Puesto no encontrado o no autorizado'}), 404

    try:
        db.session.delete(puesto)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Puesto eliminado exitosamente'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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

@postulaciones_bp.route('/puesto/<int:id>/postulantes', methods=['GET'])
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

@postulaciones_bp.route('/postulacion/<int:id>', methods=['PUT'])
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