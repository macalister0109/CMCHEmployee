document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.role-btn');
    const hidden = document.getElementById('register-role');
    const roleFields = document.querySelectorAll('.role-fields');
    const form = document.getElementById('registerForm');
    
    // Función para mostrar/ocultar campos según el rol
    const showRoleFields = (role) => {
        roleFields.forEach(field => {
            field.style.display = 'none';
            field.classList.remove('active');
            // Deshabilitar campos no relevantes
            const inputs = field.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.required = false;
                input.disabled = true;
            });
        });
        
        const activeFields = document.querySelector(`.${role}-fields`);
        if (activeFields) {
            activeFields.style.display = 'block';
            setTimeout(() => activeFields.classList.add('active'), 10);

            // Habilitar y hacer requeridos los campos del rol seleccionado
            const fields = activeFields.querySelectorAll('input, select');
            fields.forEach(field => {
                field.required = true;
                field.disabled = false;
            });
        }
    };

    // Manejador de eventos para los botones de rol
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const role = btn.dataset.role;
            hidden.value = role;
            showRoleFields(role);
        });
    });

    // Manejador del envío del formulario
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const role = hidden.value;
            if (!role) {
                alert('Por favor, selecciona un rol');
                return;
            }

            const formData = new FormData(form);
            
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    body: formData
                });

                if (response.redirected) {
                    window.location.href = response.url;
                } else if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        alert('Registro exitoso');
                        window.location.href = '/';  // Redirigir al main
                    } else {
                        alert(result.error || 'Error en el registro');
                    }
                } else {
                    const error = await response.json();
                    alert(error.error || 'Error en el registro');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en el registro');
            }
        });
    }
});
});