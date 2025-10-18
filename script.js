// Small controllers using data-attributes
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky shrinking nav
  const header = document.querySelector('[data-nav]');
  const shrinkOn = 10;
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > shrinkOn) header.classList.add('is-shrunk');
    else header.classList.remove('is-shrunk');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for anchors
  document.querySelectorAll('[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // Mobile menu
  const menu = document.querySelector('[data-menu]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const setMenu = (open) => {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('a')?.focus();
  };
  menuBtn?.addEventListener('click', () => setMenu(!menu?.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  // Accordions (services)
  document.querySelectorAll('[data-accordion-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.card')?.querySelector('[data-accordion-panel]');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (!panel) return;
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });

  // Carousel (simple)
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;
    let index = 0;
    const items = Array.from(track.children);
    const to = (i) => {
      index = (i + items.length) % items.length;
      const width = items[0].getBoundingClientRect().width + 18; // gap
      track.scrollTo({ left: index * width, behavior: prefersReduced ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => to(index - 1));
    next.addEventListener('click', () => to(index + 1));
    // Auto-advance
    if (!prefersReduced) setInterval(() => to(index + 1), 6000);
  });

  // Form validation
  document.querySelectorAll('[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form__status');
      const fields = [
        { id: 'navn', rule: (v) => v.trim().length > 1, msg: 'Skriv navnet ditt' },
        { id: 'epost', rule: (v) => /.+@.+\..+/.test(v), msg: 'Skriv en gyldig e‑post' },
        { id: 'melding', rule: (v) => v.trim().length > 5, msg: 'Skriv en kort melding' },
      ];
      let valid = true;
      fields.forEach(({ id, rule, msg }) => {
        const input = form.querySelector('#' + id);
        const error = input?.closest('.form__row')?.querySelector('.form__error');
        const ok = input && rule(String(input.value || ''));
        if (!ok) {
          valid = false;
          if (error) error.textContent = msg;
        } else if (error) error.textContent = '';
      });
      if (!valid) {
        status && (status.textContent = 'Rett feil markert over.');
        status && (status.style.color = 'var(--danger)');
        return;
      }
      status && (status.textContent = 'Takk! Vi svarer deg innen kort tid.');
      status && (status.style.color = 'var(--ok)');
      form.reset();
    });
  });

  // In-view reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-observe]').forEach((el) => io.observe(el));

  // Simple magnetic hover for primary CTAs
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 14;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
      const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  // Light particle/mesh background in hero
  const canvas = document.getElementById('mesh');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, t = 0, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.75;
      for (let i = 0; i < 90; i++) {
        const x = (Math.sin(i * 0.21 + t * 0.8) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(i * 0.17 + t * 0.6) * 0.3 + 0.5) * canvas.height;
        const r = 1.2 + (Math.sin(i + t) + 1) * 1.4;
        const g1 = ctx.createRadialGradient(x, y, 0, x, y, r * 12 * dpr);
        g1.addColorStop(0, 'rgba(95,225,255,.18)');
        g1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(x, y, r * 12 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      t += 0.006;
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }
})();


