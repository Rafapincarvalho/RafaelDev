// Rafael Carvalho Portfolio — interactions
(function () {
  // ---------- THEME ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('rc-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', next);
      localStorage.setItem('rc-theme', next);
    });
  }

  // ---------- I18N ----------
  const langSwitch = document.getElementById('langSwitch');
  const langButtons = langSwitch ? langSwitch.querySelectorAll('.lang-btn') : [];
  let currentLang = localStorage.getItem('rc-lang') || 'pt';

  function applyLang(lang) {
    currentLang = lang;

    document.documentElement.setAttribute('lang', lang === 'lgp' ? 'pt' : lang);

    const dict = window.I18N && window.I18N[lang] ? window.I18N[lang] : window.I18N.pt;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');

      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const existing = document.getElementById('lgpBanner');

    if (lang === 'lgp') {
      if (!existing) {
        const banner = document.createElement('div');
        banner.id = 'lgpBanner';
        banner.innerHTML = `
          <i class="fa-solid fa-hands"></i>
          <strong>Modo LGP ativo</strong>
          <span>— Conteúdo simplificado em Português. Vídeos em Língua Gestual Portuguesa em breve.</span>
          <button id="lgpClose" aria-label="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;

        document.body.appendChild(banner);

        const closeBtn = document.getElementById('lgpClose');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => banner.remove());
        }
      }
    } else if (existing) {
      existing.remove();
    }

    localStorage.setItem('rc-lang', lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang);
    });
  });

  applyLang(currentLang);

  // ---------- NAV scroll ----------
  const nav = document.getElementById('nav');

  function onScroll() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Burger ----------
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ---------- Cursor blob ----------
  const blob = document.getElementById('cursorBlob');

  let bx = 0;
  let by = 0;
  let tx = 0;
  let ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function tickBlob() {
    bx += (tx - bx) * 0.08;
    by += (ty - by) * 0.08;

    if (blob) {
      blob.style.transform = `translate(${bx}px, ${by}px) translate(-50%,-50%)`;
    }

    requestAnimationFrame(tickBlob);
  }

  tickBlob();

  // ---------- Reveal animations ----------
  const revealEls = document.querySelectorAll(
    '.section, .skill-card, .project-card, .timeline__item, .edu-card, .contact-item, .highlight, .download-card'
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => {
    revealObserver.observe(el);
  });

  // ---------- Animate skill bars ----------
  const skillCards = document.querySelectorAll('.skill-card');

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar span');

        if (bar) {
          const width = bar.style.width;
          bar.style.width = '0%';

          requestAnimationFrame(() => {
            bar.style.width = width;
          });
        }

        barObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4
  });

  skillCards.forEach(card => {
    barObserver.observe(card);
  });

  // ---------- Skills filters ----------
  const filters = document.querySelectorAll('.filter');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(filter => {
        filter.classList.remove('active');
      });

      btn.classList.add('active');

      const cat = btn.dataset.filter;

      document.querySelectorAll('.skill-card').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  // ---------- Contact form ----------
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form && formStatus) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      let ok = true;
      const fd = new FormData(form);

      form.querySelectorAll('.field').forEach(field => {
        field.classList.remove('invalid');
      });

      const name = fd.get('name');
      const email = fd.get('email');
      const message = fd.get('message');

      if (!name) {
        const nameInput = form.querySelector('[name=name]');
        if (nameInput) {
          nameInput.closest('.field').classList.add('invalid');
        }
        ok = false;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const emailInput = form.querySelector('[name=email]');
        if (emailInput) {
          emailInput.closest('.field').classList.add('invalid');
        }
        ok = false;
      }

      if (!message) {
        const messageInput = form.querySelector('[name=message]');
        if (messageInput) {
          messageInput.closest('.field').classList.add('invalid');
        }
        ok = false;
      }

      if (ok) {
        const subject = fd.get('subject') || (currentLang === 'en' ? 'Contact via portfolio' : 'Contacto via portfólio');
        const body = fd.get('message') + '\n\n— ' + name + ' (' + email + ')';
        window.location.href = 'mailto:carvapinto@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

        formStatus.textContent = currentLang === 'en'
          ? 'Opening your email app… If nothing opens, write to carvapinto@gmail.com.'
          : 'A abrir a tua app de email… Se não abrir, escreve para carvapinto@gmail.com.';

        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
      }
    });
  }

  // ---------- Year ----------
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        navAnchors.forEach(anchor => {
          anchor.classList.toggle(
            'active',
            anchor.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(section => {
    navObserver.observe(section);
  });
})();
