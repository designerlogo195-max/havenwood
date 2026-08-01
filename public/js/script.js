(function () {
  'use strict';

  /**
   * Havenwood Luxury Furniture - Master Interactive Script
   * Vanilla JavaScript (ES6+)
   */

  function safeRun(fn, name) {
    try {
      fn();
    } catch (err) {
      console.warn(`[Havenwood] Error in ${name}:`, err);
    }
  }

  function startApp() {
    safeRun(initPreloader, 'initPreloader');
    safeRun(initScrollProgress, 'initScrollProgress');
    safeRun(initHeader, 'initHeader');
    safeRun(initTypingEffect, 'initTypingEffect');
    safeRun(init3DTilt, 'init3DTilt');
    safeRun(initMouseGlow, 'initMouseGlow');
    safeRun(initCounters, 'initCounters');
    safeRun(initScrollReveal, 'initScrollReveal');
    safeRun(initProductFilter, 'initProductFilter');
    safeRun(initQuickViewModal, 'initQuickViewModal');
    safeRun(initGalleryLightbox, 'initGalleryLightbox');
    safeRun(initTestimonialsSlider, 'initTestimonialsSlider');
    safeRun(initContactForm, 'initContactForm');
    safeRun(initNewsletterForm, 'initNewsletterForm');
    safeRun(initBackToTop, 'initBackToTop');
    safeRun(initRippleEffect, 'initRippleEffect');
    safeRun(initFAQAccordion, 'initFAQAccordion');
    safeRun(initImageFallback, 'initImageFallback');
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startApp();
  } else {
    document.addEventListener('DOMContentLoaded', startApp);
  }

  /* ==========================================================================
     1. Preloader Loading Sequence & Fail-safe
     ========================================================================== */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const bar = document.querySelector('.preloader-bar');
    if (!preloader) return;

    let isFinished = false;

    function finishLoading() {
      if (isFinished) return;
      isFinished = true;
      if (bar) bar.style.width = '100%';
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }

    // Unconditional fail-safe timeout after 1.2s
    const failSafeTimer = setTimeout(finishLoading, 1200);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 30) + 20;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = `${progress}%`;

      if (progress === 100) {
        clearInterval(interval);
        clearTimeout(failSafeTimer);
        setTimeout(finishLoading, 150);
      }
    }, 50);

    window.addEventListener('load', () => {
      setTimeout(finishLoading, 150);
    });
  }

/* ==========================================================================
   2. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  });
}

/* ==========================================================================
   3. Header & Navigation
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }
    highlightActiveNav();
  });

  function openMobileMenu() {
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('mobile-nav-open');
  }

  function closeMobileMenu() {
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('mobile-nav-open');
  }

  function toggleMobileMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (drawer && drawer.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  highlightActiveNav();

  function highlightActiveNav() {
    let currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    if (currentPath && !currentPath.endsWith('.html')) {
      currentPath += '.html';
    }
    const allLinks = document.querySelectorAll('.nav-link');
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else if (href && href !== '#') {
        link.classList.remove('active');
      }
    });
  }
  highlightActiveNav();
}

/* ==========================================================================
   4. Typing Effect in Hero Section
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const phrases = [
    'Handcrafted Solid Teak Furniture',
    'Italian Cognac Leather Suites',
    'Bespoke Architectural Dining Tables',
    'Custom Penthouse & Executive Interiors'
  ];

  typingElement.textContent = phrases[0];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = true;
  let typeSpeed = 2200;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
      typingElement.textContent = currentPhrase.substring(0, charIndex);
      typeSpeed = 35;
    } else {
      charIndex = Math.min(currentPhrase.length, charIndex + 1);
      typingElement.textContent = currentPhrase.substring(0, charIndex);
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 350;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 2000);
}

/* ==========================================================================
   5. 3D Card Mouse Tilt Effect
   ========================================================================== */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.hero-3d-card, .tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   6. Mouse Ambient Glow
   ========================================================================== */
function initMouseGlow() {
  const glow = document.querySelector('.mouse-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* ==========================================================================
   7. Animated Counter Numbers
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const step = Math.ceil(target / (duration / 20));

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            counter.textContent = `${prefix}${count}${suffix}`;
          }, 20);
        });
      }
    });
  }, { threshold: 0.3 });

  const counterBar = document.querySelector('.counter-bar');
  if (counterBar) observer.observe(counterBar);
}

/* ==========================================================================
   8. Scroll Reveal Observer & Fail-safe
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!reveals.length) return;

  function revealAll() {
    reveals.forEach(el => el.classList.add('active'));
  }

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.05 });

  reveals.forEach(el => observer.observe(el));

  // Fail-safe: ensure elements in viewport or after delay are always visible
  setTimeout(revealAll, 800);
}

/* Fallback for image loading errors */
function initImageFallback() {
  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%232D1B0F'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='28' fill='%23C89B3C'%3EHAVENWOOD LUXURY%3C/text%3E%3C/svg%3E";
  
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.src = placeholderSvg;
    });
  });
}

/* ==========================================================================
   9. Product Category Filter & Gallery Filter
   ========================================================================== */
function initProductFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card, .gallery-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      products.forEach(product => {
        const category = product.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          product.style.display = 'flex';
          setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'scale(1)';
          }, 50);
        } else {
          product.style.opacity = '0';
          product.style.transform = 'scale(0.9)';
          setTimeout(() => {
            product.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   10. Quick View Modal
   ========================================================================== */
const productsData = {
  1: {
    title: 'The Windsor Signature Lounge Chair',
    category: 'Living Room',
    price: '$2,450',
    rating: '5.0 (42 reviews)',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    desc: 'Handcrafted from 100% sustainably harvested Grade-A teak and covered in cognac Italian full-grain leather. Built for architectural elegance and ergonomic bliss.'
  },
  2: {
    title: 'Milanese Carrara Marble Dining Table',
    category: 'Dining Room',
    price: '$3,890',
    rating: '4.9 (38 reviews)',
    img: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    desc: 'Features a solid Carrara marble top supported by sculpted American Walnut legs. Comfortably seats 8-10 guests with seamless structural integrity.'
  },
  3: {
    title: 'Aura Modular Italian Velvet Sectional',
    category: 'Living Room',
    price: '$4,600',
    rating: '5.0 (54 reviews)',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    desc: 'Deep plush velvet cushioning with ergonomic high-density foam inserts and brushed gold stainless steel accent trim.'
  },
  4: {
    title: 'Verona Sculpted Master Bed Frame',
    category: 'Bedroom',
    price: '$3,200',
    rating: '4.8 (29 reviews)',
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    desc: 'Upholstered in rich boucle fabric with an integrated warm LED back-lit teak headboard frame.'
  },
  5: {
    title: 'Presidential Walnut Executive Desk',
    category: 'Executive Office',
    price: '$2,950',
    rating: '5.0 (19 reviews)',
    img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    desc: 'Designed for CEOs and leaders. Solid solid wood build with concealed wireless charging ports and soft-close brass drawers.'
  },
  6: {
    title: 'Riviera All-Weather Outdoor Teak Lounge',
    category: 'Outdoor & Patio',
    price: '$2,100',
    rating: '4.9 (31 reviews)',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    desc: 'Weatherproof teak frame with Sunbrella water-repellent performance cushions.'
  }
};

function initQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  const closeBtn = document.querySelector('.modal-close');
  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  if (!modal) return;

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const data = productsData[id] || productsData[1];

      const modalTitle = document.getElementById('modal-title');
      const modalCategory = document.getElementById('modal-category');
      const modalPrice = document.getElementById('modal-price');
      const modalRating = document.getElementById('modal-rating');
      const modalDesc = document.getElementById('modal-desc');
      const modalImg = document.getElementById('modal-img');

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalPrice) modalPrice.textContent = data.price;
      if (modalRating) modalRating.textContent = data.rating;
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalImg) modalImg.src = data.img;

      modal.classList.add('active');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   11. Gallery Lightbox Modal
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox) return;

  let currentIndex = 0;
  const items = Array.from(galleryItems);

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
    });
  });

  function updateLightbox() {
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title');
    if (lightboxImg && img) lightboxImg.src = img.src;
    if (lightboxCaption) lightboxCaption.textContent = title ? title.textContent : '';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateLightbox();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}

/* ==========================================================================
   12. Testimonial Slider & Carousel
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');

  if (!track || !slides.length) return;

  let index = 0;
  let timer = null;

  function goToSlide(n) {
    index = n;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    goToSlide(index);
  }

  function startAutoplay() {
    timer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* ==========================================================================
   13. FAQ Accordion Handler
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   14. Forms & Toasts
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C89B3C" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${message}`;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');

    if (nameInput && !nameInput.value.trim()) {
      showToast('Please enter your full name.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn ? btn.innerHTML : 'Submit';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Sending VIP Inquiry...';
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
      form.reset();
      showToast('Thank you! Our Havenwood VIP Concierge team will reach out within 2 hours.');
    }, 1200);
  });
}

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;

    showToast('Subscribed! Welcome to the Havenwood Private Catalogue.');
    input.value = '';
  });
}

/* ==========================================================================
   15. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   16. Button Click Ripple Effect
   ========================================================================== */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-effect');

      const ripple = this.querySelector('.ripple-effect');
      if (ripple) ripple.remove();

      this.appendChild(circle);
    });
  });
}
})();
