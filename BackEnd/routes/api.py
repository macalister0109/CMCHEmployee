from flask import Blueprint, jsonify
from models.empresas import Empresas, PuestoDeTrabajo

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/empresas')
def empresas():
    try:
        empresas = Empresas.query.all()
        return jsonify([{
            'id_empresa': e.id_empresa,
            'nombre_empresa': e.nombre_empresa,
            'rubro': e.rubro,
            'direccion': e.direccion,
            'telefono': e.telefono,
            'correo_contacto': e.correo_contacto,
            'cantidad_empleados': e.cantidad_empleados,
            'logo': e.logo,
            'sitio_web': e.sitio_web,
            'estado_empresa': e.estado_empresa,
            'descripcion_empresa': e.descripcion_empresa,
            'tipo_empresa': e.tipo_empresa
        } for e in empresas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/api/empresa/<int:id>')
def empresa(id):
    try:
        empresa = Empresas.query.get_or_404(id)
        puestos = PuestoDeTrabajo.query.filter_by(Empresas_id_empresa=id).all()
        
        return jsonify({
            'empresa': {
                'id_empresa': empresa.id_empresa,
                'nombre_empresa': empresa.nombre_empresa,
                'direccion': empresa.direccion,
                'telefono': empresa.telefono,
                'correo_contacto': empresa.correo_contacto
            },
            'puestos': [{
                'id_trabajo': p.id_trabajo,
                'area_trabajo': p.area_trabajo,
                'region_trabajo': p.region_trabajo,
                'comuna_trabajo': p.comuna_trabajo,
                'modalidad_trabajo': p.modalidad_trabajo,
                'descripcion_trabajo': p.descripcion_trabajo,
                'calificaciones': p.calificaciones
            } for p in puestos]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/api/puestos')
def puestos():
    try:
        empresa_id = request.args.get('empresa_id', type=int)
        query = PuestoDeTrabajo.query
        
        if empresa_id:
            query = query.filter_by(Empresas_id_empresa=empresa_id)
        
        puestos = query.all()
        return jsonify([{
            'id_trabajo': p.id_trabajo,
            'empresa_id': p.Empresas_id_empresa,
            'area_trabajo': p.area_trabajo,
            'region_trabajo': p.region_trabajo,
            'comuna_trabajo': p.comuna_trabajo,
            'modalidad_trabajo': p.modalidad_trabajo,
            'descripcion_trabajo': p.descripcion_trabajo,
            'calificaciones': p.calificaciones
        } for p in puestos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500