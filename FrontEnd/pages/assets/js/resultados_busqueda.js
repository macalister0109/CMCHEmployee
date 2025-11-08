document.addEventListener('DOMContentLoaded', function() {
    // Obtener los resultados iniciales
    cargarResultados();
});

function cargarResultados() {
    const params = new URLSearchParams(window.location.search);
    const resultsContainer = document.getElementById('results-container');
    const loadingState = document.querySelector('.loading-state');
    const emptyState = document.querySelector('.empty-state');
    const resultsCount = document.getElementById('results-count');

    // Función para mostrar las ofertas
    const mostrarOfertas = (ofertas) => {
        // Eliminar ofertas anteriores, manteniendo los estados
        const existingCards = resultsList.querySelectorAll('.oferta-card');
        existingCards.forEach(card => card.remove());
        
        // Ocultar todos los estados
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
            ofertaCard.querySelector('.oferta-titulo').textContent = oferta.area_trabajo;
            ofertaCard.querySelector('.oferta-empresa').textContent = oferta.empresa.nombre_empresa;
            ofertaCard.querySelector('.oferta-descripcion').textContent = oferta.descripcion_trabajo;
            ofertaCard.querySelector('.oferta-ubicacion').textContent = `${oferta.comuna_trabajo}, ${oferta.region_trabajo}`;
            ofertaCard.querySelector('.oferta-modalidad').textContent = oferta.modalidad_trabajo;
            ofertaCard.querySelector('.oferta-area').textContent = oferta.tipo_industria;

            // Agregar eventos a los botones
            const btnPostular = ofertaCard.querySelector('.btn-postular');
            btnPostular.addEventListener('click', () => postular(oferta.id_trabajo));

            const btnDetalles = ofertaCard.querySelector('.btn-detalles');
            btnDetalles.addEventListener('click', () => verDetalles(oferta.id_trabajo));

            resultsList.appendChild(ofertaCard);
        });
    };

    // Función para postular a una oferta
    const postular = async (idTrabajo) => {
        try {
            const response = await fetch(`/postular/${idTrabajo}`, {
                method: 'POST'
            });
            const data = await response.json();
            
            if (response.ok) {
                alert('Postulación enviada exitosamente');
            } else {
                alert(data.error || 'Error al postular');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar la postulación');
        }
    };

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

    // Cargar ofertas iniciales
    const cargarOfertasIniciales = async () => {
        try {
            // Mostrar estado de carga inicial
            loadingState.style.display = 'block';
            emptyState.style.display = 'none';
            resultsCount.textContent = 'Cargando ofertas...';

            const response = await fetch('/api/buscar');
            const data = await response.json();
            
            if (response.ok) {
                mostrarOfertas(data.resultados);
            } else {
                throw new Error('Error al cargar ofertas');
            }
        } catch (error) {
            console.error('Error:', error);
            loadingState.style.display = 'none';
            emptyState.style.display = 'block';
            resultsCount.textContent = 'No hay ofertas disponibles';
        }
    };

    // Cargar ofertas al iniciar la página
    cargarOfertasIniciales();
});