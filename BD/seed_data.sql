
-- Paises
INSERT INTO Pais (id_pais, nombre_pais) VALUES
(1, 'Chile'),
(2, 'Argentina'),
(3, 'Perú');

-- Usuarios autorizados (documentos)
INSERT INTO UsuarioAutorizado (id_usuario_autorizado, tipo_documento, numero_documento) VALUES
(1, 'RUT', '11111111-1'),
(2, 'RUT', '22222222-2'),
(3, 'RUT', '33333333-3'),
(4, 'RUT', '44444444-4'),
(5, 'RUT', '55555555-5');

-- Usuarios (supertipo)
INSERT INTO Usuarios (id_usuario, nombre, apellido, password, correo, telefono, Pais_id_pais, UsuarioAutorizado_ID) VALUES
(1, 'Juan', 'Perez', 'password_hash_juan', 'juan.perez@example.com', '+56911111111', 1, 1),
(2, 'Ana', 'Gonzalez', 'password_hash_ana', 'ana.gonzalez@example.com', '+56922222222', 1, 2),
(3, 'Carlos', 'Rios', 'password_hash_carlos', 'carlos.rios@example.com', '+56933333333', 1, 3),
(4, 'María', 'Lopez', 'password_hash_maria', 'maria.lopez@example.com', '+56944444444', 1, 4),
(5, 'Luis', 'Gonzalez', 'password_hash_luis', 'luis.gonzalez@example.com', '+56955555555', 1, 5);

-- Alumnos (subtipo de Usuarios)
INSERT INTO Alumnos (id_usuario, carrera, anio_ingreso, experiencia_laboral) VALUES
(1, 'Programación', 2022, 'Prácticas en empresa X'),
(2, 'Administración', 2021, 'Ayudante administrativo'),
(3, 'Electrónica', 2020, 'Talleres técnicos'),
(4, 'Conectividad', 2019, 'Instalación de redes'),
(5, 'Gastronomía', 2018, 'Cocina profesional');

-- Empresarios (subtipo de Usuarios) - se usarán para empresas
INSERT INTO Empresarios (id_usuario, empresa_principal, cargo) VALUES
(5, 'Xion In', 'CEO');

-- Empresas (supertipo)
INSERT INTO Empresas (id_empresa, nombre_empresa, rubro, direccion, telefono, correo_contacto, cantidad_empleados, logo, sitio_web, estado_empresa, descripcion_empresa, tipo_empresa, Pais_id_pais, Empresarios_id_usuario) VALUES
(1, 'Xion In', 'Tecnología', 'El Fundador 14018', '+56977777777', 'contacto@xionin.com', 25, 'https://example.com/logos/xionin.png', 'https://xionin.com', 'Activa', 'Empresa de desarrollo de software.', 'Nacional', 1, 5);

-- EmpresaNacional (subtipo)
INSERT INTO EmpresaNacional (id_empresa, rut_empresa) VALUES
(1, '75.584.682-K');

-- Puestos de trabajo
INSERT INTO PuestoDeTrabajo (id_trabajo, Empresas_id_empresa, area_trabajo, region_trabajo, comuna_trabajo, modalidad_trabajo, tipo_industria, tamanio_empresa, descripcion_trabajo, calificaciones) VALUES
(1, 1, 'Desarrollo Backend', 'Metropolitana', 'Santiago', 'Jornada Completa', 'Software', 'Mediana', 'Desarrollador backend con experiencia en Python y Flask.', 'Python, Flask, MySQL'),
(2, 1, 'Soporte Técnico', 'Metropolitana', 'Santiago', 'Part-time', 'Servicios TI', 'Pequeña', 'Técnico de soporte Nivel 1.', 'Conocimientos de redes, atención al cliente');

-- Postulaciones
INSERT INTO Postulaciones (id_postulacion, id_trabajo, id_usuario, fecha_postulacion, estado) VALUES
(1, 1, 1, '2025-09-20', 'Enviado'),
(2, 2, 2, '2025-09-21', 'Entrevista');

SET FOREIGN_KEY_CHECKS = 1;
