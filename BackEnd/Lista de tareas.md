Separare las rutas para que no sea un app.py tan grande o pesado

ejemplo
  app.py                  # Solo configuración y arranque
  routes/
    auth.py              # Login, register, logout
    empresas.py          # CRUD empresas y puestos
    usuarios.py          # Perfil, edición usuario
    postulaciones.py     # Postular, mis postulaciones
    admin.py             # Rutas de administración
    api.py               # Endpoints públicos
    