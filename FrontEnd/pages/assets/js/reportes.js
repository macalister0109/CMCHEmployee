document.addEventListener("DOMContentLoaded", () => {

 // Paleta institucional
    const CMCH = {
        blue: "#1f1273",
        gold: "#f2b705",
        softGold: "#f7d44a",
        dark: "#0f0a3c",
        accent: "#4D7CFE"
    };

    const industriaCtx = document.getElementById("chartIndustria").getContext("2d");

    new Chart(industriaCtx, {
        type: "bar",
        data: {
            labels: ["Tecnología", "Administración", "Educación", "Salud", "Comercio"],
            datasets: [{
                label: "Ofertas activas",
                data: [42, 30, 15, 18, 25],
                backgroundColor: CMCH.blue,
                hoverBackgroundColor: CMCH.gold,
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: CMCH.dark, font: { weight: 600 } }
                },
                x: {
                    ticks: { color: CMCH.blue, font: { weight: 500 } }
                }
            }
        }
    });

    const modalidadCtx = document.getElementById("chartModalidad").getContext("2d");

    new Chart(modalidadCtx, {
        type: "doughnut",
        data: {
            labels: ["Presencial", "Híbrido", "Remoto"],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: [CMCH.blue, CMCH.gold, CMCH.accent],
                borderWidth: 2,
                borderColor: "#fff"
            }]
        },
        options: {
            cutout: "65%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: CMCH.dark,
                        font: { size: 13, weight: 600 }
                    }
                }
            }
        }
    });

    const animatedItems = document.querySelectorAll(".card, .stat-card, .hero-content");

    animatedItems.forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(20px)";

        setTimeout(() => {
            el.style.transition = "all 0.7s cubic-bezier(.22,.68,0,1.71)";
            el.style.opacity = 1;
            el.style.transform = "translateY(0)";
        }, 150 * i);
    });

});
