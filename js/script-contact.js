/*Sticky Navbar*/
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
});

/*End */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dynamic footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast helper ---------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(message, icon = 'fa-circle-check') {
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinksEl.classList.toggle('open');
    });
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksEl.classList.remove('open');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], .hero-section[id], section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const idToLink = {};
  navAnchors.forEach(a => {
    const id = a.getAttribute('href').replace('#', '');
    idToLink[id] = a;
  });

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = idToLink[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => navObserver.observe(sec));
  }

  /* ---------- Scroll reveal for every section ---------- */
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('active'));
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.querySelector('.testi-track');
  const prevBtn = document.querySelector('.nav-arrow.left');
  const nextBtn = document.querySelector('.nav-arrow.right');
  const dotsWrap = document.querySelector('.testi-dots');

  if (track) {
    const cards = Array.from(track.children);
    let cardsPerView = getCardsPerView();
    let index = 0;

    function getCardsPerView() {
      if (window.innerWidth <= 1024) return 1;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - cardsPerView);
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const dotCount = maxIndex() + 1;
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('span');
        if (i === index) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function update() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 20;
      const offset = index * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }

    function goTo(i) {
      index = Math.min(Math.max(i, 0), maxIndex());
      update();
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));

    let autoplay = setInterval(() => {
      goTo(index + 1 > maxIndex() ? 0 : index + 1);
    }, 5000);

    [prevBtn, nextBtn, track].forEach(el => {
      el && el.addEventListener('mouseenter', () => clearInterval(autoplay));
      el && el.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => {
          goTo(index + 1 > maxIndex() ? 0 : index + 1);
        }, 5000);
      });
    });

    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      index = Math.min(index, maxIndex());
      buildDots();
      update();
    });

    buildDots();
    update();
  }

  /* ---------- Play button (video placeholder) ---------- */
  const video = document.getElementById("productVideo");
const playBtn = document.getElementById("playBtn");

if(video && playBtn){

    video.play();

    playBtn.addEventListener("click", ()=>{

        if(video.paused){

            video.play();
            playBtn.innerHTML='<i class="fa-solid fa-pause"></i>';

        }else{

            video.pause();
            playBtn.innerHTML='<i class="fa-solid fa-play"></i>';

        }

    });

}

  /* ---------- CTA / Pre-order buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    const label = btn.textContent.trim();
    if (label.startsWith('Pre-Order')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast("You're on the list — we'll notify you at launch", 'fa-circle-check');
      });
    }
  });

  const exploreBtn = document.querySelector('.btn-outline');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Random blinking ring LEDs ---------- */
  const ledColors = ['red', 'green', 'yellow'];
  document.querySelectorAll('.ring-graphic .led').forEach((led, i) => {
    setInterval(() => {
      led.classList.toggle('blink');
    }, 900 + i * 250);
  });

  /* ---------- Contact form validation + submit ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = contactForm.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    function validateField(field) {
      const group = field.closest('.form-group');
      const isValid = field.checkValidity();
      group.classList.toggle('invalid', !isValid);
      return isValid;
    }

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('invalid')) validateField(field);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        showToast('Please fill in all required fields', 'fa-circle-exclamation');
        return;
      }

      showToast("Message sent — we'll be in touch shortly", 'fa-circle-check');
      contactForm.reset();
      fields.forEach(field => field.closest('.form-group').classList.remove('invalid'));
    });
  }
  const heroRight = document.querySelector('.hero-right');
  const floatingCards = document.querySelectorAll('.hero-right .floating-card');
  if (heroRight && floatingCards.length && window.matchMedia('(min-width: 1025px)').matches) {
    heroRight.addEventListener('mousemove', (e) => {
      const rect = heroRight.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      floatingCards.forEach((card, i) => {
        const depth = (i + 1) * 10;
        card.style.setProperty('--parallax-x', `${x * depth}px`);
        card.style.setProperty('--parallax-y', `${y * depth}px`);
      });
    });
    heroRight.addEventListener('mouseleave', () => {
      floatingCards.forEach(card => {
        card.style.setProperty('--parallax-x', '0px');
        card.style.setProperty('--parallax-y', '0px');
      });
    });
  }

  /* ---------- 3D tilt on cards (feature / testimonial / design) ---------- */
  const tiltSelector = '.feature-card, .testi-card, .d-feat';
  if (window.matchMedia('(min-width: 1025px)').matches && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll(tiltSelector).forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Animated stat counters (bottom-bar numeric values only) ---------- */
  const statHeadings = document.querySelectorAll('.stat-item h5');
  const numericPattern = /^(\d+)(.*)$/;
  const countObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const match = el.textContent.trim().match(numericPattern);
          countObserver.unobserve(el);
          if (!match) return;
          const target = parseInt(match[1], 10);
          const suffix = match[2];
          let current = 0;
          const duration = 900;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            current = Math.floor(progress * target);
            el.textContent = `${current}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = `${target}${suffix}`;
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 })
    : null;
  if (countObserver) {
    statHeadings.forEach(el => {
      if (numericPattern.test(el.textContent.trim())) countObserver.observe(el);
    });
  }
});