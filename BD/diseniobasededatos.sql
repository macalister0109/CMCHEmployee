-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para cmchemployee
CREATE DATABASE IF NOT EXISTS `cmchemployee` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `cmchemployee`;

-- Volcando estructura para tabla cmchemployee.alumnos
CREATE TABLE IF NOT EXISTS `alumnos` (
  `id_usuario` int(10) unsigned NOT NULL,
  `carrera` varchar(50) NOT NULL,
  `anio_ingreso` year(4) NOT NULL,
  `experiencia_laboral` varchar(100) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `FK_Alumnos_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.docentes
CREATE TABLE IF NOT EXISTS `docentes` (
  `id_usuario` int(10) unsigned NOT NULL,
  `rut` varchar(12) NOT NULL,
  `carrera` varchar(50) NOT NULL,
  `anio_ingreso` year(4) NOT NULL,
  `experiencia_laboral` varchar(100) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `rut` (`rut`),
  CONSTRAINT `FK_Docentes_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.empresainternacional
CREATE TABLE IF NOT EXISTS `empresainternacional` (
  `id_empresa` int(10) unsigned NOT NULL,
  `identificador_fiscal` varchar(20) NOT NULL,
  `rut_empresa` varchar(12) DEFAULT NULL,
  `pais_origen` varchar(50) NOT NULL,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `identificador_fiscal` (`identificador_fiscal`),
  CONSTRAINT `FK_EmpresaInt_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.empresanacional
CREATE TABLE IF NOT EXISTS `empresanacional` (
  `id_empresa` int(10) unsigned NOT NULL,
  `rut_empresa` varchar(12) NOT NULL,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `rut_empresa` (`rut_empresa`),
  CONSTRAINT `FK_EmpresaNac_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.empresarios
CREATE TABLE IF NOT EXISTS `empresarios` (
  `id_usuario` int(10) unsigned NOT NULL,
  `empresa_principal` varchar(50) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `FK_Empresarios_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.empresas
CREATE TABLE IF NOT EXISTS `empresas` (
  `id_empresa` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(100) NOT NULL,
  `rubro` varchar(200) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo_contacto` varchar(100) NOT NULL,
  `cantidad_empleados` int(11) DEFAULT NULL,
  `logo` varchar(255) NOT NULL COMMENT 'URL del logo',
  `sitio_web` varchar(255) NOT NULL COMMENT 'URL del sitio web',
  `estado_empresa` varchar(50) NOT NULL,
  `descripcion_empresa` varchar(1000) NOT NULL,
  `password_empresa` varchar(300) NOT NULL,
  `tipo_empresa` varchar(20) NOT NULL,
  `Pais_id_pais` int(10) unsigned NOT NULL,
  `Empresarios_id_usuario` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_empresa`),
  KEY `FK_Empresas_Pais` (`Pais_id_pais`),
  KEY `FK_Empresas_Empresario` (`Empresarios_id_usuario`),
  CONSTRAINT `FK_Empresas_Empresario` FOREIGN KEY (`Empresarios_id_usuario`) REFERENCES `empresarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Empresas_Pais` FOREIGN KEY (`Pais_id_pais`) REFERENCES `pais` (`id_pais`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.exalumnos
CREATE TABLE IF NOT EXISTS `exalumnos` (
  `id_usuario` int(10) unsigned NOT NULL,
  `carrera` varchar(50) NOT NULL,
  `anio_egreso` year(4) NOT NULL,
  `experiencia_laboral` varchar(100) NOT NULL,
  `estudiando` tinyint(1) NOT NULL,
  `casa_estudio` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `FK_ExAlumnos_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.pais
CREATE TABLE IF NOT EXISTS `pais` (
  `id_pais` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre_pais` varchar(100) NOT NULL,
  PRIMARY KEY (`id_pais`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.postulaciones
CREATE TABLE IF NOT EXISTS `postulaciones` (
  `id_postulacion` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_trabajo` int(10) unsigned NOT NULL,
  `id_usuario` int(10) unsigned NOT NULL,
  `fecha_postulacion` date NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_postulacion`),
  KEY `FK_Postulaciones_Puesto` (`id_trabajo`),
  KEY `FK_Postulaciones_Usuarios` (`id_usuario`),
  CONSTRAINT `FK_Postulaciones_Puesto` FOREIGN KEY (`id_trabajo`) REFERENCES `puestodetrabajo` (`id_trabajo`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_Postulaciones_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.puestodetrabajo
CREATE TABLE IF NOT EXISTS `puestodetrabajo` (
  `id_trabajo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Empresas_id_empresa` int(10) unsigned NOT NULL,
  `area_trabajo` varchar(50) NOT NULL,
  `region_trabajo` varchar(50) NOT NULL,
  `comuna_trabajo` varchar(50) NOT NULL,
  `modalidad_trabajo` varchar(30) NOT NULL,
  `tipo_industria` varchar(30) NOT NULL,
  `tamanio_empresa` varchar(50) NOT NULL,
  `descripcion_trabajo` varchar(300) NOT NULL,
  `calificaciones` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id_trabajo`),
  KEY `FK_PuestoTrabajo_Empresas` (`Empresas_id_empresa`),
  CONSTRAINT `FK_PuestoTrabajo_Empresas` FOREIGN KEY (`Empresas_id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.usuarioautorizado
CREATE TABLE IF NOT EXISTS `usuarioautorizado` (
  `id_usuario_autorizado` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo_documento` varchar(20) NOT NULL COMMENT 'Ej: RUT, Pasaporte, Licencia de conducir.',
  `numero_documento` varchar(30) NOT NULL COMMENT 'Número único del documento.',
  PRIMARY KEY (`id_usuario_autorizado`),
  UNIQUE KEY `numero_documento` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla cmchemployee.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(70) NOT NULL,
  `password` varchar(300) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `Pais_id_pais` int(10) unsigned NOT NULL,
  `Rut_usuario` varchar(30) NOT NULL,
  `UsuarioAutorizado_ID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `UQ_UsuarioAutorizado_ID` (`UsuarioAutorizado_ID`),
  KEY `FK_Usuarios_Pais` (`Pais_id_pais`),
  CONSTRAINT `FK_Usuarios_UsuarioAutorizado` FOREIGN KEY (`UsuarioAutorizado_ID`) REFERENCES `usuarioautorizado` (`id_usuario_autorizado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Usuarios_Rut` FOREIGN KEY (`Rut_usuario`) REFERENCES `usuarioautorizado` (`numero_documento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Usuarios_Pais` FOREIGN KEY (`Pais_id_pais`) REFERENCES `pais` (`id_pais`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
