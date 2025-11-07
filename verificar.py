#!/usr/bin/env python3
"""
Script de verificación rápida - CMCHEmployee
Verifica que todos los componentes estén listos antes de iniciar
"""

import sys
import subprocess
from pathlib import Path

def check_tool(command, name):
    """Verifica si una herramienta está instalada"""
    try:
        # En Windows, npm necesita shell=True
        if command == "npm" and sys.platform == "win32":
            subprocess.run("npm --version", 
                          stdout=subprocess.PIPE, 
                          stderr=subprocess.PIPE, 
                          check=True,
                          shell=True)
        else:
            subprocess.run([command, "--version"], 
                          stdout=subprocess.PIPE, 
                          stderr=subprocess.PIPE, 
                          check=True)
        print(f"✓ {name} instalado")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"✗ {name} NO encontrado")
        return False

def check_file(filepath, name):
    """Verifica si un archivo existe"""
    if filepath.exists():
        print(f"✓ {name} encontrado")
        return True
    else:
        print(f"✗ {name} NO encontrado")
        return False

def main():
    print("\n" + "="*60)
    print("VERIFICACIÓN RÁPIDA - CMCHEmployee")
    print("="*60 + "\n")
    
    checks = []
    
    print("🔧 Herramientas del Sistema:")
    checks.append(check_tool("python", "Python"))
    checks.append(check_tool("node", "Node.js"))
    checks.append(check_tool("npm", "npm"))
    checks.append(check_tool("git", "Git (opcional)") or True)  # Git es opcional
    
    print("\n📁 Archivos del Proyecto:")
    root = Path(__file__).parent
    checks.append(check_file(root / "start_project.py", "Script de inicio"))
    checks.append(check_file(root / "INICIAR.bat", "Acceso rápido"))
    checks.append(check_file(root / "config.ini", "Configuración"))
    checks.append(check_file(root / "requirements.txt", "Dependencias Python"))
    checks.append(check_file(root / "BackEnd" / "app.py", "Backend Flask"))
    checks.append(check_file(root / "App" / "CMCH-bag" / "package.json", "Mobile App"))
    
    print("\n" + "="*60)
    if all(checks):
        print("✅ TODO LISTO - Puedes ejecutar start_project.py o INICIAR.bat")
    else:
        print("⚠️  HAY PROBLEMAS - Revisa los elementos marcados con ✗")
        print("\nPara instalar dependencias faltantes:")
        print("  - Python: https://www.python.org/downloads/")
        print("  - Node.js: https://nodejs.org/")
        print("  - Git: https://git-scm.com/")
    print("="*60 + "\n")
    
    return all(checks)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
