const API_BASE = window.location.origin;
        const USER_ID = {{ user_id if user_id else 'null' }};
        
        let resultadosActuales = [];

        // ========================================
        // BÚSQUEDA
        // ========================================
        
        function realizarBusqueda(event) {
            if (event) event.preventDefault();
            
            const form = event ? event.target : document.querySelector('.search-form');
            const formData = new FormData(form);
            
            const params = new URLSearchParams();
            if (formData.get('q')) params.append('q', formData.get('q'));
            if (formData.get('region')) params.append('region', formData.get('region'));
            if (formData.get('modalidad')) params.append('modalidad', formData.get('modalidad'));
            if (formData.get('area')) params.append('area', formData.get('area'));
            
            buscarOfertas(params);
            return false;
        }

        async function buscarOfertas(params) {
            try {
                document.getElementById('results-container').innerHTML = `
                    <div class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Buscando ofertas...</p>
                    </div>
                `;
                
                const response = await fetch(`${API_BASE}/api/buscar?${params.toString()}`);
                const data = await response.json();
                
                if (data.success) {
                    resultadosActuales = data.resultados;
                    mostrarResultados(data.resultados);
                    
                    const count = data.total_resultados;
                    document.getElementById('results-count').innerHTML = 
                        `<i class="fas fa-briefcase"></i> ${count} oferta${count !== 1 ? 's' : ''} encontrada${count !== 1 ? 's' : ''}`;
                } else {
                    mostrarError('Error al buscar ofertas');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarError('Error de conexión');
            }
        }

        function mostrarResultados(resultados) {
            const container = document.getElementById('results-container');
            
            if (resultados.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = resultados.map(oferta => `
                <div class="oferta-card" onclick="verDetalle(${oferta.id_trabajo})">
                    <div class="oferta-header">
                        <h3>${oferta.area_trabajo}</h3>
                        <span class="badge ${oferta.modalidad_trabajo.toLowerCase()}">${oferta.modalidad_trabajo}</span>
                    </div>
                    
                    <div class="oferta-empresa">
                        <i class="fas fa-building"></i>
                        <span>${oferta.empresa.nombre_empresa}</span>
                    </div>
                    
                    <div class="oferta-ubicacion">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${oferta.region_trabajo}, ${oferta.comuna_trabajo}</span>
                    </div>
                    
                    <div class="oferta-industria">
                        <i class="fas fa-industry"></i>
                        <span>${oferta.tipo_industria}</span>
                    </div>
                    
                    <p class="oferta-descripcion">${oferta.descripcion_trabajo}</p>
                    
                    <div class="oferta-actions">
                        <button class="btn-outline" onclick="event.stopPropagation(); verDetalle(${oferta.id_trabajo})">
                            Ver más
                        </button>
                        ${USER_ID ? `
                            <button class="btn-primary" onclick="event.stopPropagation(); postular(${oferta.id_trabajo})">
                                <i class="fas fa-paper-plane"></i> Postular
                            </button>
                        ` : `
                            <a href="${API_BASE}/login" class="btn-primary">
                                Inicia sesión para postular
                            </a>
                        `}
                    </div>
                </div>
            `).join('');
        }

        function mostrarError(mensaje) {
            document.getElementById('results-container').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error</h3>
                    <p>${mensaje}</p>
                    <button class="btn-primary" onclick="location.reload()">
                        Intentar de nuevo
                    </button>
                </div>
            `;
        }

        // ========================================
        // DETALLE Y POSTULACIÓN
        // ========================================
        
        async function verDetalle(idTrabajo) {
            const oferta = resultadosActuales.find(o => o.id_trabajo === idTrabajo);
            if (!oferta) return;
            
            document.getElementById('modal-title').textContent = oferta.area_trabajo;
            document.getElementById('modal-body').innerHTML = `
                <div class="detalle-empresa">
                    <h3><i class="fas fa-building"></i> ${oferta.empresa.nombre_empresa}</h3>
                    <p><strong>Rubro:</strong> ${oferta.empresa.rubro}</p>
                </div>
                
                <div class="detalle-ubicacion">
                    <h4><i class="fas fa-map-marker-alt"></i> Ubicación</h4>
                    <p>${oferta.region_trabajo}, ${oferta.comuna_trabajo}</p>
                </div>
                
                <div class="detalle-modalidad">
                    <h4><i class="fas fa-laptop-house"></i> Modalidad</h4>
                    <p><span class="badge ${oferta.modalidad_trabajo.toLowerCase()}">${oferta.modalidad_trabajo}</span></p>
                </div>
                
                <div class="detalle-descripcion">
                    <h4><i class="fas fa-file-alt"></i> Descripción del Puesto</h4>
                    <p>${oferta.descripcion_trabajo}</p>
                </div>
                
                ${oferta.calificaciones ? `
                    <div class="detalle-requisitos">
                        <h4><i class="fas fa-star"></i> Requisitos y Calificaciones</h4>
                        <p>${oferta.calificaciones}</p>
                    </div>
                ` : ''}
                
                <div class="detalle-info">
                    <p><strong>Tipo de Industria:</strong> ${oferta.tipo_industria}</p>
                    <p><strong>Tamaño Empresa:</strong> ${oferta.tamanio_empresa}</p>
                </div>
                
                <div class="detalle-actions">
                    ${USER_ID ? `
                        <button class="btn-primary btn-large" onclick="postular(${oferta.id_trabajo})">
                            <i class="fas fa-paper-plane"></i> Postular a esta oferta
                        </button>
                    ` : `
                        <a href="${API_BASE}/login" class="btn-primary btn-large">
                            Inicia sesión para postular
                        </a>
                    `}
                </div>
            `;
            
            document.getElementById('modal-detalle').classList.add('show');
        }

        async function postular(idTrabajo) {
            if (!USER_ID) {
                window.location.href = `${API_BASE}/login`;
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE}/postular/${idTrabajo}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const result = await response.json();
                
                if (result.ok) {
                    mostrarToast('¡Postulación enviada exitosamente!', 'success');
                    cerrarModal();
                } else {
                    mostrarToast(result.error || 'Error al postular', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('Error de conexión', 'error');
            }
        }

        function ordenarResultados(criterio) {
            if (criterio === 'empresa') {
                resultadosActuales.sort((a, b) => 
                    a.empresa.nombre_empresa.localeCompare(b.empresa.nombre_empresa)
                );
            } else if (criterio === 'relevancia') {
                //mantenemos el orden original por ahora
            }
            
            mostrarResultados(resultadosActuales);
        }

        // ========================================
        // UTILIDADES
        // ========================================
        
        function cerrarModal() {
            document.getElementById('modal-detalle').classList.remove('show');
        }

        function mostrarToast(mensaje, tipo = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = mensaje;
            toast.className = `toast ${tipo} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // Realizar búsqueda al cargar la página si hay parámetros
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.toString()) {
                buscarOfertas(urlParams);
            } else {
                // Mostrar todas las ofertas
                buscarOfertas(new URLSearchParams());
            }
        });