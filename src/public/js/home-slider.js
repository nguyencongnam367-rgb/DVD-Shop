(() => {
  const carousel = document.querySelector(".hero");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  if (slides.length < 2) {
    carousel.querySelectorAll(".hero-control").forEach((button) => {
      button.hidden = true;
    });
    return;
  }

  let activeIndex = slides.findIndex((slide) =>
    slide.classList.contains("is-active"),
  );
  if (activeIndex < 0) activeIndex = 0;

  const showSlide = (nextIndex) => {
    slides[activeIndex].classList.remove("is-active");
    slides[activeIndex].setAttribute("aria-hidden", "true");
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides[activeIndex].classList.add("is-active");
    slides[activeIndex].setAttribute("aria-hidden", "false");
  };

  const previousButton = carousel.querySelector(".hero-control--previous");
  const nextButton = carousel.querySelector(".hero-control--next");
  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => showSlide(activeIndex + 1), 5000);
  }
})();
