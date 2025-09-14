document.addEventListener("DOMContentLoaded",() => {
    const elements = document.querySelectorAll(".animate");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.computedStyleMap.opacity = "1";
                entry.target.style.trasform = "traslateY(0)";
            }
        });

    }, {
        threshold: 0.2});

        elements.forEach(el => {
            el.opacity = "0";
            el.style.transform = "traslateY(30px)";
            el.style.transition = "all 0.8s ease";
            observer.observe(el);
        });

        const errorBox = document.querySelector(".error");
        if (errorBox) {
            errorBox.style.animation = "shake 0.5s ease";
        }
})