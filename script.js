let index = 0;
const slides = document.querySelectorAll(".slide");
const slideContainer = document.querySelector(".slides");

function showSlides() {
    // Hide all slides
    slides.forEach((slide) => {
        slide.style.opacity = "0"; // Fade out all slides
    });

    // Show the current slide
    slides[index].style.opacity = "1"; // Fade in the current slide

    // Move the container for slide-left transition
    slideContainer.style.transform = `translateX(-${index * 100}%)`;

    // Increment the index for the next slide
    index = (index + 1) % slides.length;
}

// Set interval to change slides every 4.5 seconds
setInterval(showSlides, 4500);

// Initial call to show the first slide
showSlides();
