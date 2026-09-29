/**
 * WashReady — Main JavaScript
 * Handles: Navigation, Scroll Effects, Carousel, FAQ Accordion,
 * Scroll Reveal Animations, Back to Top, and Mobile Menu
 */

(function () {
  'use strict';

  // ─── NAVBAR SCROLL EFFECT ───
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ─── MOBILE MENU ───
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── ACTIVE NAV LINK ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ─── TESTIMONIAL CAROUSEL ───
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonials__dot');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (track && dots.length > 0) {
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoplayInterval;

    function goToSlide(index) {
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index));
        startAutoplay();
      });
    });

    // Pause on hover
    const slider = track.closest('.testimonials__slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  }

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq-item__question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all items first
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('open');
      });

      // Toggle the clicked one
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ─── SCROLL REVEAL (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ─── BACK TO TOP ───
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    function handleBackToTop() {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    handleBackToTop();
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── PRICE CALCULATOR (for pricing page) ───
  function initCalculator() {
    const calculator = document.getElementById('priceCalculator');
    if (!calculator) return;

    const qtyBtns = calculator.querySelectorAll('.calculator__qty-btn');
    const totalEl = calculator.querySelector('.calculator__total-value');

    qtyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.calculator__row');
        const valueEl = row.querySelector('.calculator__qty-value');
        let value = parseInt(valueEl.textContent);
        const action = btn.dataset.action;

        if (action === 'add') {
          value = Math.min(value + 1, 50);
        } else if (action === 'sub') {
          value = Math.max(value - 1, 0);
        }

        valueEl.textContent = value;
        updateTotal();
      });
    });

    function updateTotal() {
      let total = 0;
      calculator.querySelectorAll('.calculator__row').forEach(row => {
        const qty = parseInt(row.querySelector('.calculator__qty-value').textContent);
        const price = parseInt(row.dataset.price);
        total += qty * price;
      });
      if (totalEl) {
        totalEl.textContent = '₹' + total.toLocaleString('en-IN');
      }
    }
  }

  initCalculator();

  // ─── CONTACT FORM VALIDATION (for contact page) ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const message = formData.get('message')?.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Sent! ✓';
        this.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }, 1200);
    });
  }

})();
