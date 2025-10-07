# 🚀 Guía Rápida - Sistema de Seguimiento de IPs

## ⚡ Uso Inmediato

### 1. Ejecuta el servidor
```powershell
cd BackEnd
python app.py
```

### 2. Observa la terminal
Verás algo como esto:
```
Conexión a la base de datos OK. Tablas creadas/comprobadas.
 * Running on http://127.0.0.1:5000

🌐 [14:30:15] 127.0.0.1 → GET main (visita #1)
🌐 [14:30:18] 127.0.0.1 → GET login (visita #2)
🌐 [14:30:25] 127.0.0.1 → POST login (visita #3)
🌐 [14:30:26] 127.0.0.1 → GET main (visita #4)
```

### 3. Navega en la aplicación
Abre `http://localhost:5000` y navega por las páginas.

### 4. Ver estadísticas completas
Visita: `http://localhost:5000/api/stats/visitors`

```json
{
  "total_unique_visitors": 2,
  "total_visits": 15,
  "visitors": [
    {
      "ip": "127.0.0.1",
      "visits": 12,
      "last_seen": "2025-10-07 14:35:22",
      "pages_visited": 5,
      "unique_pages": ["main", "login", "register", "api_empresas", "logout"]
    }
  ]
}
```

## 🧪 Probar con simulador

```powershell
# Instala requests si no lo tienes
pip install requests

# Ejecuta el simulador
python test_ip_tracking.py
```

El simulador enviará varias peticiones y mostrará las estadísticas.

## 📊 Lo que verás

**En la terminal del servidor:**
- ✅ IP del visitante
- ✅ Hora exacta (HH:MM:SS)
- ✅ Método HTTP (GET/POST)
- ✅ Endpoint visitado
- ✅ Contador de visitas

**Ejemplo real:**
```
🌐 [14:30:15] 192.168.1.100 → GET main (visita #1)
🌐 [14:30:18] 192.168.1.100 → GET login (visita #2)
🌐 [14:30:25] 192.168.1.100 → POST login (visita #3)
🌐 [14:30:28] 192.168.1.105 → GET register (visita #1)
🌐 [14:30:35] 192.168.1.105 → POST register (visita #2)
```

## 🎯 Características

- ✅ **Ligero:** No afecta el rendimiento
- ✅ **Automático:** No requiere configuración
- ✅ **Filtrado:** Ignora archivos estáticos (CSS, JS)
- ✅ **IPs reales:** Detecta IP incluso detrás de proxies
- ✅ **Estadísticas:** Endpoint JSON para análisis

## 📝 Archivos Creados

- `app.py` - Sistema de tracking integrado
- `SEGUIMIENTO_IPS.md` - Documentación completa
- `test_ip_tracking.py` - Script de prueba
- `QUICK_START_IP_TRACKING.md` - Esta guía

## 🔧 Personalizar

### Cambiar formato de salida
En `app.py`, línea del `print()`:
```python
print(f"🌐 [{timestamp}] {ip} → {method} {endpoint} (visita #{ip_tracker[ip]['count']})")
```

### Desactivar temporalmente
Comenta el decorador `@app.before_request` en `app.py`

### Agregar más información
Modifica `track_visitor()` para incluir:
- User agent
- Referrer
- Query parameters

## ⚠️ Notas Importantes

- Los datos se almacenan **solo en memoria**
- Se **pierden** al reiniciar el servidor
- Para persistencia, usa Redis o base de datos
- En producción, protege `/api/stats/visitors` con autenticación

---

**¿Problemas?** Revisa `SEGUIMIENTO_IPS.md` para documentación completa
