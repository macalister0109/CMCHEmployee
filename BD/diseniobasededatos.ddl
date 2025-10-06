-- -----------------------------------------------------
-- Creacion de la Base de datos
-- -----------------------------------------------------
CREATE DATABASE CMCHEmployee CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- -----------------------------------------------------
-- Se utiliza CMCHEmployee como Base de datos Principal
-- -----------------------------------------------------
USE CMCHEmployee;

-- -----------------------------------------------------
-- Configuración inicial
-- -----------------------------------------------------
SET default_storage_engine = INNODB;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Table Pais
-- -----------------------------------------------------
CREATE TABLE Pais (
  id_pais INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_pais VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_pais)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table UsuarioAutorizado
-- -----------------------------------------------------
CREATE TABLE UsuarioAutorizado (
  id_usuario_autorizado INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo_documento VARCHAR(20) NOT NULL COMMENT 'Ej: RUT, Pasaporte, Licencia de conducir.',
  numero_documento VARCHAR(30) NOT NULL UNIQUE COMMENT 'Número único del documento.',
  PRIMARY KEY (id_usuario_autorizado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table Usuarios (Supertipo)
-- -----------------------------------------------------
CREATE TABLE Usuarios (
  id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(70) NOT NULL,
  password VARCHAR(300) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20) NOT NULL,
  Pais_id_pais INT UNSIGNED NOT NULL,
  UsuarioAutorizado_ID INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE INDEX UQ_UsuarioAutorizado_ID (UsuarioAutorizado_ID),

  CONSTRAINT FK_Usuarios_Pais
    FOREIGN KEY (Pais_id_pais)
    REFERENCES Pais (id_pais)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

  CONSTRAINT FK_Usuarios_Auth
    FOREIGN KEY (UsuarioAutorizado_ID)
    REFERENCES UsuarioAutorizado (id_usuario_autorizado)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Subtipos de Usuarios
-- -----------------------------------------------------

CREATE TABLE Alumnos (
  id_usuario INT UNSIGNED NOT NULL,
  carrera VARCHAR(50) NOT NULL,
  anio_ingreso YEAR NOT NULL,
  experiencia_laboral VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT FK_Alumnos_Usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE Docentes (
  id_usuario INT UNSIGNED NOT NULL,
  rut VARCHAR(12) NOT NULL UNIQUE,
  carrera VARCHAR(50) NOT NULL,
  anio_ingreso YEAR NOT NULL,
  experiencia_laboral VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT FK_Docentes_Usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ExAlumnos (
  id_usuario INT UNSIGNED NOT NULL,
  carrera VARCHAR(50) NOT NULL,
  anio_egreso YEAR NOT NULL,
  experiencia_laboral VARCHAR(100) NOT NULL,
  estudiando BOOLEAN NOT NULL,
  casa_estudio VARCHAR(250),
  PRIMARY KEY (id_usuario),
  CONSTRAINT FK_ExAlumnos_Usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE Empresarios (
  id_usuario INT UNSIGNED NOT NULL,
  empresa_principal VARCHAR(50) NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT FK_Empresarios_Usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table Empresas (Supertipo)
-- -----------------------------------------------------
CREATE TABLE Empresas (
  id_empresa INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_empresa VARCHAR(100) NOT NULL,
  rubro VARCHAR(200) NOT NULL,
  direccion VARCHAR(150) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  correo_contacto VARCHAR(100) NOT NULL,
  cantidad_empleados INT,
  logo VARCHAR(255) NOT NULL COMMENT 'URL del logo',
  sitio_web VARCHAR(255) NOT NULL COMMENT 'URL del sitio web',
  estado_empresa VARCHAR(50) NOT NULL,
  descripcion_empresa VARCHAR(1000) NOT NULL,
  tipo_empresa VARCHAR(20) NOT NULL,
  Pais_id_pais INT UNSIGNED NOT NULL,
  Empresarios_id_usuario INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_empresa),

  CONSTRAINT FK_Empresas_Pais
    FOREIGN KEY (Pais_id_pais)
    REFERENCES Pais (id_pais)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

  CONSTRAINT FK_Empresas_Empresario
    FOREIGN KEY (Empresarios_id_usuario)
    REFERENCES Empresarios (id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Subtipos de Empresas
-- -----------------------------------------------------
CREATE TABLE EmpresaNacional (
  id_empresa INT UNSIGNED NOT NULL,
  rut_empresa VARCHAR(12) NOT NULL UNIQUE,
  PRIMARY KEY (id_empresa),
  CONSTRAINT FK_EmpresaNac_Empresas
    FOREIGN KEY (id_empresa)
    REFERENCES Empresas (id_empresa)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE EmpresaInternacional (
  id_empresa INT UNSIGNED NOT NULL,
  identificador_fiscal VARCHAR(20) NOT NULL UNIQUE,
  rut_empresa VARCHAR(12),
  pais_origen VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_empresa),
  CONSTRAINT FK_EmpresaInt_Empresas
    FOREIGN KEY (id_empresa)
    REFERENCES Empresas (id_empresa)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table PuestoDeTrabajo
-- -----------------------------------------------------
CREATE TABLE PuestoDeTrabajo (
  id_trabajo INT UNSIGNED NOT NULL AUTO_INCREMENT,
  Empresas_id_empresa INT UNSIGNED NOT NULL,
  area_trabajo VARCHAR(50) NOT NULL,
  region_trabajo VARCHAR(50) NOT NULL,
  comuna_trabajo VARCHAR(50) NOT NULL,
  modalidad_trabajo VARCHAR(30) NOT NULL,
  tipo_industria VARCHAR(30) NOT NULL,
  tamanio_empresa VARCHAR(50) NOT NULL,
  descripcion_trabajo VARCHAR(300) NOT NULL,
  calificaciones VARCHAR(1000),
  PRIMARY KEY (id_trabajo),

  CONSTRAINT FK_PuestoTrabajo_Empresas
    FOREIGN KEY (Empresas_id_empresa)
    REFERENCES Empresas (id_empresa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table Postulaciones (relación muchos-a-uno con PuestoDeTrabajo)
-- -----------------------------------------------------
CREATE TABLE Postulaciones (
  id_postulacion INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_trabajo INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_postulacion DATE NOT NULL,
  estado VARCHAR(20),
  PRIMARY KEY (id_postulacion),

  CONSTRAINT FK_Postulaciones_Puesto
    FOREIGN KEY (id_trabajo)
    REFERENCES PuestoDeTrabajo (id_trabajo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,

  CONSTRAINT FK_Postulaciones_Usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

