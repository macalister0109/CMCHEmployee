from flask import Blueprint, request, session, redirect, url_for, render_template, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import re
from models.usuarios import db, Usuarios, UsuarioAutorizado
from models.perfiles import Alumnos, Docentes, Exalumnos
from datetime import date
import json
import os

auth_bp = Blueprint('auth', __name__)

def get_default_pais_id():
    from models.usuarios import Pais
    pais = Pais.query.filter_by(nombre_pais='Chile').first()
    if pais:
        return pais.id_pais
    any_pais = Pais.query.first()
    if any_pais:
        return any_pais.id_pais
    new_pais = Pais(nombre_pais='Chile')
    db.session.add(new_pais)
    db.session.commit()
    return new_pais.id_pais

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        is_json = request.is_json
        if is_json:
            data = request.get_json()
            rut = data.get('rut')
            password = data.get('password')
        else:
            rut = request.form.get('rut')
            password = request.form.get('password')
        
        rut_normalizado = re.sub(r'[^0-9kK]', '', rut)
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

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        is_json = request.is_json
        if is_json:
            return jsonify({'success': False, 'error': 'Registro vía app deshabilitado'}), 403

        rut = request.form.get('rut')
        nombre = request.form.get('nombre')
        apellido = request.form.get('apellido')
        password = request.form.get('password')
        
        rut_normalizado = re.sub(r'[^0-9kK]', '', rut)
        if not password or len(password) < 8:
            return render_template('login.html', error='La contraseña debe tener al menos 8 caracteres', is_register=True, toggle=True)
        
        existing_auth = UsuarioAutorizado.query.filter_by(numero_documento=rut_normalizado).first()
        if not existing_auth:
            pending_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'pending_registrations.json')
            try:
                pending_list = []
                if os.path.exists(pending_path):
                    with open(pending_path, 'r', encoding='utf-8') as pf:
                        pending_list = json.load(pf)
            except Exception:
                pending_list = []
            
            pending_entry = {
                'rut': rut_normalizado,
                'nombre': nombre,
                'apellido': apellido,
                'correo': f'user_{rut_normalizado}@example.com',
                'telefono': '000000000',
                'hashed_password': generate_password_hash(password),
                'fecha_solicitud': date.today().isoformat()
            }
            pending_list.append(pending_entry)
            try:
                with open(pending_path, 'w', encoding='utf-8') as pf:
                    json.dump(pending_list, pf, ensure_ascii=False, indent=2)
            except Exception:
                pass
            
            return render_template('login.html', 
                                error='No estás autorizado a crear la cuenta. Tu solicitud ha sido guardada para revisión.',
                                is_register=True, toggle=True)
        
        user_exists = Usuarios.query.filter_by(UsuarioAutorizado_ID=existing_auth.id_usuario_autorizado).first()
        if user_exists:
            return render_template('login.html', error='El RUT ya está registrado', is_register=True, toggle=True)
        
        new_user = Usuarios(
            nombre=nombre,
            apellido=apellido,
            password=generate_password_hash(password),
            correo=f'user_{rut_normalizado}@example.com',
            telefono='000000000',
            Pais_id_pais=get_default_pais_id(),
            Rut_usuario=existing_auth.numero_documento,
            UsuarioAutorizado_ID=existing_auth.id_usuario_autorizado
        )
        db.session.add(new_user)
        db.session.flush()

        role = (request.form.get('role') or 'student').strip().lower()
        try:
            if role == 'exalumno' or role == 'ex-alumno' or role == 'exalum':
                new_profile = Exalumnos(id_usuario=new_user.id_usuario)
            elif role == 'docente' or role == 'teacher':
                new_profile = Docentes(id_usuario=new_user.id_usuario)
            else:
                new_profile = Alumnos(
                    id_usuario=new_user.id_usuario,
                    carrera='Sin especificar',
                    anio_ingreso=date.today().year,
                    experiencia_laboral=''
                )
            db.session.add(new_profile)
            db.session.commit()
            
            session['nombre'] = nombre
            session['apellido'] = apellido
            session['user_id'] = new_user.id_usuario
            
            return redirect(url_for('main'))
            
        except Exception as e:
            db.session.rollback()
            try:
                Usuarios.query.filter_by(id_usuario=new_user.id_usuario).delete()
                db.session.commit()
            except Exception:
                db.session.rollback()
            return render_template('login.html', error='Error al crear perfil de usuario', is_register=True, toggle=True)
            
    return render_template('login.html', toggle=True)

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('main'))