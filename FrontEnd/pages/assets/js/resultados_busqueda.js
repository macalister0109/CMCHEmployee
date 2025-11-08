document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('results-container');
    const loadingState = document.querySelector('.loading-state');
    const emptyState = document.querySelector('.empty-state');
    const resultsCount = document.getElementById('results-count');
    const searchForm = document.querySelector('.search-form');
    
    console.log('DOM Content Loaded');

    // Crear template para las ofertas
    const ofertaTemplate = document.createElement('template');

    ofertaTemplate.innerHTML = `
        <div class="oferta-card">
            <h3 class="oferta-titulo"></h3>
            <h4 class="oferta-empresa"></h4>
            <p class="oferta-descripcion"></p>
            <div class="oferta-detalles">
                <span class="oferta-ubicacion"></span>
                <span class="oferta-modalidad"></span>
                <span class="oferta-area"></span>
            </div>
            <div class="oferta-acciones">
                <button class="btn-detalles">Ver Detalles</button>
                <button class="btn-postular">Postular</button>
            </div>
        </div>
    `;

    // Función para mostrar las ofertas
    function mostrarOfertas(ofertas) {
        // Limpiar el contenedor de resultados
        while (resultsContainer.firstChild) {
            if (!resultsContainer.firstChild.classList || 
                (!resultsContainer.firstChild.classList.contains('loading-state') && 
                 !resultsContainer.firstChild.classList.contains('empty-state'))) {
                resultsContainer.removeChild(resultsContainer.firstChild);
            }
        }
        
        // Ocultar estados
        loadingState.style.display = 'none';
        emptyState.style.display = 'none';
        
        // Verificar si hay resultados
        if (!ofertas || ofertas.length === 0) {
            emptyState.style.display = 'block';
            resultsCount.textContent = 'No hay ofertas disponibles';
            return;
        }

        // Mostrar contador de resultados
        resultsCount.textContent = `${ofertas.length} ofertas encontradas`;

        ofertas.forEach(oferta => {
            const ofertaCard = ofertaTemplate.content.cloneNode(true);
            
            // Llenar los datos de la oferta
            ofertaCard.querySelector('.oferta-titulo').textContent = oferta.titulo;
            ofertaCard.querySelector('.oferta-empresa').textContent = oferta.empresa;
            ofertaCard.querySelector('.oferta-descripcion').textContent = oferta.descripcion;
            ofertaCard.querySelector('.oferta-ubicacion').textContent = oferta.region;
            ofertaCard.querySelector('.oferta-modalidad').textContent = oferta.modalidad;
            ofertaCard.querySelector('.oferta-area').textContent = oferta.tipo_industria;

            console.log('Agregando oferta:', oferta); // Debug

            // Agregar eventos a los botones
            const btnPostular = ofertaCard.querySelector('.btn-postular');
            btnPostular.addEventListener('click', () => postular(oferta.id));

            const btnDetalles = ofertaCard.querySelector('.btn-detalles');
            btnDetalles.addEventListener('click', () => verDetalles(oferta.id));

            resultsContainer.appendChild(ofertaCard);
        });
    };

    // Función para postular a una oferta
    async function postular(idTrabajo) {
        try {
            const response = await fetch(`/postular/${idTrabajo}`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                mostrarToast('Postulación enviada exitosamente', 'success');
            } else {
                mostrarToast(data.error || 'Error al postular', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarToast('Error al enviar la postulación', 'error');
        }
    }

    // Función para ver detalles de una oferta
    const verDetalles = (idTrabajo) => {
        window.location.href = `/oferta/${idTrabajo}`;
    };

    // Manejar la búsqueda
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Mostrar estado de carga
            loadingState.style.display = 'block';
            emptyState.style.display = 'none';
            resultsCount.textContent = 'Buscando...';
            
            const formData = new FormData(searchForm);
            const params = new URLSearchParams(formData);

        try {
            const response = await fetch(`/api/buscar?${params.toString()}`);
            const data = await response.json();
            
            if (response.ok) {
                mostrarOfertas(data.resultados);
            } else {
                alert('Error al buscar ofertas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al realizar la búsqueda');
        }
    });

    // Función para cargar resultados
    async function cargarResultados() {
        // Mostrar estado de carga
        loadingState.style.display = 'block';
        emptyState.style.display = 'none';
        resultsCount.textContent = 'Buscando...';

        try {
            console.log("Solicitando resultados..."); // Debug
            const response = await fetch(window.location.href, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            console.log("Respuesta recibida:", response.status); // Debug
            const data = await response.json();
            console.log("Datos recibidos:", data); // Debug

            if (data.success) {
                mostrarOfertas(data.resultados);
            } else {
                throw new Error(data.error || 'Error al cargar resultados');
            }
        } catch (error) {
            console.error('Error:', error);
            loadingState.style.display = 'none';
            emptyState.style.display = 'block';
            resultsCount.textContent = 'Error al cargar resultados';
            mostrarToast('Error al cargar los resultados', 'error');
        }
    }

    // Cargar resultados iniciales
    cargarResultados();
});