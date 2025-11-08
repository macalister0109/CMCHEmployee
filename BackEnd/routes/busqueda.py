from flask import Blueprint, render_template, request, jsonify
from models.postulaciones import PuestoDeTrabajo
from models.empresas import Empresas
from database import db

busqueda_bp = Blueprint('busqueda', __name__)

@busqueda_bp.route('/resultados-busqueda')
def resultados_busqueda():
    # Obtener parámetros de búsqueda
    query = request.args.get('q', '').strip()
    region = request.args.get('region', '').strip()
    modalidad = request.args.get('modalidad', '').strip()
    area = request.args.get('area', '').strip()
    empresa_id = request.args.get('empresa_id')

    print(f"Parámetros de búsqueda recibidos: query={query}, region={region}, modalidad={modalidad}, area={area}, empresa_id={empresa_id}")

    # Construir la consulta base con join a la tabla de empresas
    busqueda = PuestoDeTrabajo.query.join(
        Empresas,
        PuestoDeTrabajo.Empresas_id_empresa == Empresas.id_empresa
    ).filter(PuestoDeTrabajo.estado == 'Activo')

    # Aplicar filtros si se proporcionan
    if empresa_id:
        busqueda = busqueda.filter(PuestoDeTrabajo.Empresas_id_empresa == empresa_id)
    
    if query:
        busqueda = busqueda.filter(
            db.or_(
                PuestoDeTrabajo.descripcion_trabajo.ilike(f'%{query}%'),
                PuestoDeTrabajo.area_trabajo.ilike(f'%{query}%'),
                PuestoDeTrabajo.tipo_industria.ilike(f'%{query}%'),
                Empresas.nombre_empresa.ilike(f'%{query}%')
            )
        )
    
    if region and region != 'Todas las regiones' and region != 'Todo Chile':
        busqueda = busqueda.filter(PuestoDeTrabajo.region_trabajo.ilike(f'%{region}%'))
    
    if modalidad and modalidad != 'Todas las modalidades' and modalidad != 'Todos':
        busqueda = busqueda.filter(PuestoDeTrabajo.modalidad_trabajo.ilike(f'%{modalidad}%'))
    
    if area:
        busqueda = busqueda.filter(PuestoDeTrabajo.area_trabajo.ilike(f'%{area}%'))

    # Ejecutar la consulta
    resultados = busqueda.order_by(PuestoDeTrabajo.fecha_publicacion.desc()).all()
    
    print(f"Encontrados {len(resultados)} resultados")

    # Si es una solicitud AJAX, devolver JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        try:
            data = {
                'success': True,
                'resultados': [
                    {
                        'id': puesto.id_trabajo,
                        'titulo': puesto.area_trabajo,
                        'empresa': Empresas.query.get(puesto.Empresas_id_empresa).nombre_empresa if puesto.Empresas_id_empresa else 'Empresa no disponible',
                        'modalidad': puesto.modalidad_trabajo,
                        'region': puesto.region_trabajo,
                        'descripcion': puesto.descripcion_trabajo,
                        'fecha_publicacion': puesto.fecha_publicacion.isoformat() if puesto.fecha_publicacion else None,
                        'tipo_industria': puesto.tipo_industria,
                        'comuna': puesto.comuna_trabajo,
                        'tamanio_empresa': puesto.tamanio_empresa,
                        'calificaciones': puesto.calificaciones
                    }
                    for puesto in resultados
                ]
            }
            print("Enviando respuesta JSON:", data)
            return jsonify(data)
        except Exception as e:
            print(f"Error al generar JSON: {str(e)}")
            return jsonify({'success': False, 'error': str(e)}), 500

    # Si es una solicitud normal, renderizar template
    return render_template(
        'resultados_busqueda.html',
        query=query,
        region=region,
        modalidad=modalidad,
        area=area,
        resultados=resultados
    )