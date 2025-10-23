@echo off
chcp 65001 > nul
title CMCHEmployee - Instalador Completo

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║           INSTALADOR COMPLETO - CMCH EMPLOYEE                     ║
echo ║                                                                   ║
echo ║         Este script instalará todo lo necesario para el           ║
echo ║         proyecto CMCHEmployee                                     ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo [INFO] Verificando Python...
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no está instalado
    echo.
    echo El instalador necesita Python para funcionar.
    echo Por favor:
    echo   1. Ve a: https://www.python.org/downloads/
    echo   2. Descarga Python 3.11 o superior
    echo   3. Durante la instalación, marca "Add Python to PATH"
    echo   4. Completa la instalación
    echo   5. Reinicia PowerShell y ejecuta este archivo nuevamente
    echo.
    set /p OPEN="¿Quieres abrir el sitio de descarga? (S/N): "
    if /i "%OPEN%"=="S" (
        start https://www.python.org/downloads/
    )
    pause
    exit /b 1
)

echo [OK] Python está instalado
echo.

REM Instalar colorama si no está
echo [INFO] Verificando colorama...
python -c "import colorama" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Instalando colorama...
    python -m pip install colorama
)

REM Ejecutar el script de instalación
echo [INFO] Iniciando instalador...
echo.
python instalar_todo.py

REM Verificar si hubo errores
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] El instalador terminó con errores
    echo Por favor revisa los mensajes anteriores
    pause
    exit /b 1
)

echo.
echo [OK] Instalación completada
echo.
pause
