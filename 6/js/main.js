/* =====================================================
   TERMALES EL GUAYACÁN — main.js (v2: app/tabs)
   ===================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.AOS) AOS.init({ duration: 600, once: true, offset: 50, easing: 'ease-out-cubic', disable: prefersReducedMotion });

  /* ─── Idioma ─── */
  let lang = localStorage.getItem('guayacan-lang') || 'es';
  const toggles = document.querySelectorAll('.lang-toggle');
  function applyLanguage(l) {
    lang = l;
    localStorage.setItem('guayacan-lang', l);
    document.documentElement.lang = l;
    document.querySelectorAll('[data-es][data-en]').forEach(el => {
      const t = el.getAttribute('data-' + l);
      if (t === null) return;
      if (t.includes('<')) el.innerHTML = t; else el.textContent = t;
    });
    toggles.forEach(b => { b.textContent = l === 'es' ? 'EN' : 'ES'; });
  }
  toggles.forEach(b => b.addEventListener('click', () => applyLanguage(lang === 'es' ? 'en' : 'es')));

  /* ─── Estado abierto/cerrado ─── */
  const openStatus = document.getElementById('openStatus');
  if (openStatus) {
    const h = new Date().getHours();
    const open = h >= 8 && h < 21;
    openStatus.classList.add(open ? 'is-open' : 'is-closed');
    openStatus.setAttribute('data-es', open ? '● Abierto ahora · 8am–9pm' : '● Cerrado · Abrimos 8am');
    openStatus.setAttribute('data-en', open ? '● Open now · 8am–9pm' : '● Closed · We open at 8am');
  }
  applyLanguage(lang);

  /* ─── Planificador de pestañas ("Armá tu día") ─── */
  const tabs = document.querySelectorAll('.planner-tab');
  const panels = document.querySelectorAll('.planner-panel');
  function selectTab(name) {
    tabs.forEach(t => {
      const on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
  }
  tabs.forEach(t => t.addEventListener('click', () => selectTab(t.dataset.tab)));

  /* ─── Drawer móvil (menú completo) ─── */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileMenu');
  function closeDrawer() { if (!drawer) return; drawer.classList.remove('open'); if (hamburger) hamburger.classList.remove('active'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  function openDrawer() { if (!drawer) return; drawer.classList.add('open'); if (hamburger) hamburger.classList.add('active'); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  const menuClose = document.getElementById('menuClose');
  if (menuClose) menuClose.addEventListener('click', closeDrawer);
  }

  /* ─── Smooth scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ─── Scroll spy (barra inferior + nav) ─── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('[data-spy]');
  if ('IntersectionObserver' in window && sections.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.getAttribute('id');
          navItems.forEach(n => n.classList.toggle('active', n.getAttribute('data-spy') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
  }
})();
