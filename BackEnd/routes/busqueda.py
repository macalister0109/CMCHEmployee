from flask import Blueprint, render_template, request, jsonify
from models.postulaciones import PuestoDeTrabajo
from models.empresas import Empresas

busqueda_bp = Blueprint('busqueda', __name__)

@busqueda_bp.route('/resultados-busqueda')
def resultados_busqueda():
    # Obtener parámetros de búsqueda
    query = request.args.get('q', '')
    region = request.args.get('region', '')
    modalidad = request.args.get('modalidad', '')
    area = request.args.get('area', '')

    # Construir la consulta base
    busqueda = PuestoDeTrabajo.query

    # Aplicar filtros si se proporcionan
    if query:
        busqueda = busqueda.filter(
            PuestoDeTrabajo.descripcion_trabajo.ilike(f'%{query}%')
        )
    if region:
        busqueda = busqueda.filter(
            PuestoDeTrabajo.region_trabajo.ilike(f'%{region}%')
        )
    if modalidad:
        busqueda = busqueda.filter(
            PuestoDeTrabajo.modalidad_trabajo.ilike(f'%{modalidad}%')
        )
    if area:
        busqueda = busqueda.filter(
            PuestoDeTrabajo.area_trabajo.ilike(f'%{area}%')
        )

    # Ejecutar la consulta
    resultados = busqueda.all()

    # Si es una solicitud AJAX, devolver JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({
            'resultados': [
                {
                    'id': puesto.id_puesto,
                    'titulo': puesto.area_trabajo,
                    'empresa': Empresas.query.get(puesto.Empresas_id_empresa).nombre_empresa,
                    'modalidad': puesto.modalidad_trabajo,
                    'region': puesto.region_trabajo,
                    'descripcion': puesto.descripcion_trabajo
                }
                for puesto in resultados
            ]
        })

    # Si es una solicitud normal, renderizar template
    return render_template(
        'resultados_busqueda.html',
        query=query,
        region=region,
        modalidad=modalidad,
        area=area,
        resultados=resultados
    )