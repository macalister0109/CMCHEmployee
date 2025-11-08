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
    nombre_empresa = request.form.get('nombre_empresa', '').strip()
    rut_empresa = request.form.get('rut_empresa', '').strip()
    correo_empresa = request.form.get('correo_empresa', '').strip()
    nombre_encargado = request.form.get('nombre_encargado', '').strip()
    apellido_encargado = request.form.get('apellido_encargado', '').strip()
    rut_encargado = request.form.get('rut_encargado', '').strip()
    password = request.form.get('password', '').strip()
    
    print("Datos recibidos del formulario:")
    print(f"Nombre empresa: {nombre_empresa}")
    print(f"RUT empresa: {rut_empresa}")
    print(f"Correo empresa: {correo_empresa}")
    print(f"Nombre encargado: {nombre_encargado}")
    print(f"Apellido encargado: {apellido_encargado}")
    print(f"RUT encargado: {rut_encargado}")
    print(f"Password length: {len(password)}")
    
    # Validar campos obligatorios
    if not nombre_empresa:
        return render_template('login_empresa.html', error='El nombre de la empresa es obligatorio', toggle=True)
    
    if not rut_empresa:
        return render_template('login_empresa.html', error='El RUT de la empresa es obligatorio', toggle=True)
    
    if not correo_empresa:
        return render_template('login_empresa.html', error='El correo de la empresa es obligatorio', toggle=True)
    
    if not nombre_encargado:
        return render_template('login_empresa.html', error='El nombre del encargado es obligatorio', toggle=True)
    
    if not apellido_encargado:
        return render_template('login_empresa.html', error='El apellido del encargado es obligatorio', toggle=True)
    
    if not rut_encargado:
        return render_template('login_empresa.html', error='El RUT del encargado es obligatorio', toggle=True)
    
    if not password:
        return render_template('login_empresa.html', error='La contraseña es obligatoria', toggle=True)
    
    if len(password) < 8:
        return render_template('login_empresa.html', error='La contraseña debe tener al menos 8 caracteres', toggle=True)
    
    # Normalizar RUTs
    rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', rut_empresa)
    rut_encargado_normalizado = re.sub(r'[^0-9kK]', '', rut_encargado)
    
    # Verificar RUT empresa único
    existing = EmpresaNacional.query.filter_by(rut_empresa=rut_empresa_normalizado).first()
    if existing:
        return render_template('login_empresa.html', error='El RUT de empresa ya está registrado', toggle=True)
    
    # Verificar correo único
    existing_empresa = Empresas.query.filter_by(correo_empresa=correo_empresa).first()
    if existing_empresa:
        return render_template('login_empresa.html', error='El correo electrónico ya está registrado', toggle=True)
    
    # Procesar empresa y encargado
    try:
        from routes.auth import get_default_pais_id
        pais_id = get_default_pais_id()
        if not pais_id:
            return render_template('login_empresa.html', error='Error: No se pudo determinar el país', toggle=True)
            
        print(f"Iniciando registro de empresa: {nombre_empresa}")
        print(f"RUT empresa: {rut_empresa_normalizado}")
        print(f"Correo empresa: {correo_empresa}")
        print(f"RUT encargado: {rut_encargado_normalizado}")
        print(f"País ID: {pais_id}")
        
        # Crear o encontrar encargado
        from models.usuarios import UsuarioAutorizado
        
        print("Buscando o creando usuario autorizado...")
        # Crear o encontrar UsuarioAutorizado
        auth = UsuarioAutorizado.query.filter_by(numero_documento=rut_encargado_normalizado).first()
        if not auth:
            auth = UsuarioAutorizado(tipo_documento='RUT', numero_documento=rut_encargado_normalizado)
            db.session.add(auth)
            db.session.flush()
            print(f"Creado nuevo UsuarioAutorizado con ID: {auth.id_usuario_autorizado}")
        else:
            print(f"Encontrado UsuarioAutorizado existente con ID: {auth.id_usuario_autorizado}")

        # Crear o encontrar Usuario
        print("Buscando o creando usuario...")
        user = Usuarios.query.filter_by(UsuarioAutorizado_ID=auth.id_usuario_autorizado).first()
        if not user:
            user = Usuarios(
                nombre=nombre_encargado,
                apellido=apellido_encargado,
                password=generate_password_hash(password),  # Usar la contraseña proporcionada
                correo=f'encargado_{rut_encargado_normalizado}@cmchemployee.com',
                telefono='Sin especificar',
                Pais_id_pais=pais_id,
                Rut_usuario=auth.numero_documento,
                UsuarioAutorizado_ID=auth.id_usuario_autorizado,
                email_verificado=False
            )
            db.session.add(user)
            db.session.flush()
            print(f"Creado nuevo Usuario con ID: {user.id_usuario}")
        else:
            print(f"Encontrado Usuario existente con ID: {user.id_usuario}")

        # Crear o encontrar Empresario
        print("Buscando o creando empresario...")
        empresario_obj = Empresarios.query.filter_by(id_usuario=user.id_usuario).first()
        if not empresario_obj:
            empresario_obj = Empresarios(
                id_usuario=user.id_usuario,
                empresa_principal=nombre_empresa,
                cargo='Encargado'
            )
            db.session.add(empresario_obj)
            db.session.flush()
            print(f"Creado nuevo Empresario para usuario {user.id_usuario}")
        else:
            print(f"Encontrado Empresario existente para usuario {user.id_usuario}")
        
        aviso = None
        if not user.email_verificado:
            aviso = "Se enviará un correo de verificación al encargado."
        
        # Validar contraseña empresa
        if not password or len(password) < 8:
            return render_template('login_empresa.html', error='La contraseña de empresa debe tener al menos 8 caracteres', toggle=True)
        
        print(f"Creando empresa con encargado ID: {empresario_obj.id_usuario}")
        
        # Crear empresa con solo los campos esenciales
        empresa = Empresas(
            nombre_empresa=nombre_empresa,
            rubro='-',
            direccion='-',
            telefono='-',
            correo_contacto=correo_empresa,
            correo_empresa=correo_empresa,
            cantidad_empleados=0,
            logo='default-logo.png',
            sitio_web='-',
            estado_empresa='Activa',
            descripcion_empresa='-',
            tipo_empresa='Nacional',
            password_empresa=generate_password_hash(password),
            Pais_id_pais=pais_id,
            Empresarios_id_usuario=empresario_obj.id_usuario,
            email_verificado=False
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
        
        flash('Empresa registrada exitosamente. Bienvenido(a) a Legado TP.', 'success')
        return redirect(url_for('main'))
        
    except Exception as e:
        db.session.rollback()
        print(f"Error detallado: {str(e)}")  # Imprime el error completo en la consola
        error_msg = 'Error al registrar la empresa. Por favor, verifica los datos e intenta nuevamente.'
        
        error_details = str(e).lower()  # Convertir a minúsculas para hacer la búsqueda más fácil
        
        if 'duplicate entry' in error_details:
            if 'rut_empresa' in error_details:
                error_msg = 'El RUT de empresa ya está registrado'
            elif 'correo' in error_details:
                error_msg = 'El correo electrónico ya está registrado'
            elif 'numero_documento' in error_details:
                error_msg = 'Ya existe un usuario con ese documento de identidad'
            else:
                error_msg = 'Ya existe un registro con esos datos'
        elif 'foreign key constraint' in error_details:
            if 'pais_id_pais' in error_details:
                error_msg = 'Error: País no válido'
            elif 'empresarios_id_usuario' in error_details:
                error_msg = 'Error al crear el perfil del empresario'
            else:
                error_msg = f'Error de referencia en la base de datos: {str(e)}'
        elif 'null' in error_details:
            error_msg = 'Error: Algunos campos requeridos están vacíos'
        
        print(f"Mensaje de error para usuario: {error_msg}")  # Imprime el mensaje que verá el usuario
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

@empresas_bp.route('/dashboard-empresa')
def dashboard_empresa():
    empresa_id = session.get('empresa_id')
    if not empresa_id:
        return redirect(url_for('empresas.login_empresa'))
    
    empresa = Empresas.query.get(empresa_id)
    if not empresa:
        session.clear()
        return redirect(url_for('empresas.login_empresa'))
    
    # Obtener trabajos publicados por la empresa
    trabajos = PuestoDeTrabajo.query.filter_by(Empresas_id_empresa=empresa_id).all()
    
    # Obtener postulaciones a trabajos de la empresa
    postulaciones = Postulaciones.query.join(
        PuestoDeTrabajo, 
        Postulaciones.id_trabajo == PuestoDeTrabajo.id_trabajo
    ).filter(
        PuestoDeTrabajo.Empresas_id_empresa == empresa_id
    ).all()
    
    # Contar las estadísticas
    total_postulaciones = len(postulaciones)
    pendientes = sum(1 for p in postulaciones if p.estado == 'Enviado')
    aceptados = sum(1 for p in postulaciones if p.estado == 'Aceptado')
    
    return render_template(
        'dashboard_empresa.html',
        empresa=empresa,
        empresa_id=empresa_id,
        nombre_empresa=empresa.nombre_empresa,
        trabajos=trabajos,
        postulaciones=postulaciones,
        total_ofertas=len(trabajos),
        total_postulaciones=total_postulaciones,
        pendientes=pendientes,
        aceptados=aceptados
    )

# Ruta para listar todas las empresas
@empresas_bp.route('/empresas')
def listar_empresas():
    try:
        empresas = Empresas.query.filter_by(estado_empresa='Activa').all()
        
        # Si es una solicitud AJAX, devolver JSON
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({
                'success': True,
                'empresas': [{
                    'id': empresa.id_empresa,
                    'nombre': empresa.nombre_empresa,
                    'rubro': empresa.rubro,
                    'descripcion': empresa.descripcion_empresa,
                    'logo': empresa.logo,
                    'sitio_web': empresa.sitio_web
                } for empresa in empresas]
            })
        
        # Si no es AJAX, renderizar la plantilla
        return render_template('empresas.html', empresas=empresas)
    except Exception as e:
        print(f"Error al listar empresas: {str(e)}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'success': False, 'error': str(e)}), 500
        return render_template('error.html', error='Error al cargar las empresas'), 500