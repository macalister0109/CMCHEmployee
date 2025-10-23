# CMCHEmployee
Proyecto de finalización especialidad programación generación 2025.

Este proyecto fue creado como una herramienta de apoyo para los estudiantes del Colegio Marista Marcelino Champganat - La Pintana. Dado que nuestro establecimiento es de modalidad Técnico Profesional buscamos que los estudiantes puedan acceder a una práctica profesional y empleos de calidad. Nuestro enfoque es que nuestros estudiantes tengan un empleo según su necesidad e interés. Asimismo buscamos brindar herramientas a nuestros estudiantes egresados para facilitar el acceso a oportunidades laborales, expandiendo sus conceptos.

## � Instalación (Primera Vez)

### ¿Primera vez usando el proyecto?

**Ejecuta el instalador automático:**

```
Doble clic en: INSTALAR_TODO.bat
```

Este instalador configurará todo automáticamente:
- ✅ Verifica e instala Python, Node.js, Git
- ✅ Configura MySQL/XAMPP
- ✅ Instala todas las dependencias (Python + Node.js)
- ✅ Crea la base de datos
- ✅ Configura el proyecto completo

**Tiempo estimado:** 10-30 minutos (dependiendo de tu conexión)

👉 **[Ver Guía de Instalación Completa](GUIA_INSTALACION.md)**

---

## �🚀 Inicio Rápido (Después de Instalar)

### Opción 1: Script Automático (Recomendado)

**Doble clic en el archivo:**
```
INICIAR.bat
```

**O desde terminal:**
```powershell
python start_project.py
```

Este script automáticamente:
- ✅ Verifica todas las dependencias del sistema
- 🔄 Actualiza el proyecto desde Git (si aplica)
- 🗄️ Verifica la conexión a la base de datos
- 📦 Instala/actualiza dependencias de Python y Node.js
- 🚀 Inicia el backend Flask (puerto 5000)
- 📱 Inicia la aplicación móvil con Expo (puerto 8081)

### Opción 2: Inicio Manual

Ver la [Guía Completa de Inicio](INICIO_RAPIDO.md) para instrucciones detalladas.

## 📋 Requisitos Previos

- **Python 3.8+** - [Descargar](https://www.python.org/downloads/)
- **Node.js 16+** - [Descargar](https://nodejs.org/)
- **MySQL/MariaDB** - XAMPP, WAMP o instalación independiente
- **Git** (opcional) - [Descargar](https://git-scm.com/)

## 📱 Estructura del Proyecto

```
CMCHEmployee/
├── INICIAR.bat              # Script de inicio (doble clic)
├── start_project.py         # Script de inicio automático
├── INICIO_RAPIDO.md         # Guía detallada de uso
├── requirements.txt         # Dependencias Python
├── BackEnd/                 # Servidor Flask
│   └── app.py
├── App/                     # Aplicación móvil React Native
│   └── CMCHEmployee/
├── FrontEnd/                # Frontend web
│   └── pages/
└── BD/                      # Scripts de base de datos
```

## 🌐 Acceso a la Aplicación

Una vez iniciado el proyecto:

- **Frontend Web**: http://localhost:5000
- **Expo Dev Tools**: http://localhost:8081
- **App Móvil**: Escanea el QR con Expo Go

## ✨ Funcionalidades Implementadas

### 🔍 **Sistema de Búsqueda de Ofertas** (NUEVO)
- Búsqueda avanzada con múltiples filtros
- Filtrado por región, modalidad y área
- Vista de resultados en tiempo real
- Detalle completo de ofertas
- Sistema de postulación integrado

### 🏢 **Dashboard Empresarial** (NUEVO)
- Panel de control completo para empresas
- Crear, editar y eliminar ofertas laborales
- Ver lista de postulantes por oferta
- Cambiar estado de postulaciones
- Estadísticas en tiempo real

### 👤 **Gestión de Usuarios**
- Registro de estudiantes y empresas
- Sistema de autorización previa
- Login seguro con hash de contraseñas
- Sesiones persistentes

### 📊 **API REST Completa**
- Endpoints para búsqueda
- CRUD completo de puestos de trabajo
- Gestión de postulaciones
- Compatible con app móvil y web

📖 **[Ver Documentación Completa de Funcionalidades](IMPLEMENTACION_BUSQUEDA_CRUD.md)**

## 📚 Documentación

- [Guía de Inicio Rápido](INICIO_RAPIDO.md) - Instrucciones detalladas
- [Estructura del Proyecto](PROYECTO_ESTRUCTURA.md) - Arquitectura completa
- [Guía de Pruebas](GUIA_PRUEBAS.md) - Cómo probar la aplicación

## 🛠️ Tecnologías Utilizadas

### Backend
- Flask 2.3.3
- SQLAlchemy 3.0.5
- PyMySQL 1.1.0
- MySQL/MariaDB

### Mobile App
- React Native 0.81.4
- Expo 54.0.12
- TypeScript 5.8.3
- React Navigation 7.x

### Frontend Web
- HTML5, CSS3, JavaScript
- Jinja2 Templates

## 👥 Equipo

Estudiantes de la Especialidad de Programación - Generación 2025  
Colegio Marista Marcelino Champagnat - La Pintana

## 📄 Licencia

Este proyecto fue desarrollado para el Colegio Marista Marcelino Champagnat.




