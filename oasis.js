/* ═══════════════════════════════════════════════════
   OÁSIS DE CONFORTO — oasis.js
   GSAP · Parallax · Scroll Reveals · Lang · Nav · Form
   ═══════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const html    = document.documentElement;

/* ════════════════════════════════════════════════════
   LANGUAGE TOGGLE
════════════════════════════════════════════════════ */
let lang = html.getAttribute('data-lang') || 'pt';

function setLang(l) {
  lang = l;
  html.setAttribute('data-lang', l);
  html.setAttribute('lang', l);
  document.getElementById('langCurrent').textContent = l.toUpperCase();
  document.getElementById('langOther').textContent   = l === 'pt' ? 'EN' : 'PT';
  document.querySelectorAll('.footer-lang-btn').forEach(b => {
    b.style.color = b.dataset.lang === l ? 'var(--gold-btn)' : '';
  });
}

document.getElementById('langBtn')?.addEventListener('click', () => setLang(lang === 'pt' ? 'en' : 'pt'));
document.querySelectorAll('.footer-lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

setLang(lang); // sync on load

/* ════════════════════════════════════════════════════
   NAV SCROLL STATE
════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');

ScrollTrigger.create({
  start: '80px top',
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ════════════════════════════════════════════════════
   MOBILE NAV
════════════════════════════════════════════════════ */
const burger  = document.getElementById('navBurger');
const navMenu = document.getElementById('navMenu');

burger?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';

  if (!reduced && open) {
    gsap.fromTo(navMenu.querySelectorAll('.nav__link'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', immediateRender: false }
    );
  }
});
navMenu?.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => {
  navMenu.classList.remove('open');
  burger?.classList.remove('open');
  burger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

/* ════════════════════════════════════════════════════
   HERO ENTRANCE
   gsap.set → gsap.to pattern — never pre-hides elements
════════════════════════════════════════════════════ */
(function heroEntrance() {
  if (reduced) return;

  gsap.set(['.hero__kicker', '.hero__title', '.hero__sub', '.hero__content .btn-book'], {
    opacity: 0, y: 28,
  });

  const tl = gsap.timeline({ delay: 0.2 });
  tl.to('.hero__kicker',            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' })
    .to('.hero__title',             { opacity: 1, y: 0, duration: 0.9,  ease: 'power3.out' }, '-=0.3')
    .to('.hero__sub',               { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.5')
    .to('.hero__content .btn-book', { opacity: 1, y: 0, duration: 0.6,  ease: 'back.out(1.4)' }, '-=0.4');

  // Booking bar slide up
  gsap.fromTo('.hero__booking-bar',
    { opacity: 0, y: 20, immediateRender: false },
    { opacity: 1, y: 0, duration: 0.7, delay: 0.85, ease: 'power2.out' }
  );
})();

/* ════════════════════════════════════════════════════
   HERO PARALLAX
   Background image moves slower than content on scroll
════════════════════════════════════════════════════ */
(function heroParallax() {
  if (reduced) return;
  gsap.to('.hero__img', {
    yPercent: 22,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
})();

/* ════════════════════════════════════════════════════
   SCROLL REVEAL HELPER — fromTo + immediateRender:false
════════════════════════════════════════════════════ */
function rev(els, from, to, trigger, start = 'top 85%') {
  if (reduced) return;
  const targets = typeof els === 'string'
    ? [...document.querySelectorAll(els)]
    : Array.isArray(els) ? els : [els];
  if (!targets.length) return;
  gsap.fromTo(targets,
    { ...from, immediateRender: false },
    { ...to, scrollTrigger: { trigger: trigger || targets[0], start, once: true } }
  );
}

/* ════════════════════════════════════════════════════
   SECTION SCROLL ANIMATIONS
════════════════════════════════════════════════════ */
function initScrollAnimations() {

  // Trust bar
  rev('.trust-item', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '.trust-bar');

  // Section heads
  document.querySelectorAll('.section-head').forEach(el => {
    rev(el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
      el
    );
  });

  // Room cards — elegant fade-in from below
  document.querySelectorAll('.room-card').forEach((card, i) => {
    rev(card,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.75, delay: i * 0.12, ease: 'power3.out' },
      '.rooms-grid', 'top 82%'
    );
  });

  // Experience cards
  document.querySelectorAll('.exp-card').forEach((card, i) => {
    rev(card,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out' },
      '.experiencia__cards', 'top 82%'
    );
  });
  rev('.experiencia__text > *',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, stagger: 0.1, duration: 0.65, ease: 'power3.out' },
    '.experiencia__text', 'top 80%'
  );

  // Gallery items
  document.querySelectorAll('.g-item').forEach((el, i) => {
    rev(el,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.65, delay: i * 0.08, ease: 'power2.out' },
      el
    );
  });

  // Reserva section
  rev('.reserva__text > *',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, stagger: 0.1, duration: 0.65, ease: 'power3.out' },
    '.reserva__text', 'top 82%'
  );
  rev('.reserva__form',
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' },
    '.reserva__form', 'top 84%'
  );

  // Location info blocks
  document.querySelectorAll('.loc-block').forEach((el, i) => {
    rev(el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, delay: i * 0.1, ease: 'power2.out' },
      '.loc-info', 'top 82%'
    );
  });
  rev('.loc-map',
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 0.75, ease: 'power2.out' },
    '.loc-map', 'top 84%'
  );

  // Contact section
  rev('.contactos__inner > *',
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out' },
    '.contactos__inner', 'top 80%'
  );

  // Parallax on experiência background
  if (!reduced) {
    gsap.to('.experiencia__bg img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.experiencia',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }
}

/* ════════════════════════════════════════════════════
   BOOKING BAR — DATE SYNC
   Check-out min = check-in + 1 day
════════════════════════════════════════════════════ */
(function bookingDates() {
  // Set min dates to today
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  ['hbbCheckin','rCheckin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.min = today; el.value = tomorrow; }
  });

  const defaultCheckout = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
  ['hbbCheckout','rCheckout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.min = tomorrow; el.value = defaultCheckout; }
  });

  // Sync: hero bar → form
  function syncCheckin(val) {
    ['hbbCheckin','rCheckin'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    const nextDay = new Date(new Date(val).getTime() + 86400000).toISOString().split('T')[0];
    ['hbbCheckout','rCheckout'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.min = nextDay; if (el.value <= val) el.value = nextDay; }
    });
  }

  document.getElementById('hbbCheckin')?.addEventListener('change', e => syncCheckin(e.target.value));
  document.getElementById('rCheckin')?.addEventListener('change', e => syncCheckin(e.target.value));
})();

/* ════════════════════════════════════════════════════
   HERO BOOKING BAR — search button
════════════════════════════════════════════════════ */
document.getElementById('hbbSearch')?.addEventListener('click', () => {
  const checkin  = document.getElementById('hbbCheckin')?.value;
  const checkout = document.getElementById('hbbCheckout')?.value;
  const guests   = document.getElementById('hbbHospedes')?.value;

  // Populate form fields
  if (checkin)  document.getElementById('rCheckin').value  = checkin;
  if (checkout) document.getElementById('rCheckout').value = checkout;
  if (guests)   document.getElementById('rHospedes').value = guests;

  // Scroll to rooms
  const target = document.getElementById('acomodacoes');
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 12;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }
});

/* ════════════════════════════════════════════════════
   ROOM CARD "Reservar" buttons — prefill form
════════════════════════════════════════════════════ */
document.querySelectorAll('.btn-book[data-room]').forEach(btn => {
  btn.addEventListener('click', () => {
    const room = btn.dataset.room;
    const sel  = document.getElementById('rQuarto');
    if (sel) {
      for (const opt of sel.options) {
        if (opt.text.includes(room)) { sel.value = opt.value || opt.text; break; }
      }
    }
  });
});

/* ════════════════════════════════════════════════════
   RESERVA FORM
════════════════════════════════════════════════════ */
document.getElementById('reservaForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const nome     = document.getElementById('rNome')?.value.trim();
  const tel      = document.getElementById('rTel')?.value.trim();
  const email    = document.getElementById('rEmail')?.value.trim();
  const checkin  = document.getElementById('rCheckin')?.value;
  const checkout = document.getElementById('rCheckout')?.value;
  const quarto   = document.getElementById('rQuarto')?.value;
  const pgmento  = document.getElementById('rPagamento')?.value;
  const pedidos  = document.getElementById('rPedidos')?.value;
  const status   = document.getElementById('formStatus');
  const btn      = document.getElementById('rSubmit');

  if (!nome || !tel || !email || !checkin || !checkout) {
    if (status) { status.textContent = lang === 'pt' ? 'Por favor preencha os campos obrigatórios.' : 'Please fill in all required fields.'; status.style.color = 'var(--terracota)'; }
    return;
  }

  btn.disabled = true;
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="${lang === 'pt' ? 't-pt' : 't-en'}">${lang === 'pt' ? '⏳ A processar...' : '⏳ Processing...'}</span>`;

  const waMsgPt =
    `Olá! Gostaria de reservar no *Oásis de Conforto*.\n\n` +
    `👤 *Nome:* ${nome}\n📞 *Tel:* ${tel}\n📧 *E-mail:* ${email}\n\n` +
    `🗓 *Check-in:* ${checkin}\n🗓 *Check-out:* ${checkout}\n` +
    (quarto   ? `🛏 *Quarto:* ${quarto}\n`   : '') +
    (pgmento  ? `💳 *Pagamento:* ${pgmento}\n` : '') +
    (pedidos  ? `📝 *Pedidos:* ${pedidos}\n`  : '') +
    `\nPoderia confirmar a disponibilidade? Obrigado!`;

  const waMsgEn =
    `Hello! I'd like to book at *Oásis de Conforto*.\n\n` +
    `👤 *Name:* ${nome}\n📞 *Phone:* ${tel}\n📧 *Email:* ${email}\n\n` +
    `🗓 *Check-in:* ${checkin}\n🗓 *Check-out:* ${checkout}\n` +
    (quarto   ? `🛏 *Room:* ${quarto}\n`     : '') +
    (pgmento  ? `💳 *Payment:* ${pgmento}\n`  : '') +
    (pedidos  ? `📝 *Requests:* ${pedidos}\n` : '') +
    `\nCould you confirm availability? Thank you!`;

  const msg = lang === 'pt' ? waMsgPt : waMsgEn;

  setTimeout(() => {
    window.open(`https://wa.me/244923000000?text=${encodeURIComponent(msg)}`, '_blank');

    btn.innerHTML = `<span>✓ ${lang === 'pt' ? 'Pedido enviado! Confirmaremos em breve.' : 'Request sent! We\'ll confirm shortly.'}</span>`;
    btn.style.background = 'var(--green)';
    btn.style.borderColor = 'var(--green)';
    if (status) {
      status.textContent = lang === 'pt'
        ? `Obrigado, ${nome}! Receberá confirmação via WhatsApp em até 2 horas.`
        : `Thank you, ${nome}! You'll receive WhatsApp confirmation within 2 hours.`;
      status.style.color = 'var(--green)';
    }

    // GSAP success pulse
    if (!reduced) {
      gsap.fromTo('.reserva__form',
        { boxShadow: '0 0 0 rgba(27,77,62,0)' },
        { boxShadow: '0 0 40px rgba(27,77,62,0.15)', duration: 0.5, yoyo: true, repeat: 1 }
      );
    }

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
      if (status) status.textContent = '';
      e.target.reset();
    }, 6000);
  }, 800);
});

/* ════════════════════════════════════════════════════
   STICKY BAR (mobile) — shows after hero passes
════════════════════════════════════════════════════ */
const stickyBar = document.getElementById('stickyBar');
ScrollTrigger.create({
  trigger: '.hero',
  start: 'bottom 80%',
  onEnter:     () => stickyBar?.classList.add('visible'),
  onLeaveBack: () => stickyBar?.classList.remove('visible'),
});

/* ════════════════════════════════════════════════════
   WHATSAPP FLOAT ENTRANCE
════════════════════════════════════════════════════ */
(function waEntrance() {
  const wa = document.querySelector('.wa-float');
  if (!wa || reduced) return;
  gsap.set(wa, { scale: 0, opacity: 0 });
  gsap.to(wa, { scale: 1, opacity: 1, duration: 0.55, delay: 2.5, ease: 'back.out(1.7)' });
  setInterval(() => {
    gsap.fromTo(wa, { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' });
  }, 9000);
})();

/* ════════════════════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 72) - 12;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    navMenu?.classList.remove('open');
    burger?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════ */
initScrollAnimations();
