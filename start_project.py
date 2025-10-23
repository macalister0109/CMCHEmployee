#!/usr/bin/env python3
"""
Script de inicio automático para el proyecto CMCHEmployee
Verifica, actualiza dependencias e inicia todos los servicios necesarios
"""

import os
import sys
import subprocess
import time
import socket
from pathlib import Path
import pymysql
from colorama import init, Fore, Style
import configparser

# Inicializar colorama para colores en Windows
init(autoreset=True)

# Configuración del proyecto
PROJECT_ROOT = Path(__file__).parent
CONFIG_FILE = PROJECT_ROOT / "config.ini"

# Cargar configuración desde config.ini
config = configparser.ConfigParser()
if CONFIG_FILE.exists():
    config.read(CONFIG_FILE)
    
    # Configuración de la base de datos
    DB_CONFIG = {
        'host': config.get('database', 'host', fallback='localhost'),
        'user': config.get('database', 'user', fallback='root'),
        'password': config.get('database', 'password', fallback=''),
        'database': config.get('database', 'database', fallback='CMCHEmployee'),
        'port': config.getint('database', 'port', fallback=3306)
    }
    
    # Rutas del proyecto
    BACKEND_DIR = PROJECT_ROOT / config.get('paths', 'backend_dir', fallback='BackEnd')
    APP_DIR = PROJECT_ROOT / config.get('paths', 'app_dir', fallback='App/CMCHEmployee')
    
    # Puertos
    BACKEND_PORT = config.getint('backend', 'port', fallback=5000)
    EXPO_PORT = config.getint('expo', 'port', fallback=8081)
else:
    # Valores por defecto si no existe config.ini
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'CMCHEmployee',
        'port': 3306
    }
    BACKEND_DIR = PROJECT_ROOT / "BackEnd"
    APP_DIR = PROJECT_ROOT / "App" / "CMCHEmployee"
    BACKEND_PORT = 5000
    EXPO_PORT = 8081

REQUIREMENTS_FILE = PROJECT_ROOT / "requirements.txt"
PACKAGE_JSON = APP_DIR / "package.json"

# Procesos activos
processes = []


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


def check_command_exists(command):
    """Verifica si un comando existe en el sistema"""
    try:
        # En Windows, npm necesita shell=True o .cmd
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


def check_dependencies():
    """Verifica que todas las herramientas necesarias estén instaladas"""
    print_header("VERIFICANDO DEPENDENCIAS DEL SISTEMA")
    
    dependencies = {
        'python': 'Python',
        'node': 'Node.js',
        'npm': 'npm',
        'git': 'Git'
    }
    
    all_ok = True
    for cmd, name in dependencies.items():
        print_step(f"Verificando {name}...")
        if check_command_exists(cmd):
            # Obtener versión
            try:
                # En Windows, npm necesita shell=True
                if cmd == 'npm' and sys.platform == 'win32':
                    result = subprocess.run(
                        "npm --version",
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        shell=True
                    )
                else:
                    result = subprocess.run(
                        [cmd, "--version"],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                version = result.stdout.strip() or result.stderr.strip()
                print_success(f"{name} instalado: {version}")
            except:
                print_success(f"{name} instalado")
        else:
            print_error(f"{name} NO encontrado. Por favor instálalo.")
            all_ok = False
    
    if not all_ok:
        print_error("\nFaltan dependencias críticas. Por favor instálalas antes de continuar.")
        sys.exit(1)
    
    print_success("\n¡Todas las dependencias del sistema están instaladas!")


def check_database_connection():
    """Verifica la conexión a la base de datos MySQL"""
    print_header("VERIFICANDO CONEXIÓN A LA BASE DE DATOS")
    
    print_step(f"Intentando conectar a MySQL en {DB_CONFIG['host']}:{DB_CONFIG['port']}...")
    
    try:
        connection = pymysql.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            port=DB_CONFIG['port'],
            connect_timeout=5
        )
        print_success(f"Conexión exitosa al servidor MySQL")
        
        # Verificar si existe la base de datos
        print_step(f"Verificando base de datos '{DB_CONFIG['database']}'...")
        with connection.cursor() as cursor:
            cursor.execute(f"SHOW DATABASES LIKE '{DB_CONFIG['database']}'")
            result = cursor.fetchone()
            
            if result:
                print_success(f"Base de datos '{DB_CONFIG['database']}' encontrada")
                
                # Conectar a la base de datos específica
                connection.select_db(DB_CONFIG['database'])
                
                # Verificar tablas
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                if tables:
                    print_success(f"Base de datos contiene {len(tables)} tablas")
                    print_info(f"Tablas: {', '.join([t[0] for t in tables[:5]])}{'...' if len(tables) > 5 else ''}")
                else:
                    print_error("La base de datos existe pero no tiene tablas")
                    print_info("Ejecuta los scripts de creación de tablas en la carpeta BD/")
            else:
                print_error(f"Base de datos '{DB_CONFIG['database']}' NO encontrada")
                print_info(f"Por favor crea la base de datos ejecutando: CREATE DATABASE {DB_CONFIG['database']};")
                connection.close()
                return False
        
        connection.close()
        return True
        
    except pymysql.err.OperationalError as e:
        print_error(f"Error de conexión: {e}")
        print_info("Asegúrate de que MySQL esté ejecutándose")
        print_info("Puedes iniciar MySQL desde XAMPP, WAMP o el servicio de Windows")
        return False
    except Exception as e:
        print_error(f"Error inesperado: {e}")
        return False


def check_git_status():
    """Verifica el estado de Git y actualiza si es necesario"""
    print_header("VERIFICANDO ESTADO DEL REPOSITORIO GIT")
    
    if not (PROJECT_ROOT / ".git").exists():
        print_info("Este proyecto no es un repositorio Git")
        return
    
    try:
        # Verificar rama actual
        result = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=PROJECT_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        branch = result.stdout.strip()
        print_info(f"Rama actual: {branch}")
        
        # Verificar si hay cambios sin commitear
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=PROJECT_ROOT,
            stdout=subprocess.PIPE,
            text=True,
            check=True
        )
        
        if result.stdout.strip():
            print_info("Hay cambios sin commitear en el repositorio")
            print_info("Archivos modificados:")
            for line in result.stdout.strip().split('\n')[:5]:
                print(f"  {line}")
        else:
            print_success("No hay cambios sin commitear")
        
        # Verificar si hay actualizaciones disponibles
        print_step("Verificando actualizaciones remotas...")
        subprocess.run(
            ["git", "fetch"],
            cwd=PROJECT_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        
        result = subprocess.run(
            ["git", "status", "-uno"],
            cwd=PROJECT_ROOT,
            stdout=subprocess.PIPE,
            text=True,
            check=True
        )
        
        if "Your branch is behind" in result.stdout:
            print_info("Hay actualizaciones disponibles en el repositorio remoto")
            response = input(f"{Fore.YELLOW}¿Deseas hacer pull? (s/n): {Style.RESET_ALL}").lower()
            if response == 's':
                print_step("Actualizando repositorio...")
                subprocess.run(
                    ["git", "pull"],
                    cwd=PROJECT_ROOT,
                    check=True
                )
                print_success("Repositorio actualizado")
        else:
            print_success("El repositorio está actualizado")
            
    except subprocess.CalledProcessError as e:
        print_error(f"Error al verificar Git: {e}")


def update_python_dependencies():
    """Actualiza las dependencias de Python"""
    print_header("ACTUALIZANDO DEPENDENCIAS DE PYTHON")
    
    if not REQUIREMENTS_FILE.exists():
        print_error(f"No se encontró {REQUIREMENTS_FILE}")
        return False
    
    print_step("Instalando/actualizando dependencias de Python...")
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", str(REQUIREMENTS_FILE)],
            check=True
        )
        print_success("Dependencias de Python actualizadas correctamente")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Error al instalar dependencias de Python: {e}")
        return False


def update_node_dependencies():
    """Actualiza las dependencias de Node.js"""
    print_header("ACTUALIZANDO DEPENDENCIAS DE NODE.JS")
    
    if not PACKAGE_JSON.exists():
        print_error(f"No se encontró {PACKAGE_JSON}")
        return False
    
    if not (APP_DIR / "node_modules").exists():
        print_step("Instalando dependencias de Node.js por primera vez...")
        try:
            subprocess.run(
                ["npm", "install"],
                cwd=APP_DIR,
                check=True,
                shell=True
            )
            print_success("Dependencias de Node.js instaladas correctamente")
            return True
        except subprocess.CalledProcessError as e:
            print_error(f"Error al instalar dependencias: {e}")
            return False
    else:
        print_step("Verificando dependencias de Node.js...")
        try:
            # Verificar si hay actualizaciones
            result = subprocess.run(
                ["npm", "outdated"],
                cwd=APP_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True
            )
            
            if result.stdout.strip():
                print_info("Hay actualizaciones disponibles para algunos paquetes")
                print(result.stdout)
                response = input(f"{Fore.YELLOW}¿Deseas actualizar? (s/n): {Style.RESET_ALL}").lower()
                if response == 's':
                    print_step("Actualizando dependencias...")
                    subprocess.run(
                        ["npm", "update"],
                        cwd=APP_DIR,
                        check=True,
                        shell=True
                    )
                    print_success("Dependencias actualizadas")
            else:
                print_success("Todas las dependencias están actualizadas")
            
            return True
        except subprocess.CalledProcessError as e:
            print_error(f"Error al verificar dependencias: {e}")
            return False


def is_port_in_use(port):
    """Verifica si un puerto está en uso"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0


def start_backend():
    """Inicia el servidor Flask"""
    print_header("INICIANDO SERVIDOR BACKEND (FLASK)")
    
    if is_port_in_use(BACKEND_PORT):
        print_info(f"El puerto {BACKEND_PORT} ya está en uso. El backend podría estar ejecutándose.")
        response = input(f"{Fore.YELLOW}¿Deseas continuar de todas formas? (s/n): {Style.RESET_ALL}").lower()
        if response != 's':
            return None
    
    app_py = BACKEND_DIR / "app.py"
    if not app_py.exists():
        print_error(f"No se encontró {app_py}")
        return None
    
    print_step(f"Iniciando Flask en http://localhost:{BACKEND_PORT} ...")
    
    try:
        # Iniciar Flask en una nueva ventana de CMD
        backend_path = str(BACKEND_DIR.resolve())
        
        batch_content = f'@echo off\ncd /d "{backend_path}"\necho Iniciando Flask Backend...\npython app.py'
        batch_file = PROJECT_ROOT / 'temp_start_backend.bat'
        
        with open(batch_file, 'w') as f:
            f.write(batch_content)
        
        process = subprocess.Popen(
            [str(batch_file)],
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
        
        # Esperar un momento para que el servidor inicie
        time.sleep(3)
        
        # Verificar si el servidor está corriendo
        if is_port_in_use(BACKEND_PORT):
            print_success(f"Servidor Flask iniciado correctamente en http://localhost:{BACKEND_PORT}")
            return process
        else:
            print_error("El servidor Flask no pudo iniciarse correctamente")
            return None
            
    except Exception as e:
        print_error(f"Error al iniciar Flask: {e}")
        return None


def start_mobile_app():
    """Inicia la aplicación móvil con Expo"""
    print_header("INICIANDO APLICACIÓN MÓVIL (EXPO)")
    
    if is_port_in_use(EXPO_PORT):
        print_info(f"El puerto {EXPO_PORT} ya está en uso. Expo podría estar ejecutándose.")
        response = input(f"{Fore.YELLOW}¿Deseas continuar de todas formas? (s/n): {Style.RESET_ALL}").lower()
        if response != 's':
            return None
    
    print_step("Iniciando Expo Metro Bundler...")
    
    try:
        # Iniciar Expo en una nueva ventana de CMD
        app_path = str(APP_DIR.resolve())
        
        # Crear un script batch temporal para evitar problemas con comillas
        batch_content = f'@echo off\ncd /d "{app_path}"\necho Iniciando Expo Metro Bundler...\nnpm start'
        batch_file = PROJECT_ROOT / 'temp_start_expo.bat'
        
        with open(batch_file, 'w') as f:
            f.write(batch_content)
        
        process = subprocess.Popen(
            [str(batch_file)],
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
        
        print_success("Expo Metro Bundler iniciado")
        print_info("Se abrirá una nueva ventana con el servidor de Expo")
        print_info("Escanea el código QR con la app Expo Go para ver la aplicación")
        
        return process
        
    except Exception as e:
        print_error(f"Error al iniciar Expo: {e}")
        return None


def main():
    """Función principal"""
    print(f"{Fore.CYAN}{Style.BRIGHT}")
    print("""
    ╔═══════════════════════════════════════════════════════════════════╗
    ║                                                                   ║
    ║              CMCH EMPLOYEE - SCRIPT DE INICIO                     ║
    ║                                                                   ║
    ║              Proyecto: Legado TP - Bolsa de Empleo                ║
    ║                                                                   ║
    ╚═══════════════════════════════════════════════════════════════════╝
    """)
    print(Style.RESET_ALL)
    
    try:
        # Paso 1: Verificar dependencias del sistema
        check_dependencies()
        
        # Paso 2: Verificar Git y actualizar si es necesario
        check_git_status()
        
        # Paso 3: Verificar conexión a la base de datos
        db_ok = check_database_connection()
        if not db_ok:
            print_error("\nNo se pudo conectar a la base de datos.")
            print_info("El backend no podrá funcionar correctamente sin la base de datos.")
            response = input(f"{Fore.YELLOW}¿Deseas continuar de todas formas? (s/n): {Style.RESET_ALL}").lower()
            if response != 's':
                print_info("Abortando inicio del proyecto.")
                sys.exit(1)
        
        # Paso 4: Actualizar dependencias de Python
        if not update_python_dependencies():
            print_error("Error al actualizar dependencias de Python")
            sys.exit(1)
        
        # Paso 5: Actualizar dependencias de Node.js
        if not update_node_dependencies():
            print_error("Error al actualizar dependencias de Node.js")
            sys.exit(1)
        
        # Paso 6: Iniciar servicios
        print_header("INICIANDO SERVICIOS")
        
        # Iniciar backend
        backend_process = start_backend()
        if backend_process:
            processes.append(('Backend', backend_process))
        
        # Esperar un poco entre servicios
        time.sleep(2)
        
        # Iniciar aplicación móvil
        mobile_process = start_mobile_app()
        if mobile_process:
            processes.append(('Mobile App', mobile_process))
        
        # Resumen final
        print_header("ESTADO FINAL")
        print_success("✓ Proyecto iniciado correctamente")
        print_info(f"\nServicios activos:")
        for name, process in processes:
            status = "✓ Corriendo" if process.poll() is None else "✗ Detenido"
            print(f"  {name}: {status}")
        
        print(f"\n{Fore.CYAN}Enlaces útiles:")
        print(f"  • Backend (Web):     http://localhost:{BACKEND_PORT}")
        print(f"  • Expo Dev Tools:    http://localhost:{EXPO_PORT}")
        print(f"\n{Fore.YELLOW}Presiona Ctrl+C para detener todos los servicios{Style.RESET_ALL}\n")
        
        # Mantener el script corriendo
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n{Fore.YELLOW}Deteniendo servicios...{Style.RESET_ALL}")
            for name, process in processes:
                try:
                    process.terminate()
                    print_info(f"Detenido: {name}")
                except:
                    pass
            print_success("¡Hasta luego!")
            
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Proceso interrumpido por el usuario{Style.RESET_ALL}")
        sys.exit(0)
    except Exception as e:
        print_error(f"Error inesperado: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
