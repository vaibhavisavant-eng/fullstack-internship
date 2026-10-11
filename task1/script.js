/**
 * script.js — Portfolio Website JavaScript
 * Author: Vaibhavi S Savant
 *
 * Features:
 *  1. Dark / Light theme toggle (persisted in localStorage)
 *  2. Navbar: scroll styling + active link highlight via IntersectionObserver
 *  3. Hero typed role rotation:
 *     "Full Stack Developer" | "Backend Developer" | "Cloud Enthusiast" | "Software Engineer"
 *  4. Scroll-triggered reveal animations (IntersectionObserver)
 *  5. Contact form validation (required fields, valid email, min 10 chars for message)
 *     with inline errors & success notification
 *  6. Floating Back to Top button with smooth scroll
 */

'use strict';

/* =====================================================
   1. THEME TOGGLE (Dark / Light)
===================================================== */
(function initTheme() {
  const html      = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn || !themeIcon) return;

  const ICONS = {
    dark:  'bi-moon-stars-fill',
    light: 'bi-sun-fill'
  };

  const savedTheme = localStorage.getItem('vaibhavi-portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('vaibhavi-portfolio-theme', theme);
    themeIcon.className = `bi ${theme === 'dark' ? ICONS.light : ICONS.dark}`;
    toggleBtn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
})();


/* =====================================================
   2. NAVBAR — SCROLL SHADOW + ACTIVE LINK HIGHLIGHT
===================================================== */
(function initNavbar() {
  const nav      = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  if (!nav) return;

  // Add scrolled class on scroll
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight active section link
  const observerOptions = {
    root: null,
    rootMargin: '-70px 0px -55% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-link',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Close mobile dropdown when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarLinks');
      if (typeof bootstrap !== 'undefined' && bootstrap.Collapse && collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();


/* =====================================================
   3. HERO TYPED ROLE ROTATION
===================================================== */
(function initTypedText() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  // Required roles to cycle through
  const roles = [
    'Full Stack Developer',
    'Backend Developer',
    'Cloud Enthusiast',
    'Software Engineer'
  ];

  let roleIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;

  const TYPING_SPEED   = 85;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER    = 1800;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIdx === current.length) {
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 500);
})();


/* =====================================================
   4. SCROLL REVEAL ANIMATIONS
===================================================== */
(function initReveal() {
  // Animate hero items on page load
  const heroAnimated = document.querySelectorAll('.hero-section .animate-slide-up');
  heroAnimated.forEach(el => el.classList.add('visible'));

  // Reveal cards, skills, and sections on scroll
  const revealTargets = document.querySelectorAll(
    '.about-card, .skill-group-card, .experience-card, .project-card, .hobby-card, .contact-info-card, .contact-form-card'
  );

  if (!revealTargets.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.dataset.revealDelay = (i % 3) * 80;
    revealObserver.observe(el);
  });
})();


/* =====================================================
   5. CONTACT FORM VALIDATION (Required, Email regex, Min 10 chars)
===================================================== */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const nameInput  = document.getElementById('inputName');
  const emailInput = document.getElementById('inputEmail');
  const msgInput   = document.getElementById('inputMessage');
  const charCount  = document.getElementById('charCount');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitBtnText');
  const submitIcon = document.getElementById('submitBtnIcon');
  const spinner    = document.getElementById('submitSpinner');

  if (!form || !nameInput || !emailInput || !msgInput) return;

  const MAX_CHARS = 500;
  const MIN_CHARS = 10;

  // Live character counter
  msgInput.addEventListener('input', () => {
    let len = msgInput.value.length;
    if (len > MAX_CHARS) {
      msgInput.value = msgInput.value.substring(0, MAX_CHARS);
      len = MAX_CHARS;
    }
    if (charCount) charCount.textContent = `${len} / ${MAX_CHARS}`;
    clearError(msgInput, 'messageError');
  });

  // Blur validation
  nameInput.addEventListener('blur',  () => validateName());
  emailInput.addEventListener('blur', () => validateEmail());
  msgInput.addEventListener('blur',   () => validateMessage());

  // Input clearing
  nameInput.addEventListener('input',  () => clearError(nameInput,  'nameError'));
  emailInput.addEventListener('input', () => clearError(emailInput, 'emailError'));

  // Form submit event
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameOk  = validateName();
    const emailOk = validateEmail();
    const msgOk   = validateMessage();

    if (!nameOk || !emailOk || !msgOk) {
      if (!nameOk)       nameInput.focus();
      else if (!emailOk) emailInput.focus();
      else if (!msgOk)   msgInput.focus();
      return;
    }

    // Submission animation state
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      form.reset();
      if (charCount) charCount.textContent = `0 / ${MAX_CHARS}`;

      [nameInput, emailInput, msgInput].forEach(inp => {
        inp.classList.remove('is-valid', 'is-invalid');
      });

      if (successMsg) {
        successMsg.classList.remove('d-none');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => successMsg.classList.add('d-none'), 7000);
      }
    }, 1200);
  });

  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      setError(nameInput, 'nameError', 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      setError(nameInput, 'nameError', 'Name must be at least 2 characters.');
      return false;
    }
    setValid(nameInput, 'nameError');
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!val) {
      setError(emailInput, 'emailError', 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setError(emailInput, 'emailError', 'Please enter a valid email address (e.g., name@example.com).');
      return false;
    }
    setValid(emailInput, 'emailError');
    return true;
  }

  function validateMessage() {
    const val = msgInput.value.trim();
    if (!val) {
      setError(msgInput, 'messageError', 'Message cannot be empty.');
      return false;
    }
    if (val.length < MIN_CHARS) {
      setError(
        msgInput,
        'messageError',
        `Message must be at least ${MIN_CHARS} characters (currently ${val.length} characters).`
      );
      return false;
    }
    setValid(msgInput, 'messageError');
    return true;
  }

  function setError(input, errorId, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = message;
  }

  function setValid(input, errorId) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = '';
  }

  function clearError(input, errorId) {
    input.classList.remove('is-invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = '';
  }

  function setSubmitting(loading) {
    if (submitBtn)  submitBtn.disabled = loading;
    if (submitText) submitText.textContent = loading ? 'Sending…' : 'Send Message';
    if (submitIcon) submitIcon.classList.toggle('d-none', loading);
    if (spinner)    spinner.classList.toggle('d-none', !loading);
  }
})();


/* =====================================================
   6. FLOATING BACK TO TOP BUTTON
===================================================== */
(function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
