let index = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
    slides.forEach((slide, i) => {
        slide.style.opacity = (i === index) ? "1" : "0";
    });
    index = (index + 1) % slides.length;
}

setInterval(showSlides, 4000); // 4 sec per slide
showSlides();
