@echo off
chcp 65001 > nul
title CMCHEmployee - Inicio Automático

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║              CMCH EMPLOYEE - INICIO AUTOMÁTICO                    ║
echo ║                                                                   ║
echo ║              Proyecto: Legado TP - Bolsa de Empleo                ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo Iniciando proyecto...
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no está instalado o no está en PATH
    echo Por favor instala Python desde: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Instalar colorama si no está instalado
pip show colorama >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Instalando colorama...
    pip install colorama
)

REM Ejecutar el script de Python
python start_project.py

REM Si el script termina con error, mantener la ventana abierta
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] El script terminó con errores
    pause
)
