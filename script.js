
document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {

        currentSlide = index;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4500);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            showSlide(index);
            startSlider();
        });
    });

    showSlide(0);
    startSlider();

});
