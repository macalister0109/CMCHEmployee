# Backend - CMCHEmployee

## Descripción
Backend de la aplicación web "TP Legacy" - Sistema de bolsa de empleo para el Colegio Marista Marcelino Champagnat.

## Desarrollado por
Luis Gonzalez

## Características
- **Flask**: Framework web ligero y flexible
- **Autenticación**: Sistema de login para alumnos y empresas
- **Base de datos JSON**: Almacenamiento temporal en archivo JSON (migrable a MySQL)
- **Gestión de sesiones**: Control de usuarios logueados
- **Validación de RUT**: Normalización automática de RUT chilenos
- **Hash de contraseñas**: Seguridad con Werkzeug

## Instalación

### Prerrequisitos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/macalister0109/CMCHEmployee.git
   cd CMCHEmployee
   ```

2. **Crear entorno virtual (recomendado)**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ejecutar la aplicación**
   ```bash
   cd BackEnd
   python app.py
   ```

5. **Acceder a la aplicación**
   - Abrir navegador web
   - Ir a: `http://127.0.0.1:5000`

## Estructura del proyecto

```
BackEnd/
├── app.py              # Aplicación principal Flask
├── db.json            # Base de datos en formato JSON
├── migrar_db.py       # Script de migración MySQL → JSON
└── Readne.md          # Este archivo
```

## Funcionalidades

### Para Alumnos
- ✅ Registro de cuenta nueva
- ✅ Inicio de sesión
- ✅ Visualización de perfil
- ✅ Cerrar sesión

### Para Empresas
- ✅ Registro de empresa
- ✅ Inicio de sesión empresarial
- ✅ Creación automática de usuario encargado
- ✅ Gestión de datos empresariales

## Configuración

### Base de datos JSON (Actual)
El sistema actualmente usa un archivo `db.json` para almacenar datos. No requiere configuración adicional.

### Migración a MySQL (Opcional)
Para usar MySQL en lugar de JSON:

1. **Instalar MySQL Server**
2. **Crear base de datos**
   ```sql
   CREATE DATABASE CMCHEmployee;
   ```

3. **Descomentar líneas en app.py**
   ```python
   # Descomentar estas líneas:
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/CMCHEmployee'
   app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
   db = SQLAlchemy(app)
   
   # Descomentar modelos Alumnos y Empresa
   # Comentar funciones load_db() y save_db()
   ```

4. **Crear tablas**
   ```python
   flask shell
   >>> from app import db
   >>> db.create_all()
   ```

## Variables de entorno

Para producción, configurar:
- `SECRET_KEY`: Clave secreta para sesiones
- `DATABASE_URL`: URL de base de datos MySQL

## Rutas disponibles

- `/` - Página principal
- `/login` - Login de alumnos
- `/register` - Registro de alumnos
- `/login_empresa` - Login de empresas
- `/register_empresa` - Registro de empresas
- `/logout` - Cerrar sesión
- `/assets/<path>` - Archivos estáticos

## Solución de problemas

### Error: ModuleNotFoundError
```bash
pip install -r requirements.txt
```

### Error: Template not found
Verificar que la carpeta `FrontEnd/pages` exista y contenga los archivos HTML.

### Error: db.json not found
El archivo se crea automáticamente al ejecutar la aplicación por primera vez.

## Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es parte del trabajo de título del Colegio Marista Marcelino Champagnat.