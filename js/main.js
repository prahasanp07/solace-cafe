/* ============================================================
   SOLACE CAFÉ — Main JavaScript
   File: js/main.js
   ============================================================ */

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('heroBg').classList.add('loaded');
  }, 1800);
});

/* ─── CUSTOM CURSOR ─── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* Cursor hover expand effect */
const hoverTargets = document.querySelectorAll(
  'a, button, .menu-item, .gallery-card, .visit-card, .special-card'
);
hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

/* ─── NAV SCROLL BEHAVIOUR ─── */
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  parallaxAmbiance();
});

/* ─── PARALLAX — AMBIANCE SECTION ─── */
function parallaxAmbiance() {
  const bg      = document.getElementById('ambianceBg');
  const section = document.getElementById('ambiance');
  if (!bg || !section) return;

  const rect     = section.getBoundingClientRect();
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  const offset   = (progress - 0.5) * 80;
  bg.style.transform = `translateY(${offset}px)`;
}
// Run once on load so it's positioned correctly from the start
parallaxAmbiance();

/* ─── MOBILE MENU TOGGLE ─── */
function toggleMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  const isOpen    = mobileNav.style.display === 'flex';

  mobileNav.style.display = isOpen ? 'none' : 'flex';

  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  } else {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4.5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -4.5px)';
  }
}

/* ─── MENU TABS ─── */
function switchTab(btn, panelId) {
  // Deactivate all tabs and panels
  document.querySelectorAll('.menu-tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.menu-panel').forEach((p) => p.classList.remove('active'));

  // Activate selected
  btn.classList.add('active');
  const panel = document.getElementById('panel-' + panelId);
  if (panel) panel.classList.add('active');
}

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
  revealObserver.observe(el);
});

/* ─── COUNT-UP ANIMATION ─── */
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el       = entry.target;
      const target   = parseFloat(el.dataset.count);
      const isFloat  = target % 1 !== 0;
      const duration = 1200;
      const start    = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const value    = eased * target;

        if (isFloat) {
          el.textContent = value.toFixed(1);
        } else {
          el.textContent = Math.round(value) + (target >= 100 ? '+' : '');
        }

        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      // Only animate once
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach((el) => {
  countObserver.observe(el);
});

/* ─── TESTIMONIALS CAROUSEL (mobile) ─── */
function initTestimonialsCarousel() {
  const grid = document.querySelector('.testimonials-grid');
  const dotsWrap = document.querySelector('.test-carousel-dots');
  if (!grid || !dotsWrap) return;

  const cards = Array.from(grid.querySelectorAll('.test-card'));
  const isMobile = window.matchMedia('(max-width: 700px)').matches;

  // Clear previous dots
  dotsWrap.innerHTML = '';

  if (!isMobile) {
    grid.style.removeProperty('scroll-behavior');
    grid.removeAttribute('data-carousel');
    return;
  }

  grid.setAttribute('data-carousel', 'enabled');
  grid.style.scrollBehavior = 'smooth';

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => {
      const card = cards[i];
      grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  function updateActiveDot() {
    const center = grid.scrollLeft + grid.clientWidth / 2;
    let active = 0;
    cards.forEach((c, idx) => {
      const cCenter = c.offsetLeft + c.clientWidth / 2;
      if (Math.abs(cCenter - center) < Math.abs((cards[active].offsetLeft + cards[active].clientWidth / 2) - center)) {
        active = idx;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  }

  // Initialize
  updateActiveDot();

  let scrollTimeout;
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 80);
  }, { passive: true });

  // Snap to nearest on touchend
  let isTouching = false;
  grid.addEventListener('touchstart', () => { isTouching = true; }, { passive: true });
  grid.addEventListener('touchend', () => {
    isTouching = false;
    // snap
    const center = grid.scrollLeft + grid.clientWidth / 2;
    let nearest = 0;
    cards.forEach((c, idx) => {
      const cCenter = c.offsetLeft + c.clientWidth / 2;
      if (Math.abs(cCenter - center) < Math.abs((cards[nearest].offsetLeft + cards[nearest].clientWidth / 2) - center)) nearest = idx;
    });
    const target = cards[nearest];
    grid.scrollTo({ left: target.offsetLeft - (grid.clientWidth - target.clientWidth) / 2, behavior: 'smooth' });
  }, { passive: true });

  // Recompute on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Rebuild if breakpoint changed
      initTestimonialsCarousel();
    }, 120);
  });

  // Chevron controls
  const prevBtn = document.querySelector('.test-prev');
  const nextBtn = document.querySelector('.test-next');
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      // find active index
      const activeIndex = dots.findIndex(d => d.classList.contains('active')) || 0;
      const targetIndex = Math.max(0, activeIndex - 1);
      const card = cards[targetIndex];
      if (card) grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
      stopAutoplayWithDelay();
    });

    nextBtn.addEventListener('click', () => {
      const activeIndex = dots.findIndex(d => d.classList.contains('active')) || 0;
      const targetIndex = Math.min(cards.length - 1, activeIndex + 1);
      const card = cards[targetIndex];
      if (card) grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
      stopAutoplayWithDelay();
    });
  }

  // Autoplay with pause-on-interaction
  const AUTOPLAY_DELAY = 4200;

  function playNext() {
    const activeIndex = dots.findIndex(d => d.classList.contains('active')) || 0;
    const nextIndex = (activeIndex + 1) % cards.length;
    const card = cards[nextIndex];
    if (card) grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
  }

  function startAutoplay() {
    if (grid._autoplayTimer) return;
    grid._autoplayTimer = setInterval(playNext, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (grid._autoplayTimer) {
      clearInterval(grid._autoplayTimer);
      grid._autoplayTimer = null;
    }
  }

  function stopAutoplayWithDelay() {
    stopAutoplay();
    if (grid._resumeTimer) clearTimeout(grid._resumeTimer);
    grid._resumeTimer = setTimeout(() => startAutoplay(), 3000);
  }

  // Pause on touch/hover/focus
  ['touchstart', 'pointerdown', 'mouseenter', 'focusin'].forEach((ev) => {
    grid.addEventListener(ev, () => stopAutoplay(), { passive: true });
  });
  ['touchend', 'pointerup', 'mouseleave', 'focusout'].forEach((ev) => {
    grid.addEventListener(ev, () => { grid._resumeTimer = setTimeout(() => startAutoplay(), 2000); }, { passive: true });
  });

  // Start autoplay by default on mobile
  startAutoplay();
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', initTestimonialsCarousel);
// Also init after load (in case fonts/images change layout)
window.addEventListener('load', initTestimonialsCarousel);


/* ─── DISH MODAL: open/close, populate, zoom on scroll, swipe-down to close ─── */
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('dishModal');
  if (!modal) return;

  const modalContent = modal.querySelector('.modal-content');
  const closeBtn = modal.querySelector('.close-btn');
  const titleEl = modal.querySelector('.dish-title');
  const priceEl = modal.querySelector('.dish-price');
  const tagEl = modal.querySelector('.dish-tag');
  const descEl = modal.querySelector('.dish-desc');
  const model = modal.querySelector('#dishModel');

  function openModal(data = {}) {
    if (data.title) titleEl.textContent = data.title;
    if (data.price) priceEl.textContent = data.price;
    tagEl.textContent = data.tag || '';
    if (data.desc) descEl.textContent = data.desc;
    if (data.modelSrc && model) model.setAttribute('src', data.modelSrc);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modalContent.style.transform = 'translateY(0)';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (model) model.style.transform = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) closeModal();
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });

  // Open modal from menu items
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const data = {
        title: item.querySelector('.item-name')?.textContent?.trim() || 'Dish',
        price: item.querySelector('.item-price')?.textContent?.trim() || '',
        tag: item.querySelector('.item-tag')?.textContent?.trim() || '',
        desc: item.querySelector('.item-desc')?.textContent?.trim() || '',
        modelSrc: item.dataset.model || null,
      };
      openModal(data);
    });
  });

  // Zoom on scroll (subtle scale)
  let currentScale = 1;
  const minScale = 0.96;
  const maxScale = 1.06;
  const scaleStep = 0.0009;
  const viewerWrap = modal.querySelector('.viewer-container');
  viewerWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    currentScale = Math.max(minScale, Math.min(maxScale, currentScale - delta * scaleStep));
    if (model) model.style.transform = `scale(${currentScale})`;
  }, { passive: false });

  // Touch: swipe-down to close
  let touchStartY = 0;
  let touchCurrentY = 0;
  modalContent.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    modalContent.classList.add('dragging');
  }, { passive: true });

  modalContent.addEventListener('touchmove', (e) => {
    touchCurrentY = e.touches[0].clientY;
    const dy = Math.max(0, touchCurrentY - touchStartY);
    modalContent.style.transform = `translateY(${dy}px)`;
  }, { passive: true });

  modalContent.addEventListener('touchend', () => {
    modalContent.classList.remove('dragging');
    const dy = touchCurrentY - touchStartY;
    modalContent.style.transition = '';
    if (dy > 120) {
      closeModal();
    } else {
      modalContent.style.transform = '';
    }
    touchStartY = touchCurrentY = 0;
  });

  // Buttons inside modal (placeholder actions)
  modal.querySelector('.call-btn')?.addEventListener('click', () => {
    const tel = 'tel:+919000000000';
    window.open(tel);
  });
  modal.querySelector('.dir-btn')?.addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/6DUScAwwaL7NU5WW8', '_blank');
  });

});
