# 📦 Guía de Instalación Completa - CMCHEmployee

## 🎯 Objetivo

Este script instalará y configurará **TODO** lo necesario para ejecutar el proyecto CMCHEmployee desde cero.

---

## ⚡ Inicio Rápido (2 opciones)

### Opción 1: Doble Clic (Más Fácil)
```
Haz doble clic en: INSTALAR_TODO.bat
```

### Opción 2: Desde Terminal
```powershell
python instalar_todo.py
```

---

## 📋 ¿Qué Instala Este Script?

### 1. **Herramientas del Sistema**
- ✅ **Python 3.8+** (Backend Flask)
- ✅ **Node.js 16+** (React Native)
- ✅ **npm** (Gestor de paquetes de Node.js)
- ✅ **Git** (Control de versiones - opcional)

### 2. **Base de Datos**
- ✅ **MySQL/MariaDB** (vía XAMPP, WAMP o standalone)
- ✅ Creación de base de datos `CMCHEmployee`
- ✅ Verificación de conexión

### 3. **Dependencias Python** (Backend)
```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Werkzeug==2.3.7
PyMySQL==1.1.0
cryptography==41.0.4
Jinja2==3.1.2
colorama==0.4.6
... y más
```

### 4. **Dependencias Node.js** (Mobile App)
```
React Native
Expo
React Navigation
TypeScript
... y más (200+ paquetes)
```

### 5. **Configuración**
- ✅ Archivo `config.ini`
- ✅ Variables de entorno
- ✅ Puertos configurados

### 6. **Expo CLI**
- ✅ Configuración de Expo para React Native
- ✅ Guía de instalación de Expo Go en móvil

---

## 🎬 Proceso Paso a Paso

### Paso 1/8: Verificación de Python
```
El script verificará si Python está instalado.
Si no lo está, te guiará para instalarlo.
```

### Paso 2/8: Verificación de Node.js
```
El script verificará si Node.js está instalado.
Si no lo está, te guiará para instalarlo.
```

### Paso 3/8: Git (Opcional)
```
El script preguntará si quieres instalar Git.
Git es útil para control de versiones.
```

### Paso 4/8: MySQL/MariaDB
```
El script verificará si MySQL está corriendo.
Te dará opciones para instalar:
  • XAMPP (recomendada)
  • MySQL Standalone
  • WAMP
```

### Paso 5/8: Dependencias Python
```
Instala todos los paquetes de requirements.txt
Actualiza pip automáticamente
Verifica la instalación
```

### Paso 6/8: Dependencias Node.js
```
Ejecuta 'npm install' en App/CMCHEmployee
Instala 200+ paquetes (puede tardar 5-15 minutos)
Verifica node_modules
```

### Paso 7/8: Configuración
```
Crea config.ini si no existe
Configura la base de datos
Verifica conexión a MySQL
```

### Paso 8/8: Expo Go (Móvil)
```
Muestra guía para instalar Expo Go en tu móvil
Links a Play Store / App Store
```

---

## ⏱️ Tiempo Estimado

| Componente | Tiempo Aproximado |
|------------|-------------------|
| Verificación de herramientas | 2-3 minutos |
| Instalación de dependencias Python | 2-5 minutos |
| Instalación de dependencias Node.js | 5-15 minutos |
| Configuración de base de datos | 2-3 minutos |
| **TOTAL** | **10-30 minutos** |

*El tiempo varía según tu conexión a internet y velocidad de tu PC*

---

## 🎨 Características del Instalador

### Interfaz Colorida
- 🟢 **Verde (✓)**: Componente instalado correctamente
- 🔴 **Rojo (✗)**: Error o faltante
- 🟡 **Amarillo (ℹ)**: Información importante
- 🟣 **Magenta (➤)**: Paso en ejecución
- 🟠 **Naranja (⚠)**: Advertencia

### Inteligente y Flexible
- Detecta qué ya está instalado
- No reinstala lo que ya existe
- Te pregunta antes de instalar componentes opcionales
- Abre enlaces de descarga automáticamente
- Guarda progreso por si hay errores

### Resumen Final
Al terminar, verás un resumen completo:
```
Estado de componentes:

✓ Python
✓ Node.js
✓ Git
✓ MySQL
✓ Paquetes Python
✓ Paquetes Node.js
✓ Expo CLI
✓ Archivo config.ini
✓ Base de datos

🎉 ¡INSTALACIÓN COMPLETA! 🎉
```

---

## 🔧 Requisitos Previos

### Antes de Empezar

1. **Conexión a Internet** - Estable y rápida (preferible)
2. **Espacio en Disco** - Al menos 2 GB libres
3. **Permisos** - Permisos de administrador (algunos instaladores lo requieren)
4. **Sistema Operativo** - Windows 10/11 (64 bits)

### Puertos Requeridos

Estos puertos deben estar libres:
- **3306** - MySQL
- **5000** - Backend Flask
- **8081** - Expo Metro Bundler

---

## 🚀 Después de la Instalación

### 1. Configurar Base de Datos (Si no lo hizo el script)

```sql
-- En phpMyAdmin o MySQL Workbench:

-- 1. Crear base de datos
CREATE DATABASE CMCHEmployee;

-- 2. Seleccionar base de datos
USE CMCHEmployee;

-- 3. Ejecutar scripts de la carpeta BD/
-- (Copia y pega el contenido de cada archivo .sql)
```

### 2. Verificar Instalación

```powershell
python verificar.py
```

### 3. Iniciar el Proyecto

```powershell
# Opción 1: Doble clic
INICIAR.bat

# Opción 2: Desde terminal
python start_project.py
```

---

## ⚠️ Solución de Problemas

### Error: "Python no encontrado"

**Causa:** Python no está en PATH

**Solución:**
1. Reinstala Python
2. Marca "Add Python to PATH" durante instalación
3. O agrega manualmente a PATH:
   ```
   Variables de entorno > Path > Nuevo
   C:\Python311\
   C:\Python311\Scripts\
   ```

### Error: "node/npm no encontrado"

**Causa:** Node.js no está en PATH

**Solución:**
1. Reinstala Node.js
2. Reinicia PowerShell
3. Verifica con: `node --version`

### Error: "No se puede conectar a MySQL"

**Causa:** MySQL no está corriendo

**Solución:**
1. Inicia XAMPP/WAMP
2. Verifica que el servicio MySQL esté activo (verde)
3. Verifica que el puerto 3306 esté libre

### Error: "npm install failed"

**Causa:** Problemas de red o permisos

**Solución:**
1. Verifica tu conexión a internet
2. Ejecuta PowerShell como administrador
3. Limpia caché de npm:
   ```powershell
   npm cache clean --force
   ```
4. Intenta nuevamente

### Error: "Access denied for user 'root'"

**Causa:** MySQL requiere contraseña

**Solución:**
1. Edita `config.ini`
2. Cambia el campo `password` en la sección `[database]`
3. Guarda y vuelve a ejecutar el instalador

---

## 📱 Instalación de Expo Go (Móvil)

### Android

1. Abre **Google Play Store**
2. Busca "**Expo Go**"
3. Instala la app
4. Abre Expo Go
5. Escanea el código QR cuando ejecutes `start_project.py`

**Link directo:**
https://play.google.com/store/apps/details?id=host.exp.exponent

### iOS

1. Abre **App Store**
2. Busca "**Expo Go**"
3. Instala la app
4. Abre Expo Go
5. Escanea el código QR cuando ejecutes `start_project.py`

**Link directo:**
https://apps.apple.com/app/expo-go/id982107779

### Requisitos

- Tu móvil debe estar en la **misma red WiFi** que tu PC
- Tener cámara funcional para escanear QR
- Android 5.0+ o iOS 11.0+

---

## 📊 Estructura de Carpetas Después de Instalar

```
CMCHEmployee/
├── App/
│   └── CMCHEmployee/
│       ├── node_modules/        ← ~200 MB (instalado)
│       ├── package.json
│       └── ...
├── BackEnd/
│   ├── app.py
│   └── ...
├── BD/
│   ├── diseniobasededatos.ddl
│   └── ...
├── FrontEnd/
│   └── ...
├── config.ini                   ← Creado automáticamente
├── INSTALAR_TODO.bat           ← Script de instalación
├── instalar_todo.py            ← Instalador Python
├── INICIAR.bat                 ← Para iniciar proyecto
├── start_project.py            ← Script de inicio
├── verificar.py                ← Verificar instalación
└── requirements.txt
```

---

## 🎯 Checklist de Instalación

Marca cada item a medida que lo completes:

### Antes de Instalar
- [ ] Tengo conexión a internet estable
- [ ] Tengo al menos 2 GB libres en disco
- [ ] Descargué/cloné el repositorio completo

### Durante la Instalación
- [ ] Python instalado y en PATH
- [ ] Node.js instalado y en PATH
- [ ] Git instalado (opcional)
- [ ] MySQL/XAMPP instalado y corriendo
- [ ] Base de datos `CMCHEmployee` creada
- [ ] Dependencias Python instaladas
- [ ] Dependencias Node.js instaladas
- [ ] Archivo config.ini creado

### Después de Instalar
- [ ] Ejecuté `python verificar.py` (todo ✓)
- [ ] Ejecuté scripts SQL de carpeta BD/
- [ ] Instalé Expo Go en mi móvil
- [ ] Probé `python start_project.py`
- [ ] Accedí a http://localhost:5000
- [ ] Escaneé QR con Expo Go

---

## 💡 Tips y Recomendaciones

### Instalación Primera Vez
- ✅ Instala XAMPP (incluye todo lo de MySQL)
- ✅ Usa versiones LTS de Node.js
- ✅ Marca "Add to PATH" en todos los instaladores
- ✅ Reinicia PowerShell después de cada instalación
- ✅ Ten paciencia con `npm install` (es normal que tarde)

### Desarrollo Diario
- ✅ Usa `INICIAR.bat` para iniciar el proyecto rápidamente
- ✅ Mantén XAMPP corriendo mientras trabajas
- ✅ No cierres las ventanas que abre el script (Backend, Expo)
- ✅ Los cambios en código se reflejan automáticamente (hot reload)

### Optimización
- ✅ Conecta tu móvil por USB y usa `npm run android` (más rápido que WiFi)
- ✅ Usa un SSD para instalar node_modules (más rápido)
- ✅ Desactiva antivirus temporalmente si npm es muy lento

---

## 🆘 Soporte

Si tienes problemas que no puedes resolver:

1. **Revisa esta guía completa**
2. **Ejecuta `python verificar.py`** para ver qué falta
3. **Lee los mensajes de error** completos
4. **Revisa la carpeta de logs** (si existe)
5. **Busca el error en Google** (muchos son comunes)

---

## 📚 Documentación Relacionada

Después de instalar, lee:

1. **LEEME_PRIMERO.md** - Guía de inicio rápido
2. **INICIO_RAPIDO.md** - Uso del proyecto
3. **EJEMPLO_EJECUCION.md** - Cómo se ve cuando funciona
4. **README.md** - Información general del proyecto

---

## ✅ Verificación Final

Para verificar que todo está correcto:

```powershell
# 1. Verificar instalación
python verificar.py

# 2. Verificar conexión a base de datos
python -c "import pymysql; pymysql.connect(host='localhost', user='root', password='', database='CMCHEmployee'); print('✓ Conexión OK')"

# 3. Iniciar proyecto
python start_project.py
```

Si los 3 comandos funcionan correctamente: **¡Estás listo! 🎉**

---

**Fecha de creación:** 23 de octubre de 2025  
**Versión del instalador:** 1.0.0  
**Desarrollado para:** CMCHEmployee - Legado TP  
**Institución:** Colegio Marista Marcelino Champagnat
