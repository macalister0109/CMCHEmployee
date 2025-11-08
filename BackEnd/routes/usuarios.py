from flask import Blueprint, request, session, redirect, url_for, render_template, jsonify
from models.usuarios import db, Usuarios
from models.perfiles import Alumnos, Docentes, Exalumnos

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/profile', methods=['GET', 'POST'])
def profile():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('auth.login'))

    user = Usuarios.query.get(user_id)
    role = 'usuario'
    perfil = None
    
    # Detectar rol
    alumno = Alumnos.query.filter_by(id_usuario=user_id).first()
    docente = Docentes.query.filter_by(id_usuario=user_id).first()
    exalumno = Exalumnos.query.filter_by(id_usuario=user_id).first()
    
    if alumno:
        role = 'alumno'
        perfil = alumno
    elif docente:
        role = 'docente'
        perfil = docente
    elif exalumno:
        role = 'exalumno'
        perfil = exalumno

    if request.method == 'POST':
        # Actualizar datos básicos
        user.nombre = request.form.get('nombre') or user.nombre
        user.apellido = request.form.get('apellido') or user.apellido
        user.correo = request.form.get('correo') or user.correo
        user.telefono = request.form.get('telefono') or user.telefono

        try:
            # Actualizar perfil según rol
            if role == 'alumno':
                if not perfil:
                    perfil = Alumnos(id_usuario=user.id_usuario)
                    db.session.add(perfil)
                perfil.carrera = request.form.get('carrera') or perfil.carrera
                perfil.anio_ingreso = request.form.get('anio_ingreso') or perfil.anio_ingreso
                perfil.anio_egreso = request.form.get('anio_egreso') or perfil.anio_egreso
                perfil.experiencia_laboral = request.form.get('experiencia_laboral') or perfil.experiencia_laboral
                perfil.descripcion = request.form.get('descripcion') or perfil.descripcion
                perfil.linkedin = request.form.get('linkedin') or perfil.linkedin
                perfil.ciudad = request.form.get('ciudad') or perfil.ciudad
                perfil.region = request.form.get('region') or perfil.region
                perfil.habilidades = request.form.get('habilidades') or perfil.habilidades
                perfil.nivel_estudios = request.form.get('nivel_estudios') or perfil.nivel_estudios
                perfil.estado_profesional = request.form.get('estado_profesional') or perfil.estado_profesional

            elif role == 'docente':
                if not perfil:
                    perfil = Docentes(id_usuario=user.id_usuario)
                    db.session.add(perfil)
                perfil.institucional_id = request.form.get('institucional_id') or perfil.institucional_id
                perfil.departamento = request.form.get('departamento') or perfil.departamento
                perfil.area_academica = request.form.get('area_academica') or perfil.area_academica
                perfil.cargo = request.form.get('cargo') or perfil.cargo
                perfil.bio_academica = request.form.get('bio_academica') or perfil.bio_academica
                perfil.correo_institucional = request.form.get('correo_institucional') or perfil.correo_institucional
                perfil.telefono_contacto = request.form.get('telefono_contacto') or perfil.telefono_contacto
                perfil.oficina = request.form.get('oficina') or perfil.oficina

            elif role == 'exalumno':
                if not perfil:
                    perfil = Exalumnos(id_usuario=user.id_usuario)
                    db.session.add(perfil)
                perfil.carrera = request.form.get('carrera') or perfil.carrera
                perfil.anio_egreso = request.form.get('anio_egreso') or perfil.anio_egreso
                perfil.estudiando = bool(request.form.get('estudiando'))
                perfil.tipo_institucion = request.form.get('tipo_institucion') or perfil.tipo_institucion
                perfil.casa_estudio = request.form.get('casa_estudio') or perfil.casa_estudio
                perfil.trabajando = bool(request.form.get('trabajando'))
                perfil.empresa_actual = request.form.get('empresa_actual') or perfil.empresa_actual
                perfil.puesto_actual = request.form.get('puesto_actual') or perfil.puesto_actual
                perfil.descripcion = request.form.get('descripcion') or perfil.descripcion
                perfil.linkedin = request.form.get('linkedin') or perfil.linkedin
                perfil.ciudad = request.form.get('ciudad') or perfil.ciudad
                perfil.region = request.form.get('region') or perfil.region
                perfil.habilidades = request.form.get('habilidades') or perfil.habilidades

            db.session.commit()
            return render_template('profile_user.html', user=user, role=role, perfil=perfil, success=True)
            
        except Exception as e:
            db.session.rollback()
            return render_template('profile_user.html', user=user, role=role, perfil=perfil, error=str(e))

    return render_template('profile_user.html', user=user, role=role, perfil=perfil)