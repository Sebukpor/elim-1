/* ============================================================
   ELIM Hair & Beauty — script.js
   Complete interactive functionality
   ============================================================ */

'use strict';

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {

/* ==================== THEME TOGGLE ==================== */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
  body.classList.toggle('dark-mode', theme === 'dark');
  body.classList.toggle('light-mode', theme === 'light');
}

// Load saved preference or detect system preference
const savedTheme = localStorage.getItem('elim-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('elim-theme', next);
});

// Listen for OS theme change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('elim-theme')) applyTheme(e.matches ? 'dark' : 'light');
});


/* ==================== SCROLL PROGRESS BAR ==================== */
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  progressBar.setAttribute('aria-valuenow', Math.round(pct));
}

window.addEventListener('scroll', updateProgress, { passive: true });


/* ==================== NAVBAR ==================== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavScroll() {
  // Scrolled style
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlighting
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load


/* ==================== MOBILE HAMBURGER MENU ==================== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when a nav link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ==================== SMOOTH SCROLLING ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ==================== INTERSECTION OBSERVER — REVEAL ANIMATIONS ==================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ==================== PORTFOLIO FILTERING ==================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const category = item.dataset.category;
      const show = filter === 'all' || category === filter;

      item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

      if (show) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.pointerEvents = 'auto';
        item.style.display = '';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.94)';
        item.style.pointerEvents = 'none';
        setTimeout(() => {
          if (item.style.opacity === '0') item.style.display = 'none';
        }, 350);
      }
    });
  });
});


/* ==================== LIGHTBOX ==================== */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');

// Collect all portfolio images for navigation
let allImages = [];
let currentLightboxIndex = 0;

function buildImageList() {
  allImages = Array.from(document.querySelectorAll('.portfolio-item img'));
}

function openLightbox(index) {
  buildImageList();
  currentLightboxIndex = index;
  const img = allImages[index];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function navigateLightbox(direction) {
  currentLightboxIndex = (currentLightboxIndex + direction + allImages.length) % allImages.length;
  const img = allImages[currentLightboxIndex];

  // Crossfade
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.opacity = '1';
  }, 180);
}

lightboxImg.style.transition = 'opacity 0.18s ease';

// Attach zoom buttons
document.querySelectorAll('.portfolio-zoom').forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(i);
  });
});

// Click image area to open
portfolioItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

// Click backdrop to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')   closeLightbox();
  if (e.key === 'ArrowLeft')  navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});


/* ==================== TESTIMONIALS CAROUSEL ==================== */
const track       = document.getElementById('testimonial-track');
const dotsContainer = document.getElementById('carousel-dots');
const prevBtn     = document.getElementById('carousel-prev');
const nextBtn     = document.getElementById('carousel-next');
const cards       = track.querySelectorAll('.testimonial-card');

let currentSlide = 0;
let autoSlideTimer = null;
let isDragging = false;
let dragStartX = 0;
let dragDelta = 0;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
  dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
  dot.dataset.index = i;
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function getVisibleCount() {
  if (window.innerWidth < 600) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function getCardWidth() {
  const card = cards[0];
  const gap = 24; // matches --space-xl = 1.5rem * 16 = 24px
  return card.offsetWidth + gap;
}

function goToSlide(index) {
  const max = cards.length - getVisibleCount();
  currentSlide = Math.max(0, Math.min(index, max));
  track.style.transform = `translateX(-${currentSlide * getCardWidth()}px)`;

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
    dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
  });
}

function nextSlide() {
  const max = cards.length - getVisibleCount();
  goToSlide(currentSlide < max ? currentSlide + 1 : 0);
}

function prevSlide() {
  const max = cards.length - getVisibleCount();
  goToSlide(currentSlide > 0 ? currentSlide - 1 : max);
}

prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

function startAutoSlide() {
  autoSlideTimer = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

startAutoSlide();

// Pause on hover
track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
track.addEventListener('mouseleave', startAutoSlide);

// Touch/drag support
track.addEventListener('touchstart', e => {
  isDragging = true;
  dragStartX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchmove', e => {
  if (!isDragging) return;
  dragDelta = e.touches[0].clientX - dragStartX;
}, { passive: true });

track.addEventListener('touchend', () => {
  if (!isDragging) return;
  isDragging = false;
  if (dragDelta < -50) nextSlide();
  else if (dragDelta > 50) prevSlide();
  dragDelta = 0;
  resetAutoSlide();
});

// Reposition on resize
window.addEventListener('resize', () => goToSlide(currentSlide));


/* ==================== BOOKING FORM VALIDATION ==================== */
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');

// Set minimum date to today
const dateInput = document.getElementById('appt-date');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function validateBookingForm() {
  let valid = true;

  // Name
  const name = document.getElementById('client-name').value.trim();
  if (!name || name.length < 2) {
    showError('client-name', 'name-error', 'Please enter your full name.');
    valid = false;
  } else {
    clearError('client-name', 'name-error');
  }

  // Phone
  const phone = document.getElementById('client-phone').value.trim();
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    showError('client-phone', 'phone-error', 'Please enter a valid phone number.');
    valid = false;
  } else {
    clearError('client-phone', 'phone-error');
  }

  // Email
  const email = document.getElementById('client-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showError('client-email', 'email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('client-email', 'email-error');
  }

  // Service
  const service = document.getElementById('service-select').value;
  if (!service) {
    showError('service-select', 'service-error', 'Please select a service.');
    valid = false;
  } else {
    clearError('service-select', 'service-error');
  }

  // Date
  const date = document.getElementById('appt-date').value;
  if (!date) {
    showError('appt-date', 'date-error', 'Please choose a preferred date.');
    valid = false;
  } else {
    clearError('appt-date', 'date-error');
  }

  // Time
  const time = document.getElementById('appt-time').value;
  if (!time) {
    showError('appt-time', 'time-error', 'Please choose a preferred time.');
    valid = false;
  } else {
    clearError('appt-time', 'time-error');
  }

  return valid;
}

// Live validation on blur
['client-name', 'client-phone', 'client-email', 'service-select', 'appt-date', 'appt-time'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', validateBookingForm);
});

bookingForm && bookingForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateBookingForm()) return;

  const submitBtn = document.getElementById('submit-btn');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // Loading state
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;

  /*
   * ============================================================
   * GOOGLE CALENDAR API INTEGRATION POINT
   * ------------------------------------------------------------
   * Replace this setTimeout block with your real API call:
   *
   * const formData = new FormData(bookingForm);
   * const payload = Object.fromEntries(formData.entries());
   *
   * const response = await fetch('/api/book-appointment', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(payload),
   * });
   *
   * The backend endpoint should:
   * 1. Authenticate with Google OAuth2 using a service account
   * 2. Call Google Calendar API to create an event:
   *    - summary: `${payload.service} — ${payload.name}`
   *    - start: { dateTime: `${payload.date}T${payload.time}:00` }
   *    - attendees: [{ email: payload.email }]
   *    - description: payload.message
   * 3. Send confirmation email via Gmail API or nodemailer
   * 4. Return { success: true, eventLink: '...' }
   * ============================================================
   */

  await new Promise(resolve => setTimeout(resolve, 1800)); // simulate network

  // Show success
  bookingForm.hidden = true;
  bookingSuccess.hidden = false;

  // Reset state
  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoading.hidden = true;
});


/* ==================== CONTACT FORM ==================== */
const contactForm = document.getElementById('contact-form');

contactForm && contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Sent! ✓';
  btn.disabled = true;
  btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

  setTimeout(() => {
    contactForm.reset();
    btn.textContent = original;
    btn.disabled = false;
    btn.style.background = '';
  }, 3000);
});


/* ==================== FOOTER YEAR ==================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ==================== LAZY LOADING IMAGES ==================== */
// Native lazy loading is set in HTML; this enhances older browsers
if ('loading' in HTMLImageElement.prototype === false) {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImgs.forEach(img => imgObserver.observe(img));
}


/* ==================== PARALLAX HERO BLOBS ==================== */
const blobs = document.querySelectorAll('.blob');

window.addEventListener('mousemove', e => {
  if (window.innerWidth < 768) return; // skip on mobile
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 0.4;
    blob.style.transform = `translate(${x * factor}px, ${y * factor}px) scale(1)`;
  });
}, { passive: true });


/* ==================== KEYBOARD ACCESSIBILITY — PORTFOLIO ITEMS ==================== */
portfolioItems.forEach((item, i) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `View portfolio image ${i + 1}`);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});


/* ==================== SERVICES CARD TILT ==================== */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ==================== ANIMATED COUNTER (about stats via hero glass card) ==================== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const suffix = el.dataset.suffix || '';

  const tick = () => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(start) + suffix;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// Observe the hero glass card stats
const heroStats = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^([\d.]+)(\D*)$/);
      if (match) {
        const num = parseFloat(match[1]);
        el.dataset.suffix = match[2];
        animateCounter(el, num);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

heroStats.forEach(stat => counterObserver.observe(stat));


/* ==================== UPI ID COPY FUNCTIONALITY ==================== */
const copyUpiBtn = document.getElementById('copy-upi-btn');
const upiIdEl = document.getElementById('upi-id');
const copySuccessMsg = document.getElementById('copy-success');

if (copyUpiBtn && upiIdEl) {
  copyUpiBtn.addEventListener('click', async () => {
    const upiId = upiIdEl.textContent.trim();
    
    try {
      await navigator.clipboard.writeText(upiId);
      
      // Show success message
      if (copySuccessMsg) {
        copySuccessMsg.classList.add('show');
        
        // Hide after animation completes
        setTimeout(() => {
          copySuccessMsg.classList.remove('show');
        }, 2000);
      }
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = upiId;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        if (copySuccessMsg) {
          copySuccessMsg.classList.add('show');
          setTimeout(() => {
            copySuccessMsg.classList.remove('show');
          }, 2000);
        }
      } catch (fallbackErr) {
        console.error('Failed to copy UPI ID:', fallbackErr);
      }
      
      document.body.removeChild(textArea);
    }
  });
}


/* ==================== BLOG MODAL FUNCTIONALITY ==================== */
const blogModal = document.getElementById('blog-modal');
const blogModalBody = document.getElementById('blog-modal-body');
const blogModalClose = document.querySelector('.blog-modal-close');
const openBlogBtns = document.querySelectorAll('.open-blog');

// Blog content data
const blogPosts = {
  1: {
    title: "5 Essential Tips for Maintaining Healthy Hair in Winter",
    category: "Hair Care",
    date: "📅 Dec 15, 2024",
    readTime: "⏱️ 5 min read",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
    content: `
      <p class="blog-full-intro">Winter can be particularly harsh on our hair, especially for those with natural African hair textures. The cold air, low humidity, and indoor heating can strip moisture from your strands, leaving them dry, brittle, and prone to breakage. At ELIM Hair & Beauty, we understand the unique challenges African hair faces during the winter months, and we're here to help you maintain healthy, lustrous locks throughout the season.</p>
      
      <h3>1. Deep Condition Regularly</h3>
      <p>During winter, your hair needs extra moisture. Incorporate a deep conditioning treatment into your weekly routine. Look for products containing shea butter, coconut oil, or argan oil—ingredients that are particularly beneficial for African hair types. Apply the conditioner to damp hair, cover with a shower cap, and let it penetrate for at least 30 minutes before rinsing.</p>
      
      <h3>2. Reduce Heat Styling</h3>
      <p>The temptation to use heat styling tools may increase in winter, but excessive heat can further dry out your hair. Embrace protective styles like braids, twists, or buns that minimize manipulation and protect your ends. If you must use heat, always apply a heat protectant spray first and keep the temperature moderate.</p>
      
      <h3>3. Seal in Moisture</h3>
      <p>The LOC (Liquid-Oil-Cream) method works wonders for African hair in winter. Start with a water-based leave-in conditioner (Liquid), follow with a natural oil like jojoba or castor oil (Oil), and finish with a butter or cream (Cream) to seal everything in. This layering technique helps lock moisture into your hair shaft.</p>
      
      <h3>4. Protect Your Hair at Night</h3>
      <p>Cotton pillowcases can absorb moisture from your hair while you sleep. Switch to a satin or silk pillowcase, or wear a satin bonnet or scarf to bed. This simple change reduces friction, prevents breakage, and helps maintain your hairstyle longer.</p>
      
      <h3>5. Trim Regularly</h3>
      <p>Split ends can travel up the hair shaft, causing more damage. Schedule regular trims every 8-12 weeks to remove damaged ends and promote healthy growth. Don't be afraid to cut away damage—it's better for your hair's long-term health.</p>
      
      <div class="blog-tip-box">
        <strong>💡 ELIM Pro Tip:</strong> During winter, consider reducing shampoo frequency to once a week or every two weeks. Over-washing can strip natural oils. Opt for co-washing (conditioner washing) between shampoos to keep your scalp clean without drying out your strands.
      </div>
      
      <p>Remember, every head of hair is unique. What works for one person may not work for another. Visit us at ELIM Hair & Beauty for a personalized consultation, and let our expert stylists create a winter hair care plan tailored specifically to your needs.</p>
    `
  },
  2: {
    title: "Your Complete Bridal Beauty Timeline: 6 Months to Perfection",
    category: "Bridal",
    date: "📅 Dec 10, 2024",
    readTime: "⏱️ 7 min read",
    image: "https://images.unsplash.com/photo-1594916749047-c54926b4e0bc?w=800&q=80",
    content: `
      <p class="blog-full-intro">Your wedding day is one of the most important days of your life, and looking and feeling your absolute best is essential. At ELIM Hair & Beauty, we specialize in creating breathtaking bridal looks that celebrate your unique beauty. This comprehensive timeline will guide you through the six months leading up to your big day, ensuring every detail is perfectly planned.</p>
      
      <h3>6 Months Before: The Foundation Phase</h3>
      <p><strong>Hair:</strong> Begin assessing your hair's health. If you're planning to grow your hair or make significant changes, now is the time to start. Schedule a consultation with our bridal specialists to discuss your vision and create a customized hair care regimen.</p>
      <p><strong>Skin:</strong> Establish a consistent skincare routine. Consider professional facials to address any concerns like hyperpigmentation, acne, or uneven texture. For African skin, focus on products that target specific concerns while maintaining your skin's natural barrier.</p>
      <p><strong>Nails:</strong> Start taking biotin supplements to strengthen your nails if they're brittle.</p>
      
      <h3>4 Months Before: Trial Runs Begin</h3>
      <p><strong>Hair Trial:</strong> Book your first hair trial session. Bring inspiration photos and be open to your stylist's professional advice. This is the time to experiment with different styles—from elegant updos to flowing curls or traditional African braided styles.</p>
      <p><strong>Makeup Trial:</strong> Schedule your makeup trial. Our artists will work with you to create a look that enhances your natural features and photographs beautifully. We'll test different foundations to match your skin tone perfectly and ensure longevity throughout your celebration.</p>
      
      <h3>2 Months Before: Refinement Phase</h3>
      <p><strong>Final Trials:</strong> Confirm your final hair and makeup looks with second trials if needed. Take photos in different lighting to see how everything translates on camera.</p>
      <p><strong>Bridal Party:</strong> Coordinate beauty arrangements for your bridesmaids and family members. Create a schedule for the wedding day to ensure everyone is ready on time.</p>
      <p><strong>Skincare Boost:</strong> Consider adding hydrating masks and gentle exfoliation to your routine. Avoid trying new products that could cause reactions.</p>
      
      <h3>1 Month Before: Final Preparations</h3>
      <p><strong>Confirm Details:</strong> Reconfirm all appointments, times, and services with your beauty team. Provide a detailed timeline of your wedding day.</p>
      <p><strong>Hair Color:</strong> If you're planning color treatments, schedule them 2-3 weeks before the wedding to allow time for any adjustments.</p>
      <p><strong>Relaxation:</strong> Book a relaxing spa treatment or massage. Stress can affect your skin and hair, so prioritize self-care.</p>
      
      <h3>1 Week Before: The Final Countdown</h3>
      <p><strong>Hair Wash:</strong> Wash your hair 2-3 days before the wedding. Slightly day-old hair holds styles better than freshly washed hair.</p>
      <p><strong>Skincare:</strong> Stick to your regular routine—no new products! Stay hydrated and get plenty of sleep.</p>
      <p><strong>Nails:</strong> Get your manicure and pedicure done 1-2 days before the wedding.</p>
      
      <h3>The Wedding Day: Radiant and Ready</h3>
      <p>Arrive with clean, dry hair as instructed by your stylist. Wear a button-down shirt to avoid disrupting your hair and makeup when changing into your dress. Trust our expert team to bring your vision to life while you relax and enjoy this special moment.</p>
      
      <div class="blog-tip-box">
        <strong>💡 ELIM Bridal Package:</strong> Our comprehensive bridal packages include multiple trials, day-of styling for the bride and bridal party, touch-up kits, and even emergency beauty services. Contact us to customize a package that suits your needs.
      </div>
      
      <p>Remember, the goal is to look like the most beautiful version of yourself—not someone else. Let ELIM Hair & Beauty help you shine on your special day!</p>
    `
  },
  3: {
    title: "Balayage vs Highlights: Which Coloring Technique is Right for You?",
    category: "Coloring",
    date: "📅 Dec 5, 2024",
    readTime: "⏱️ 6 min read",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80",
    content: `
      <p class="blog-full-intro">Hair coloring has evolved tremendously, offering African women beautiful ways to enhance their natural texture and express their personal style. Two of the most popular techniques today are balayage and traditional highlights. But what's the difference, and which one is right for you? Let's break it down with insights from ELIM's expert colorists.</p>
      
      <h3>Understanding Balayage</h3>
      <p>Balayage (from the French word meaning "to sweep") is a freehand coloring technique where color is painted onto sections of hair, creating a natural, sun-kissed effect. The colorist strategically places lighter pieces throughout your hair, typically concentrating on the mid-lengths and ends while keeping the roots darker.</p>
      <p><strong>Best for:</strong> Those seeking a low-maintenance, natural-looking dimension. Balayage grows out gracefully, requiring fewer touch-ups (typically every 3-4 months).</p>
      
      <h3>Understanding Traditional Highlights</h3>
      <p>Traditional highlights involve sectioning the hair and applying color using foils or a cap system. This technique creates more uniform, defined streaks of color from root to tip. Highlights can be subtle or dramatic, depending on your preference.</p>
      <p><strong>Best for:</strong> Those who want more noticeable contrast and don't mind regular maintenance. Touch-ups are typically needed every 6-8 weeks as regrowth becomes visible.</p>
      
      <h3>Key Differences at a Glance</h3>
      <ul class="blog-list">
        <li><strong>Application:</strong> Balayage is hand-painted; highlights use foils</li>
        <li><strong>Maintenance:</strong> Balayage requires less frequent touch-ups</li>
        <li><strong>Look:</strong> Balayage offers a softer, more natural gradient; highlights provide more defined contrast</li>
        <li><strong>Cost:</strong> Balayage may cost more initially but saves money on maintenance</li>
        <li><strong>Growth:</strong> Balayage blends seamlessly as it grows; highlights show clear regrowth lines</li>
      </ul>
      
      <h3>Considerations for African Hair</h3>
      <p>African hair textures require special consideration when coloring. Our hair tends to be more fragile and prone to dryness, so it's crucial to:</p>
      <ul class="blog-list">
        <li>Work with experienced colorists who understand African hair</li>
        <li>Ensure proper protein and moisture balance before and after coloring</li>
        <li>Use high-quality, ammonia-free or low-ammonia color products</li>
        <li>Follow up with intensive conditioning treatments</li>
      </ul>
      
      <h3>Which Should You Choose?</h3>
      <p><strong>Choose Balayage if:</strong></p>
      <ul class="blog-list">
        <li>You want a natural, effortless look</li>
        <li>You prefer low-maintenance color</li>
        <li>You're new to hair coloring and want something subtle</li>
        <li>You have a busy lifestyle and can't visit the salon frequently</li>
      </ul>
      
      <p><strong>Choose Highlights if:</strong></p>
      <ul class="blog-list">
        <li>You want more dramatic color contrast</li>
        <li>You don't mind regular salon visits for maintenance</li>
        <li>You prefer a more polished, uniform look</li>
        <li>You want to cover gray hairs effectively</li>
      </ul>
      
      <div class="blog-tip-box">
        <strong>💡 ELIM Pro Tip:</strong> Many clients opt for a combination of both techniques! We can use balayage for overall dimension and add subtle highlights around the face for brightness. This hybrid approach gives you the best of both worlds.
      </div>
      
      <p>Ready to transform your look? Book a consultation with our color specialists at ELIM Hair & Beauty. We'll assess your hair's condition, discuss your goals, and recommend the perfect coloring technique for your unique texture and lifestyle.</p>
    `
  },
  4: {
    title: "Achieving Flawless Makeup: Pro Tips from Our Artists",
    category: "Makeup",
    date: "📅 Nov 28, 2024",
    readTime: "⏱️ 4 min read",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
    content: `
      <p class="blog-full-intro">Flawless makeup isn't about masking your features—it's about enhancing your natural beauty and creating a canvas that looks impeccable in person and photographs beautifully. Our ELIM makeup artists have years of experience working with diverse African skin tones and textures. Here are their insider secrets to achieving a flawless finish every time.</p>
      
      <h3>1. Prep Your Skin Properly</h3>
      <p>The foundation of great makeup is great skin. Start with a clean, moisturized face. For African skin, which can range from very oily to very dry, choose products suited to your skin type:</p>
      <ul class="blog-list">
        <li><strong>Oily skin:</strong> Use a lightweight, oil-free moisturizer and mattifying primer</li>
        <li><strong>Dry skin:</strong> Layer hydrating serums under a rich moisturizer and use a hydrating primer</li>
        <li><strong>Combination skin:</strong> Apply different products to different areas (lighter on T-zone, richer on cheeks)</li>
      </ul>
      
      <h3>2. Color Correction is Key</h3>
      <p>African skin often deals with hyperpigmentation, dark circles, or uneven tone. Color correctors are your secret weapon:</p>
      <ul class="blog-list">
        <li><strong>Peach/Orange:</strong> Neutralizes dark circles on deeper skin tones</li>
        <li><strong>Green:</strong> Cancels out redness</li>
        <li><strong>Yellow:</strong> Brightens purple undertones</li>
      </ul>
      <p>Apply corrector before foundation, using a light hand and blending well.</p>
      
      <h3>3. Foundation Matching Matters</h3>
      <p>One of the biggest makeup mistakes is wearing the wrong foundation shade. Test foundation on your jawline, not your hand or wrist. The perfect match should disappear into your skin. Remember, African skin often has warm, cool, or neutral undertones—identify yours for the best match.</p>
      <p><strong>Application tip:</strong> Use a damp beauty sponge for a natural, airbrushed finish. Build coverage gradually rather than applying one thick layer.</p>
      
      <h3>4. Set Strategically</h3>
      <p>Setting powder prevents makeup from sliding, especially in humid climates. However, don't over-powder, which can make skin look ashy on deeper tones. Use translucent powder only on areas that tend to get oily (T-zone, under eyes). For the rest of your face, a setting spray works beautifully.</p>
      
      <h3>5. Define Your Features</h3>
      <p><strong>Brows:</strong> Well-groomed brows frame your face. Fill sparse areas with short, hair-like strokes using a brow pencil or pomade that matches your natural color.</p>
      <p><strong>Cheekbones:</strong> Contour subtly with a cream product that's 2-3 shades darker than your skin. Blend upward toward your temples for a lifted effect.</p>
      <p><strong>Highlight:</strong> Choose gold, bronze, or copper highlighters for warmer skin tones, and rose gold or champagne for cooler tones. Apply to high points: cheekbones, brow bone, cupid's bow, and bridge of nose.</p>
      
      <h3>6. Eye Makeup That Pops</h3>
      <p>Rich, pigmented eyeshadows look stunning on African skin. Earth tones, warm bronzes, deep purples, and vibrant jewel tones all complement deeper complexions beautifully. Don't forget to prime your eyelids to prevent creasing and enhance color payoff.</p>
      
      <h3>7. Lips That Last</h3>
      <p>For long-lasting lip color:</p>
      <ol class="blog-list">
        <li>Exfoliate lips gently</li>
        <li>Apply a thin layer of balm</li>
        <li>Line lips with a matching liner</li>
        <li>Fill in with lipstick</li>
        <li>Blot and reapply</li>
        <li>For extra longevity, place a tissue over lips and dust translucent powder lightly</li>
      </ol>
      
      <div class="blog-tip-box">
        <strong>💡 ELIM Pro Tip:</strong> Always do a trial run before important events. Practice your full makeup look a few days before to identify any issues and perfect your technique.
      </div>
      
      <p>Want professional guidance? Book a makeup lesson or application service with ELIM's expert artists. We'll teach you techniques tailored to your features and help you select products that work perfectly with your skin tone and type.</p>
    `
  },
  5: {
    title: "Protective Styling: Why Braids Are More Than Just Beautiful",
    category: "Styling",
    date: "📅 Nov 20, 2024",
    readTime: "⏱️ 5 min read",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08d2fc6b8?w=800&q=80",
    content: `
      <p class="blog-full-intro">Protective styling has become increasingly popular among women with African hair textures, and for good reason. While braids, twists, and other protective styles are undeniably gorgeous, their benefits extend far beyond aesthetics. At ELIM Hair & Beauty, we're passionate about helping our clients understand how protective styling can transform their hair health.</p>
      
      <h3>What Is Protective Styling?</h3>
      <p>Protective styling refers to any hairstyle that tucks away the ends of your hair, minimizing manipulation and exposure to environmental damage. Common protective styles include box braids, knotless braids, cornrows, twists, buns, wigs, and weaves when installed correctly.</p>
      
      <h3>The Science Behind Protection</h3>
      <p>Your hair's ends are the oldest, most fragile part of your strands. Every day, these ends rub against clothing, pillows, and the environment, leading to wear and tear known as mechanical damage. By keeping ends tucked away in a protective style, you significantly reduce this damage, allowing your hair to retain length more effectively.</p>
      
      <h3>Key Benefits of Protective Styling</h3>
      
      <h4>1. Promotes Length Retention</h4>
      <p>When your ends are protected, breakage decreases dramatically. This means the length you gain from growth stays on your head instead of breaking off. Many clients report their fastest growth periods while maintaining a rotation of protective styles.</p>
      
      <h4>2. Reduces Daily Manipulation</h4>
      <p>Constant combing, brushing, and styling can stress your hair. Protective styles can last several weeks, giving your hair a much-needed break from daily handling. This is especially beneficial for those transitioning from relaxed to natural hair.</p>
      
      <h4>3. Saves Time and Money</h4>
      <p>While the initial installation may take time, protective styles eliminate daily styling routines. No more spending 30+ minutes each morning on your hair! Plus, you'll use fewer products and heat tools, saving money in the long run.</p>
      
      <h4>4. Versatility Without Damage</h4>
      <p>Protective styles come in countless variations—from sleek cornrows to voluminous box braids, from faux locs to passion twists. You can switch up your look regularly without subjecting your natural hair to constant chemical or heat processing.</p>
      
      <h4>5. Helps Maintain Moisture</h4>
      <p>With less exposure to air and elements, your hair retains moisture better. The style itself acts as a barrier, keeping your strands hydrated longer between washes.</p>
      
      <h3>Important Considerations</h3>
      <p>While protective styling offers numerous benefits, it's crucial to install and maintain these styles correctly:</p>
      <ul class="blog-list">
        <li><strong>Don't install too tightly:</strong> Excessive tension can cause traction alopecia and damage your edges</li>
        <li><strong>Keep your scalp clean:</strong> Wash your scalp regularly with diluted shampoo to prevent buildup</li>
        <li><strong>Moisturize underneath:</strong> Use lightweight oils and leave-in conditioners to keep your hair hydrated</li>
        <li><strong>Don't keep styles too long:</strong> Remove protective styles after 6-8 weeks maximum to prevent matting</li>
        <li><strong>Give your hair breaks:</strong> Allow your hair to rest for at least a week between installations</li>
      </ul>
      
      <h3>Popular Protective Styles at ELIM</h3>
      <ul class="blog-list">
        <li><strong>Knotless Braids:</strong> A gentler alternative to traditional box braids, starting with your natural hair</li>
        <li><strong>Box Braids:</strong> Classic, versatile, and available in various sizes and lengths</li>
        <li><strong>Passion Twists:</strong> Bohemian, curly texture that's lightweight and beautiful</li>
        <li><strong>Faux Locs:</strong> Gives the look of dreadlocks without the permanent commitment</li>
        <li><strong>Senegalese Twists:</strong> Sleek, rope-like twists that last for weeks</li>
      </ul>
      
      <div class="blog-tip-box">
        <strong>💡 ELIM Pro Tip:</strong> Before installing any protective style, treat your hair with a protein treatment followed by deep conditioning. This strengthens your strands and prepares them for the weeks ahead.
      </div>
      
      <p>Ready to embrace protective styling? Our braiding specialists at ELIM Hair & Beauty are experts in installation techniques that prioritize your hair's health. Book your appointment today and discover the perfect protective style for your lifestyle!</p>
    `
  },
  6: {
    title: "The Ultimate Guide to Glowing Skin: Treatments That Work",
    category: "Skincare",
    date: "📅 Nov 15, 2024",
    readTime: "⏱️ 6 min read",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    content: `
      <p class="blog-full-intro">Radiant, glowing skin is a universal desire, but achieving it requires understanding your unique skin type and concerns. African skin has its own characteristics and needs, from managing hyperpigmentation to maintaining optimal hydration. At ELIM Hair & Beauty, our skincare specialists combine science-backed treatments with luxurious pampering to help you achieve your best skin ever.</p>
      
      <h3>Understanding African Skin</h3>
      <p>African skin typically has more melanin, providing natural protection against UV damage but also making it more prone to hyperpigmentation and dark spots. Understanding your skin's specific needs is the first step to effective skincare.</p>
      <p><strong>Common concerns:</strong></p>
      <ul class="blog-list">
        <li>Hyperpigmentation and dark spots</li>
        <li>Uneven skin tone</li>
        <li>Acne and post-inflammatory hyperpigmentation</li>
        <li>Dryness or dehydration</li>
        <li>Enlarged pores</li>
      </ul>
      
      <h3>Essential Skincare Routine Steps</h3>
      
      <h4>1. Gentle Cleansing</h4>
      <p>Start with a pH-balanced cleanser that removes impurities without stripping your skin's natural oils. Cleanse twice daily—morning and evening. For African skin, avoid harsh sulfates that can cause irritation and trigger excess melanin production.</p>
      
      <h4>2. Exfoliation</h4>
      <p>Regular exfoliation removes dead skin cells, revealing brighter skin underneath. Chemical exfoliants (AHAs and BHAs) are often gentler and more effective than physical scrubs for African skin. Limit exfoliation to 2-3 times per week to avoid over-exfoliation.</p>
      
      <h4>3. Targeted Serums</h4>
      <p>Serums deliver concentrated active ingredients deep into your skin:</p>
      <ul class="blog-list">
        <li><strong>Vitamin C:</strong> Brightens and evens skin tone</li>
        <li><strong>Niacinamide:</strong> Reduces hyperpigmentation and minimizes pores</li>
        <li><strong>Hyaluronic Acid:</strong> Provides intense hydration</li>
        <li><strong>Retinol:</strong> Promotes cell turnover and reduces fine lines (use at night)</li>
      </ul>
      
      <h4>4. Moisturize</h4>
      <p>Even oily skin needs moisturizer! Choose formulations based on your skin type:</p>
      <ul class="blog-list">
        <li><strong>Oily skin:</strong> Lightweight, gel-based, non-comedogenic moisturizers</li>
        <li><strong>Dry skin:</strong> Rich creams with ceramides and natural oils</li>
        <li><strong>Combination skin:</strong> Lightweight lotions with targeted treatment for dry areas</li>
      </ul>
      
      <h4>5. Sun Protection</h4>
      <p>Yes, African skin needs sunscreen too! While melanin provides some protection (approximately SPF 13), it's not enough to prevent damage. Use a broad-spectrum SPF 30+ daily, even indoors. Look for sunscreens that don't leave a white cast on deeper skin tones.</p>
      
      <h3>Professional Treatments at ELIM</h3>
      
      <h4>HydraFacial</h4>
      <p>This multi-step treatment cleanses, exfoliates, extracts, and hydrates skin simultaneously. Suitable for all skin types, it delivers immediate glow with no downtime.</p>
      
      <h4>Chemical Peels</h4>
      <p>Customized peels using glycolic, salicylic, or mandelic acid can address hyperpigmentation, acne, and uneven texture. Our specialists carefully select peel strength based on your skin's tolerance.</p>
      
      <h4>Microdermabrasion</h4>
      <p>This gentle exfoliation treatment removes the outermost layer of dead skin cells, promoting cell renewal and improving skin texture and tone.</p>
      
      <h4>Led Light Therapy</h4>
      <p>Different wavelengths of LED light target various concerns:</p>
      <ul class="blog-list">
        <li><strong>Red light:</strong> Stimulates collagen, reduces inflammation</li>
        <li><strong>Blue light:</strong> Kills acne-causing bacteria</li>
        <li><strong>Green light:</strong> Targets hyperpigmentation</li>
      </ul>
      
      <h4>Custom Facials</h4>
      <p>Our signature ELIM facials are tailored to your specific concerns, combining manual extraction, massage, masks, and premium products for transformative results.</p>
      
      <h3>Lifestyle Factors for Glowing Skin</h3>
      <ul class="blog-list">
        <li><strong>Hydration:</strong> Drink at least 8 glasses of water daily</li>
        <li><strong>Diet:</strong> Eat antioxidant-rich foods (berries, leafy greens, nuts)</li>
        <li><strong>Sleep:</strong> Aim for 7-9 hours nightly—your skin repairs itself during sleep</li>
        <li><strong>Stress Management:</strong> Chronic stress can worsen skin conditions; practice meditation, yoga, or deep breathing</li>
        <li><strong>Avoid Smoking:</strong> Smoking accelerates aging and dulls complexion</li>
      </ul>
      
      <div class="blog-tip-box">
        <strong>💡 ELIM Pro Tip:</strong> Consistency is key! Give any new skincare routine or treatment at least 4-6 weeks to show results. Your skin cycle is approximately 28 days, so patience pays off.
      </div>
      
      <p>Ready to achieve your glowing skin goals? Book a consultation with ELIM's skincare specialists. We'll analyze your skin, discuss your concerns, and create a personalized treatment plan combining professional services and home care recommendations.</p>
    `
  }
};

// Open blog modal
openBlogBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const blogId = this.getAttribute('data-blog');
    const post = blogPosts[blogId];
    
    if (post) {
      blogModalBody.innerHTML = `
        <div class="blog-modal-header">
          <span class="blog-modal-category">${post.category}</span>
          <h2 class="blog-modal-title">${post.title}</h2>
          <div class="blog-modal-meta">
            <span>${post.date}</span>
            <span>${post.readTime}</span>
          </div>
        </div>
        <div class="blog-modal-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy" />
        </div>
        <div class="blog-modal-text">
          ${post.content}
        </div>
        <div class="blog-modal-footer">
          <a href="#booking" class="btn-primary" onclick="closeBlogModal()">Book an Appointment</a>
        </div>
      `;
      
      blogModal.classList.add('active');
      blogModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close blog modal function
function closeBlogModal() {
  blogModal.classList.remove('active');
  blogModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  blogModalBody.innerHTML = '';
}

// Close on overlay click
if (blogModal) {
  blogModal.addEventListener('click', function(e) {
    if (e.target === blogModal || e.target.classList.contains('blog-modal-overlay')) {
      closeBlogModal();
    }
  });
  
  // Close on button click
  if (blogModalClose) {
    blogModalClose.addEventListener('click', closeBlogModal);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && blogModal.classList.contains('active')) {
      closeBlogModal();
    }
  });
}


/* ==================== INIT ==================== */
console.log('%c✦ ELIM Hair & Beauty ✦', 'color: #FF4FA3; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with elegance and care.', 'color: #888; font-size: 12px;');

}); // End of DOMContentLoaded
