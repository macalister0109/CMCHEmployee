#!/usr/bin/env python3
"""
Script de Instalación Completa - CMCHEmployee
Instala y configura todo lo necesario para el proyecto
"""

import os
import sys
import subprocess
import platform
import urllib.request
import shutil
from pathlib import Path
from colorama import init, Fore, Style

# Inicializar colorama
try:
    init(autoreset=True)
except ImportError:
    # Si colorama no está, instalarlo primero
    subprocess.run([sys.executable, "-m", "pip", "install", "colorama"], 
                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    init(autoreset=True)

# Configuración
PROJECT_ROOT = Path(__file__).parent
DOWNLOADS_DIR = PROJECT_ROOT / "instaladores"


def print_header(message):
    """Imprime un encabezado estilizado"""
    print(f"\n{Fore.CYAN}{'=' * 70}")
    print(f"{Fore.CYAN}{message.center(70)}")
    print(f"{Fore.CYAN}{'=' * 70}{Style.RESET_ALL}\n")


def print_success(message):
    """Imprime mensaje de éxito"""
    print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")


def print_error(message):
    """Imprime mensaje de error"""
    print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")


def print_info(message):
    """Imprime mensaje informativo"""
    print(f"{Fore.YELLOW}ℹ {message}{Style.RESET_ALL}")


def print_step(message):
    """Imprime paso actual"""
    print(f"{Fore.MAGENTA}➤ {message}{Style.RESET_ALL}")


def print_warning(message):
    """Imprime advertencia"""
    print(f"{Fore.YELLOW}⚠ {message}{Style.RESET_ALL}")


def is_admin():
    """Verifica si el script se ejecuta como administrador"""
    try:
        return os.getuid() == 0
    except AttributeError:
        import ctypes
        return ctypes.windll.shell32.IsUserAnAdmin() != 0


def check_command_exists(command):
    """Verifica si un comando existe"""
    try:
        # En Windows, npm necesita shell=True
        if command == 'npm' and sys.platform == 'win32':
            subprocess.run(
                "npm --version",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
                shell=True
            )
        else:
            subprocess.run(
                [command, "--version"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True
            )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def get_version(command):
    """Obtiene la versión de un comando"""
    try:
        # En Windows, npm necesita shell=True
        if command == 'npm' and sys.platform == 'win32':
            result = subprocess.run(
                "npm --version",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True
            )
        else:
            result = subprocess.run(
                [command, "--version"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
        version = result.stdout.strip() or result.stderr.strip()
        return version.split('\n')[0]
    except:
        return "Desconocida"


def install_python():
    """Guía para instalar Python"""
    print_header("INSTALACIÓN DE PYTHON")
    
    if check_command_exists("python"):
        version = get_version("python")
        print_success(f"Python ya está instalado: {version}")
        return True
    
    print_warning("Python NO está instalado")
    print_info("Python es REQUERIDO para ejecutar el backend Flask")
    print()
    print("Para instalar Python:")
    print("1. Visita: https://www.python.org/downloads/")
    print("2. Descarga Python 3.11 o superior")
    print("3. IMPORTANTE: Durante la instalación, marca la opción 'Add Python to PATH'")
    print("4. Completa la instalación")
    print("5. Reinicia PowerShell y ejecuta este script nuevamente")
    print()
    
    response = input(f"{Fore.YELLOW}¿Quieres abrir el sitio de descarga ahora? (s/n): {Style.RESET_ALL}").lower()
    if response == 's':
        subprocess.run(["start", "https://www.python.org/downloads/"], shell=True)
        print_info("Sitio abierto en el navegador")
    
    return False


def install_nodejs():
    """Guía para instalar Node.js"""
    print_header("INSTALACIÓN DE NODE.JS")
    
    if check_command_exists("node"):
        version = get_version("node")
        print_success(f"Node.js ya está instalado: {version}")
        
        # Verificar npm también
        if check_command_exists("npm"):
            npm_version = get_version("npm")
            print_success(f"npm ya está instalado: {npm_version}")
        return True
    
    print_warning("Node.js NO está instalado")
    print_info("Node.js es REQUERIDO para la aplicación móvil React Native")
    print()
    print("Para instalar Node.js:")
    print("1. Visita: https://nodejs.org/")
    print("2. Descarga la versión LTS (recomendada)")
    print("3. Ejecuta el instalador")
    print("4. Sigue las instrucciones (usa las opciones por defecto)")
    print("5. Reinicia PowerShell y ejecuta este script nuevamente")
    print()
    
    response = input(f"{Fore.YELLOW}¿Quieres abrir el sitio de descarga ahora? (s/n): {Style.RESET_ALL}").lower()
    if response == 's':
        subprocess.run(["start", "https://nodejs.org/"], shell=True)
        print_info("Sitio abierto en el navegador")
    
    return False


def install_git():
    """Guía para instalar Git"""
    print_header("INSTALACIÓN DE GIT (OPCIONAL)")
    
    if check_command_exists("git"):
        version = get_version("git")
        print_success(f"Git ya está instalado: {version}")
        return True
    
    print_warning("Git NO está instalado")
    print_info("Git es opcional pero recomendado para control de versiones")
    print()
    
    response = input(f"{Fore.YELLOW}¿Quieres instalar Git? (s/n): {Style.RESET_ALL}").lower()
    if response != 's':
        print_info("Git no será instalado (puedes instalarlo después)")
        return True
    
    print()
    print("Para instalar Git:")
    print("1. Visita: https://git-scm.com/download/win")
    print("2. Descarga el instalador de 64 bits")
    print("3. Ejecuta el instalador")
    print("4. Usa las opciones por defecto")
    print("5. Reinicia PowerShell y ejecuta este script nuevamente")
    print()
    
    response = input(f"{Fore.YELLOW}¿Quieres abrir el sitio de descarga ahora? (s/n): {Style.RESET_ALL}").lower()
    if response == 's':
        subprocess.run(["start", "https://git-scm.com/download/win"], shell=True)
        print_info("Sitio abierto en el navegador")
    
    return False


def install_mysql():
    """Guía para instalar MySQL/XAMPP"""
    print_header("INSTALACIÓN DE MYSQL")
    
    print_info("Verificando si MySQL está corriendo...")
    
    # Intentar conectar a MySQL
    try:
        import pymysql
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            port=3306,
            connect_timeout=2
        )
        connection.close()
        print_success("MySQL ya está instalado y corriendo")
        return True
    except ImportError:
        print_info("PyMySQL no está instalado todavía (se instalará después)")
    except:
        pass
    
    print_warning("MySQL NO está corriendo o no está instalado")
    print_info("MySQL es REQUERIDO para la base de datos del proyecto")
    print()
    print("Opciones para instalar MySQL:")
    print()
    print("OPCIÓN 1 - XAMPP (Recomendada para desarrollo):")
    print("  • Incluye MySQL, Apache, PHP")
    print("  • Fácil de usar con interfaz gráfica")
    print("  • Incluye phpMyAdmin")
    print("  • Descarga: https://www.apachefriends.org/download.html")
    print()
    print("OPCIÓN 2 - MySQL Standalone:")
    print("  • Solo MySQL Server")
    print("  • Más ligero pero requiere configuración")
    print("  • Descarga: https://dev.mysql.com/downloads/installer/")
    print()
    print("OPCIÓN 3 - WAMP (Alternativa a XAMPP):")
    print("  • Similar a XAMPP")
    print("  • Descarga: https://www.wampserver.com/en/")
    print()
    
    print("¿Qué opción prefieres?")
    print("1) XAMPP (recomendada)")
    print("2) MySQL Standalone")
    print("3) WAMP")
    print("4) Ya lo tengo instalado / Instalaré después")
    
    choice = input(f"{Fore.YELLOW}Elige una opción (1-4): {Style.RESET_ALL}").strip()
    
    urls = {
        '1': "https://www.apachefriends.org/download.html",
        '2': "https://dev.mysql.com/downloads/installer/",
        '3': "https://www.wampserver.com/en/"
    }
    
    if choice in urls:
        subprocess.run(["start", urls[choice]], shell=True)
        print_info(f"Sitio abierto en el navegador")
        print()
        print("Después de instalar:")
        print("1. Inicia MySQL/XAMPP")
        print("2. Crea la base de datos 'CMCHEmployee'")
        print("3. Ejecuta los scripts SQL de la carpeta BD/")
        print("4. Vuelve a ejecutar este script")
        return False
    elif choice == '4':
        print_info("Asegúrate de tener MySQL corriendo antes de iniciar el proyecto")
        return True
    
    return False


def install_python_packages():
    """Instala las dependencias de Python"""
    print_header("INSTALANDO DEPENDENCIAS DE PYTHON")
    
    requirements_file = PROJECT_ROOT / "requirements.txt"
    
    if not requirements_file.exists():
        print_error(f"No se encontró {requirements_file}")
        return False
    
    print_step("Actualizando pip...")
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "--upgrade", "pip"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print_success("pip actualizado")
    except subprocess.CalledProcessError as e:
        print_warning("No se pudo actualizar pip, continuando...")
    
    print_step("Instalando paquetes desde requirements.txt...")
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", str(requirements_file)],
            check=True
        )
        print_success("Todas las dependencias de Python instaladas correctamente")
        
        # Mostrar paquetes instalados
        print()
        print_info("Paquetes instalados:")
        with open(requirements_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    print(f"  • {line}")
        
        return True
    except subprocess.CalledProcessError as e:
        print_error("Error al instalar dependencias de Python")
        print_error(str(e))
        return False


def install_nodejs_packages():
    """Instala las dependencias de Node.js"""
    print_header("INSTALANDO DEPENDENCIAS DE NODE.JS")
    
    app_dir = PROJECT_ROOT / "App" / "CMCH-bag"
    package_json = app_dir / "package.json"
    
    if not package_json.exists():
        print_error(f"No se encontró {package_json}")
        return False
    
    print_step("Instalando dependencias de Node.js (esto puede tardar varios minutos)...")
    print_info("Por favor espera, npm está descargando paquetes...")
    
    try:
        # Cambiar al directorio de la app
        os.chdir(app_dir)
        
        subprocess.run(
            ["npm", "install"],
            check=True,
            shell=True
        )
        
        print_success("Todas las dependencias de Node.js instaladas correctamente")
        
        # Verificar node_modules
        node_modules = app_dir / "node_modules"
        if node_modules.exists():
            num_packages = len(list(node_modules.iterdir()))
            print_info(f"Se instalaron aproximadamente {num_packages} paquetes")
        
        # Volver al directorio raíz
        os.chdir(PROJECT_ROOT)
        
        return True
    except subprocess.CalledProcessError as e:
        print_error("Error al instalar dependencias de Node.js")
        print_error(str(e))
        os.chdir(PROJECT_ROOT)
        return False


def install_expo_cli():
    """Instala Expo CLI globalmente"""
    print_header("INSTALANDO EXPO CLI")
    
    print_step("Verificando si Expo CLI está instalado...")
    
    # Verificar si expo está instalado
    try:
        result = subprocess.run(
            ["npx", "expo", "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )
        if result.returncode == 0:
            print_success(f"Expo CLI ya está disponible")
            return True
    except:
        pass
    
    print_info("Expo CLI no está instalado globalmente")
    print_info("No te preocupes, se usará 'npx expo' que descarga Expo automáticamente")
    print_success("Expo CLI configurado correctamente (modo npx)")
    
    return True


def setup_database():
    """Guía para configurar la base de datos"""
    print_header("CONFIGURACIÓN DE BASE DE DATOS")
    
    print_step("Verificando conexión a MySQL...")
    
    try:
        import pymysql
        
        # Intentar conectar
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            port=3306,
            connect_timeout=5
        )
        
        print_success("Conexión exitosa a MySQL")
        
        # Verificar si existe la base de datos
        with connection.cursor() as cursor:
            cursor.execute("SHOW DATABASES LIKE 'CMCHEmployee'")
            result = cursor.fetchone()
            
            if result:
                print_success("Base de datos 'CMCHEmployee' ya existe")
                
                # Verificar tablas
                connection.select_db('CMCHEmployee')
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                
                if tables:
                    print_success(f"La base de datos tiene {len(tables)} tablas")
                else:
                    print_warning("La base de datos existe pero no tiene tablas")
                    print_info("Debes ejecutar los scripts SQL de la carpeta BD/")
            else:
                print_warning("Base de datos 'CMCHEmployee' NO existe")
                print()
                response = input(f"{Fore.YELLOW}¿Quieres crear la base de datos ahora? (s/n): {Style.RESET_ALL}").lower()
                
                if response == 's':
                    cursor.execute("CREATE DATABASE CMCHEmployee")
                    print_success("Base de datos 'CMCHEmployee' creada correctamente")
                    print()
                    print_info("Siguiente paso: Ejecuta los scripts SQL de la carpeta BD/")
                    print_info("Puedes hacerlo desde phpMyAdmin o MySQL Workbench")
                else:
                    print_info("Recuerda crear la base de datos antes de iniciar el proyecto")
        
        connection.close()
        return True
        
    except ImportError:
        print_error("PyMySQL no está instalado (se instalará con requirements.txt)")
        return False
    except Exception as e:
        print_error(f"No se pudo conectar a MySQL: {e}")
        print()
        print_info("Asegúrate de que:")
        print("  1. MySQL/XAMPP esté corriendo")
        print("  2. El puerto 3306 esté disponible")
        print("  3. El usuario 'root' no tenga contraseña (o actualiza config.ini)")
        return False


def create_config_if_needed():
    """Crea el archivo config.ini si no existe"""
    print_header("CONFIGURACIÓN DEL PROYECTO")
    
    config_file = PROJECT_ROOT / "config.ini"
    
    if config_file.exists():
        print_success("Archivo config.ini ya existe")
        return True
    
    print_step("Creando archivo config.ini...")
    
    config_content = """# Configuración del proyecto CMCHEmployee
# Edita estos valores según tu entorno local

[database]
host = localhost
user = root
password = 
database = CMCHEmployee
port = 3306

[backend]
port = 5000
host = localhost

[expo]
port = 8081

[paths]
# Rutas relativas desde la raíz del proyecto
backend_dir = BackEnd
app_dir = App/CMCH-bag
frontend_dir = FrontEnd

[options]
# Opciones de comportamiento
auto_update_git = ask
auto_update_npm = ask
open_browser = false
verbose = true
"""
    
    try:
        with open(config_file, 'w', encoding='utf-8') as f:
            f.write(config_content)
        print_success("Archivo config.ini creado correctamente")
        print_info("Puedes editar config.ini para personalizar la configuración")
        return True
    except Exception as e:
        print_error(f"Error al crear config.ini: {e}")
        return False


def install_expo_go_guide():
    """Muestra guía para instalar Expo Go en móvil"""
    print_header("EXPO GO - APLICACIÓN MÓVIL")
    
    print_info("Para probar la aplicación móvil en tu dispositivo:")
    print()
    print("📱 Android:")
    print("  1. Abre Google Play Store")
    print("  2. Busca 'Expo Go'")
    print("  3. Instala la aplicación")
    print("  4. Abre Expo Go y escanea el código QR")
    print()
    print("📱 iOS:")
    print("  1. Abre App Store")
    print("  2. Busca 'Expo Go'")
    print("  3. Instala la aplicación")
    print("  4. Abre Expo Go y escanea el código QR")
    print()
    print_info("Asegúrate de que tu móvil esté en la misma red WiFi que tu PC")
    print()
    
    response = input(f"{Fore.YELLOW}¿Quieres abrir las páginas de descarga? (s/n): {Style.RESET_ALL}").lower()
    if response == 's':
        print_info("Abriendo páginas de descarga...")
        subprocess.run(["start", "https://play.google.com/store/apps/details?id=host.exp.exponent"], shell=True)
        print_success("Enlaces abiertos en el navegador")


def final_summary(results):
    """Muestra resumen final de la instalación"""
    print_header("RESUMEN DE INSTALACIÓN")
    
    all_ok = all(results.values())
    
    print("Estado de componentes:")
    print()
    
    for component, status in results.items():
        if status:
            print(f"{Fore.GREEN}✓ {component}{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}✗ {component}{Style.RESET_ALL}")
    
    print()
    print("="*70)
    
    if all_ok:
        print(f"{Fore.GREEN}{Style.BRIGHT}")
        print("🎉 ¡INSTALACIÓN COMPLETA! 🎉")
        print(Style.RESET_ALL)
        print()
        print("Siguiente paso:")
        print(f"  {Fore.CYAN}1. Haz doble clic en: INICIAR.bat{Style.RESET_ALL}")
        print(f"  {Fore.CYAN}2. O ejecuta: python start_project.py{Style.RESET_ALL}")
        print()
        print("El script verificará todo e iniciará el proyecto automáticamente")
    else:
        print(f"{Fore.YELLOW}{Style.BRIGHT}")
        print("⚠ INSTALACIÓN INCOMPLETA")
        print(Style.RESET_ALL)
        print()
        print("Componentes faltantes (marcados con ✗):")
        print()
        for component, status in results.items():
            if not status:
                print(f"  • {component}")
        print()
        print("Por favor instala los componentes faltantes y ejecuta este script nuevamente")
    
    print("="*70)
    print()


def main():
    """Función principal"""
    print(f"{Fore.CYAN}{Style.BRIGHT}")
    print("""
    ╔═══════════════════════════════════════════════════════════════════╗
    ║                                                                   ║
    ║           INSTALADOR COMPLETO - CMCH EMPLOYEE                     ║
    ║                                                                   ║
    ║         Este script instalará todo lo necesario para:             ║
    ║           • Backend Flask (Python)                                ║
    ║           • Frontend Web (HTML/CSS/JS)                            ║
    ║           • Aplicación Móvil (React Native + Expo)                ║
    ║           • Base de Datos (MySQL)                                 ║
    ║                                                                   ║
    ╚═══════════════════════════════════════════════════════════════════╝
    """)
    print(Style.RESET_ALL)
    
    print_info("Este proceso puede tardar entre 10-30 minutos dependiendo de tu conexión")
    print_info("Asegúrate de tener conexión a internet estable")
    print()
    
    response = input(f"{Fore.YELLOW}¿Deseas continuar? (s/n): {Style.RESET_ALL}").lower()
    if response != 's':
        print_info("Instalación cancelada")
        return
    
    # Diccionario para guardar resultados
    results = {}
    
    try:
        # Paso 1: Verificar e instalar herramientas del sistema
        print_header("PASO 1/8 - HERRAMIENTAS DEL SISTEMA")
        results['Python'] = install_python()
        
        if not results['Python']:
            print_error("Python es requerido. Instálalo y vuelve a ejecutar este script.")
            return
        
        results['Node.js'] = install_nodejs()
        
        if not results['Node.js']:
            print_error("Node.js es requerido. Instálalo y vuelve a ejecutar este script.")
            return
        
        results['Git'] = install_git()
        
        # Paso 2: MySQL
        print_header("PASO 2/8 - BASE DE DATOS MYSQL")
        results['MySQL'] = install_mysql()
        
        # Paso 3: Dependencias Python
        print_header("PASO 3/8 - DEPENDENCIAS PYTHON")
        results['Paquetes Python'] = install_python_packages()
        
        # Paso 4: Dependencias Node.js
        print_header("PASO 4/8 - DEPENDENCIAS NODE.JS")
        results['Paquetes Node.js'] = install_nodejs_packages()
        
        # Paso 5: Expo CLI
        print_header("PASO 5/8 - EXPO CLI")
        results['Expo CLI'] = install_expo_cli()
        
        # Paso 6: Configuración
        print_header("PASO 6/8 - CONFIGURACIÓN")
        results['Archivo config.ini'] = create_config_if_needed()
        
        # Paso 7: Base de datos
        print_header("PASO 7/8 - CONFIGURACIÓN DE BASE DE DATOS")
        results['Base de datos'] = setup_database()
        
        # Paso 8: Guía Expo Go
        print_header("PASO 8/8 - APLICACIÓN MÓVIL (OPCIONAL)")
        install_expo_go_guide()
        
        # Resumen final
        final_summary(results)
        
    except KeyboardInterrupt:
        print()
        print_warning("\nInstalación interrumpida por el usuario")
        print_info("Puedes ejecutar este script nuevamente cuando quieras")
    except Exception as e:
        print_error(f"\nError inesperado: {e}")
        print_info("Por favor reporta este error si persiste")


if __name__ == "__main__":
    main()
