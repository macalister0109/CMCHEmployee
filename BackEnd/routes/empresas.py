from flask import Blueprint, request, session, redirect, url_for, render_template, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from models.usuarios import db, Usuarios
from models.empresas import Empresas, EmpresaNacional, Empresarios
from models.postulaciones import Postulaciones, PuestoDeTrabajo
import re

empresas_bp = Blueprint('empresas', __name__)

@empresas_bp.route('/register_empresa', methods=['POST'])
def register_empresa():
    if request.is_json:
        return jsonify({'success': False, 'error': 'Registro vía app deshabilitado'}), 403

    # Obtener datos del formulario
    nombre_empresa = request.form.get('nombre_empresa')
    nombre_encargado = request.form.get('nombre_encargado')
    apellido_encargado = request.form.get('apellido_encargado')
    rut_empresa = request.form.get('rut_empresa')
    rut_encargado = request.form.get('rut_encargado')
    direccion = request.form.get('direccion') or '-'
    email = request.form.get('email') or request.form.get('correo_empresa')
    rubro = request.form.get('rubro') or '-'
    sitio_web = request.form.get('sitio_web') or '-'
    password = request.form.get('password')
    
    # Normalizar RUTs
    rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', rut_empresa)
    rut_encargado_normalizado = re.sub(r'[^0-9kK]', '', rut_encargado) if rut_encargado else None
    
    # Validaciones
    if not rut_encargado_normalizado:
        return render_template('login_empresa.html', error='El RUT del encargado es obligatorio', toggle=True)
    
    if not nombre_encargado or not apellido_encargado:
        return render_template('login_empresa.html', error='El nombre y apellido del encargado son obligatorios', toggle=True)
    
    if not email:
        email = f'empresa_{rut_empresa_normalizado}@example.com'
    
    # Verificar RUT empresa único
    existing = EmpresaNacional.query.filter_by(rut_empresa=rut_empresa_normalizado).first()
    if existing:
        return render_template('login_empresa.html', error='El RUT de empresa ya está registrado', toggle=True)
    
    # Verificar correo único
    existing_empresa = Empresas.query.filter_by(correo_empresa=email).first()
    if existing_empresa:
        return render_template('login_empresa.html', error='El correo electrónico ya está registrado', toggle=True)
    
    # Procesar empresa y encargado
    try:
        from routes.auth import get_default_pais_id
        
        # Crear o encontrar encargado
        from models.usuarios import UsuarioAutorizado
        auth = UsuarioAutorizado.query.filter_by(numero_documento=rut_encargado_normalizado).first()
        user_encargado = None
        
        if auth:
            user_encargado = Usuarios.query.filter_by(UsuarioAutorizado_ID=auth.id_usuario_autorizado).first()
        
        empresario_obj = None
        aviso = None
        
        if user_encargado:
            empresario_obj = Empresarios.query.get(user_encargado.id_usuario)
            if not empresario_obj:
                empresario_obj = Empresarios(
                    id_usuario=user_encargado.id_usuario,
                    empresa_principal=nombre_empresa,
                    cargo='Encargado'
                )
                db.session.add(empresario_obj)
                db.session.flush()
        else:
            new_auth = UsuarioAutorizado(tipo_documento='RUT', numero_documento=rut_encargado_normalizado)
            db.session.add(new_auth)
            db.session.flush()
            
            new_user = Usuarios(
                nombre=nombre_encargado,
                apellido=apellido_encargado,
                password=generate_password_hash('012345A'),
                correo=f'encargado_{rut_encargado_normalizado}@example.com',
                telefono='000000000',
                Pais_id_pais=get_default_pais_id(),
                Rut_usuario=new_auth.numero_documento,
                UsuarioAutorizado_ID=new_auth.id_usuario_autorizado
            )
            db.session.add(new_user)
            db.session.flush()
            
            new_empresario = Empresarios(
                id_usuario=new_user.id_usuario,
                empresa_principal=nombre_empresa,
                cargo='Encargado'
            )
            db.session.add(new_empresario)
            db.session.flush()
            empresario_obj = new_empresario
            aviso = f"Usuario encargado creado con RUT {rut_encargado_normalizado} y contraseña predeterminada: 012345A"
        
        # Validar contraseña empresa
        if not password or len(password) < 8:
            return render_template('login_empresa.html', error='La contraseña de empresa debe tener al menos 8 caracteres', toggle=True)
        
        # Crear empresa
        empresa = Empresas(
            nombre_empresa=nombre_empresa,
            rubro=rubro,
            direccion=direccion,
            telefono='000000000',
            correo_contacto=email,
            correo_empresa=email,
            cantidad_empleados=0,
            logo='-',
            sitio_web=sitio_web,
            estado_empresa='Activa',
            descripcion_empresa='-',
            tipo_empresa='Nacional',
            password_empresa=generate_password_hash(password),
            Pais_id_pais=get_default_pais_id(),
            Empresarios_id_usuario=empresario_obj.id_usuario
        )
        db.session.add(empresa)
        db.session.flush()
        
        # Crear subtipo nacional
        emp_nac = EmpresaNacional(id_empresa=empresa.id_empresa, rut_empresa=rut_empresa_normalizado)
        db.session.add(emp_nac)
        db.session.commit()
        
        # Iniciar sesión
        session['nombre'] = empresa.nombre_empresa
        session['apellido'] = ''
        session['user_id'] = None
        session['empresa_id'] = empresa.id_empresa
        
        return redirect(url_for('empresas.profile_empresa'))
        
    except Exception as e:
        db.session.rollback()
        error_msg = 'Error al registrar la empresa. Por favor, verifica los datos e intenta nuevamente.'
        
        if 'Duplicate entry' in str(e):
            if 'rut_empresa' in str(e):
                error_msg = 'El RUT de empresa ya está registrado'
            elif 'correo' in str(e):
                error_msg = 'El correo electrónico ya está registrado'
            elif 'numero_documento' in str(e):
                error_msg = 'Ya existe un usuario con ese documento de identidad'
            else:
                error_msg = 'Ya existe un registro con esos datos'
        
        return render_template('login_empresa.html', error=error_msg, toggle=True)

# Resto de rutas de empresas (login, perfil, etc)
@empresas_bp.route('/login_empresa', methods=['GET', 'POST'])
def login_empresa():
    if request.method == 'POST':
        is_json = request.is_json
        if is_json:
            data = request.get_json()
            rut_empresa = data.get('rut_empresa')
            password = data.get('password')
        else:
            rut_empresa = request.form.get('rut_empresa')
            password = request.form.get('password')
        
        if not rut_empresa or not password:
            error = 'Ingrese el RUT y la contraseña'
            if is_json:
                return jsonify({'success': False, 'error': error}), 400
            return render_template('login_empresa.html', error=error)
        
        rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', str(rut_empresa))
        emp_nac = EmpresaNacional.query.filter_by(rut_empresa=rut_empresa_normalizado).first()
        if not emp_nac:
            error = 'RUT de empresa no registrado o incorrecto'
            if is_json:
                return jsonify({'success': False, 'error': error}), 401
            return render_template('login_empresa.html', error=error)
        
        empresa = Empresas.query.get(emp_nac.id_empresa)
        if empresa and empresa.password_empresa:
            try:
                if check_password_hash(empresa.password_empresa, password):
                    session['nombre'] = empresa.nombre_empresa
                    session['apellido'] = ''
                    session['user_id'] = None
                    session['empresa_id'] = empresa.id_empresa
                    
                    if is_json:
                        return jsonify({
                            'success': True,
                            'message': f"Bienvenida empresa '{empresa.nombre_empresa}'",
                            'empresa': {
                                'id_empresa': empresa.id_empresa,
                                'nombre_empresa': empresa.nombre_empresa,
                                'rut_empresa': rut_empresa_normalizado
                            }
                        })
                    return redirect(url_for('empresas.profile_empresa'))
            except Exception:
                pass
        
        error = 'Contraseña incorrecta'
        if is_json:
            return jsonify({'success': False, 'error': error}), 401
        return render_template('login_empresa.html', error=error)
        
    return render_template('login_empresa.html')

@empresas_bp.route('/profile-empresa', methods=['GET', 'POST'])
def profile_empresa():
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return redirect(url_for('empresas.login_empresa'))
    
    empresa = Empresas.query.get(empresa_id)
    if request.method == 'POST':
        empresa.nombre_empresa = request.form.get('nombre_empresa') or empresa.nombre_empresa
        empresa.rubro = request.form.get('rubro') or empresa.rubro
        empresa.direccion = request.form.get('direccion') or empresa.direccion
        empresa.telefono = request.form.get('telefono') or empresa.telefono
        empresa.correo_empresa = request.form.get('correo_empresa') or empresa.correo_empresa
        empresa.sitio_web = request.form.get('sitio_web') or empresa.sitio_web
        empresa.descripcion_empresa = request.form.get('descripcion_empresa') or empresa.descripcion_empresa
        empresa.tipo_empresa = request.form.get('tipo_empresa') or empresa.tipo_empresa
        
        try:
            db.session.commit()
            return render_template('profile_empresa.html', empresa=empresa, success=True)
        except Exception as e:
            db.session.rollback()
            return render_template('profile_empresa.html', empresa=empresa, error=str(e))
    
    return render_template('profile_empresa.html', empresa=empresa)

# ... Más rutas de empresas según sea necesario