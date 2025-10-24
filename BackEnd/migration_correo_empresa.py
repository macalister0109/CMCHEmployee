"""
Script de migración: Agregar campo correo_empresa a la tabla empresas
Ejecuta este script ANTES de reiniciar el servidor Flask
"""

import pymysql
import sys
from colorama import init, Fore, Style

init(autoreset=True)

# Configuración de la base de datos (ajusta según tu configuración)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',  # Cambia según tu configuración
    'password': '',  # Cambia según tu configuración
    'database': 'cmchemployee',
    'charset': 'utf8mb4'
}

def print_step(step, message):
    """Imprime un paso con formato"""
    print(f"\n{Fore.CYAN}[{step}]{Style.RESET_ALL} {message}")

def print_success(message):
    """Imprime un mensaje de éxito"""
    print(f"{Fore.GREEN}✓{Style.RESET_ALL} {message}")

def print_error(message):
    """Imprime un mensaje de error"""
    print(f"{Fore.RED}✗{Style.RESET_ALL} {message}")

def print_warning(message):
    """Imprime un mensaje de advertencia"""
    print(f"{Fore.YELLOW}⚠{Style.RESET_ALL} {message}")

def check_column_exists(cursor, table, column):
    """Verifica si una columna existe en una tabla"""
    cursor.execute(f"""
        SELECT COUNT(*) 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}' 
        AND TABLE_NAME = '{table}' 
        AND COLUMN_NAME = '{column}'
    """)
    return cursor.fetchone()[0] > 0

def main():
    print("=" * 70)
    print(f"{Fore.YELLOW}{'MIGRACIÓN DE BASE DE DATOS':^70}{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}{'Agregar campo correo_empresa':^70}{Style.RESET_ALL}")
    print("=" * 70)
    
    connection = None
    try:
        # Paso 1: Conectar a la base de datos
        print_step(1, "Conectando a la base de datos...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print_success(f"Conectado a: {DB_CONFIG['database']}")
        
        # Paso 2: Verificar si el campo ya existe
        print_step(2, "Verificando si el campo ya existe...")
        if check_column_exists(cursor, 'empresas', 'correo_empresa'):
            print_warning("El campo 'correo_empresa' ya existe en la tabla empresas")
            print_warning("No es necesario ejecutar la migración")
            return
        
        print_success("El campo no existe. Procediendo con la migración...")
        
        # Paso 3: Agregar el campo correo_empresa
        print_step(3, "Agregando campo 'correo_empresa' a la tabla empresas...")
        cursor.execute("""
            ALTER TABLE `empresas` 
            ADD COLUMN `correo_empresa` VARCHAR(100) NULL 
            COMMENT 'Correo principal de la empresa'
            AFTER `correo_contacto`
        """)
        connection.commit()
        print_success("Campo agregado exitosamente")
        
        # Paso 4: Copiar datos de correo_contacto a correo_empresa
        print_step(4, "Copiando datos existentes de correo_contacto a correo_empresa...")
        cursor.execute("""
            UPDATE `empresas` 
            SET `correo_empresa` = `correo_contacto` 
            WHERE `correo_empresa` IS NULL
        """)
        rows_affected = cursor.rowcount
        connection.commit()
        print_success(f"Datos copiados: {rows_affected} registros actualizados")
        
        # Paso 5: Verificar la migración
        print_step(5, "Verificando la migración...")
        cursor.execute("""
            SELECT 
                COUNT(*) as total_empresas,
                COUNT(correo_empresa) as empresas_con_correo
            FROM `empresas`
        """)
        total, con_correo = cursor.fetchone()
        print_success(f"Total empresas: {total}")
        print_success(f"Empresas con correo_empresa: {con_correo}")
        
        # Paso 6: Mostrar estructura actualizada
        print_step(6, "Estructura actualizada de la tabla empresas:")
        cursor.execute("DESCRIBE `empresas`")
        columns = cursor.fetchall()
        
        print(f"\n{Fore.CYAN}{'Campo':<25} {'Tipo':<20} {'Nulo':<8} {'Clave':<8} {'Default':<15}{Style.RESET_ALL}")
        print("-" * 80)
        for col in columns:
            field, type_, null, key, default, extra = col
            # Resaltar el nuevo campo
            if field == 'correo_empresa':
                print(f"{Fore.GREEN}{field:<25}{Style.RESET_ALL} {type_:<20} {null:<8} {key:<8} {str(default):<15}")
            else:
                print(f"{field:<25} {type_:<20} {null:<8} {key:<8} {str(default):<15}")
        
        print("\n" + "=" * 70)
        print(f"{Fore.GREEN}{'✓ MIGRACIÓN COMPLETADA EXITOSAMENTE':^70}{Style.RESET_ALL}")
        print("=" * 70)
        print(f"\n{Fore.YELLOW}Próximos pasos:{Style.RESET_ALL}")
        print("1. Reinicia el servidor Flask")
        print("2. Prueba el registro de empresas")
        print("3. Verifica que el campo correo_empresa se guarde correctamente")
        
    except pymysql.Error as e:
        print_error(f"Error de base de datos: {e}")
        if connection:
            connection.rollback()
        sys.exit(1)
        
    except Exception as e:
        print_error(f"Error inesperado: {e}")
        if connection:
            connection.rollback()
        sys.exit(1)
        
    finally:
        if connection:
            cursor.close()
            connection.close()
            print(f"\n{Fore.CYAN}Conexión cerrada{Style.RESET_ALL}")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Fore.YELLOW}Operación cancelada por el usuario{Style.RESET_ALL}")
        sys.exit(0)
