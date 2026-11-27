/* ============================================
   NEBULA SETUPS — LANDING PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ──────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ── Mobile nav toggle ─────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('active')));
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Reveal on scroll (Intersection Observer) ── */
  const revealElements = () => {
    // Tag elements for reveal
    const selectors = [
      '.feature-card',
      '.product-card',
      '.spec-item',
      '.testimonial-card',
      '.section__tag',
      '.section__title',
      '.section__subtitle',
      '.cta-section__content',
    ];

    document.querySelectorAll(selectors.join(',')).forEach((el, i) => {
      el.classList.add('reveal');
      // Add staggered delay based on siblings
      const parent = el.parentElement;
      const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains('reveal')) : [];
      const index = siblings.indexOf(el);
      if (index >= 0 && index < 4) {
        el.classList.add(`reveal--delay-${index + 1}`);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  };

  if (window.IntersectionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) revealElements();

  /* ── Counter animation ─────────────────── */
  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1800;
          const start = performance.now();

          const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            el.textContent = Math.round(easedProgress * target).toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  };

  if (window.IntersectionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) animateCounters();
  else document.querySelectorAll('[data-count]').forEach(el => { el.textContent = Number(el.dataset.count).toLocaleString(); });

  /* ── Floating particles in hero ─────────── */
  const createParticles = () => {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 3 + 1;

      Object.assign(particle.style, {
        position: 'absolute',
        width:  `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: Math.random() > 0.5
          ? 'rgba(0, 229, 255, .35)'
          : 'rgba(57, 255, 127, .3)',
        left: `${Math.random() * 100}%`,
        top:  `${Math.random() * 100}%`,
        animation: `floatParticle ${6 + Math.random() * 10}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        pointerEvents: 'none',
      });

      container.appendChild(particle);
    }

    // Inject keyframes once
    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1);   opacity: .4; }
          25%      { transform: translate(15px, -20px) scale(1.2); opacity: .7; }
          50%      { transform: translate(-10px, -40px) scale(.8); opacity: .5; }
          75%      { transform: translate(20px, -15px) scale(1.1); opacity: .6; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) createParticles();

  /* ── Parallax-lite on hero image ─────────── */
  const heroImageWrapper = document.getElementById('hero-image-wrapper');

  if (heroImageWrapper && window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      heroImageWrapper.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  /* ── Hide scroll indicator on scroll ─────── */
  const scrollIndicator = document.getElementById('scroll-indicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '';
        scrollIndicator.style.pointerEvents = '';
      }
    }, { passive: true });
  }

  /* ── Active nav link on scroll ──────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.navbar__link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--accent-cyan)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ── Bilingual content and local concept configuration ── */
  const english = {
  "Inicio": "Home",
  "Ventajas": "Benefits",
  "El Bundle": "The bundle",
  "Ideas de juego": "Play ideas",
  "Ver el concepto": "Explore the concept",
  "Tu espacio de juego": "Your gaming space",
  "en otra órbita": "in a new orbit",
  "Desde cualquier portátil.": "From any laptop.",
  "Transforma cualquier portátil básico en un setup gaming de alta gama. Monitor ultrawide, teclado mecánico y ratón de precisión — todo en un solo bundle.": "Turn an everyday laptop into an immersive gaming station. Ultrawide monitor, mechanical keyboard and precision mouse in one concept bundle.",
  "Explorar el setup": "Explore the setup",
  "Explorar el Bundle": "Explore the bundle",
  "Respuesta del panel": "Panel response",
  "¿Por qué Nebula?": "Why Nebula?",
  "Diseñado para": "Made for",
  "No necesitas una GPU de $2,000. Solo necesitas la estación correcta.": "You don't need a $2,000 GPU. You need a space built around your play.",
  "Cero Lag Visual": "Responsive display",
  "Panel de 165 Hz y 1 ms de respuesta declarado. La fluidez del streaming depende de tu conexión y servicio.": "A 165 Hz panel with a stated 1 ms response time. Streaming smoothness depends on your connection and service.",
  "Inmersión Ultrawide": "Ultrawide immersion",
  "Panel 21:9 que envuelve tu campo de visión. Cada mundo se siente más grande, más real.": "A 21:9 display opens up your field of view. Each world feels larger and more immersive.",
  "Build Premium": "Considered design",
  "Un concepto cuidado hasta el último detalle: monitor inmersivo, teclado compacto y ratón ligero.": "A concept designed down to the details: immersive monitor, compact keyboard and lightweight mouse.",
  "Conecta tu equipo y abre tu plataforma cloud favorita. La compatibilidad depende de cada dispositivo y servicio.": "Connect your gear and open your favorite cloud platform. Compatibility varies by device and service.",
  "Tres piezas. Un solo objetivo: que tu experiencia en la nube sea épica.": "Three pieces. One goal: make your cloud gaming space feel special.",
  "Pieza central": "Centerpiece",
  "Panel IPS ultrawide 21:9 · 3440×1440 · 165Hz · 1ms GtG · HDR400 · Bordes ultradelgados": "21:9 ultrawide IPS panel · 3440×1440 · 165Hz · 1ms GtG · HDR400 · slim bezels",
  "Resolución": "Resolution",
  "Respuesta": "Response",
  "Teclado": "Keyboard",
  "Mecánico · Switches lineales de baja latencia · RGB por tecla · Hot-swap · Aluminio CNC": "Mechanical · low latency linear switches · per-key RGB · hot-swap · CNC aluminum",
  "Lineales": "Linear",
  "Cuerpo": "Body",
  "Aluminio CNC": "CNC aluminum",
  "Ratón": "Mouse",
  "Sensor óptico 26K DPI · 58g ultraligero · Polling rate 4000Hz · Switches ópticos · Grip texturizado": "26K DPI optical sensor · lightweight 58g · 4000Hz polling rate · optical switches · textured grip",
  "Peso": "Weight",
  "Especificaciones": "Specifications",
  "Números que": "Numbers that",
  "hablan": "speak",
  "Resolución UWQHD": "UWQHD resolution",
  "Tasa de refresco": "Refresh rate",
  "Precisión del sensor": "Sensor precision",
  "Formas de jugar": "Ways to play",
  "Un setup,": "One setup,",
  "más posibilidades": "more possibilities",
  "Tres ideas para imaginar la experiencia. Son ejemplos creativos de esta demo.": "Three ways to imagine the experience. These are creative examples for this demo.",
  "\"Imagina tus mundos favoritos en formato ultrawide, con más espacio para explorar y una mesa lista para jugar.\"": "\"Picture your favorite worlds in ultrawide, with more room to explore and a desk ready to play.\"",
  "\"Una estación compacta para trabajar de día y disfrutar tus partidas al terminar: cambia de modo sin cambiar de escritorio.\"": "\"A compact station for work by day and games at night: switch modes without changing desks.\"",
  "\"Tu portátil puede ser el punto de partida. Con un servicio compatible y buena conexión, el juego llega a tu pantalla.\"": "\"Your laptop can be the starting point. With a compatible service and a good connection, games reach your screen.\"",
  "Pantalla inmersiva": "Immersive screen",
  "Escenario conceptual": "Concept scenario",
  "Escritorio versátil": "Versatile desk",
  "Juego en la nube": "Cloud gaming",
  "Concepto interactivo": "Interactive concept",
  "¿Listo para elevar tu": "Ready to elevate your",
  "Explora cómo sería configurar el Nebula Cloud-Station Bundle. Esta experiencia es una demo de portafolio.": "See how you might configure the Nebula Cloud-Station Bundle. This is a portfolio demo.",
  "Precio ilustrativo": "Illustrative price",
  "Configurar demo": "Configure demo",
  "Simulación local · sin compra ni envío": "Local simulation · no purchase or shipping",
  "La estación de juegos definitiva para cloud gamers.": "The ultimate gaming station for cloud players.",
  "Producto": "Product",
  "Sobre esta demo": "About this demo",
  "Proyecto conceptual de portafolio. Productos, especificaciones y precio son ilustrativos; no hay venta real.": "A portfolio concept. Products, specifications and price are illustrative; nothing is for sale.",
  "Todos los derechos reservados.": "All rights reserved.",
  "Demo interactiva": "Interactive demo",
  "Tu estación, a tu manera": "Your station, your way",
  "Elige un estilo y descubre tu resumen. No se envían datos ni se realiza ninguna compra.": "Choose a style and see your summary. No data is sent and no purchase is made.",
  "Elige la iluminación": "Choose lighting",
  "Violeta / Orbit": "Violet / Orbit",
  "Menta / Pulse": "Mint / Pulse",
  "Tu estilo de juego": "Your play style",
  "Trabajo + juego": "Work + play",
  "Aventura inmersiva": "Immersive adventure",
  "Ver mi configuración": "View my configuration",
  "Configuración creada": "Configuration created",
  "Vista previa de portafolio. No se ha realizado ninguna reserva ni cobro.": "Portfolio preview. No reservation or charge has been made.",
  "Cambiar selección": "Change selection"
};
  const originalText = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const key = node.nodeValue.trim().replace(/\s+/g, ' ');
    if (Object.prototype.hasOwnProperty.call(english, key)) originalText.set(node, { key, raw: node.nodeValue });
  }
  const languageButtons = document.querySelectorAll('.language-switch button');
  const metaDescription = document.querySelector('meta[name="description"]');
  const originalDescription = metaDescription.content;
  const originalTitle = document.title;
  const translatedAttrs = [
    [document.getElementById('nav-toggle'), 'aria-label', 'Open navigation menu'],
    [document.getElementById('config-close'), 'aria-label', 'Close'],
    [document.getElementById('hero-image'), 'alt', 'Nebula Cloud-Station concept with an ultrawide monitor, mechanical keyboard, precision mouse and laptop'],
    [document.querySelector('#product-monitor img'), 'alt', 'Nebula 34-inch ultrawide monitor concept'],
    [document.querySelector('#product-keyboard img'), 'alt', 'Nebula compact mechanical keyboard concept'],
    [document.querySelector('#product-mouse img'), 'alt', 'Nebula precision mouse concept']
  ].map(([element, attribute, en]) => ({ element, attribute, en, es: element.getAttribute(attribute) }));
  let currentLanguage = 'es';
  const applyLanguage = lang => {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    originalText.forEach(({ key, raw }, node) => {
      node.nodeValue = lang === 'en' ? raw.replace(/\S[\s\S]*\S/, english[key]) : raw;
    });
    translatedAttrs.forEach(({ element, attribute, en, es }) => element.setAttribute(attribute, lang === 'en' ? en : es));
    document.title = lang === 'en' ? 'Nebula Setups — Cloud Gaming Station Concept' : originalTitle;
    metaDescription.content = lang === 'en'
      ? 'Explore the Nebula Cloud-Station concept: an ultrawide monitor, compact mechanical keyboard and precision mouse for cloud gaming.'
      : originalDescription;
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    if (!document.getElementById('config-result').hidden) renderSummary();
    try { localStorage.setItem('nebula-language', lang); } catch (_) { /* Storage may be unavailable. */ }
  };
  languageButtons.forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
  let savedLanguage = 'es';
  try { savedLanguage = localStorage.getItem('nebula-language') === 'en' ? 'en' : 'es'; } catch (_) {}
  applyLanguage(savedLanguage);

  const dialog = document.getElementById('config-dialog');
  const form = document.getElementById('config-form');
  const result = document.getElementById('config-result');
  const summary = document.getElementById('config-summary');
  const selections = {
    cyan: { es: 'Cyan / Nebula', en: 'Cyan / Nebula' },
    violet: { es: 'Violeta / Orbit', en: 'Violet / Orbit' },
    mint: { es: 'Menta / Pulse', en: 'Mint / Pulse' },
    cloud: { es: 'cloud gaming', en: 'cloud gaming' },
    hybrid: { es: 'trabajo y juego', en: 'work and play' },
    immersive: { es: 'aventura inmersiva', en: 'immersive adventures' }
  };
  function renderSummary() {
    const lighting = form.elements.lighting.value;
    const use = form.elements.use.value;
    summary.textContent = currentLanguage === 'en'
      ? `Lighting: ${selections[lighting].en}. Play style: ${selections[use].en}. Your concept includes the UltraView monitor, KeyForge keyboard and Vortex Pro mouse.`
      : `Iluminación: ${selections[lighting].es}. Estilo: ${selections[use].es}. Tu concepto incluye el monitor UltraView, teclado KeyForge y ratón Vortex Pro.`;
  }
  document.getElementById('final-cta').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    dialog.showModal();
  });
  document.getElementById('config-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    renderSummary();
    form.hidden = true;
    result.hidden = false;
  });
  document.getElementById('config-again').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    form.querySelector('input:checked').focus();
  });

});
