const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

// Verificar si debe mostrar el formulario de registro (por errores)
document.addEventListener("DOMContentLoaded", () => {
    // Si hay un atributo data-toggle en el body o container, activar registro
    const shouldToggle = document.body.dataset.toggle === "true";
    if (shouldToggle) {
        container.classList.add("toggle");
    }
});

// Activar modo Sign Up
btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle");
});

// Activar modo Sign In
btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle");
});