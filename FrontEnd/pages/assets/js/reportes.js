// Reportes del Mercado Laboral - CMCHEmployee
// Chart.js Config + Animaciones suaves

document.addEventListener("DOMContentLoaded", () => {

    // Colores institucionales CMCH
    const cmchColors = {
        blue: "#1f1273",
        gold: "#f2b705",
        darkBlue: "#0f0a3c",
        light: "#f5f6fa"
    };

    // === Industria ===
    const industriaCtx = document.getElementById("chartIndustria").getContext("2d");
    new Chart(industriaCtx, {
        type: "bar",
        data: {
            labels: ["Tecnología", "Administración", "Educación", "Salud", "Comercio"],
            datasets: [{
                label: "Ofertas por rubro",
                data: [42, 30, 15, 18, 25],
                backgroundColor: cmchColors.blue,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: cmchColors.darkBlue }
                },
                x: {
                    ticks: { color: cmchColors.darkBlue }
                }
            }
        }
    });

    // === Modalidad ===
    const modalidadCtx = document.getElementById("chartModalidad").getContext("2d");
    new Chart(modalidadCtx, {
        type: "doughnut",
        data: {
            labels: ["Presencial", "Híbrido", "Remoto"],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: [
                    cmchColors.blue,
                    cmchColors.gold,
                    "#4b91ff"
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: "60%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: cmchColors.darkBlue }
                }
            }
        }
    });

    // Animación suave de tarjetas
    const cards = document.querySelectorAll(".card, .stat-card");
    cards.forEach((c, i) => {
        c.style.opacity = 0;
        c.style.transform = "translateY(20px)";
        setTimeout(() => {
            c.style.transition = "all 0.6s ease";
            c.style.opacity = 1;
            c.style.transform = "translateY(0)";
        }, i * 120);
    });
});
