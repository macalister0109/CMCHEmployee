 function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
     function changeLanguage(lang) {
    console.log("Idioma seleccionado:", lang);
    //agregar lógica para cambiar el idioma
  }

    function cambiarIdioma(idioma) {
    if (idioma === 'es') {
      window.location.href = 'main.html';
    } else if (idioma === 'en') {
      window.location.href = 'main_en.html';
    }
  }