/**
 * script.js — LuxeShop E-Commerce Landing Page
 * -----------------------------------------------
 * Features:
 *  1. Navbar — scroll shadow + active-link highlight
 *  2. Announcement bar dismissal
 *  3. Hero section entry animation
 *  4. Category filter pills (products grid)
 *  5. Cart system — add, remove, qty change, totals,
 *     badge update, sidebar open/close
 *  6. Countdown timer (promo banner)
 *  7. Scroll-reveal (IntersectionObserver)
 *  8. Back-to-top button
 *  9. Newsletter form validation
 * 10. Footer dynamic year
 * 11. Toast notification system
 */

'use strict';

/* =====================================================
   UTILITIES
===================================================== */

/**
 * Show a temporary toast notification.
 * @param {string} message
 * @param {'success'|'info'} type
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-bag-check-fill'} toast-icon ${type}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

/** Format a number as a USD price string. */
function formatPrice(num) {
  return `$${parseFloat(num).toFixed(2)}`;
}

/* =====================================================
   1. NAVBAR — SCROLL SHADOW + ACTIVE LINK
===================================================== */
(function initNavbar() {
  const nav    = document.getElementById('mainNav');
  const links  = nav.querySelectorAll('.nav-link[href^="#"]');
  const sects  = document.querySelectorAll('section[id]');

  // Add shadow class when page scrolled
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Active link via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-70px 0px -55% 0px', threshold: 0 });

  sects.forEach(s => observer.observe(s));

  // Close mobile collapse on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      const collapseEl = document.getElementById('navbarContent');
      if (typeof bootstrap !== 'undefined' && bootstrap.Collapse && collapseEl) {
        const bsCol = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCol) bsCol.hide();
      }
    });
  });
})();


/* =====================================================
   2. ANNOUNCEMENT BAR DISMISSAL
===================================================== */
(function initAnnouncement() {
  const bar = document.getElementById('announcementBar');
  const btn = document.getElementById('closeAnnouncement');
  if (!bar || !btn) return;

  btn.addEventListener('click', () => {
    bar.style.transition = 'max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease';
    bar.style.overflow   = 'hidden';
    bar.style.maxHeight  = `${bar.offsetHeight}px`;
    requestAnimationFrame(() => {
      bar.style.maxHeight = '0';
      bar.style.opacity   = '0';
      bar.style.padding   = '0';
    });
    bar.addEventListener('transitionend', () => bar.remove(), { once: true });
  });
})();


/* =====================================================
   3. HERO ENTRY ANIMATION
===================================================== */
(function initHeroAnimation() {
  const animated = document.querySelectorAll('.hero-section .animate-up');
  // Trigger slightly after page load
  requestAnimationFrame(() => {
    animated.forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 90);
    });
  });
})();


/* =====================================================
   4. CATEGORY FILTER PILLS
===================================================== */
(function initCategoryFilter() {
  const pills = document.querySelectorAll('.cat-pill');
  const items = document.querySelectorAll('.product-item');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.cat;

      items.forEach(item => {
        const match = cat === 'all' || item.dataset.cat === cat;
        // Animate filter transition
        if (match) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();


/* =====================================================
   5. CART SYSTEM
===================================================== */
(function initCart() {
  /* ---- State ---- */
  // cart is an array of: { id, name, price, img, qty }
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('luxeshop-cart') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
  }

  /* ---- DOM refs ---- */
  const sidebar       = document.getElementById('cartSidebar');
  const overlay       = document.getElementById('cartOverlay');
  const closeBtn      = document.getElementById('closeCart');
  const cartBody      = document.getElementById('cartBody');
  const cartItemsList = document.getElementById('cartItems');
  const cartEmpty     = document.getElementById('cartEmpty');
  const cartFooter    = document.getElementById('cartFooter');
  const cartTotalEl   = document.getElementById('cartTotal');
  const clearBtn      = document.getElementById('clearCartBtn');
  const checkoutBtn   = document.getElementById('checkoutBtn');
  const mobileCount   = document.getElementById('mobileCartCount');
  const desktopCount  = document.getElementById('desktopCartCount');

  /* ---- Persist & sync ---- */
  function saveCart() {
    localStorage.setItem('luxeshop-cart', JSON.stringify(cart));
  }

  /** Update both cart badge counts. */
  function updateBadges() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    [mobileCount, desktopCount].forEach(el => {
      if (!el) return;
      el.textContent = total;
      // Brief pop animation
      el.classList.remove('pop');
      void el.offsetWidth; // reflow
      el.classList.add('pop');
      setTimeout(() => el.classList.remove('pop'), 300);
    });
  }

  /** Recalculate and display cart total. */
  function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
  }

  /** Render the cart items list in the sidebar. */
  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    const isEmpty = cart.length === 0;
    if (cartEmpty)  cartEmpty.style.display  = isEmpty ? '' : 'none';
    if (cartFooter) cartFooter.style.display = isEmpty ? 'none' : '';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.dataset.id = item.id;
      li.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn qty-dec" aria-label="Decrease quantity of ${item.name}">−</button>
          <span class="qty-val" aria-label="Quantity: ${item.qty}">${item.qty}</span>
          <button class="qty-btn qty-inc" aria-label="Increase quantity of ${item.name}">+</button>
          <button class="cart-remove-btn" aria-label="Remove ${item.name} from cart">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      `;

      // Qty decrement
      li.querySelector('.qty-dec').addEventListener('click', () => {
        const idx = cart.findIndex(c => c.id === item.id);
        if (idx === -1) return;
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart(); updateBadges(); renderCart(); updateTotal();
      });

      // Qty increment
      li.querySelector('.qty-inc').addEventListener('click', () => {
        const idx = cart.findIndex(c => c.id === item.id);
        if (idx !== -1) cart[idx].qty++;
        saveCart(); updateBadges(); renderCart(); updateTotal();
      });

      // Remove item
      li.querySelector('.cart-remove-btn').addEventListener('click', () => {
        cart = cart.filter(c => c.id !== item.id);
        saveCart(); updateBadges(); renderCart(); updateTotal();
        showToast(`${item.name} removed.`, 'info');
      });

      cartItemsList.appendChild(li);
    });

    updateTotal();
  }

  /* ---- Open / Close sidebar ---- */
  function openCart() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open on cart button clicks
  document.getElementById('mobileCartBtn')?.addEventListener('click', e => { e.preventDefault(); openCart(); });
  document.getElementById('desktopCartBtn')?.addEventListener('click', e => { e.preventDefault(); openCart(); });
  // Close triggers
  closeBtn?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  // Esc key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  /* ---- Add to cart buttons ---- */
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.productId;
      const name  = btn.dataset.productName;
      const price = parseFloat(btn.dataset.productPrice);
      const img   = btn.dataset.productImg;

      const existing = cart.find(c => c.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, price, img, qty: 1 });
      }

      saveCart();
      updateBadges();
      renderCart();

      // Button feedback
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Added!';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }, 1200);

      showToast(`${name} added to cart!`, 'success');
    });
  });

  /* ---- Clear cart ---- */
  clearBtn?.addEventListener('click', () => {
    cart = [];
    saveCart(); updateBadges(); renderCart();
    showToast('Cart cleared.', 'info');
  });

  /* ---- Checkout (demo) ---- */
  checkoutBtn?.addEventListener('click', () => {
    showToast('Checkout coming soon! 🚀', 'info');
  });

  /* ---- Init ---- */
  updateBadges();
  renderCart();
  if (cart.length === 0 && cartFooter) cartFooter.style.display = 'none';
})();


/* =====================================================
   6. COUNTDOWN TIMER (PROMO BANNER)
===================================================== */
(function initCountdown() {
  const hoursEl = document.getElementById('cdHours');
  const minsEl  = document.getElementById('cdMins');
  const secsEl  = document.getElementById('cdSecs');
  if (!hoursEl || !minsEl || !secsEl) return;

  // Set an end time 8 hours 45 minutes from when the page loads
  const endTime = Date.now() + (8 * 3600 + 45 * 60) * 1000;

  function tick() {
    const diff = Math.max(0, endTime - Date.now());
    const h  = Math.floor(diff / 3_600_000);
    const m  = Math.floor((diff % 3_600_000) / 60_000);
    const s  = Math.floor((diff % 60_000) / 1000);

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent  = String(m).padStart(2, '0');
    secsEl.textContent  = String(s).padStart(2, '0');

    if (diff > 0) setTimeout(tick, 1000);
  }

  tick();
})();


/* =====================================================
   7. SCROLL REVEAL (IntersectionObserver)
===================================================== */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within the same batch by a small offset
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  revealEls.forEach(el => observer.observe(el));
})();


/* =====================================================
   8. BACK TO TOP BUTTON
===================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 320);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* =====================================================
   9. NEWSLETTER FORM VALIDATION
===================================================== */
(function initNewsletter() {
  const form      = document.getElementById('newsletterForm');
  const nameInput = document.getElementById('nlName');
  const emailInput= document.getElementById('nlEmail');
  const nameErr   = document.getElementById('nlNameError');
  const emailErr  = document.getElementById('nlEmailError');
  const submitBtn = document.getElementById('nlSubmitBtn');
  const btnText   = document.getElementById('nlBtnText');
  const spinner   = document.getElementById('nlSpinner');
  const success   = document.getElementById('nlSuccess');
  if (!form) return;

  /* Email regex (simplified RFC-5322) */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Validation helpers */
  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      setError(nameInput, nameErr, 'Please enter your name.');
      return false;
    }
    if (val.length < 2) {
      setError(nameInput, nameErr, 'Name must be at least 2 characters.');
      return false;
    }
    clearError(nameInput, nameErr);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      setError(emailInput, emailErr, 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setError(emailInput, emailErr, 'Please enter a valid email (e.g. you@example.com).');
      return false;
    }
    clearError(emailInput, emailErr);
    return true;
  }

  function setError(input, errEl, msg) {
    input.classList.add('is-invalid');
    if (errEl) errEl.textContent = msg;
  }
  function clearError(input, errEl) {
    input.classList.remove('is-invalid');
    if (errEl) errEl.textContent = '';
  }

  /* Real-time clear on input */
  nameInput.addEventListener('input',  () => clearError(nameInput,  nameErr));
  emailInput.addEventListener('input', () => clearError(emailInput, emailErr));

  /* Blur-time validation */
  nameInput.addEventListener('blur',  validateName);
  emailInput.addEventListener('blur', validateEmail);

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameOk  = validateName();
    const emailOk = validateEmail();
    if (!nameOk || !emailOk) return;

    // Loading state
    submitBtn.disabled  = true;
    btnText.textContent = 'Subscribing…';
    spinner.classList.remove('d-none');

    // Simulate API call
    setTimeout(() => {
      submitBtn.disabled  = false;
      btnText.textContent = 'Subscribe';
      spinner.classList.add('d-none');

      form.reset();
      success.classList.remove('d-none');
      showToast('You\'re subscribed! Welcome to LuxeShop. 🎉', 'success');

      setTimeout(() => success.classList.add('d-none'), 7000);
    }, 1600);
  });
})();


/* =====================================================
   10. FOOTER DYNAMIC YEAR
===================================================== */
(function initYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();
