
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function setMobileMenuOpen(isOpen) {
  if (!mobileMenu || !hamburger) return;

  mobileMenu.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute(
    'aria-label',
    isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
  );
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.documentElement.classList.toggle('is-mobile-menu-open', isOpen);

  if (mobileOverlay) {
    mobileOverlay.classList.toggle('is-open', isOpen);
    mobileOverlay.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      mobileOverlay.removeAttribute('hidden');
    } else {
      mobileOverlay.setAttribute('hidden', '');
    }
  }
}

function closeMobileMenu() {
  setMobileMenuOpen(false);
  if (!mobileMenu) return;
  mobileMenu.querySelectorAll('[data-navbar-accordion]').forEach(function (accordion) {
    accordion.classList.remove('is-open');
    const trigger = accordion.querySelector('[data-navbar-accordion-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    setMobileMenuOpen(!mobileMenu.classList.contains('is-open'));
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
      hamburger.focus();
    }
  });
}

document.querySelectorAll('[data-navbar-dropdown]').forEach(function (dropdown) {
  const trigger = dropdown.querySelector('[data-navbar-dropdown-trigger]');
  let closeTimer = null;

  function openDropdown() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    dropdown.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    closeTimer = setTimeout(function () {
      dropdown.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      closeTimer = null;
    }, 140);
  }

  dropdown.addEventListener('mouseenter', openDropdown);
  dropdown.addEventListener('mouseleave', closeDropdown);

  dropdown.addEventListener('focusin', openDropdown);
  dropdown.addEventListener('focusout', function (e) {
    if (!dropdown.contains(e.relatedTarget)) {
      closeDropdown();
    }
  });

  dropdown.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('is-open');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    }
  });
});

document.querySelectorAll('[data-navbar-accordion]').forEach(function (accordion) {
  const trigger = accordion.querySelector('[data-navbar-accordion-trigger]');

  if (!trigger) return;

  trigger.addEventListener('click', function () {
    const isOpen = accordion.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});
