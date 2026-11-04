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
    function setMobileMenu(open) {
      navToggle.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileMenu.setAttribute('aria-hidden', String(!open));
      mobileMenu.inert = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }

    navToggle.addEventListener('click', () => {
      setMobileMenu(!mobileMenu.classList.contains('open'));
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setMobileMenu(false);
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMobileMenu(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) setMobileMenu(false);
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
  let currentDelivery = 'normal';

  // Expose delivery toggle globally for onclick
  window.setDelivery = function(type) {
    currentDelivery = type;
    const normalBtn = document.getElementById('deliveryNormal');
    const expressBtn = document.getElementById('deliveryExpress');
    if (normalBtn && expressBtn) {
      if (type === 'normal') {
        normalBtn.className = 'btn btn--primary btn--sm';
        expressBtn.className = 'btn btn--outline btn--sm';
      } else {
        normalBtn.className = 'btn btn--outline btn--sm';
        expressBtn.className = 'btn btn--primary btn--sm';
      }
    }
    // Update displayed prices
    const calculator = document.getElementById('priceCalculator');
    if (calculator) {
      calculator.querySelectorAll('.calculator__row[data-price]').forEach(row => {
        const priceLabel = row.querySelector('.calculator__item-price');
        if (priceLabel) {
          const price = type === 'express'
            ? row.dataset.expressPrice
            : row.dataset.price;
          const unit = row.dataset.unit || 'piece';
          const prefix = row.dataset.startingPrice === 'true' ? 'Starts @ ' : '';
          priceLabel.textContent = prefix + '₹' + price + ' / ' + unit;
        }
      });
    }
    updateTotal();
  };

  function initCalculator() {
    const calculator = document.getElementById('priceCalculator');
    if (!calculator) return;

    const qtyBtns = calculator.querySelectorAll('.calculator__qty-btn');

    qtyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.calculator__row');
        const valueEl = row.querySelector('.calculator__qty-value');
        if (!valueEl) return;
        let value = parseFloat(valueEl.textContent);
        const step = parseFloat(row.dataset.step || '1');
        const action = btn.dataset.action;

        if (action === 'add') {
          value = Math.min(value + step, 99);
        } else if (action === 'sub') {
          value = Math.max(value - step, 0);
        }

        valueEl.textContent = value;
        updateTotal();
      });
    });
  }

  function updateTotal() {
    const calculator = document.getElementById('priceCalculator');
    if (!calculator) return;
    const totalEl = calculator.querySelector('.calculator__total-value');
    let total = 0;
    calculator.querySelectorAll('.calculator__row[data-price]').forEach(row => {
      const qtyEl = row.querySelector('.calculator__qty-value');
      if (!qtyEl) return;
      const qty = parseFloat(qtyEl.textContent);
      const price = currentDelivery === 'express'
        ? parseInt(row.dataset.expressPrice)
        : parseInt(row.dataset.price);
      total += qty * price;
    });
    if (totalEl) {
      totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    }
  }

  // Pre-fill booking form from Pricing calculator
  const calcBookBtn = document.getElementById('calcBookBtn');
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const rows = document.querySelectorAll('.calculator__row[data-price]');
      let summary = [];
      let selectedServices = [];
      let totalItems = 0;
      rows.forEach(r => {
        const name = r.dataset.service || r.querySelector('.calculator__item-name')?.textContent.trim();
        const qty = parseFloat(r.querySelector('.calculator__qty-value')?.textContent || '0');
        if (qty > 0) {
          const unit = r.dataset.unit === 'kg' ? 'kg' : 'pcs';
          summary.push(`${qty} ${unit} ${name}`);
          selectedServices.push(name);
          if (unit === 'pcs') totalItems += qty;
        }
      });
      const deliveryParam = currentDelivery === 'express' ? 'Express' : 'Normal';
      const itemsParam = totalItems > 0 ? totalItems : '';
      const notesParam = summary.length > 0 ? summary.join(', ') : '';
      
      const query = new URLSearchParams();
      if (itemsParam) query.set('qty', itemsParam);
      if (notesParam) query.set('notes', notesParam);
      if (selectedServices.length) {
        query.set('service', selectedServices.length === 1 ? selectedServices[0] : 'Mixed / Multiple Services');
      }
      if (deliveryParam) query.set('delivery', deliveryParam);

      window.location.href = `contact.html?${query.toString()}`;
    });
  }

  // Check URL params on contact.html to prefill
  if (window.location.pathname.includes('contact.html') || window.location.href.includes('contact.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const qtyVal = urlParams.get('qty');
    const notesVal = urlParams.get('notes');
    const deliveryVal = urlParams.get('delivery');
    const serviceVal = urlParams.get('service');

    const serviceSelect = document.getElementById('custService');
    if (serviceVal && serviceSelect) {
      const option = Array.from(serviceSelect.options).find(option =>
        option.value === serviceVal || option.value.startsWith(serviceVal + ' (') || option.value.startsWith(serviceVal + ' -')
      );
      if (option) serviceSelect.value = option.value;
    }

    if (qtyVal && document.getElementById('custQty')) {
      document.getElementById('custQty').value = qtyVal;
    }
    if (notesVal && document.getElementById('custNotes')) {
      document.getElementById('custNotes').value = `From Estimator: ${notesVal}`;
    }
    if (deliveryVal && document.getElementById('custDelivery')) {
      if (deliveryVal.toLowerCase().includes('express')) {
        document.getElementById('custDelivery').value = "Express Delivery (24 Hours - +₹5/pc)";
      } else {
        document.getElementById('custDelivery').value = "Normal Delivery (48 Hours)";
      }
    }
  }

  initCalculator();

  // ─── BOOKING ORDER FORM (WhatsApp Dispatcher) ───
  const bookingForm = document.getElementById('bookingOrderForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('custName')?.value.trim();
      const phone = document.getElementById('custPhone')?.value.trim();
      const city = document.getElementById('custCity')?.value.trim();
      const address = document.getElementById('custAddress')?.value.trim();
      const service = document.getElementById('custService')?.value.trim();
      const delivery = document.getElementById('custDelivery')?.value.trim();
      const slot = document.getElementById('custSlot')?.value.trim();
      const qty = document.getElementById('custQty')?.value.trim() || 'Not specified';
      const notes = document.getElementById('custNotes')?.value.trim() || 'None';

      if (!name || !phone || !address) {
        alert('Please fill in your name, phone number, and pickup address.');
        return;
      }

      // Format WhatsApp message
      const textMessage = 
`🧺 *New Laundry Pickup Order — WashReady*
━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${name}
📞 *Phone:* ${phone}
📍 *City:* ${city}
🏠 *Address / Sector:* ${address}
━━━━━━━━━━━━━━━━━━
✨ *Service:* ${service}
⚡ *Delivery Mode:* ${delivery}
⏰ *Preferred Slot:* ${slot}
👕 *Est. Items:* ${qty}
📝 *Notes:* ${notes}
━━━━━━━━━━━━━━━━━━
_Sent via WashReady Website_`;

      const businessWhatsAppNumber = "917355892555"; // WhatsApp Business
      const encodedMessage = encodeURIComponent(textMessage);
      const whatsappUrl = `https://wa.me/${businessWhatsAppNumber}?text=${encodedMessage}`;

      // Open WhatsApp in new tab / app
      window.open(whatsappUrl, '_blank');
    });
  }

  // ─── LEGACY CONTACT FORM VALIDATION (Fallback) ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! We will get in touch with you shortly.');
      this.reset();
    });
  }

})();
