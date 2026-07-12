/* ============================================
   MOHAMED MOSTAFA — PREMIUM PORTFOLIO
   Data Analyst & AI Developer
   Main JavaScript (ES6+)
   ============================================ */

'use strict';

/* ---------- DOM References ---------- */
const loadingScreen = document.getElementById('loadingScreen');
const loaderProgressBar = document.getElementById('loaderProgressBar');
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const typingText = document.getElementById('typingText');
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
const mouseGlow = document.getElementById('mouseGlow');
const mouseTrailCanvas = document.getElementById('mouseTrail');
const textGlow = document.getElementById('textGlow');
const particlesContainer = document.getElementById('particles');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const sections = document.querySelectorAll('.section');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

/* ============================================
   LOADING SCREEN
   Animated progress bar on page load
   ============================================ */
document.body.style.overflow = 'hidden';

function initLoader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      finishLoading();
    }
    if (loaderProgressBar) loaderProgressBar.style.width = `${progress}%`;
  }, 120);
}

function finishLoading() {
  setTimeout(() => {
    loadingScreen?.classList.add('hidden');
    document.body.style.overflow = '';
    initTypingAnimation();
    initScrollReveal();
    initSkillBars();
    initStatCounters();
    initHeroEntrance();
  }, 400);
}

window.addEventListener('load', initLoader);

/* ============================================
   THEME TOGGLE (Dark / Light Mode)
   Persists preference in localStorage
   ============================================ */
function getPreferredTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

setTheme(getPreferredTheme());

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});

/* ============================================
   NAVBAR & SCROLL BEHAVIOR
   ============================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  header?.classList.toggle('scrolled', scrollY > 50);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
    scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
  }

  backToTop?.classList.toggle('visible', scrollY > 400);

  if (!prefersReducedMotion) {
    document.querySelectorAll('.blob').forEach((blob, index) => {
      blob.style.transform = `translateY(${scrollY * (index + 1) * 0.03}px)`;
    });
  }
});

function updateActiveNav() {
  const scrollPos = window.scrollY + 150;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

navToggle?.addEventListener('click', () => {
  navMenu?.classList.toggle('open');
  navToggle?.classList.toggle('active');
  navToggle?.setAttribute('aria-expanded', navMenu?.classList.contains('open'));
});

document.addEventListener('click', (e) => {
  if (!navMenu?.contains(e.target) && !navToggle?.contains(e.target)) {
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================
   TYPING ANIMATION
   ============================================ */
function initTypingAnimation() {
  if (!typingText) return;

  const phrases = [
    'Data Analyst',
    'Machine Learning Engineer',
    'Python Developer',
    'Business Intelligence Specialist'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    let speed = 100;

    if (isDeleting) {
      typingText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      speed = 50;
    } else {
      typingText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      speed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const parent = entry.target.closest(
          '.skills-grid, .projects-grid, .services-grid, .certificates-grid, .timeline, .social-grid'
        );
        const siblings = parent ? [...parent.querySelectorAll('.reveal, .reveal-left, .reveal-right')] : [];
        const delay = parent ? siblings.indexOf(entry.target) * 100 : 0;

        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ============================================
   SKILL PROGRESS BARS
   ============================================ */
function initSkillBars() {
  const progressBars = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const progress = entry.target.getAttribute('data-progress');
        entry.target.style.setProperty('--progress-width', `${progress}%`);
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  progressBars.forEach((bar) => observer.observe(bar));
}

/* ============================================
   ANIMATED STAT COUNTERS
   ============================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

/* ============================================
   HERO ENTRANCE ANIMATION
   ============================================ */
function initHeroEntrance() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.home-content > .reveal').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.12}s`;
    el.classList.add('visible');
  });
}

/* ============================================
   CUSTOM CURSOR, GLOW & MOUSE TRAIL
   ============================================ */
if (!isTouchDevice && !prefersReducedMotion) {
  document.body.classList.add('custom-cursor');

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  const trailPoints = [];

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    if (mouseGlow) {
      mouseGlow.style.left = `${mouseX}px`;
      mouseGlow.style.top = `${mouseY}px`;
    }

    if (textGlow) {
      const rect = textGlow.parentElement.getBoundingClientRect();
      const inside =
        mouseX >= rect.left && mouseX <= rect.right &&
        mouseY >= rect.top && mouseY <= rect.bottom;
      textGlow.style.opacity = inside ? '1' : '0';
      if (inside) {
        textGlow.style.left = `${mouseX - rect.left - 100}px`;
        textGlow.style.top = `${mouseY - rect.top - 100}px`;
      }
    }

    trailPoints.push({ x: mouseX, y: mouseY, age: 0 });
    if (trailPoints.length > 20) trailPoints.shift();
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  document.querySelectorAll('a, button, .skill-card, .project-card, .service-card, .social-card, .testimonial-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorOutline?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline?.classList.remove('hover'));
  });

  /* Mouse trail canvas */
  if (mouseTrailCanvas) {
    const ctx = mouseTrailCanvas.getContext('2d');
    const resizeCanvas = () => {
      mouseTrailCanvas.width = window.innerWidth;
      mouseTrailCanvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawTrail() {
      ctx.clearRect(0, 0, mouseTrailCanvas.width, mouseTrailCanvas.height);
      trailPoints.forEach((point, i) => {
        point.age += 1;
        const alpha = Math.max(0, 1 - point.age / 20);
        const size = 4 * alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.6})`;
        ctx.fill();
      });
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        if (trailPoints[i].age > 20) trailPoints.splice(i, 1);
      }
      requestAnimationFrame(drawTrail);
    }
    drawTrail();
  }
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagneticButtons() {
  if (isTouchDevice || prefersReducedMotion) return;

  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-strength')) || 0.3;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

initMagneticButtons();

/* ============================================
   TILT CARDS (3D hover effect)
   ============================================ */
function initTiltCards() {
  if (isTouchDevice || prefersReducedMotion) return;

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

initTiltCards();

/* ============================================
   RIPPLE EFFECT ON BUTTONS
   ============================================ */
document.querySelectorAll('.ripple').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.classList.add('ripple-circle');
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});

/* ============================================
   FLOATING PARTICLES
   ============================================ */
function createParticles() {
  if (!particlesContainer || prefersReducedMotion) return;

  const colors = ['#6366F1', '#818CF8', '#10B981', '#14B8A6'];
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    const size = 2 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particlesContainer.appendChild(particle);
  }
}

createParticles();

/* ============================================
   TESTIMONIALS CAROUSEL
   ============================================ */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialsDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = [...track.querySelectorAll('.testimonial-card')];
  let currentIndex = 0;
  let autoplayInterval;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateCarousel() {
    const visible = getVisibleCount();
    const gap = 24;
    const basis = `calc(${100 / visible}% - ${(gap * (visible - 1)) / visible}px)`;

    cards.forEach((card) => {
      card.style.flex = `0 0 ${basis}`;
    });

    const offset = currentIndex * (100 / visible);
    track.style.transform = `translateX(calc(-${offset}% - ${currentIndex * gap / visible}px))`;

    dotsContainer?.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goNext() {
    currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function goPrev() {
    currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
    updateCarousel();
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    if (!prefersReducedMotion) {
      autoplayInterval = setInterval(goNext, 5000);
    }
  }

  track.style.display = 'flex';
  track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  track.style.width = '100%';
  cards.forEach((card) => {
    card.style.flexShrink = '0';
  });

  buildDots();
  updateCarousel();
  resetAutoplay();

  prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });

  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    buildDots();
    updateCarousel();
  });
}

initTestimonialsCarousel();

/* ============================================
   CONTACT FORM
   ============================================ */
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.className = 'form-status error';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.textContent = 'Please enter a valid email address.';
    formStatus.className = 'form-status error';
    return;
  }

  formStatus.textContent = 'Thank you! Your message has been received.';
  formStatus.className = 'form-status success';
  contactForm.reset();

  setTimeout(() => {
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }, 5000);
});

/* ============================================
   SECTION FADE TRANSITIONS
   ============================================ */
if (!prefersReducedMotion) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.style.opacity = '1';
      });
    },
    { threshold: 0.05 }
  );

  sections.forEach((section) => {
    section.style.transition = 'opacity 0.6s ease';
    sectionObserver.observe(section);
  });
}

/* ============================================
   LAZY LOADING IMAGES (Lottie-ready)
   Add loading="lazy" to future images automatically
   ============================================ */
document.querySelectorAll('img[data-src]').forEach((img) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    });
  });
  observer.observe(img);
});
