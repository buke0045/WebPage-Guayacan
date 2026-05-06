/* =====================================================
   TERMALES EL GUAYACÁN — main.js
   Handles: language toggle, navbar scroll, mobile menu,
            smooth active nav, AOS init
   ===================================================== */

(function () {
  'use strict';

  /* ─── AOS init ─────────────────────────────────────── */
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic',
  });

  /* ─── Elements ─────────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const langToggle = document.getElementById('langToggle');

  /* ─── Language system ──────────────────────────────── */
  let currentLang = localStorage.getItem('guayacan-lang') || 'es';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('guayacan-lang', lang);
    document.documentElement.lang = lang;

    // Update all translatable text nodes
    document.querySelectorAll('[data-es][data-en]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text === null) return;

      // Elements that may contain HTML (e.g. spans inside h1)
      // We only set innerHTML when the attribute value contains tags
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Toggle button shows the OTHER language
    langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
  }

  langToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'es' ? 'en' : 'es');
  });

  // Apply on page load (respects saved preference)
  applyLanguage(currentLang);

  /* ─── Navbar: transparent → solid on scroll ────────── */
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ─── Mobile menu toggle ───────────────────────────── */
  function openMenu() {
    mobileMenu.style.display = 'flex';
    // Reflow so transition works
    requestAnimationFrame(() => {
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
    });
    hamburger.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Hide after transition
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = 'none';
      }
    }, 320);
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on any nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  /* ─── Smooth scroll for all internal anchor links ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── Active nav link highlight on scroll ───────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
  });

  sections.forEach(s => observer.observe(s));

})();
