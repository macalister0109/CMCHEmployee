 // Variable global para empresa_id (será inyectada desde Flask)
        const EMPRESA_ID = {{ empresa_id }};
        const API_BASE = window.location.origin;

        // ========================================
        // FUNCIONES DE CARGA DE DATOS
        // ========================================

        async function cargarOfertas() {
            try {
                const response = await fetch(`${API_BASE}/api/empresa/mis-puestos?empresa_id=${EMPRESA_ID}`);
                const data = await response.json();
                
                if (data.success) {
                    mostrarOfertas(data.puestos);
                    actualizarEstadisticas(data.puestos);
                } else {
                    mostrarToast('Error al cargar ofertas', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error de conexión', 'error');
            }
        }

        function mostrarOfertas(puestos) {
            const container = document.getElementById('ofertas-container');
            
            if (puestos.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-briefcase"></i>
                        <h3>No tienes ofertas publicadas</h3>
                        <p>Crea tu primera oferta laboral para comenzar</p>
                        <button class="btn-primary" onclick="mostrarFormularioCrear()">
                            <i class="fas fa-plus"></i> Crear Oferta
                        </button>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = puestos.map(puesto => `
                <div class="oferta-card">
                    <div class="oferta-header">
                        <h3>${puesto.area_trabajo}</h3>
                        <span class="badge ${puesto.modalidad_trabajo.toLowerCase()}">${puesto.modalidad_trabajo}</span>
                    </div>
                    
                    <div class="oferta-info">
                        <p><i class="fas fa-map-marker-alt"></i> ${puesto.region_trabajo}, ${puesto.comuna_trabajo}</p>
                        <p><i class="fas fa-industry"></i> ${puesto.tipo_industria}</p>
                        <p class="descripcion">${puesto.descripcion_trabajo}</p>
                    </div>
                    
                    <div class="oferta-stats">
                        <span class="stat-badge">
                            <i class="fas fa-users"></i> ${puesto.total_postulaciones} postulantes
                        </span>
                    </div>
                    
                    <div class="oferta-actions">
                        <button class="btn-icon" onclick="verPostulantes(${puesto.id_trabajo})" title="Ver postulantes">
                            <i class="fas fa-users"></i>
                        </button>
                        <button class="btn-icon" onclick="editarOferta(${puesto.id_trabajo})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon danger" onclick="eliminarOferta(${puesto.id_trabajo})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function actualizarEstadisticas(puestos) {
            document.getElementById('total-puestos').textContent = puestos.length;
            
            const totalPost = puestos.reduce((sum, p) => sum + p.total_postulaciones, 0);
            document.getElementById('total-postulaciones').textContent = totalPost;
            
            // Estas estadísticas requerirían más datos del backend
            document.getElementById('pendientes').textContent = '-';
            document.getElementById('aceptados').textContent = '-';
        }

        // ========================================
        // CRUD DE OFERTAS
        // ========================================

        function mostrarFormularioCrear() {
            document.getElementById('modal-title').innerHTML = '<i class="fas fa-briefcase"></i> Nueva Oferta Laboral';
            document.getElementById('form-oferta').reset();
            document.getElementById('oferta-id').value = '';
            document.getElementById('modal-oferta').classList.add('show');
        }

        async function editarOferta(id) {
            try {
                const response = await fetch(`${API_BASE}/api/puestos?empresa_id=${EMPRESA_ID}`);
                const puestos = await response.json();
                const puesto = puestos.find(p => p.id_trabajo === id);
                
                if (puesto) {
                    document.getElementById('modal-title').innerHTML = '<i class="fas fa-edit"></i> Editar Oferta';
                    document.getElementById('oferta-id').value = id;
                    document.getElementById('area_trabajo').value = puesto.area_trabajo;
                    document.getElementById('tipo_industria').value = puesto.tipo_industria;
                    document.getElementById('region_trabajo').value = puesto.region_trabajo;
                    document.getElementById('comuna_trabajo').value = puesto.comuna_trabajo;
                    document.getElementById('modalidad_trabajo').value = puesto.modalidad_trabajo;
                    document.getElementById('tamanio_empresa').value = puesto.tamanio_empresa;
                    document.getElementById('descripcion_trabajo').value = puesto.descripcion_trabajo;
                    document.getElementById('calificaciones').value = puesto.calificaciones || '';
                    
                    document.getElementById('modal-oferta').classList.add('show');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error al cargar oferta', 'error');
            }
        }

        async function guardarOferta(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const ofertaId = document.getElementById('oferta-id').value;
            
            const data = {
                empresa_id: EMPRESA_ID,
                area_trabajo: formData.get('area_trabajo'),
                tipo_industria: formData.get('tipo_industria'),
                region_trabajo: formData.get('region_trabajo'),
                comuna_trabajo: formData.get('comuna_trabajo'),
                modalidad_trabajo: formData.get('modalidad_trabajo'),
                tamanio_empresa: formData.get('tamanio_empresa'),
                descripcion_trabajo: formData.get('descripcion_trabajo'),
                calificaciones: formData.get('calificaciones') || ''
            };
            
            try {
                const url = ofertaId ? `${API_BASE}/api/puesto/${ofertaId}` : `${API_BASE}/api/puesto`;
                const method = ofertaId ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    mostrarToast(result.message || 'Oferta guardada exitosamente', 'success');
                    cerrarModal();
                    cargarOfertas();
                } else {
                    mostrarToast(result.error || 'Error al guardar oferta', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error de conexión', 'error');
            }
        }

        async function eliminarOferta(id) {
            if (!confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE}/api/puesto/${id}?empresa_id=${EMPRESA_ID}&format=json`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    mostrarToast('Oferta eliminada exitosamente', 'success');
                    cargarOfertas();
                } else {
                    mostrarToast(result.error || 'Error al eliminar oferta', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error de conexión', 'error');
            }
        }

        // ========================================
        // GESTIÓN DE POSTULANTES
        // ========================================

        async function verPostulantes(puestoId) {
            try {
                const response = await fetch(`${API_BASE}/api/puesto/${puestoId}/postulantes?empresa_id=${EMPRESA_ID}`);
                const data = await response.json();
                
                if (data.success) {
                    mostrarPostulantes(data.postulantes, data.puesto);
                } else {
                    mostrarToast('Error al cargar postulantes', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error de conexión', 'error');
            }
        }

        function mostrarPostulantes(postulantes, puesto) {
            const container = document.getElementById('postulantes-container');
            
            if (postulantes.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-user-slash"></i>
                        <h3>Sin postulantes aún</h3>
                        <p>Esta oferta no tiene postulaciones todavía</p>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="postulantes-header">
                        <h3>${puesto.area_trabajo}</h3>
                        <p>${postulantes.length} postulante(s)</p>
                    </div>
                    ${postulantes.map(post => `
                        <div class="postulante-card">
                            <div class="postulante-info">
                                <div class="postulante-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="postulante-detalles">
                                    <h4>${post.usuario.nombre} ${post.usuario.apellido}</h4>
                                    <p><i class="fas fa-envelope"></i> ${post.usuario.correo}</p>
                                    <p><i class="fas fa-phone"></i> ${post.usuario.telefono}</p>
                                    ${post.usuario.carrera ? `<p><i class="fas fa-graduation-cap"></i> ${post.usuario.carrera}</p>` : ''}
                                    ${post.usuario.experiencia_laboral ? `<p><i class="fas fa-briefcase"></i> ${post.usuario.experiencia_laboral}</p>` : ''}
                                </div>
                            </div>
                            
                            <div class="postulante-meta">
                                <span class="fecha">
                                    <i class="fas fa-calendar"></i> ${new Date(post.fecha_postulacion).toLocaleDateString('es-CL')}
                                </span>
                                <select class="estado-select" onchange="cambiarEstado(${post.id_postulacion}, this.value)">
                                    <option value="Enviado" ${post.estado === 'Enviado' ? 'selected' : ''}>Enviado</option>
                                    <option value="En Revisión" ${post.estado === 'En Revisión' ? 'selected' : ''}>En Revisión</option>
                                    <option value="En Proceso" ${post.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                                    <option value="Aceptado" ${post.estado === 'Aceptado' ? 'selected' : ''}>Aceptado</option>
                                    <option value="Rechazado" ${post.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                                </select>
                            </div>
                        </div>
                    `).join('')}
                `;
            }
            
            document.getElementById('modal-postulantes').classList.add('show');
        }

        async function cambiarEstado(postulacionId, nuevoEstado) {
            try {
                const response = await fetch(`${API_BASE}/api/postulacion/${postulacionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        estado: nuevoEstado,
                        empresa_id: EMPRESA_ID
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    mostrarToast(`Estado actualizado a: ${nuevoEstado}`, 'success');
                } else {
                    mostrarToast(result.error || 'Error al cambiar estado', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error de conexión', 'error');
            }
        }

        // ========================================
        // FUNCIONES DE UTILIDAD
        // ========================================

        function cerrarModal() {
            document.getElementById('modal-oferta').classList.remove('show');
        }

        function cerrarModalPostulantes() {
            document.getElementById('modal-postulantes').classList.remove('show');
        }

        function mostrarToast(mensaje, tipo = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = mensaje;
            toast.className = `toast ${tipo} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Cargar ofertas al inicio
        document.addEventListener('DOMContentLoaded', () => {
            cargarOfertas();
        });

        // Cerrar modales al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });