// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile Menu Toggle =====
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
}

// Close menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== Active Navigation Link =====
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

setActiveNavLink();

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.service-card, .value-card, .team-card, .tool-item, .process-step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animateOnScroll.observe(el);
});

// CSS class for animated elements
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);

// ===== Form Handling =====
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    // Simple validation
    let isValid = true;
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(field => {
      const input = this.querySelector(`[name="${field}"]`);
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ff4444';
      } else {
        input.style.borderColor = '';
      }
    });
    
    // Email validation
    const emailInput = this.querySelector('[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value)) {
      isValid = false;
      emailInput.style.borderColor = '#ff4444';
    }
    
    // If validation fails, prevent submission
    if (!isValid) {
      e.preventDefault();
      return false;
    }
    
    // Validation passed - show sending state
    const btn = this.querySelector('.btn');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
      Sending...
    `;
    btn.disabled = true;
    
    // Form will submit to Formspree automatically
    // No need to prevent default - let it submit!
  });
  
  // Remove error styling on input
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  });
}

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const originalText = counter.textContent.trim();
    
    // Skip non-numeric values like "24/7", "∞", etc.
    if (originalText.includes('/') || originalText.includes('∞') || !/\d/.test(originalText)) {
      return;
    }
    
    const target = parseInt(originalText.replace(/\D/g, ''));
    const suffix = originalText.replace(/[0-9]/g, '');
    
    // Skip if no valid number found
    if (isNaN(target) || target === 0) {
      return;
    }
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    };
    
    // Only animate when in viewport
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

animateCounters();

// ===== Typing Effect for Code Block =====
function typeCode() {
  const codeBlock = document.querySelector('.code-block');
  if (!codeBlock) return;
  
  const lines = codeBlock.querySelectorAll('.code-line');
  lines.forEach((line, index) => {
    line.style.opacity = '0';
    setTimeout(() => {
      line.style.transition = 'opacity 0.3s ease';
      line.style.opacity = '1';
    }, index * 150);
  });
}

// Run typing effect when about section is in view
const aboutSection = document.querySelector('.about-image-main');
if (aboutSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeCode();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  
  observer.observe(aboutSection);
}

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');
  
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled * 0.002);
  }
});

// ===== Tool Tips =====
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', function() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.dataset.tooltip;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--secondary);
      color: var(--light);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      z-index: 1000;
      pointer-events: none;
      transform: translateX(-50%);
      white-space: nowrap;
    `;
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + window.scrollY + 'px';
  });
  
  el.addEventListener('mouseleave', function() {
    document.querySelectorAll('.tooltip').forEach(t => t.remove());
  });
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
