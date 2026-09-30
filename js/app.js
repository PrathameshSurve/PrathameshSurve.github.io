const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = window.Lenis && !prefersReducedMotion
  ? new window.Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true })
  : null;

/* Navigation */
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('navMobile');
  const links = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('[data-section]');

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (lenis) isOpen ? lenis.stop() : lenis.start();
  });

  links.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  function smoothScrollTo(target) {
    const el = document.querySelector(target);
    if (!el) return;
    const navHeight = nav.offsetHeight;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    if (lenis) {
      lenis.scrollTo(el, { offset: -navHeight });
    } else {
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      smoothScrollTo(href);
    });
  });

  let scrollTicking = false;

  function updateActiveLink() {
    const navHeight = nav.offsetHeight;
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - navHeight - 80) {
        current = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.navLink === current);
    });
    scrollTicking = false;
  }

  if (lenis) {
    lenis.on('scroll', updateActiveLink);
  } else {
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateActiveLink);
      }
    }, { passive: true });
  }
  updateActiveLink();
})();

/* Accordion */
(function () {
  document.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-open', !isOpen);
    });
  });
})();

/* Modal */
(function () {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('modalClose');

  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modalCaption.textContent = alt;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-modal]');
    if (!el) return;
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (img) openModal(img.src, img.alt);
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

/* Contact form — EmailJS */
(function () {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitButton');
  const successMsg = document.getElementById('feedbackSuccess');
  const errorMsg = document.getElementById('feedbackError');

  if (!form || typeof emailjs === 'undefined') return;

  emailjs.init('UMjOQBBaZvQP2NT9j');

  function showFeedback(el, duration) {
    successMsg.classList.remove('is-visible');
    errorMsg.classList.remove('is-visible');
    el.classList.add('is-visible');
    submitBtn.disabled = true;
    setTimeout(() => {
      el.classList.remove('is-visible');
      submitBtn.disabled = false;
    }, duration);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !message) {
      errorMsg.textContent = 'Please fill in your name and message.';
      showFeedback(errorMsg, 4000);
      return;
    }

    if (!isValidEmail(email)) {
      errorMsg.textContent = 'Please enter a valid email address.';
      showFeedback(errorMsg, 4000);
      return;
    }

    emailjs
      .send('service_re41wdm', 'template_h5rrguw', { name, email, message })
      .then(() => {
        form.reset();
        showFeedback(successMsg, 10000);
      })
      .catch(() => {
        errorMsg.textContent = 'Something went wrong. Please try again or email directly.';
        showFeedback(errorMsg, 6000);
      });
  });
})();

/* Subtle rAF parallax — hero only, desktop */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 767px)').matches) return;

  const hero = document.getElementById('hero');
  const glow = document.querySelector('.hero__glow--1');
  if (!hero || !glow) return;

  let ticking = false;

  function updateParallax() {
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = Math.min(window.scrollY * 0.03, 32);
      glow.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
    ticking = false;
  }

  if (lenis) {
    lenis.on('scroll', updateParallax);
  } else {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }
  updateParallax();
})();
