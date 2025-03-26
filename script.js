let index = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
    slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? "block" : "none";
    });
    index = (index + 1) % slides.length;
}

setInterval(showSlides, 3000);
showSlides();
