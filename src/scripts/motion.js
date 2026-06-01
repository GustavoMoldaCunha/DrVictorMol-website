(function () {
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function prefersReduced() {
    return reducedQuery.matches;
  }

  function reveal(el) {
    el.classList.add('is-visible');
    el.addEventListener(
      'transitionend',
      function onEnd(e) {
        if (e.propertyName === 'opacity') {
          el.style.willChange = 'auto';
          el.removeEventListener('transitionend', onEnd);
        }
      },
      { once: true }
    );
  }

  function revealAll(selector) {
    document.querySelectorAll(selector).forEach(reveal);
  }

  function setStaggerDelays(container, step) {
    var children = container.querySelectorAll(':scope > [data-motion]');
    children.forEach(function (child, index) {
      child.style.setProperty('--motion-delay', String(index * step) + 'ms');
      reveal(child);
    });
    container.classList.add('is-ready');
  }

  function initNavbarScroll() {
    var wrap = document.querySelector('.navbar-fixed-wrap');
    if (!wrap) return;

    var onScroll = function () {
      wrap.classList.toggle('is-scrolled', window.scrollY > 20);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initImmediate() {
    document.querySelectorAll('[data-motion-immediate]').forEach(function (el, index) {
      el.style.setProperty('--motion-delay', String(index * 100) + 'ms');
      requestAnimationFrame(function () {
        reveal(el);
      });
    });

    document.querySelectorAll('[data-motion-immediate-stagger]').forEach(function (group) {
      setStaggerDelays(group, 100);
    });
  }

  function initScrollReveal() {
    if (prefersReduced()) {
      revealAll('[data-motion]');
      document.querySelectorAll('[data-motion-stagger]').forEach(function (g) {
        g.classList.add('is-ready');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var target = entry.target;

          if (target.hasAttribute('data-motion-stagger')) {
            setStaggerDelays(target, 90);
            observer.unobserve(target);
            return;
          }

          if (target.hasAttribute('data-motion')) {
            reveal(target);
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px',
      }
    );

    document.querySelectorAll('[data-motion-stagger]').forEach(function (el) {
      observer.observe(el);
    });

    document.querySelectorAll('[data-motion]').forEach(function (el) {
      if (el.closest('[data-motion-stagger]')) return;
      if (el.hasAttribute('data-motion-immediate')) return;
      observer.observe(el);
    });
  }

  function init() {
    initNavbarScroll();
    initImmediate();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  reducedQuery.addEventListener('change', function () {
    if (prefersReduced()) {
      revealAll('[data-motion]');
      document.querySelectorAll('[data-motion-stagger]').forEach(function (g) {
        setStaggerDelays(g, 0);
      });
    }
  });
})();
