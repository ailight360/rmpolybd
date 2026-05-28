/**
 * RM POLY & PACKAGING - Modern Theme JavaScript
 * Features: Auto Dark/Light Mode, Smooth Scrolling, Mobile Menu, Animations
 */

// ============ DOM Elements ============
const html = document.documentElement;
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const backToTopBtn = document.querySelector('.back-to-top');
const pageLoader = document.querySelector('.page-loader');

// ============ Theme Management ============
class ThemeManager {
  constructor() {
    this.theme = this.getSavedTheme() || this.getAutoTheme();
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();
    this.setupTimeBasedThemeSwitch();
  }

  getSavedTheme() {
    return localStorage.getItem('theme');
  }

  getAutoTheme() {
    const hour = new Date().getHours();
    // Dark mode from 6 PM to 6 AM
    return (hour >= 18 || hour < 6) ? 'dark' : 'light';
  }

  applyTheme() {
    html.setAttribute('data-theme', this.theme);
    this.updateThemeIcon();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    
    // Add rotation animation
    if (themeToggle) {
      themeToggle.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 300);
    }
  }

  updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.innerHTML = this.theme === 'dark' 
      ? '<i class="mobi-mbri-sun mobi-mbri"></i>' 
      : '<i class="mobi-mbri-moon mobi-mbri"></i>';
    themeToggle.setAttribute('aria-label', `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  setupEventListeners() {
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setupTimeBasedThemeSwitch() {
    // Check every minute if theme should change automatically
    setInterval(() => {
      const savedTheme = this.getSavedTheme();
      if (!savedTheme) {
        const autoTheme = this.getAutoTheme();
        if (autoTheme !== this.theme) {
          this.theme = autoTheme;
          this.applyTheme();
        }
      }
    }, 60000);
  }
}

// ============ Navigation Management ============
class NavigationManager {
  constructor() {
    this.lastScroll = 0;
    this.init();
  }

  init() {
    this.setupScrollListener();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  }

  setupScrollListener() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;

    // Navbar shadow on scroll
    if (navbar) {
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (currentScroll > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    this.lastScroll = currentScroll;
  }

  setupMobileMenu() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ============ Scroll Animations ============
class ScrollAnimationManager {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    this.observeElements();
    this.setupParallax();
  }

  observeElements() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Stop observing once visible
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    // Observe cards and other animated elements
    document.querySelectorAll('.card, .product-card, .contact-item').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      
      observer.observe(el);
    });
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          
          parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
          });
          
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

// ============ Hero Slider ============
class HeroSliderManager {
  constructor() {
    this.slides = [];
    this.currentSlide = 0;
    this.interval = null;
    this.init();
  }

  init() {
    this.slides = document.querySelectorAll('.hero-slide');
    if (this.slides.length > 0) {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.slides[this.currentSlide].classList.add('active');
  }

  goToSlide(index) {
    clearInterval(this.interval);
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.startAutoPlay();
  }
}

// ============ Page Loader ============
function hidePageLoader() {
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      
      // Remove from DOM after transition
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 500);
    }, 1000);
  }
}

// ============ Initialize Everything ============
document.addEventListener('DOMContentLoaded', () => {
  // Hide page loader
  hidePageLoader();
  
  // Initialize managers
  new ThemeManager();
  new NavigationManager();
  new ScrollAnimationManager();
  new HeroSliderManager();
  
  // Add fade-in class to sections for animation
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
  });
});

// ============ Utility Functions ============
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============ Back to Top Functionality ============
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============ Keyboard Navigation ============
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape') {
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

console.log('🎨 RM Poly & Packaging - Modern Theme Loaded Successfully');
