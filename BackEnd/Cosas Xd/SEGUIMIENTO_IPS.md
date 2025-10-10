# 🌐 Sistema de Seguimiento de IPs

## Descripción
Sistema ligero de monitoreo de visitantes que muestra en tiempo real qué IPs están accediendo a la aplicación.

## Características

### 📊 Registro en Terminal
Cada vez que una IP accede a la aplicación, se muestra:
```
🌐 [14:32:15] 192.168.1.100 → GET main (visita #3)
🌐 [14:32:18] 192.168.1.105 → POST login (visita #1)
🌐 [14:32:20] 192.168.1.100 → GET api_empresas (visita #4)
```

**Formato:**
- `[HH:MM:SS]` - Timestamp de la visita
- `IP` - Dirección IP del visitante
- `MÉTODO` - HTTP method (GET, POST, etc.)
- `ENDPOINT` - Ruta o endpoint visitado
- `(visita #N)` - Contador de visitas de esa IP

### 🎯 Filtrado Inteligente
- **Ignora archivos estáticos** (CSS, JS, imágenes) para no saturar la terminal
- Solo registra rutas principales y endpoints de API

### 📈 Endpoint de Estadísticas
**URL:** `http://localhost:5000/api/stats/visitors`

**Respuesta JSON:**
```json
{
  "total_unique_visitors": 5,
  "total_visits": 47,
  "visitors": [
    {
      "ip": "192.168.1.100",
      "visits": 25,
      "last_seen": "2025-10-07 14:35:22",
      "pages_visited": 8,
      "unique_pages": ["main", "login", "register", "api_empresas"]
    },
    {
      "ip": "192.168.1.105",
      "visits": 12,
      "last_seen": "2025-10-07 14:30:10",
      "pages_visited": 4,
      "unique_pages": ["main", "login_empresa", "register_empresa"]
    }
  ]
}
```

## Implementación Técnica

### Funciones Clave

#### `get_client_ip()`
Obtiene la IP real del cliente, incluso si está detrás de proxies:
```python
def get_client_ip():
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    return request.remote_addr or 'Unknown'
```

#### `@app.before_request` - Middleware
Se ejecuta antes de cada request para registrar la visita:
```python
@app.before_request
def track_visitor():
    # Ignora archivos estáticos
    if request.path.startswith('/assets/') or request.path.startswith('/static/'):
        return
    
    ip = get_client_ip()
    endpoint = request.endpoint or request.path
    method = request.method
    
    # Actualiza contador y muestra en terminal
    ip_tracker[ip]['count'] += 1
    ip_tracker[ip]['last_seen'] = datetime.now()
    ip_tracker[ip]['pages'].add(endpoint)
    
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f"🌐 [{timestamp}] {ip} → {method} {endpoint} (visita #{ip_tracker[ip]['count']})")
```

### Estructura de Datos
```python
ip_tracker = {
    '192.168.1.100': {
        'count': 25,
        'last_seen': datetime(2025, 10, 7, 14, 35, 22),
        'pages': {'main', 'login', 'register', 'api_empresas'}
    },
    # ... más IPs
}
```

## Ventajas

✅ **Ligero:** No almacena en base de datos, solo en memoria  
✅ **No intrusivo:** Solo muestra en terminal, no afecta rendimiento  
✅ **Útil para desarrollo:** Permite ver actividad en tiempo real  
✅ **Filtrado inteligente:** Ignora archivos estáticos  
✅ **Estadísticas opcionales:** Endpoint para análisis más detallado  

## Limitaciones

⚠️ **Datos en memoria:** Se pierden al reiniciar el servidor  
⚠️ **No persistente:** No se almacena historial  
⚠️ **Sin protección de endpoint:** `/api/stats/visitors` debería protegerse en producción  

## Recomendaciones para Producción

### 🔒 Proteger endpoint de estadísticas
```python
@app.route('/api/stats/visitors')
@require_admin  # Agregar decorador de autenticación
def visitor_stats():
    # ... código existente
```

### 💾 Persistir datos (opcional)
Para mantener historial, considera:
- Redis para datos en memoria persistente
- Base de datos para análisis histórico
- Archivos de log estructurados

### 📊 Integración con Analytics
Para producción seria, considera integrar:
- Google Analytics
- Matomo
- Plausible
- Mixpanel

## Uso

### Desarrollo Local
1. Ejecuta el servidor: `python app.py`
2. Observa la terminal mientras navegas
3. Accede a `/api/stats/visitors` para ver resumen

### Ejemplo de Salida en Terminal
```
Conexión a la base de datos OK. Tablas creadas/comprobadas.
 * Running on http://127.0.0.1:5000
🌐 [14:25:30] 127.0.0.1 → GET main (visita #1)
🌐 [14:25:35] 127.0.0.1 → GET login (visita #2)
🌐 [14:25:42] 127.0.0.1 → POST login (visita #3)
🌐 [14:25:43] 127.0.0.1 → GET main (visita #4)
🌐 [14:26:10] 192.168.1.50 → GET register (visita #1)
🌐 [14:26:15] 192.168.1.50 → POST register (visita #2)
```

## Desactivar (si es necesario)

Para desactivar el seguimiento, comenta estas líneas en `app.py`:

```python
# @app.before_request
# def track_visitor():
#     # ... todo el código del middleware
```

---

**Implementado:** 7 de octubre de 2025  
**Versión:** 1.0  
**Autor:** Backend Team CMCHEmployee
