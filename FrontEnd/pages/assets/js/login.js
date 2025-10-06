const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

// Activar modo Sign Up
btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle");
});

// Activar modo Sign In
btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle");
});