const carousel = document.querySelector('.carousel');
let index = 0;
let interval;

// Actualiza la posición del carrusel
function updateCarousel() {
  if (carousel.children.length === 0) return;
  const cardWidth = carousel.children[0].offsetWidth + 20; // ancho + margen
  carousel.style.transform = `translateX(${-index * cardWidth}px)`;
}

// Avance automático
function startAutoPlay() {
  interval = setInterval(() => {
    index++;
    if (index > carousel.children.length - 1) index = 0;
    updateCarousel();
  }, 3000); // cada 3 segundos
}

// Detiene el autoplay
function stopAutoPlay() {
  clearInterval(interval);
}

// Botón Next
document.querySelector('.next').addEventListener('click', () => {
  stopAutoPlay();
  index++;
  if (index > carousel.children.length - 1) index = 0;
  updateCarousel();
  startAutoPlay();
});

// Botón Prev
document.querySelector('.prev').addEventListener('click', () => {
  stopAutoPlay();
  index--;
  if (index < 0) index = carousel.children.length - 1;
  updateCarousel();
  startAutoPlay();
});

// Recalcula posición si cambia el tamaño de la ventana
window.addEventListener('resize', updateCarousel);

// Inicia autoplay al cargar la página
startAutoPlay();
