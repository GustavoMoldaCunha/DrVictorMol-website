(function () {
  var slider = document.querySelector('[data-testimonials-slider]');
  if (!slider) return;

  var section = slider.closest('.testimonials');
  var slides = Array.from(slider.querySelectorAll('[data-testimonial-slide]'));
  var prevBtn = section && section.querySelector('[data-testimonials-prev]');
  var nextBtn = section && section.querySelector('[data-testimonials-next]');

  if (!slides.length || !prevBtn || !nextBtn) return;

  var current = 0;
  var isAnimating = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var duration = reducedMotion ? 0 : 450;

  function setActive(index) {
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle('is-active', active);
      slide.classList.remove('is-leaving');
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    current = index;
  }

  function goTo(direction) {
    if (isAnimating || slides.length < 2) return;

    var nextIndex =
      direction === 'next'
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length;

    if (nextIndex === current) return;

    if (duration === 0) {
      setActive(nextIndex);
      return;
    }

    isAnimating = true;
    var outgoing = slides[current];
    var incoming = slides[nextIndex];

    outgoing.classList.add('is-leaving');
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');

    window.setTimeout(function () {
      outgoing.classList.remove('is-active', 'is-leaving');
      outgoing.setAttribute('aria-hidden', 'true');
      current = nextIndex;
      isAnimating = false;
    }, duration);
  }

  function preventFocusRingOnClick(btn) {
    btn.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });
  }

  function onNavKeydown(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo('prev');
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo('next');
    }
  }

  preventFocusRingOnClick(prevBtn);
  preventFocusRingOnClick(nextBtn);

  prevBtn.addEventListener('click', function () {
    goTo('prev');
  });

  nextBtn.addEventListener('click', function () {
    goTo('next');
  });

  prevBtn.addEventListener('keydown', onNavKeydown);
  nextBtn.addEventListener('keydown', onNavKeydown);
})();
