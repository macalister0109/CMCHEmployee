document.addEventListener('DOMContentLoaded', () => {
    const ofertaForm = document.getElementById('ofertaForm');

    ofertaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Recoger todos los datos del formulario
        const formData = new FormData(ofertaForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/puesto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Oferta laboral publicada exitosamente');
                // Limpiar el formulario
                ofertaForm.reset();
                // Redireccionar a la página de ofertas o dashboard
                window.location.href = '/';
            } else {
                alert(result.error || 'Error al publicar la oferta');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al publicar la oferta');
        }
    });
});