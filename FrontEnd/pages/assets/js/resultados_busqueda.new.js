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

    loadingState.style.display = 'flex';
    emptyState.style.display = 'none';

    fetch(window.location.href, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        loadingState.style.display = 'none';
        resultsContainer.innerHTML = '';

        if (data.resultados && data.resultados.length > 0) {
            resultsCount.textContent = `${data.resultados.length} ofertas encontradas`;
            data.resultados.forEach(oferta => {
                resultsContainer.appendChild(crearTarjetaOferta(oferta));
            });
        } else {
            emptyState.style.display = 'flex';
            resultsCount.textContent = 'No se encontraron ofertas';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'flex';
        resultsCount.textContent = 'Error al cargar resultados';
    });
}

function crearTarjetaOferta(oferta) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-header">
            <h3>${oferta.titulo}</h3>
            <span class="empresa">${oferta.empresa}</span>
        </div>
        <div class="job-details">
            <span><i class="fas fa-map-marker-alt"></i> ${oferta.region}</span>
            <span><i class="fas fa-briefcase"></i> ${oferta.modalidad}</span>
        </div>
        <p class="job-description">${oferta.descripcion.substring(0, 150)}...</p>
        <button onclick="verDetalle(${oferta.id})" class="btn-secondary">
            <i class="fas fa-eye"></i> Ver detalles
        </button>
    `;
    return card;
}

function verDetalle(id) {
    const modal = document.getElementById('modal-detalle');
    const modalBody = document.getElementById('modal-body');
    modal.style.display = 'flex';
    
    modalBody.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>';
    
    fetch(`/api/ofertas/${id}`)
        .then(response => response.json())
        .then(data => {
            modalBody.innerHTML = `
                <div class="oferta-detalle">
                    <h3>${data.titulo}</h3>
                    <p class="empresa"><i class="fas fa-building"></i> ${data.empresa}</p>
                    <div class="detalles">
                        <span><i class="fas fa-map-marker-alt"></i> ${data.region}</span>
                        <span><i class="fas fa-briefcase"></i> ${data.modalidad}</span>
                    </div>
                    <div class="descripcion">
                        <h4>Descripción del puesto</h4>
                        <p>${data.descripcion}</p>
                    </div>
                    <div class="acciones">
                        <button onclick="postular(${data.id})" class="btn-primary">
                            <i class="fas fa-paper-plane"></i> Postular
                        </button>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            modalBody.innerHTML = '<p class="error">Error al cargar los detalles</p>';
        });
}

function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    modal.style.display = 'none';
}

function ordenarResultados(criterio) {
    // Implementar ordenamiento según el criterio seleccionado
    cargarResultados();
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modal-detalle');
    if (event.target == modal) {
        cerrarModal();
    }
}

function postular(id) {
    // Implementar lógica de postulación
    fetch(`/api/postular/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacion('Postulación enviada con éxito');
            cerrarModal();
        } else {
            mostrarNotificacion('Error al enviar la postulación', true);
        }
    })
    .catch(() => {
        mostrarNotificacion('Error al enviar la postulación', true);
    });
}

function mostrarNotificacion(mensaje, esError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${esError ? 'error' : 'success'} show`;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}