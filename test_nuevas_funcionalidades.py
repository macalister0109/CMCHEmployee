# Script de Prueba - Sistema de Búsqueda y CRUD de Puestos
# Para ejecutar: python test_nuevas_funcionalidades.py

import requests
import json

BASE_URL = "http://localhost:5000"

print("="*60)
print("🧪 PRUEBAS DE NUEVAS FUNCIONALIDADES")
print("="*60)
print()

# 1. Probar búsqueda sin filtros
print("1️⃣  Probando búsqueda sin filtros...")
try:
    response = requests.get(f"{BASE_URL}/api/buscar")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Éxito: {data.get('total_resultados', 0)} resultados encontrados")
    else:
        print(f"   ❌ Error: Status {response.status_code}")
except Exception as e:
    print(f"   ❌ Error de conexión: {e}")
print()

# 2. Probar búsqueda con filtros
print("2️⃣  Probando búsqueda con filtros...")
try:
    params = {
        'q': 'programación',
        'region': 'Región Metropolitana',
        'modalidad': 'Remoto'
    }
    response = requests.get(f"{BASE_URL}/api/buscar", params=params)
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Éxito: {data.get('total_resultados', 0)} resultados con filtros")
        print(f"   📋 Filtros aplicados: {data.get('filtros_aplicados', {})}")
    else:
        print(f"   ❌ Error: Status {response.status_code}")
except Exception as e:
    print(f"   ❌ Error de conexión: {e}")
print()

# 3. Probar endpoint de empresas (debe existir)
print("3️⃣  Probando endpoint de empresas...")
try:
    response = requests.get(f"{BASE_URL}/api/empresas")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Éxito: {len(data)} empresas en el sistema")
    else:
        print(f"   ❌ Error: Status {response.status_code}")
except Exception as e:
    print(f"   ❌ Error de conexión: {e}")
print()

# 4. Probar endpoint de puestos
print("4️⃣  Probando endpoint de puestos...")
try:
    response = requests.get(f"{BASE_URL}/api/puestos")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Éxito: {len(data)} puestos disponibles")
    else:
        print(f"   ❌ Error: Status {response.status_code}")
except Exception as e:
    print(f"   ❌ Error de conexión: {e}")
print()

# 5. Verificar que las páginas existan
print("5️⃣  Verificando páginas web...")
paginas = [
    ('/', 'Página principal'),
    ('/resultados-busqueda', 'Resultados de búsqueda'),
    ('/login_empresa', 'Login empresa')
]

for ruta, nombre in paginas:
    try:
        response = requests.get(f"{BASE_URL}{ruta}")
        if response.status_code == 200:
            print(f"   ✅ {nombre}: OK")
        else:
            print(f"   ⚠️  {nombre}: Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ {nombre}: Error {e}")
print()

print("="*60)
print("📊 RESUMEN")
print("="*60)
print("""
✅ Si todos los tests pasaron:
   - El backend está funcionando correctamente
   - Los nuevos endpoints están disponibles
   - Las páginas web son accesibles

🔐 Para probar el dashboard de empresa:
   1. Ir a http://localhost:5000/login_empresa
   2. Iniciar sesión con una empresa registrada
   3. Serás redirigido al dashboard automáticamente

🔍 Para probar la búsqueda:
   1. Ir a http://localhost:5000
   2. Usar el formulario de búsqueda
   3. Ver resultados en la nueva página

📱 Para la app móvil:
   - Los endpoints ya están integrados en api.ts
   - Usar los nuevos métodos del apiService
""")

print("="*60)
