from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import re
from datetime import date, datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text
from collections import defaultdict

# Rutas de templates y estáticos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_PAGES = os.path.join(BASE_DIR, '../FrontEnd/pages')
STATIC_FOLDER = os.path.join(FRONTEND_PAGES, 'assets')

app = Flask(__name__, template_folder=FRONTEND_PAGES, static_folder=STATIC_FOLDER)

app.secret_key = os.environ.get('SECRET_KEY', 'ClaveSuperSecreta')
DATABASE_URL = os.environ.get('DATABASE_URL', 'mysql+pymysql://root@localhost/CMCHEmployee')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Sistema de seguimiento de IPs (en memoria)
ip_tracker = defaultdict(lambda: {'count': 0, 'last_seen': None, 'pages': set()})

def get_client_ip():
    """Obtiene la IP real del cliente, incluso detrás de proxies"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    return request.remote_addr or 'Unknown'

@app.before_request
def track_visitor():
    """Registra cada visita de IP en la terminal"""
    # Ignorar archivos estáticos para no llenar la terminal
    if request.path.startswith('/assets/') or request.path.startswith('/static/'):
        return
    
    ip = get_client_ip()
    endpoint = request.endpoint or request.path
    method = request.method
    
    # Actualizar tracker
    ip_tracker[ip]['count'] += 1
    ip_tracker[ip]['last_seen'] = datetime.now()
    ip_tracker[ip]['pages'].add(endpoint)
    
    # Mostrar en terminal
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f"🌐 [{timestamp}] {ip} → {method} {endpoint} (visita #{ip_tracker[ip]['count']})")



# Modelos (basados en BD/diseniobasededatos.ddl)
class Pais(db.Model):
    __tablename__ = 'Pais'
    id_pais = db.Column(db.Integer, primary_key=True)
    nombre_pais = db.Column(db.String(100), nullable=False)


class UsuarioAutorizado(db.Model):
    __tablename__ = 'UsuarioAutorizado'
    id_usuario_autorizado = db.Column(db.Integer, primary_key=True)
    tipo_documento = db.Column(db.String(20), nullable=False)
    numero_documento = db.Column(db.String(30), unique=True, nullable=False)


class Usuarios(db.Model):
    __tablename__ = 'Usuarios'
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(70), nullable=False)
    password = db.Column(db.String(300), nullable=False)
    correo = db.Column(db.String(100), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=False)
    Pais_id_pais = db.Column(db.Integer, db.ForeignKey('Pais.id_pais'), nullable=False)
    Rut_usuario = db.Column(db.String(30), db.ForeignKey('UsuarioAutorizado.numero_documento'), nullable=False)
    UsuarioAutorizado_ID = db.Column(db.Integer, db.ForeignKey('UsuarioAutorizado.id_usuario_autorizado'), nullable=False)


class Alumnos(db.Model):
    __tablename__ = 'Alumnos'
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), primary_key=True)
    carrera = db.Column(db.String(50), nullable=False)
    anio_ingreso = db.Column(db.Integer, nullable=False)
    experiencia_laboral = db.Column(db.String(100), nullable=False)


class Empresarios(db.Model):
    __tablename__ = 'Empresarios'
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), primary_key=True)
    empresa_principal = db.Column(db.String(50), nullable=False)
    cargo = db.Column(db.String(50), nullable=False)


class Empresas(db.Model):
    __tablename__ = 'Empresas'
    id_empresa = db.Column(db.Integer, primary_key=True)
    nombre_empresa = db.Column(db.String(100), nullable=False)
    rubro = db.Column(db.String(200), nullable=False)
    direccion = db.Column(db.String(150), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    correo_contacto = db.Column(db.String(100), nullable=False)
    cantidad_empleados = db.Column(db.Integer)
    logo = db.Column(db.String(255), nullable=False)
    sitio_web = db.Column(db.String(255), nullable=False)
    estado_empresa = db.Column(db.String(50), nullable=False)
    descripcion_empresa = db.Column(db.String(1000), nullable=False)
    tipo_empresa = db.Column(db.String(20), nullable=False)
    password_empresa = db.Column(db.String(300), nullable=False)
    Pais_id_pais = db.Column(db.Integer, db.ForeignKey('Pais.id_pais'), nullable=False)
    Empresarios_id_usuario = db.Column(db.Integer, db.ForeignKey('Empresarios.id_usuario'), nullable=False)


class EmpresaNacional(db.Model):
    __tablename__ = 'EmpresaNacional'
    id_empresa = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), primary_key=True)
    rut_empresa = db.Column(db.String(12), unique=True, nullable=False)


class PuestoDeTrabajo(db.Model):
    __tablename__ = 'PuestoDeTrabajo'
    id_trabajo = db.Column(db.Integer, primary_key=True)
    Empresas_id_empresa = db.Column(db.Integer, db.ForeignKey('Empresas.id_empresa'), nullable=False)
    area_trabajo = db.Column(db.String(50), nullable=False)
    region_trabajo = db.Column(db.String(50), nullable=False)
    comuna_trabajo = db.Column(db.String(50), nullable=False)
    modalidad_trabajo = db.Column(db.String(30), nullable=False)
    tipo_industria = db.Column(db.String(30), nullable=False)
    tamanio_empresa = db.Column(db.String(50), nullable=False)
    descripcion_trabajo = db.Column(db.String(300), nullable=False)
    calificaciones = db.Column(db.String(1000))


class Postulaciones(db.Model):
    __tablename__ = 'Postulaciones'
    id_postulacion = db.Column(db.Integer, primary_key=True)
    id_trabajo = db.Column(db.Integer, db.ForeignKey('PuestoDeTrabajo.id_trabajo'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('Usuarios.id_usuario'), nullable=False)
    fecha_postulacion = db.Column(db.Date, nullable=False)
    estado = db.Column(db.String(20))

# Utilidades de base de datos
def test_db_connection():
    """Ejecuta una consulta ligera para probar la conexión."""
    try:
        with db.engine.connect() as conn:
            conn.execute(text('SELECT 1'))
    except Exception:
        raise

def ensure_db_created():
    db.create_all()


def get_default_pais_id():
    """Return an existing Pais id for 'Chile' or the first Pais id; create 'Chile' if no Pais exists."""
    pais = Pais.query.filter_by(nombre_pais='Chile').first()
    if pais:
        return pais.id_pais
    # if no 'Chile', try to get any pais
    any_pais = Pais.query.first()
    if any_pais:
        return any_pais.id_pais
    # create Chile as fallback
    new_pais = Pais(nombre_pais='Chile')
    db.session.add(new_pais)
    db.session.commit()
    return new_pais.id_pais

#Registro empresa 
@app.route('/register_empresa', methods=['GET', 'POST'])
def register_empresa():
    if request.method == 'POST':
        # Detectar si es JSON (desde app móvil) o form-data (desde web)
        is_json = request.is_json
        if is_json:
            data = request.get_json()
            nombre_empresa = data.get('nombre_empresa')
            nombre_encargado = data.get('nombre_encargado')
            apellido_encargado = data.get('apellido_encargado')
            rut_empresa = data.get('rut_empresa')
            rut_encargado = data.get('rut_encargado')
            direccion = data.get('direccion', '-')
            email = data.get('email')
            rubro = data.get('rubro', '-')
            sitio_web = data.get('sitio_web', '-')
            password = data.get('password')
        else:
            nombre_empresa = request.form.get('nombre_empresa')
            nombre_encargado = request.form.get('nombre_encargado')
            apellido_encargado = request.form.get('apellido_encargado')
            rut_empresa = request.form.get('rut_empresa')
            rut_encargado = request.form.get('rut_encargado')
            direccion = request.form.get('direccion') or '-'
            email = request.form.get('email') or request.form.get('correo_contacto')
            rubro = request.form.get('rubro') or '-'
            sitio_web = request.form.get('sitio_web') or '-'
            password = request.form.get('password')
        
        rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', rut_empresa)
        rut_encargado_normalizado = re.sub(r'[^0-9kK]', '', rut_encargado) if rut_encargado else None
        
        # Validar que el email no sea None (generar uno por defecto si no viene)
        if not email:
            email = f'empresa_{rut_empresa_normalizado}@example.com'
        
        # Verifica que el rut de empresa sea unico
        existing = EmpresaNacional.query.filter_by(rut_empresa=rut_empresa_normalizado).first()
        if existing:
            if is_json:
                return jsonify({'success': False, 'error': 'El RUT de empresa ya está registrado'}), 409
            return render_template('register_empresa.html', error='El RUT de empresa ya está registrado')
        
        aviso = None
        empresario_obj = None
        if rut_encargado_normalizado:
            # buscar usuario encargado por numero de documento
            auth = UsuarioAutorizado.query.filter_by(numero_documento=rut_encargado_normalizado).first()
            user_encargado = None
            if auth:
                user_encargado = Usuarios.query.filter_by(UsuarioAutorizado_ID=auth.id_usuario_autorizado).first()
            if user_encargado:
                empresario_obj = Empresarios.query.get(user_encargado.id_usuario)
            else:
                # crear UsuarioAutorizado y Usuario + Empresario
                new_auth = UsuarioAutorizado(tipo_documento='RUT', numero_documento=rut_encargado_normalizado)
                db.session.add(new_auth)
                db.session.flush()
                hashed_pred = generate_password_hash('012345A')
                new_user = Usuarios(nombre=nombre_encargado or 'Encargado', apellido=apellido_encargado or '', password=hashed_pred, correo=f'encargado_{rut_encargado_normalizado}@example.com', telefono='000000000', Pais_id_pais=get_default_pais_id(), Rut_usuario=new_auth.numero_documento, UsuarioAutorizado_ID=new_auth.id_usuario_autorizado)
                db.session.add(new_user)
                db.session.flush()
                new_empresario = Empresarios(id_usuario=new_user.id_usuario, empresa_principal=nombre_empresa, cargo='Encargado')
                db.session.add(new_empresario)
                db.session.flush()
                empresario_obj = new_empresario
                aviso = f"Usuario encargado creado con rut {rut_encargado_normalizado} y contraseña predeterminada: 012345A. Por favor cámbiala en modo usuario."
        else:
            # crear un empresario placeholder vinculado a un nuevo usuario administrador si no se proporcionó encargado
            placeholder_auth = UsuarioAutorizado(tipo_documento='RUT', numero_documento=f'admin-{nombre_empresa}')
            db.session.add(placeholder_auth)
            db.session.flush()
            hashed_pred = generate_password_hash('changeMe123')
            placeholder_user = Usuarios(nombre=f'{nombre_empresa} Admin', apellido=apellido_encargado or '', password=hashed_pred, correo=f'admin_{nombre_empresa.replace(" ","").lower()}@example.com', telefono='000000000', Pais_id_pais=get_default_pais_id(), Rut_usuario=placeholder_auth.numero_documento, UsuarioAutorizado_ID=placeholder_auth.id_usuario_autorizado)
            db.session.add(placeholder_user)
            db.session.flush()
            placeholder_emp = Empresarios(id_usuario=placeholder_user.id_usuario, empresa_principal=nombre_empresa, cargo='Administrador')
            db.session.add(placeholder_emp)
            db.session.flush()
            empresario_obj = placeholder_emp
        
        # La contraseña de empresa es obligatoria
        if not password or len(password) < 8:
            if is_json:
                return jsonify({'success': False, 'error': 'La contraseña de empresa debe tener al menos 8 caracteres'}), 400
            return render_template('register_empresa.html', error='La contraseña de empresa debe tener al menos 8 caracteres')
        
        hashed_password = generate_password_hash(password)
        # crear empresa y relaciones
        empresa = Empresas(
            nombre_empresa=nombre_empresa,
            rubro=rubro,
            direccion=direccion or '-',
            telefono='000000000',
            correo_contacto=email,
            cantidad_empleados=0,
            logo='-',
            sitio_web=sitio_web,
            estado_empresa='Activa',
            descripcion_empresa='-',
            tipo_empresa='Nacional',
            password_empresa=hashed_password,
            Pais_id_pais=get_default_pais_id(),
            Empresarios_id_usuario=empresario_obj.id_usuario
        )
        db.session.add(empresa)
        db.session.flush()
        # crear subtipo nacional
        emp_nac = EmpresaNacional(id_empresa=empresa.id_empresa, rut_empresa=rut_empresa_normalizado)
        db.session.add(emp_nac)
        db.session.commit()
        
        if is_json:
            return jsonify({
                'success': True,
                'message': f"Empresa '{nombre_empresa}' registrada exitosamente",
                'empresa': {
                    'id_empresa': empresa.id_empresa,
                    'nombre_empresa': nombre_empresa,
                    'rut_empresa': rut_empresa_normalizado
                },
                'aviso': aviso
            })
        
        bienvenida = f"Bienvenida empresa '{nombre_empresa}'"
        return render_template('main.html', bienvenida=bienvenida, aviso=aviso)
    return render_template('register_empresa.html')

#login empresa
@app.route('/login_empresa', methods=['GET', 'POST'])
def login_empresa():
    if request.method == 'POST':
        # Detectar si es JSON (desde app móvil) o form-data (desde web)
        is_json = request.is_json
        if is_json:
            data = request.get_json()
            rut_empresa = data.get('rut_empresa')
            password = data.get('password')
        else:
            rut_empresa = request.form.get('rut_empresa')
            password = request.form.get('password')
        
        # Validaciones básicas
        if not rut_empresa:
            if is_json:
                return jsonify({'success': False, 'error': 'Ingrese el RUT de la empresa'}), 400
            return render_template('login_empresa.html', error='Ingrese el RUT de la empresa')
        if not password:
            if is_json:
                return jsonify({'success': False, 'error': 'Ingrese la contraseña'}), 400
            return render_template('login_empresa.html', error='Ingrese la contraseña')
        
        # Normaliza el RUT y busca la entidad
        rut_empresa_normalizado = re.sub(r'[^0-9kK]', '', str(rut_empresa))
        emp_nac = EmpresaNacional.query.filter_by(rut_empresa=rut_empresa_normalizado).first()
        if not emp_nac:
            if is_json:
                return jsonify({'success': False, 'error': 'RUT de empresa no registrado o incorrecto'}), 401
            return render_template('login_empresa.html', error='RUT de empresa no registrado o incorrecto')
        
        empresa = Empresas.query.get(emp_nac.id_empresa)
        # Primero intentar validar con la contraseña de la empresa
        if empresa and empresa.password_empresa:
            try:
                if check_password_hash(empresa.password_empresa, password):
                    bienvenida = f"Bienvenida empresa '{empresa.nombre_empresa}'"
                    # set session as empresa administrador placeholder (no user id)
                    session['nombre'] = empresa.nombre_empresa
                    session['apellido'] = ''
                    session['user_id'] = None
                    session['empresa_id'] = empresa.id_empresa  # Guardar ID de empresa
                    
                    if is_json:
                        return jsonify({
                            'success': True,
                            'message': bienvenida,
                            'empresa': {
                                'id_empresa': empresa.id_empresa,
                                'nombre_empresa': empresa.nombre_empresa,
                                'rut_empresa': rut_empresa_normalizado
                            }
                        })
                    return redirect(url_for('dashboard_empresa'))
            except Exception:
                # Si hay cualquier error al chequear hash, continuamos con el flujo antiguo
                pass
        
        if not empresa:
            if is_json:
                return jsonify({'success': False, 'error': 'Empresa asociada no encontrada'}), 404
            return render_template('login_empresa.html', error='Empresa asociada no encontrada')
        
        # buscar empresario y usuario asociado (login por usuario empresario)
        empresario = None
        if empresa.Empresarios_id_usuario:
            empresario = Empresarios.query.get(empresa.Empresarios_id_usuario)
        user = None
        if empresario and empresario.id_usuario:
            user = Usuarios.query.get(empresario.id_usuario)
        if not user:
            if is_json:
                return jsonify({'success': False, 'error': 'Usuario empresario no disponible para esta empresa'}), 404
            return render_template('login_empresa.html', error='Usuario empresario no disponible para esta empresa')
        
        if not check_password_hash(user.password, password):
            if is_json:
                return jsonify({'success': False, 'error': 'Contraseña incorrecta'}), 401
            return render_template('login_empresa.html', error='Contraseña incorrecta')
        
        bienvenida = f"Bienvenida empresa '{empresa.nombre_empresa}'"
        session['nombre'] = user.nombre
        session['apellido'] = user.apellido
        session['user_id'] = user.id_usuario
        session['empresa_id'] = empresa.id_empresa  # Guardar ID de empresa
        
        if is_json:
            return jsonify({
                'success': True,
                'message': bienvenida,
                'empresa': {
                    'id_empresa': empresa.id_empresa,
                    'nombre_empresa': empresa.nombre_empresa,
                    'rut_empresa': rut_empresa_normalizado
                },
                'user': {
                    'nombre': user.nombre,
                    'apellido': user.apellido,
                    'user_id': user.id_usuario
                }
            })
        return redirect(url_for('dashboard_empresa'))
    return render_template('login_empresa.html')

# Ruta principal
@app.route('/')
def main():
    nombre = session.get('nombre')
    apellido = session.get('apellido')
    empresa_id = session.get('empresa_id')
    return render_template('main.html', nombre=nombre, apellido=apellido, empresa_id=empresa_id)

# Dashboard Empresa
@app.route('/dashboard-empresa')
def dashboard_empresa():
    """Dashboard para empresas autenticadas"""
    empresa_id = session.get('empresa_id')
    nombre_empresa = session.get('nombre')
    
    if not empresa_id:
        return redirect(url_for('login_empresa'))
    
    return render_template('dashboard_empresa.html', 
                         empresa_id=empresa_id,
                         nombre_empresa=nombre_empresa)

# Página de resultados de búsqueda
@app.route('/resultados-busqueda')
def resultados_busqueda():
    """Página de resultados de búsqueda"""
    query = request.args.get('q', '')
    region = request.args.get('region', '')
    modalidad = request.args.get('modalidad', '')
    area = request.args.get('area', '')
    user_id = session.get('user_id')
    nombre = session.get('nombre')
    apellido = session.get('apellido')
    
    return render_template('resultados_busqueda.html',
                         query=query,
                         region=region,
                         modalidad=modalidad,
                         area=area,
                         user_id=user_id,
                         nombre=nombre,
                         apellido=apellido)

# Página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Detectar si es JSON (desde app móvil) o form-data (desde web)
        is_json = request.is_json
        if is_json:
            data = request.get_json()
            rut = data.get('rut')
            password = data.get('password')
        else:
            rut = request.form.get('rut')
            password = request.form.get('password')
        
        # hace que el rut se pueda ingresar sin puntos ni guiones
        rut_normalizado = re.sub(r'[^0-9kK]', '', rut)
        # Buscar UsuarioAutorizado por numero_documento
        auth = UsuarioAutorizado.query.filter_by(numero_documento=rut_normalizado).first()
        if not auth:
            if is_json:
                return jsonify({'success': False, 'error': 'RUT no registrado o formato incorrecto'}), 401
            return render_template('login.html', error='RUT no registrado o formato incorrecto')
        
        user = Usuarios.query.filter_by(UsuarioAutorizado_ID=auth.id_usuario_autorizado).first()
        if not user or not password or not check_password_hash(user.password, password):
            if is_json:
                return jsonify({'success': False, 'error': 'Contraseña incorrecta'}), 401
            return render_template('login.html', error='Contraseña incorrecta')
        
        session['nombre'] = user.nombre
        session['apellido'] = user.apellido
        session['user_id'] = user.id_usuario
        
        if is_json:
            return jsonify({
                'success': True,
                'message': f'Bienvenido {user.nombre}!',
                'user': {
                    'nombre': user.nombre,
                    'apellido': user.apellido,
                    'user_id': user.id_usuario
                }
            })
        return redirect(url_for('main'))
    return render_template('login.html')

# Página de registro
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Detectar si es JSON (desde app móvil) o form-data (desde web)
        is_json = request.is_json
        if is_json:
            data = request.get_json()
            rut = data.get('rut')
            nombre = data.get('nombre')
            apellido = data.get('apellido')
            password = data.get('password')
        else:
            rut = request.form.get('rut')
            nombre = request.form.get('nombre')
            apellido = request.form.get('apellido')
            password = request.form.get('password')
        
        # hace que el rut se pueda ingresar sin puntos ni guiones
        rut_normalizado = re.sub(r'[^0-9kK]', '', rut)
        # Verifica el largo de la contraseña
        if not password or len(password) < 8:
            if is_json:
                return jsonify({'success': False, 'error': 'La contraseña debe tener al menos 8 caracteres'}), 400
            return render_template('login.html', error='La contraseña debe tener al menos 8 caracteres', is_register=True, toggle=True)
        
        # Verifica que el RUT esté autorizado en UsuarioAutorizado
        existing_auth = UsuarioAutorizado.query.filter_by(numero_documento=rut_normalizado).first()
        if not existing_auth:
            # Guardar la solicitud en JSON para revisión posterior
            pending_path = os.path.join(BASE_DIR, 'pending_registrations.json')
            try:
                pending_list = []
                if os.path.exists(pending_path):
                    with open(pending_path, 'r', encoding='utf-8') as pf:
                        pending_list = json.load(pf)
            except Exception:
                pending_list = []
            hashed_pw_for_pending = generate_password_hash(password)
            pending_entry = {
                'rut': rut_normalizado,
                'nombre': nombre,
                'apellido': apellido,
                'correo': f'user_{rut_normalizado}@example.com',
                'telefono': '000000000',
                'hashed_password': hashed_pw_for_pending,
                'fecha_solicitud': date.today().isoformat()
            }
            pending_list.append(pending_entry)
            try:
                with open(pending_path, 'w', encoding='utf-8') as pf:
                    json.dump(pending_list, pf, ensure_ascii=False, indent=2)
            except Exception:
                # Si no se puede escribir el archivo, seguimos sin fallo crítico
                pass
            
            error_msg = 'No estás autorizado a crear la cuenta. Tu solicitud ha sido guardada para revisión.'
            if is_json:
                return jsonify({'success': False, 'error': error_msg}), 403
            return render_template('login.html', error=error_msg, is_register=True, toggle=True)
        
        # Si el RUT está autorizado, verificar que aún no tenga usuario asociado
        user_exists = Usuarios.query.filter_by(UsuarioAutorizado_ID=existing_auth.id_usuario_autorizado).first()
        if user_exists:
            if is_json:
                return jsonify({'success': False, 'error': 'El RUT ya está registrado'}), 409
            return render_template('login.html', error='El RUT ya está registrado', is_register=True, toggle=True)
        
        # Crear Usuarios y Alumnos vinculados al UsuarioAutorizado existente
        hashed_password = generate_password_hash(password)
        new_user = Usuarios(nombre=nombre, apellido=apellido, password=hashed_password, correo=f'user_{rut_normalizado}@example.com', telefono='000000000', Pais_id_pais=get_default_pais_id(), Rut_usuario=existing_auth.numero_documento, UsuarioAutorizado_ID=existing_auth.id_usuario_autorizado)
        db.session.add(new_user)
        db.session.flush()
        new_alumno = Alumnos(id_usuario=new_user.id_usuario, carrera='Sin especificar', anio_ingreso=date.today().year, experiencia_laboral='')
        db.session.add(new_alumno)
        db.session.commit()
        session['nombre'] = nombre
        session['apellido'] = apellido
        session['user_id'] = new_user.id_usuario
        
        if is_json:
            return jsonify({
                'success': True,
                'message': 'Registro exitoso',
                'user': {
                    'nombre': nombre,
                    'apellido': apellido,
                    'user_id': new_user.id_usuario
                }
            })
        return redirect(url_for('main'))
    # Si acceden directamente a /register con GET, redirigir a login con toggle
    return render_template('login.html', toggle=True)


# API: listar empresas
@app.route('/api/empresas')
def api_empresas():
    empresas = Empresas.query.all()
    result = []
    for e in empresas:
        result.append({
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
        })
    return jsonify(result)


# API: detalle empresa y puestos
@app.route('/api/empresa/<int:id>')
def api_empresa(id):
    e = Empresas.query.get_or_404(id)
    puestos = PuestoDeTrabajo.query.filter_by(Empresas_id_empresa=id).all()
    puestos_list = []
    for p in puestos:
        puestos_list.append({
            'id_trabajo': p.id_trabajo,
            'area_trabajo': p.area_trabajo,
            'region_trabajo': p.region_trabajo,
            'comuna_trabajo': p.comuna_trabajo,
            'modalidad_trabajo': p.modalidad_trabajo,
            'descripcion_trabajo': p.descripcion_trabajo,
            'calificaciones': p.calificaciones
        })
    return jsonify({
        'empresa': {
            'id_empresa': e.id_empresa,
            'nombre_empresa': e.nombre_empresa,
            'direccion': e.direccion,
            'telefono': e.telefono,
            'correo_contacto': e.correo_contacto
        },
        'puestos': puestos_list
    })


# API: listar puestos (opcional filter por empresa)
@app.route('/api/puestos')
def api_puestos():
    empresa_id = request.args.get('empresa_id', type=int)
    if empresa_id:
        puestos = PuestoDeTrabajo.query.filter_by(Empresas_id_empresa=empresa_id).all()
    else:
        puestos = PuestoDeTrabajo.query.all()
    out = []
    for p in puestos:
        out.append({
            'id_trabajo': p.id_trabajo,
            'empresa_id': p.Empresas_id_empresa,
            'area_trabajo': p.area_trabajo,
            'region_trabajo': p.region_trabajo,
            'comuna_trabajo': p.comuna_trabajo,
            'modalidad_trabajo': p.modalidad_trabajo,
            'descripcion_trabajo': p.descripcion_trabajo,
            'calificaciones': p.calificaciones
        })
    return jsonify(out)


# Endpoint para postular a un puesto
@app.route('/postular/<int:job_id>', methods=['POST'])
def postular(job_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    job = PuestoDeTrabajo.query.get(job_id)
    if not job:
        return jsonify({'error': 'Puesto no encontrado'}), 404
    nueva = Postulaciones(id_trabajo=job_id, id_usuario=user_id, fecha_postulacion=date.today(), estado='Enviado')
    db.session.add(nueva)
    db.session.commit()
    return jsonify({'ok': True, 'id_postulacion': nueva.id_postulacion})


# Endpoint para ver mis postulaciones
@app.route('/mis_postulaciones')
def mis_postulaciones():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    postul = Postulaciones.query.filter_by(id_usuario=user_id).all()
    out = []
    for p in postul:
        out.append({
            'id_postulacion': p.id_postulacion,
            'id_trabajo': p.id_trabajo,
            'fecha_postulacion': p.fecha_postulacion.isoformat(),
            'estado': p.estado
        })
    return jsonify(out)

# Definir carpeta de archivos estaticos
@app.route('/assets/<path:filename>')
def assets_files(filename):
    return send_from_directory(STATIC_FOLDER, filename)

# Cerrar sesión
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('main'))

# ========================================
# GESTIÓN DE PUESTOS DE TRABAJO (EMPRESAS)
# ========================================

# Crear nuevo puesto de trabajo
@app.route('/api/puesto', methods=['POST'])
def crear_puesto():
    """Permite a una empresa crear un nuevo puesto de trabajo"""
    # Detectar si es JSON (app móvil) o form-data (web)
    is_json = request.is_json
    if is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    # Obtener ID de empresa desde sesión o parámetro
    empresa_id = data.get('empresa_id') or session.get('empresa_id')
    
    if not empresa_id:
        if is_json:
            return jsonify({'success': False, 'error': 'Debe estar autenticado como empresa'}), 401
        return jsonify({'error': 'Debe estar autenticado como empresa'}), 401
    
    # Validar campos requeridos
    required_fields = ['area_trabajo', 'region_trabajo', 'comuna_trabajo', 
                       'modalidad_trabajo', 'tipo_industria', 'tamanio_empresa', 
                       'descripcion_trabajo']
    
    for field in required_fields:
        if not data.get(field):
            error_msg = f'El campo {field} es requerido'
            if is_json:
                return jsonify({'success': False, 'error': error_msg}), 400
            return jsonify({'error': error_msg}), 400
    
    # Crear el puesto
    try:
        nuevo_puesto = PuestoDeTrabajo(
            Empresas_id_empresa=empresa_id,
            area_trabajo=data['area_trabajo'],
            region_trabajo=data['region_trabajo'],
            comuna_trabajo=data['comuna_trabajo'],
            modalidad_trabajo=data['modalidad_trabajo'],
            tipo_industria=data['tipo_industria'],
            tamanio_empresa=data['tamanio_empresa'],
            descripcion_trabajo=data['descripcion_trabajo'],
            calificaciones=data.get('calificaciones', '')
        )
        db.session.add(nuevo_puesto)
        db.session.commit()
        
        if is_json:
            return jsonify({
                'success': True,
                'message': 'Puesto creado exitosamente',
                'puesto': {
                    'id_trabajo': nuevo_puesto.id_trabajo,
                    'area_trabajo': nuevo_puesto.area_trabajo,
                    'region_trabajo': nuevo_puesto.region_trabajo
                }
            }), 201
        
        return jsonify({'success': True, 'id_trabajo': nuevo_puesto.id_trabajo}), 201
        
    except Exception as e:
        db.session.rollback()
        if is_json:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({'error': str(e)}), 500


# Editar puesto de trabajo existente
@app.route('/api/puesto/<int:id>', methods=['PUT'])
def editar_puesto(id):
    """Permite a una empresa editar uno de sus puestos de trabajo"""
    is_json = request.is_json
    if is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    # Buscar el puesto
    puesto = PuestoDeTrabajo.query.get(id)
    if not puesto:
        if is_json:
            return jsonify({'success': False, 'error': 'Puesto no encontrado'}), 404
        return jsonify({'error': 'Puesto no encontrado'}), 404
    
    # Verificar que la empresa sea dueña del puesto (seguridad básica)
    empresa_id = data.get('empresa_id') or session.get('empresa_id')
    if empresa_id and puesto.Empresas_id_empresa != int(empresa_id):
        if is_json:
            return jsonify({'success': False, 'error': 'No autorizado para editar este puesto'}), 403
        return jsonify({'error': 'No autorizado para editar este puesto'}), 403
    
    # Actualizar campos si vienen en la petición
    try:
        if data.get('area_trabajo'):
            puesto.area_trabajo = data['area_trabajo']
        if data.get('region_trabajo'):
            puesto.region_trabajo = data['region_trabajo']
        if data.get('comuna_trabajo'):
            puesto.comuna_trabajo = data['comuna_trabajo']
        if data.get('modalidad_trabajo'):
            puesto.modalidad_trabajo = data['modalidad_trabajo']
        if data.get('tipo_industria'):
            puesto.tipo_industria = data['tipo_industria']
        if data.get('tamanio_empresa'):
            puesto.tamanio_empresa = data['tamanio_empresa']
        if data.get('descripcion_trabajo'):
            puesto.descripcion_trabajo = data['descripcion_trabajo']
        if 'calificaciones' in data:
            puesto.calificaciones = data['calificaciones']
        
        db.session.commit()
        
        if is_json:
            return jsonify({
                'success': True,
                'message': 'Puesto actualizado exitosamente',
                'puesto': {
                    'id_trabajo': puesto.id_trabajo,
                    'area_trabajo': puesto.area_trabajo,
                    'region_trabajo': puesto.region_trabajo,
                    'descripcion_trabajo': puesto.descripcion_trabajo
                }
            })
        
        return jsonify({'success': True, 'message': 'Puesto actualizado'}), 200
        
    except Exception as e:
        db.session.rollback()
        if is_json:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({'error': str(e)}), 500


# Eliminar puesto de trabajo
@app.route('/api/puesto/<int:id>', methods=['DELETE'])
def eliminar_puesto(id):
    """Permite a una empresa eliminar uno de sus puestos de trabajo"""
    is_json = request.is_json or request.args.get('format') == 'json'
    
    puesto = PuestoDeTrabajo.query.get(id)
    if not puesto:
        if is_json:
            return jsonify({'success': False, 'error': 'Puesto no encontrado'}), 404
        return jsonify({'error': 'Puesto no encontrado'}), 404
    
    # Verificar autorización (básica)
    empresa_id = request.args.get('empresa_id') or session.get('empresa_id')
    if empresa_id and puesto.Empresas_id_empresa != int(empresa_id):
        if is_json:
            return jsonify({'success': False, 'error': 'No autorizado para eliminar este puesto'}), 403
        return jsonify({'error': 'No autorizado'}), 403
    
    try:
        # Eliminar postulaciones asociadas primero
        Postulaciones.query.filter_by(id_trabajo=id).delete()
        
        # Eliminar el puesto
        db.session.delete(puesto)
        db.session.commit()
        
        if is_json:
            return jsonify({'success': True, 'message': 'Puesto eliminado exitosamente'})
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        if is_json:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({'error': str(e)}), 500


# Ver postulantes a un puesto específico
@app.route('/api/puesto/<int:id>/postulantes', methods=['GET'])
def ver_postulantes(id):
    """Permite a una empresa ver los postulantes a uno de sus puestos"""
    puesto = PuestoDeTrabajo.query.get(id)
    if not puesto:
        return jsonify({'success': False, 'error': 'Puesto no encontrado'}), 404
    
    # Verificar autorización
    empresa_id = request.args.get('empresa_id') or session.get('empresa_id')
    if empresa_id and puesto.Empresas_id_empresa != int(empresa_id):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    # Obtener postulaciones
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


# Cambiar estado de una postulación
@app.route('/api/postulacion/<int:id>', methods=['PUT'])
def cambiar_estado_postulacion(id):
    """Permite a una empresa cambiar el estado de una postulación"""
    is_json = request.is_json
    if is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    nuevo_estado = data.get('estado')
    if not nuevo_estado:
        return jsonify({'success': False, 'error': 'Estado requerido'}), 400
    
    # Estados válidos
    estados_validos = ['Enviado', 'En Revisión', 'Aceptado', 'Rechazado', 'En Proceso']
    if nuevo_estado not in estados_validos:
        return jsonify({'success': False, 'error': f'Estado debe ser uno de: {", ".join(estados_validos)}'}), 400
    
    postulacion = Postulaciones.query.get(id)
    if not postulacion:
        return jsonify({'success': False, 'error': 'Postulación no encontrada'}), 404
    
    # Verificar que la empresa sea dueña del puesto
    puesto = PuestoDeTrabajo.query.get(postulacion.id_trabajo)
    empresa_id = data.get('empresa_id') or session.get('empresa_id')
    if empresa_id and puesto.Empresas_id_empresa != int(empresa_id):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
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
        return jsonify({'success': False, 'error': str(e)}), 500


# Obtener puestos de la empresa autenticada
@app.route('/api/empresa/mis-puestos', methods=['GET'])
def mis_puestos_empresa():
    """Obtiene todos los puestos de la empresa autenticada"""
    empresa_id = request.args.get('empresa_id') or session.get('empresa_id')
    
    if not empresa_id:
        return jsonify({'success': False, 'error': 'Debe estar autenticado como empresa'}), 401
    
    puestos = PuestoDeTrabajo.query.filter_by(Empresas_id_empresa=empresa_id).all()
    
    result = []
    for p in puestos:
        # Contar postulaciones
        total_postulaciones = Postulaciones.query.filter_by(id_trabajo=p.id_trabajo).count()
        
        result.append({
            'id_trabajo': p.id_trabajo,
            'area_trabajo': p.area_trabajo,
            'region_trabajo': p.region_trabajo,
            'comuna_trabajo': p.comuna_trabajo,
            'modalidad_trabajo': p.modalidad_trabajo,
            'tipo_industria': p.tipo_industria,
            'tamanio_empresa': p.tamanio_empresa,
            'descripcion_trabajo': p.descripcion_trabajo,
            'calificaciones': p.calificaciones,
            'total_postulaciones': total_postulaciones
        })
    
    return jsonify({
        'success': True,
        'total_puestos': len(result),
        'puestos': result
    })


# ========================================
# SISTEMA DE BÚSQUEDA
# ========================================

@app.route('/api/buscar', methods=['GET', 'POST'])
def buscar_ofertas():
    """Sistema de búsqueda de ofertas laborales"""
    # Aceptar parámetros por GET o POST
    if request.method == 'POST':
        if request.is_json:
            params = request.get_json()
        else:
            params = request.form.to_dict()
    else:
        params = request.args.to_dict()
    
    # Parámetros de búsqueda
    query = params.get('q', '').strip()  # Texto de búsqueda
    region = params.get('region', '').strip()
    modalidad = params.get('modalidad', '').strip()
    area = params.get('area', '').strip()
    
    # Empezar con todos los puestos
    puestos_query = PuestoDeTrabajo.query
    
    # Filtrar por texto en área, descripción o calificaciones
    if query:
        search_pattern = f'%{query}%'
        puestos_query = puestos_query.filter(
            db.or_(
                PuestoDeTrabajo.area_trabajo.like(search_pattern),
                PuestoDeTrabajo.descripcion_trabajo.like(search_pattern),
                PuestoDeTrabajo.calificaciones.like(search_pattern),
                PuestoDeTrabajo.tipo_industria.like(search_pattern)
            )
        )
    
    # Filtrar por región
    if region and region != 'Todo Chile':
        puestos_query = puestos_query.filter(PuestoDeTrabajo.region_trabajo == region)
    
    # Filtrar por modalidad
    if modalidad:
        puestos_query = puestos_query.filter(PuestoDeTrabajo.modalidad_trabajo == modalidad)
    
    # Filtrar por área
    if area:
        puestos_query = puestos_query.filter(PuestoDeTrabajo.area_trabajo.like(f'%{area}%'))
    
    # Obtener resultados
    puestos = puestos_query.all()
    
    # Construir respuesta con información de empresa
    resultados = []
    for p in puestos:
        empresa = Empresas.query.get(p.Empresas_id_empresa)
        if empresa:
            resultados.append({
                'id_trabajo': p.id_trabajo,
                'area_trabajo': p.area_trabajo,
                'region_trabajo': p.region_trabajo,
                'comuna_trabajo': p.comuna_trabajo,
                'modalidad_trabajo': p.modalidad_trabajo,
                'tipo_industria': p.tipo_industria,
                'tamanio_empresa': p.tamanio_empresa,
                'descripcion_trabajo': p.descripcion_trabajo,
                'calificaciones': p.calificaciones,
                'empresa': {
                    'id_empresa': empresa.id_empresa,
                    'nombre_empresa': empresa.nombre_empresa,
                    'rubro': empresa.rubro,
                    'logo': empresa.logo,
                    'estado_empresa': empresa.estado_empresa
                }
            })
    
    return jsonify({
        'success': True,
        'total_resultados': len(resultados),
        'filtros_aplicados': {
            'query': query,
            'region': region,
            'modalidad': modalidad,
            'area': area
        },
        'resultados': resultados
    })


# Endpoint para ver estadísticas de IPs (solo para desarrollo/admin)
@app.route('/api/stats/visitors')
def visitor_stats():
    """Muestra estadísticas de visitantes - solo para admin"""
    # En producción deberías proteger esto con autenticación de admin
    stats = []
    for ip, data in ip_tracker.items():
        stats.append({
            'ip': ip,
            'visits': data['count'],
            'last_seen': data['last_seen'].strftime('%Y-%m-%d %H:%M:%S') if data['last_seen'] else None,
            'pages_visited': len(data['pages']),
            'unique_pages': list(data['pages'])
        })
    
    # Ordenar por número de visitas
    stats.sort(key=lambda x: x['visits'], reverse=True)
    
    return jsonify({
        'total_unique_visitors': len(ip_tracker),
        'total_visits': sum(d['count'] for d in ip_tracker.values()),
        'visitors': stats
    })

if __name__ == '__main__':
    # Antes de iniciar, probamos la conexión y creamos tablas si todo está OK
    try:
        with app.app_context():
            test_db_connection()
            ensure_db_created()
        print('Conexión a la base de datos OK. Tablas creadas/comprobadas.')
    except Exception as e:
        print('ERROR: No se pudo conectar a la base de datos. Revisa DATABASE_URL y que el servidor MySQL esté activo.')
        print('Detalle:', e)
        # Si la variable ALLOW_NO_DB está establecida, arrancamos en modo degradado (sin DB)
        allow_no_db = os.environ.get('ALLOW_NO_DB', '0')
        if allow_no_db in ('1', 'true', 'True'):
            print('ALERT: Se iniciará la aplicación sin conexión a la base de datos por ALLOW_NO_DB.')
        else:
            # Salimos para evitar comportamientos inesperados
            raise
    app.run(debug=True)