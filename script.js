/**
 * React-Style Sliding Gallery Component
 * Mimics React functionality with vanilla JavaScript
 */

class ReactStyleSlidingGallery {
  constructor(options = {}) {
    // Configuration matching React component
    this.config = {
      autoPlay: true,
      autoPlayDelay: 4000,
      transitionDuration: 700,
      pauseOnHover: true,
      pauseOnFocus: true,
      enableKeyboard: true,
      enableTouch: true,
      loop: true,
      ...options,
    }

    // State management (React-like)
    this.state = {
      currentIndex: 0,
      isAutoPlaying: true,
      touchStart: 0,
      touchEnd: 0,
      isAnimating: false,
    }

    // Event data (matching React component)
    this.events = [
      {
        id: 1,
        title: "Annual IT Expo 2024",
        description:
          "Join us for the biggest technology exhibition in Jalgoan featuring the latest in computer hardware, software solutions, and CCTV security systems.",
        date: "March 15, 2024",
        location: "Jalgoan Convention Center",
        attendees: "500+",
        category: "Exhibition",
      },
      {
        id: 2,
        title: "CCTV Installation Workshop",
        description:
          "Hands-on training session covering advanced CCTV installation techniques, network configuration, and troubleshooting methods.",
        date: "February 28, 2024",
        location: "JJITA Training Center",
        attendees: "50+",
        category: "Workshop",
      },
      {
        id: 3,
        title: "Dealers Network Meetup",
        description:
          "Monthly networking event bringing together computer and CCTV dealers to share experiences, discuss challenges, and explore opportunities.",
        date: "January 20, 2024",
        location: "Hotel Presidency",
        attendees: "80+",
        category: "Networking",
      },
      {
        id: 4,
        title: "Technology Summit 2024",
        description:
          "Premier technology conference featuring industry leaders discussing emerging trends in IT and security solutions.",
        date: "April 10, 2024",
        location: "Jalgoan Auditorium",
        attendees: "300+",
        category: "Conference",
      },
      {
        id: 5,
        title: "Security Systems Training",
        description:
          "Comprehensive training program covering modern security systems, access control, and surveillance technologies.",
        date: "May 5, 2024",
        location: "JJITA Academy",
        attendees: "40+",
        category: "Training",
      },
      {
        id: 6,
        title: "Digital Marketing for Dealers",
        description:
          "Learn effective digital marketing strategies to grow your computer and CCTV business in the digital age.",
        date: "June 12, 2024",
        location: "Business Center",
        attendees: "60+",
        category: "Workshop",
      },
    ]

    // DOM elements
    this.elements = {}
    this.autoPlayTimer = null

    // Initialize
    this.init()
  }

  /**
   * Initialize the gallery (React componentDidMount equivalent)
   */
  init() {
    try {
      this.getDOMElements()
      this.validateElements()
      this.setupEventListeners()
      this.setupAccessibility()
      this.updateGallery(true)
      this.startAutoPlay()
      this.announceToScreenReader("Gallery initialized with " + this.events.length + " events")
    } catch (error) {
      console.error("React-style gallery initialization failed:", error)
      this.handleError(error)
    }
  }

  /**
   * Get DOM elements (React refs equivalent)
   */
  getDOMElements() {
    this.elements = {
      track: document.getElementById("reactGalleryTrack"),
      prevBtn: document.getElementById("reactPrevBtn"),
      nextBtn: document.getElementById("reactNextBtn"),
      indicators: document.querySelectorAll(".react-indicator"),
      indicatorContainer: document.getElementById("reactGalleryIndicators"),
      thumbnails: document.querySelectorAll(".react-thumbnail"),
      progressFill: document.getElementById("reactProgressFill"),
      progressText: document.getElementById("reactProgressText"),
      autoplayStatus: document.getElementById("reactAutoplayStatus"),
      cards: document.querySelectorAll(".react-event-card"),
      container: document.getElementById("reactGalleryContainer"),
    }

    this.totalSlides = this.events.length
  }

  /**
   * Validate required elements
   */
  validateElements() {
    const required = ["track", "cards"]
    const missing = required.filter(
      (key) => !this.elements[key] || (Array.isArray(this.elements[key]) && this.elements[key].length === 0),
    )

    if (missing.length > 0) {
      throw new Error(`Missing required elements: ${missing.join(", ")}`)
    }

    if (this.totalSlides === 0) {
      throw new Error("No event cards found")
    }
  }

  /**
   * Setup event listeners (React event handlers equivalent)
   */
  setupEventListeners() {
    // Navigation buttons
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener("click", () => this.goToPrevious())
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener("click", () => this.goToNext())
    }

    // Indicator dots
    this.elements.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })

    // Thumbnail navigation
    this.elements.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => this.goToSlide(index))
    })

    // Touch events (React touch handlers equivalent)
    if (this.config.enableTouch && this.elements.container) {
      this.elements.container.addEventListener("touchstart", (e) => this.handleTouchStart(e))
      this.elements.container.addEventListener("touchmove", (e) => this.handleTouchMove(e))
      this.elements.container.addEventListener("touchend", () => this.handleTouchEnd())
    }

    // Mouse events for hover (React onMouseEnter/onMouseLeave equivalent)
    if (this.config.pauseOnHover && this.elements.container) {
      this.elements.container.addEventListener("mouseenter", () => this.pauseAutoPlay())
      this.elements.container.addEventListener("mouseleave", () => this.resumeAutoPlay())
    }

    // Keyboard navigation
    if (this.config.enableKeyboard) {
      document.addEventListener("keydown", (e) => this.handleKeydown(e))
    }

    // Window events
    window.addEventListener("resize", () => this.handleResize())
    document.addEventListener("visibilitychange", () => this.handleVisibilityChange())
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    if (this.elements.container) {
      this.elements.container.setAttribute("aria-live", "polite")
    }

    this.elements.cards.forEach((card, index) => {
      card.setAttribute("aria-hidden", index !== this.state.currentIndex)
      card.setAttribute("tabindex", index === this.state.currentIndex ? "0" : "-1")
    })
  }

  /**
   * Handle touch start (React onTouchStart equivalent)
   */
  handleTouchStart(e) {
    this.state.touchStart = e.targetTouches[0].clientX
    this.pauseAutoPlay()
  }

  /**
   * Handle touch move (React onTouchMove equivalent)
   */
  handleTouchMove(e) {
    this.state.touchEnd = e.targetTouches[0].clientX
  }

  /**
   * Handle touch end (React onTouchEnd equivalent)
   */
  handleTouchEnd() {
    if (!this.state.touchStart || !this.state.touchEnd) return

    const distance = this.state.touchStart - this.state.touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      this.goToNext()
    } else if (isRightSwipe) {
      this.goToPrevious()
    }

    this.resumeAutoPlay()
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(e) {
    const isGalleryFocused =
      this.elements.container &&
      (this.elements.container.contains(document.activeElement) || document.activeElement === this.elements.container)

    if (!isGalleryFocused) return

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        this.goToPrevious()
        break
      case "ArrowRight":
        e.preventDefault()
        this.goToNext()
        break
      case " ":
        e.preventDefault()
        this.toggleAutoPlay()
        break
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      this.updateGallery(true)
    }, 250)
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseAutoPlay()
    } else {
      this.resumeAutoPlay()
    }
  }

  /**
   * Go to next slide (React method equivalent)
   */
  goToNext() {
    if (this.state.isAnimating) return

    const nextIndex = (this.state.currentIndex + 1) % this.totalSlides
    this.goToSlide(nextIndex)
    this.pauseAutoPlayTemporarily()
  }

  /**
   * Go to previous slide (React method equivalent)
   */
  goToPrevious() {
    if (this.state.isAnimating) return

    const prevIndex = (this.state.currentIndex - 1 + this.totalSlides) % this.totalSlides
    this.goToSlide(prevIndex)
    this.pauseAutoPlayTemporarily()
  }

  /**
   * Go to specific slide (React method equivalent)
   */
  goToSlide(index) {
    if (this.state.isAnimating || index === this.state.currentIndex) return

    this.state.isAnimating = true
    this.state.currentIndex = index

    this.updateGallery()
    this.pauseAutoPlayTemporarily()

    // Reset animation flag
    setTimeout(() => {
      this.state.isAnimating = false
    }, this.config.transitionDuration)
  }

  /**
   * Update gallery display (React render equivalent)
   */
  updateGallery(skipAnimation = false) {
    if (!this.elements.track) return

    // Calculate transform
    const translateX = -this.state.currentIndex * 100

    // Apply transform
    if (skipAnimation) {
      this.elements.track.style.transition = "none"
    } else {
      this.elements.track.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`
    }

    this.elements.track.style.transform = `translateX(${translateX}%)`

    if (skipAnimation) {
      this.elements.track.offsetHeight
      this.elements.track.style.transition = ""
    }

    // Update states
    this.updateActiveStates()
    this.updateIndicators()
    this.updateThumbnails()
    this.updateProgress()
    this.updateAccessibility()
  }

  /**
   * Update active states (React state update equivalent)
   */
  updateActiveStates() {
    this.elements.cards.forEach((card, index) => {
      if (card && card.classList) {
        const isActive = index === this.state.currentIndex
        card.classList.toggle("active", isActive)
        card.setAttribute("tabindex", isActive ? "0" : "-1")
        card.setAttribute("aria-hidden", !isActive)
      }
    })
  }

  /**
   * Update indicators (React state update equivalent)
   */
  updateIndicators() {
    this.elements.indicators.forEach((indicator, index) => {
      if (indicator && indicator.classList) {
        const isActive = index === this.state.currentIndex
        indicator.classList.toggle("active", isActive)
        indicator.setAttribute("aria-selected", isActive)
      }
    })
  }

  /**
   * Update thumbnails (React state update equivalent)
   */
  updateThumbnails() {
    this.elements.thumbnails.forEach((thumbnail, index) => {
      if (thumbnail && thumbnail.classList) {
        const isActive = index === this.state.currentIndex
        thumbnail.classList.toggle("active", isActive)
      }
    })
  }

  /**
   * Update progress (React state update equivalent)
   */
  updateProgress() {
    if (this.elements.progressFill) {
      const progress = ((this.state.currentIndex + 1) / this.totalSlides) * 100
      this.elements.progressFill.style.width = `${progress}%`
    }

    if (this.elements.progressText) {
      this.elements.progressText.textContent = `${this.state.currentIndex + 1} of ${this.totalSlides}`
    }

    if (this.elements.autoplayStatus) {
      this.elements.autoplayStatus.textContent = this.state.isAutoPlaying ? "Auto-playing" : "Paused"
    }
  }

  /**
   * Update accessibility
   */
  updateAccessibility() {
    if (this.elements.container) {
      const label = `Viewing event ${this.state.currentIndex + 1} of ${this.totalSlides}`
      this.elements.container.setAttribute("aria-label", label)
    }
  }

  /**
   * Start auto-play (React useEffect equivalent)
   */
  startAutoPlay() {
    if (!this.config.autoPlay || this.autoPlayTimer) return

    this.autoPlayTimer = setInterval(() => {
      this.goToNext()
    }, this.config.autoPlayDelay)

    this.state.isAutoPlaying = true
    this.updateProgress()
  }

  /**
   * Stop auto-play
   */
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
      this.autoPlayTimer = null
    }

    this.state.isAutoPlaying = false
    this.updateProgress()
  }

  /**
   * Pause auto-play temporarily
   */
  pauseAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
      this.autoPlayTimer = null
    }
  }

  /**
   * Resume auto-play
   */
  resumeAutoPlay() {
    if (this.state.isAutoPlaying && !this.autoPlayTimer) {
      this.startAutoPlay()
    }
  }

  /**
   * Pause auto-play temporarily (React setTimeout equivalent)
   */
  pauseAutoPlayTemporarily() {
    this.pauseAutoPlay()
    setTimeout(() => {
      if (this.state.isAutoPlaying) {
        this.startAutoPlay()
      }
    }, 5000)
  }

  /**
   * Toggle auto-play
   */
  toggleAutoPlay() {
    if (this.state.isAutoPlaying) {
      this.stopAutoPlay()
      this.announceToScreenReader("Slideshow paused")
    } else {
      this.state.isAutoPlaying = true
      this.startAutoPlay()
      this.announceToScreenReader("Slideshow playing")
    }
  }

  /**
   * Announce to screen readers
   */
  announceToScreenReader(message) {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.style.cssText = "position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Handle errors
   */
  handleError(error) {
    console.error("React-style gallery error:", error)
    this.stopAutoPlay()

    if (this.elements.container) {
      const errorMessage = document.createElement("div")
      errorMessage.className = "gallery-error"
      errorMessage.innerHTML = `
        <p>Unable to load gallery. Please refresh the page or try again later.</p>
        <button onclick="location.reload()">Refresh Page</button>
      `
      errorMessage.style.cssText = `
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
        background: var(--bg-card);
        border-radius: var(--border-radius);
        margin: 1rem;
      `

      this.elements.container.appendChild(errorMessage)
    }
  }

  /**
   * Destroy gallery (React componentWillUnmount equivalent)
   */
  destroy() {
    this.stopAutoPlay()
    clearTimeout(this.resizeTimer)

    // Remove event listeners
    window.removeEventListener("resize", this.handleResize)
    document.removeEventListener("visibilitychange", this.handleVisibilityChange)
    document.removeEventListener("keydown", this.handleKeydown)

    this.elements = {}
    this.state = {
      currentIndex: 0,
      isAutoPlaying: false,
      touchStart: 0,
      touchEnd: 0,
      isAnimating: false,
    }
  }
}

/**
 * Mobile Menu Component
 */
class MobileMenu {
  constructor() {
    this.menuBtn = document.getElementById("mobileMenuBtn")
    this.menu = document.getElementById("mobileMenu")
    this.isOpen = false

    this.init()
  }

  init() {
    if (!this.menuBtn || !this.menu) return

    this.menuBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.toggle()
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
        this.close()
      }
    })

    // Close menu when clicking a link
    const mobileLinks = this.menu.querySelectorAll(".nav-link-mobile")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => this.close())
    })

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close()
      }
    })
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.isOpen = true
    this.menuBtn.setAttribute("aria-expanded", "true")
    this.menu.classList.add("active")
    document.body.style.overflow = "hidden"

    // Focus first menu item
    const firstLink = this.menu.querySelector(".nav-link-mobile")
    if (firstLink) {
      firstLink.focus()
    }
  }

  close() {
    this.isOpen = false
    this.menuBtn.setAttribute("aria-expanded", "false")
    this.menu.classList.remove("active")
    document.body.style.overflow = ""
  }
}

/**
 * Smooth Scrolling Component
 */
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))

        if (target) {
          const headerHeight = document.querySelector(".header")?.offsetHeight || 0
          const targetPosition = target.offsetTop - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  }
}

/**
 * Header Scroll Effect
 */
class HeaderScrollEffect {
  constructor() {
    this.header = document.getElementById("header")
    this.lastScrollY = window.scrollY
    this.ticking = false

    this.init()
  }

  init() {
    if (!this.header) return

    window.addEventListener("scroll", () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateHeader()
          this.ticking = false
        })
        this.ticking = true
      }
    })
  }

  updateHeader() {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      this.header.classList.add("scrolled")
    } else {
      this.header.classList.remove("scrolled")
    }

    this.lastScrollY = currentScrollY
  }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameCount: 0,
      lastTime: performance.now(),
    }

    this.init()
  }

  init() {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark("gallery-init-start")
    }

    this.startFPSMonitor()
  }

  startFPSMonitor() {
    const measureFPS = (currentTime) => {
      this.metrics.frameCount++

      if (currentTime >= this.metrics.lastTime + 1000) {
        this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / (currentTime - this.metrics.lastTime))
        this.metrics.frameCount = 0
        this.metrics.lastTime = currentTime

        // Log performance warnings
        if (this.metrics.fps < 30) {
          console.warn("Low FPS detected:", this.metrics.fps)
        }
      }

      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)
  }

  markComplete() {
    if (typeof performance !== "undefined" && performance.mark && performance.measure) {
      performance.mark("gallery-init-end")
      performance.measure("gallery-init", "gallery-init-start", "gallery-init-end")
    }
  }
}

/**
 * Form Handler Component
 */
class FormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const button = this.form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    try {
      button.textContent = 'Sending...';
      button.disabled = true;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.showSuccess();
      this.form.reset();
    } catch (error) {
      this.showError();
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  showSuccess() {
    alert('Message sent successfully!');
  }

  showError() {
    alert('Failed to send message. Please try again.');
  }
}

/**
 * Enhanced Membership Cards Component
 */
class MembershipCards {
  constructor() {
    this.cards = document.querySelectorAll('.membership-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      const button = card.querySelector('.btn');
      if (button) {
        button.addEventListener('click', () => this.handleJoin(card));
      }
    });
  }

  handleJoin(card) {
    const type = card.querySelector('h3').textContent;
    alert(`Thank you for your interest in ${type}. Our team will contact you soon.`);
  }
}

/**
 * Enhanced UI Controller
 */
class UIController {
  constructor() {
    this.header = document.getElementById('header');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.sections = document.querySelectorAll('.section');
    this.lastScroll = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    this.initializeIntersectionObserver();
    this.initializeMobileMenu();
    this.initializeScrollHandler();
    this.initializeSmoothScroll();
    this.initializeParallax();
  }

  initializeIntersectionObserver() {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '-50px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.hasAttribute('data-lazy-bg')) {
            entry.target.style.backgroundImage = `url(${entry.target.getAttribute('data-lazy-bg')})`;
            entry.target.removeAttribute('data-lazy-bg');
          }
        }
      });
    }, observerOptions);

    this.sections.forEach(section => sectionObserver.observe(section));
  }

  initializeMobileMenu() {
    if (this.mobileMenuBtn && this.mobileMenu) {
      this.mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = this.mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        this.mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        this.mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });

      // Close mobile menu on link click
      this.mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.mobileMenu.classList.remove('active');
          this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('menu-open');
        });
      });
    }
  }

  initializeScrollHandler() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Header show/hide logic
    if (currentScroll <= 0) {
      this.header.classList.remove('scroll-up', 'scroll-down');
      return;
    }

    if (currentScroll > this.lastScroll && !this.header.classList.contains('scroll-down')) {
      this.header.classList.remove('scroll-up');
      this.header.classList.add('scroll-down');
    } else if (currentScroll < this.lastScroll && this.header.classList.contains('scroll-down')) {
      this.header.classList.remove('scroll-down');
      this.header.classList.add('scroll-up');
    }

    this.lastScroll = currentScroll;
  }

  initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', debounce(() => {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = element.getAttribute('data-parallax') || 0.5;
          const yPos = -(scrolled * speed);
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
      });
    }, 10));
  }
}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new UIController();
});

/**
 * Responsive Navigation Handling
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const header = document.getElementById('header');
  let lastScroll = 0;

  // Mobile Menu Toggle
  if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
          const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
          mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
          if (mobileMenu && mobileMenu.classList) {
              mobileMenu.classList.toggle('active');
          }
          
          // Animate hamburger
          const bars = mobileMenuBtn.querySelectorAll('.hamburger');
          if (bars.length > 0) {
              bars.forEach(bar => {
                  if (bar && bar.classList) {
                      bar.classList.toggle('active');
                  }
              });
          }
      });

      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
              if (mobileMenu && mobileMenu.classList) {
                  mobileMenu.classList.remove('active');
              }
              if (mobileMenuBtn) {
                  mobileMenuBtn.setAttribute('aria-expanded', 'false');
              }
          });
      });
  }

  // Header scroll behavior
  window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (!header) return; // Add null check
      
      if (currentScroll <= 0) {
          header.classList.remove('scroll-up');
          return;
      }
      
      if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
          // Scrolling down
          header.classList.remove('scroll-up');
          header.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
          // Scrolling up
          header.classList.remove('scroll-down');
          header.classList.add('scroll-up');
      }
      
      lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
              const headerOffset = 80;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Responsive image loading
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
          }
      });
  });

  images.forEach(img => imageObserver.observe(img));

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
      document.body.classList.add('resize-animation-stopper');
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
          document.body.classList.remove('resize-animation-stopper');
      }, 400);
  });
});

/**
 * Initialize everything when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize React-style gallery instead of the previous one
    const reactGallery = new ReactStyleSlidingGallery({
      autoPlay: true,
      autoPlayDelay: 4000,
      pauseOnHover: true,
      pauseOnFocus: true,
      enableKeyboard: true,
      enableTouch: true,
      loop: true,
    })

    // Initialize Logo Carousel with touch gesture support
    const logoCarousel = new LogoCarousel();
    window.logoCarousel = logoCarousel; // Make it globally accessible
    console.log('✅ Enhanced Logo Carousel with touch gestures initialized successfully');

    // Keep other components
    const mobileMenu = new MobileMenu()
    const smoothScroll = new SmoothScroll()
    const headerEffect = new HeaderScrollEffect()
    const formHandler = new FormHandler();
    const membershipCards = new MembershipCards();

    document.body.classList.add("loaded")

    // Add AOS-style scroll animations
    document.querySelectorAll('.about-card, .membership-card, .contact-card').forEach(el => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(el);
    });

    // Add animation observer for committee cards
    const committeeFadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('aos-animate');
              committeeFadeObserver.unobserve(entry.target);
          }
      });
    }, {
      threshold: 0.2
    });

    // Observe all committee cards
    document.querySelectorAll('.committee-card').forEach(card => {
      committeeFadeObserver.observe(card);
    });

    // Initialize staggered animations
    document.querySelectorAll('[data-aos-delay]').forEach((element, index) => {
      element.style.transitionDelay = `${index * 100}ms`;
    });

    console.log("JJITA React-Style Sliding Gallery initialized successfully")
  } catch (error) {
    console.error("Failed to initialize React-style gallery:", error)
  }
})

/**
 * Service Worker Registration (Optional)
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

/**
 * Enhanced Navigation Controller
 */
class NavigationController {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.links = document.querySelectorAll('.nav-link, .nav-link-mobile');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 100;
        this.ticking = false;

        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollHandler();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = this.mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                this.mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                if (this.mobileMenuBtn.classList) {
                    this.mobileMenuBtn.classList.toggle('active');
                }
                if (this.mobileMenu.classList) {
                    this.mobileMenu.classList.toggle('active');
                }
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            // Close mobile menu on link click
            this.mobileMenu.querySelectorAll('.nav-link-mobile').forEach(link => {
                link.addEventListener('click', () => {
                    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    if (this.mobileMenuBtn.classList) {
                        this.mobileMenuBtn.classList.remove('active');
                    }
                    if (this.mobileMenu.classList) {
                        this.mobileMenu.classList.remove('active');
                    }
                    document.body.style.overflow = '';
                });
            });
        }
    }

    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    handleScroll() {
        // Add scrolled class when page is scrolled
        if (this.header && this.header.classList) {
            if (window.scrollY > 0) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (window.scrollY > this.scrollThreshold) {
                if (window.scrollY > this.lastScrollY) {
                    this.header.classList.add('nav-hidden');
                } else {
                    this.header.classList.remove('nav-hidden');
                }
            }
        }
        this.lastScrollY = window.scrollY;
    }

    setupSmoothScroll() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    let scrollY = window.pageYOffset;
                    
                    sections.forEach(section => {
                        const sectionHeight = section.offsetHeight;
                        const sectionTop = section.offsetTop - 100;
                        const sectionId = section.getAttribute('id');
                        
                        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                          document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
                          document.querySelector(`.nav-link-mobile[href="#${sectionId}"]`)?.classList.add('active');
                        } else {
                          document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
                          document.querySelector(`.nav-link-mobile[href="#${sectionId}"]`)?.classList.remove('active');
                        }
                    });
                    
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationController();
});

/**
 * Parallax scrolling effect
 */
document.addEventListener('DOMContentLoaded', () => {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    let ticking = false;

    function updateParallax() {
        parallaxSections.forEach(section => {
            const distance = window.pageYOffset - section.offsetTop;
            const parallaxContent = section.querySelector('.parallax-content');
            
            if (isElementInViewport(section)) {
                const speed = 0.5;
                const yValue = distance * speed;
                if (parallaxContent) {
                    parallaxContent.style.transform = `translate3d(0, ${yValue}px, 0)`;
                }
            }
        });
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Throttled scroll event
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial update
    updateParallax();
});

/**
 * Footer Animation Enhancement
 */
document.addEventListener('DOMContentLoaded', function() {
    // Animate footer elements when they enter viewport
    const footerElements = document.querySelectorAll('.footer-brand, .footer-nav, .footer-contact');
    
    if (footerElements.length) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation with slight delay based on index
                    setTimeout(() => {
                        entry.target.classList.add('footer-animate-in');
                    }, index * 150);
                    
                    footerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe each footer element
        footerElements.forEach(element => {
            footerObserver.observe(element);
        });
    }
    
    // Smooth scroll for footer links
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

/**
 * Contact Section Animation Enhancement
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    if (contactCards.length) {
        // Create intersection observer for contact cards
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('contact-card-animated');
                    }, index * 150);
                    
                    contactObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Set initial state and observe cards
        contactCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            contactObserver.observe(card);
        });
    }
    
    // Add click tracking for contact links (optional analytics)
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = e.offsetX + 'px';
            ripple.style.top = e.offsetY + 'px';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for contact animations
if (!document.querySelector('#contact-animations-style')) {
    const contactStyle = document.createElement('style');
    contactStyle.id = 'contact-animations-style';
    contactStyle.textContent = `
        .contact-card-animated {
            animation: contactCardSlideIn 0.6s ease forwards;
        }
        
        @keyframes contactCardSlideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .contact-link {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(contactStyle);
}

// ========================================
// SIMPLE SITE LOAD MESSAGES
// ========================================

const siteLoadStart = performance.now();

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ JJITA DOM loaded successfully');
    });
} else {
    console.log('✅ JJITA DOM loaded successfully');
}

// Site fully loaded
window.addEventListener('load', () => {
    const loadTime = Math.round(performance.now() - siteLoadStart);
    console.log(`🎉 JJITA Site fully loaded in ${loadTime}ms`);
    console.log(`📊 ${document.querySelectorAll('img').length} images, ${document.querySelectorAll('*').length} elements`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Site loaded slowly, consider optimization');
    }
});

/**
 * Enhanced Logo Carousel Component with Touch Gesture Support
 * Creates a smooth, infinite scrolling logo carousel with swipe/drag interaction
 */
class LogoCarousel {
    constructor() {
        this.track = null;
        this.wrapper = null;
        this.isHovered = false;
        this.observerThreshold = 0.1;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.translateX = 0;
        this.animationId = null;
        this.velocity = 0;
        this.lastMoveTime = 0;
        this.lastMoveX = 0;
        this.isManualScroll = false;
        this.autoScrollResumeTimeout = null;
        this.trackWidth = 0;
        this.totalSlides = 0;
        this.slideWidth = 0;
        this.gap = 0;
        
        // Touch/drag configuration
        this.config = {
            momentumMultiplier: 0.95,
            momentumThreshold: 0.1,
            autoScrollResumeDelay: 3000,
            maxVelocity: 50,
            dampingFactor: 0.92,
            minDragDistance: 10,
            smoothTransitionDuration: 600
        };

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.track = document.getElementById('logoCarouselTrack');
        this.wrapper = this.track?.parentElement;
        
        if (!this.track || !this.wrapper) {
            console.warn('Logo carousel elements not found');
            return;
        }

        this.createSeamlessLoop();
        this.setupIntersectionObserver();
        this.setupEventListeners();
        this.setupTouchGestures();
        this.preloadImages();
        this.optimizePerformance();
        this.calculateDimensions();
    }

    createSeamlessLoop() {
        // Clone all logo slides for seamless infinite loop
        const logoSlides = this.track.querySelectorAll('.logo-slide');
        
        if (logoSlides.length === 0) return;

        this.totalSlides = logoSlides.length;

        // Create a duplicate set for seamless looping
        logoSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            this.track.appendChild(clone);
        });

        // Set responsive gap based on screen size
        this.updateResponsiveGap();
    }

    calculateDimensions() {
        if (!this.track) return;

        const slides = this.track.querySelectorAll('.logo-slide');
        if (slides.length === 0) return;

        // Calculate slide width and gap from CSS
        const computedStyle = getComputedStyle(this.track);
        this.gap = parseFloat(computedStyle.gap) || 0;
        
        // Get actual slide width
        const firstSlide = slides[0];
        if (firstSlide) {
            const slideRect = firstSlide.getBoundingClientRect();
            this.slideWidth = slideRect.width;
        }

        // Calculate total width for one set of slides
        this.trackWidth = this.totalSlides * (this.slideWidth + this.gap);
    }

    updateResponsiveGap() {
        if (!this.track) return;
        
        const screenWidth = window.innerWidth;
        let gap, logoWidth;
        
        // Responsive gap and width calculations
        if (screenWidth >= 1200) {
            gap = 64; // 4rem
            logoWidth = 200;
        } else if (screenWidth >= 992) {
            gap = 56; // 3.5rem  
            logoWidth = 180;
        } else if (screenWidth >= 768) {
            gap = 48; // 3rem
            logoWidth = 160;
        } else if (screenWidth >= 576) {
            gap = 40; // 2.5rem
            logoWidth = 140;
        } else {
            gap = 32; // 2rem
            logoWidth = 120;
        }
        
        this.gap = gap;
        this.slideWidth = logoWidth;
        
        // Update CSS custom properties for dynamic calculations
        const totalWidth = this.totalSlides * (logoWidth + gap);
        
        this.track.style.setProperty('--logo-set-width', `${totalWidth}px`);
        this.track.style.setProperty('--logo-gap', `${gap}px`);
        this.track.style.setProperty('--logo-width', `${logoWidth}px`);
        
        this.trackWidth = totalWidth;
    }

    setupTouchGestures() {
        if (!this.wrapper || !this.track) return;

        // Touch events
        this.wrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.wrapper.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.wrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        this.wrapper.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: true });

        // Mouse events for desktop drag support
        this.wrapper.addEventListener('mousedown', this.handleMouseDown.bind(this), { passive: false });
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: false });
        document.addEventListener('mouseup', this.handleMouseUp.bind(this), { passive: true });

        // Prevent context menu on long press
        this.wrapper.addEventListener('contextmenu', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }

    handleTouchStart(e) {
        this.startDrag(e.touches[0].clientX);
        e.preventDefault(); // Prevent scrolling
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.updateDrag(e.touches[0].clientX);
        e.preventDefault(); // Prevent scrolling
    }

    handleTouchEnd(e) {
        this.endDrag();
    }

    handleMouseDown(e) {
        // Only handle left mouse button
        if (e.button !== 0) return;
        this.startDrag(e.clientX);
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.updateDrag(e.clientX);
        e.preventDefault();
    }

    handleMouseUp(e) {
        this.endDrag();
    }

    startDrag(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        this.currentX = clientX;
        this.lastMoveX = clientX;
        this.lastMoveTime = Date.now();
        this.velocity = 0;

        // Stop auto scroll and switch to manual mode
        this.pauseAutoScroll();
        this.wrapper.classList.add('dragging');
        this.track.classList.add('manual-scroll');

        // Cancel any ongoing animations
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Clear auto resume timeout
        if (this.autoScrollResumeTimeout) {
            clearTimeout(this.autoScrollResumeTimeout);
        }
    }

    updateDrag(clientX) {
        if (!this.isDragging) return;

        const currentTime = Date.now();
        const deltaX = clientX - this.currentX;
        const deltaTime = currentTime - this.lastMoveTime;

        // Calculate velocity for momentum
        if (deltaTime > 0) {
            this.velocity = deltaX / deltaTime;
        }

        this.currentX = clientX;
        this.lastMoveX = clientX;
        this.lastMoveTime = currentTime;

        // Calculate total drag distance
        const totalDrag = this.currentX - this.startX;
        
        // Apply drag with resistance at edges
        const dragDistance = this.applyDragResistance(totalDrag);
        
        // Update transform
        this.translateX = dragDistance;
        this.updateTrackPosition();
    }

    applyDragResistance(drag) {
        // Apply resistance to make dragging feel natural
        const resistance = 0.6;
        return drag * resistance;
    }

    endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.wrapper.classList.remove('dragging');

        const totalDrag = this.currentX - this.startX;

        // Check if drag distance meets minimum threshold
        if (Math.abs(totalDrag) < this.config.minDragDistance) {
            // Small movement, return to auto scroll immediately
            this.resumeAutoScroll();
            return;
        }

        // Apply momentum if velocity is significant
        if (Math.abs(this.velocity) > this.config.momentumThreshold) {
            this.applyMomentum();
        } else {
            // No significant momentum, return to auto scroll after a delay
            this.scheduleAutoScrollResume();
        }
    }

    applyMomentum() {
        // Clamp velocity to maximum
        const clampedVelocity = Math.max(-this.config.maxVelocity, 
                                       Math.min(this.config.maxVelocity, this.velocity));

        // Calculate momentum distance
        let momentumDistance = clampedVelocity * 200; // Scale factor for momentum
        
        // Apply momentum with animation
        this.animateMomentum(momentumDistance);
    }

    animateMomentum(initialDistance) {
        let distance = initialDistance;
        const animate = () => {
            // Apply damping
            distance *= this.config.dampingFactor;
            
            // Update position
            this.translateX += distance;
            this.updateTrackPosition();

            // Continue animation if momentum is still significant
            if (Math.abs(distance) > 0.1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                // Momentum finished, schedule auto scroll resume
                this.scheduleAutoScrollResume();
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }

    updateTrackPosition() {
        if (!this.track) return;

        // Ensure seamless looping by wrapping position
        const normalizedX = this.normalizePosition(this.translateX);
        
        // Apply transform
        this.track.style.transform = `translate3d(${normalizedX}px, 0, 0)`;
    }

    normalizePosition(x) {
        // Keep position within bounds for seamless looping
        if (!this.trackWidth) return x;
        
        // Wrap position to create infinite scroll effect
        while (x > 0) {
            x -= this.trackWidth;
        }
        while (x < -this.trackWidth) {
            x += this.trackWidth;
        }
        
        return x;
    }

    pauseAutoScroll() {
        this.isManualScroll = true;
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
    }

    resumeAutoScroll() {
        this.isManualScroll = false;
        this.translateX = 0;
        
        if (this.track) {
            // Smooth transition back to auto scroll
            this.track.classList.add('transitioning');
            this.track.style.transform = 'translate3d(0, 0, 0)';
            
            // Resume animation after transition
            setTimeout(() => {
                this.track.classList.remove('transitioning', 'manual-scroll');
                this.track.style.animationPlayState = 'running';
            }, this.config.smoothTransitionDuration);
        }
    }

    scheduleAutoScrollResume() {
        // Clear any existing timeout
        if (this.autoScrollResumeTimeout) {
            clearTimeout(this.autoScrollResumeTimeout);
        }

        // Schedule auto scroll resume
        this.autoScrollResumeTimeout = setTimeout(() => {
            this.resumeAutoScroll();
        }, this.config.autoScrollResumeDelay);
    }

    setupIntersectionObserver() {
        // Only animate when carousel is visible with better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smoother animation start
                    requestAnimationFrame(() => {
                        if (!this.isManualScroll) {
                            this.track.style.animationPlayState = 'running';
                        }
                    });
                } else {
                    this.track.style.animationPlayState = 'paused';
                }
            });
        }, {
            threshold: this.observerThreshold,
            rootMargin: '100px'
        });

        if (this.track) {
            observer.observe(this.track);
        }
    }

    setupEventListeners() {
        if (!this.wrapper) return;

        // Use passive event listeners for better performance
        const handleMouseEnter = () => {
            this.isHovered = true;
            if (!this.isManualScroll) {
                requestAnimationFrame(() => {
                    this.track.style.animationPlayState = 'paused';
                });
            }
        };

        const handleMouseLeave = () => {
            this.isHovered = false;
            if (!this.isManualScroll) {
                requestAnimationFrame(() => {
                    this.track.style.animationPlayState = 'running';
                });
            }
        };

        // Store references for cleanup
        this.handleMouseEnter = handleMouseEnter;
        this.handleMouseLeave = handleMouseLeave;

        // Only add hover listeners on devices that support hover
        if (window.matchMedia('(hover: hover)').matches) {
            this.wrapper.addEventListener('mouseenter', handleMouseEnter, { passive: true });
            this.wrapper.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        }

        // Optimized visibility change handler
        const handleVisibilityChange = () => {
            requestAnimationFrame(() => {
                if (document.hidden || (this.isHovered && !this.isManualScroll)) {
                    this.track.style.animationPlayState = 'paused';
                } else if (!this.isManualScroll) {
                    this.track.style.animationPlayState = 'running';
                }
            });
        };

        this.handleVisibilityChange = handleVisibilityChange;
        document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

        // Handle reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleReducedMotion = (e) => {
            if (e.matches) {
                this.track.style.animation = 'none';
            } else {
                // Get responsive animation duration
                const duration = this.getResponsiveAnimationDuration();
                this.track.style.animation = `logoScrollInfinite ${duration}s linear infinite`;
            }
        };

        this.handleReducedMotion = handleReducedMotion;
        mediaQuery.addEventListener('change', handleReducedMotion);
        handleReducedMotion(mediaQuery); // Check initial state

        // Handle window resize for responsive updates
        const handleResize = () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.updateResponsiveGap();
                this.updateResponsiveAnimation();
                this.calculateDimensions();
            }, 150);
        };

        this.handleResize = handleResize;
        window.addEventListener('resize', handleResize, { passive: true });
    }

    getResponsiveAnimationDuration() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 992) {
            return 30; // Desktop speed
        } else if (screenWidth >= 768) {
            return 35; // Tablet speed
        } else if (screenWidth >= 576) {
            return 40; // Mobile large speed
        } else {
            return 45; // Mobile small speed
        }
    }

    updateResponsiveAnimation() {
        if (!this.track) return;
        
        const duration = this.getResponsiveAnimationDuration();
        
        // Check if reduced motion is preferred
        if (window.matchMedia('(prefers-reduced-motion)').matches) {
            this.track.style.animation = 'none';
        } else {
            this.track.style.animation = `logoScrollInfinite ${duration}s linear infinite`;
        }
    }

    preloadImages() {
        const images = this.track?.querySelectorAll('.logo-image');
        
        if (!images) return;

        // Use requestIdleCallback for better performance
        const preloadImage = (img, index) => {
            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.style.opacity = '1';
                img.removeAttribute('data-loading');
            };
            imageLoader.onerror = () => {
                console.warn(`Failed to load logo image: ${img.src}`);
                img.style.display = 'none';
            };
            
            // Add loading attribute for better performance
            img.setAttribute('data-loading', 'true');
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.2s ease';
            
            // Stagger image loading for smoother experience
            setTimeout(() => {
                imageLoader.src = img.src;
            }, index * 50);
        };

        // Use requestIdleCallback if available, otherwise setTimeout
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                images.forEach((img, index) => preloadImage(img, index));
            });
        } else {
            setTimeout(() => {
                images.forEach((img, index) => preloadImage(img, index));
            }, 100);
        }
    }

    optimizePerformance() {
        if (!this.track) return;
        
        // Use will-change strategically
        this.track.style.willChange = 'transform';
        
        // Use transform3d for hardware acceleration
        this.track.style.transform = 'translate3d(0, 0, 0)';
        this.track.style.backfaceVisibility = 'hidden';
        this.track.style.perspective = '1000px';
        
        // Optimize individual logo slides
        const logoSlides = this.track.querySelectorAll('.logo-slide');
        logoSlides.forEach(slide => {
            slide.style.willChange = 'transform';
            slide.style.backfaceVisibility = 'hidden';
        });
        
        // Remove will-change after animation is established to save memory
        setTimeout(() => {
            if (this.track && !this.isManualScroll) {
                this.track.style.willChange = 'auto';
                logoSlides.forEach(slide => {
                    slide.style.willChange = 'auto';
                });
            }
        }, 1000);
        
        // Add performance hints
        if (this.wrapper) {
            this.wrapper.style.contain = 'layout style paint';
        }
    }

    // Public methods for external control
    pause() {
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
    }

    play() {
        if (this.track && !this.isHovered && !document.hidden && !this.isManualScroll) {
            this.track.style.animationPlayState = 'running';
        }
    }

    destroy() {
        // Clean up event listeners and observers
        if (this.wrapper && this.handleMouseEnter && this.handleMouseLeave) {
            this.wrapper.removeEventListener('mouseenter', this.handleMouseEnter);
            this.wrapper.removeEventListener('mouseleave', this.handleMouseLeave);
        }
        
        if (this.handleVisibilityChange) {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }

        if (this.handleReducedMotion) {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            mediaQuery.removeEventListener('change', this.handleReducedMotion);
        }

        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }

        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        if (this.autoScrollResumeTimeout) {
            clearTimeout(this.autoScrollResumeTimeout);
        }

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Clean up touch/mouse events
        if (this.wrapper) {
            // Remove all event listeners
            const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'contextmenu'];
            events.forEach(event => {
                this.wrapper.removeEventListener(event, this[`handle${event.charAt(0).toUpperCase() + event.slice(1)}`]);
            });
        }

        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        // Reset will-change properties
        if (this.track) {
            this.track.style.willChange = 'auto';
            const logoSlides = this.track.querySelectorAll('.logo-slide');
            logoSlides.forEach(slide => {
                slide.style.willChange = 'auto';
            });
        }
    }
}

/**
 * Stats Animation Component
 * Animates numbers with counting effect when stats come into view
 */
class StatsAnimator {
    constructor() {
        this.statsItems = document.querySelectorAll('.stat-item');
        this.animated = new Set(); // Track which stats have been animated
        this.init();
    }

    init() {
        if (this.statsItems.length === 0) {
            console.log('No stats items found');
            return;
        }

        // Set up intersection observer to trigger animation when stats are visible
        this.setupIntersectionObserver();
        
        // Add enhanced click effects
        this.addClickEffects();
        
        console.log(`✅ Stats Animator initialized for ${this.statsItems.length} items`);
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5, // Trigger when 50% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly earlier
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateStatItem(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, options);

        // Observe all stats items
        this.statsItems.forEach(item => {
            this.observer.observe(item);
        });
    }

    animateStatItem(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        const iconElement = statItem.querySelector('.stat-icon');
        const labelElement = statItem.querySelector('.stat-label');

        if (!numberElement) return;

        // Extract the target number from the text content
        const text = numberElement.textContent.trim();
        const match = text.match(/(\d+)/);
        
        if (!match) return;

        const targetNumber = parseInt(match[1]);
        const suffix = text.replace(match[1], ''); // Get the '+' or other suffix
        
        // Animate the number counting up
        this.animateCounter(numberElement, 0, targetNumber, suffix, 1500);

        // Add extra animations with delays
        setTimeout(() => {
            if (iconElement) {
                iconElement.style.animation = 'iconFloat 3s ease-in-out infinite, statIconPop 0.6s ease-out';
            }
        }, 500);

        setTimeout(() => {
            if (labelElement) {
                labelElement.style.opacity = '1';
                labelElement.style.transform = 'translateY(0)';
            }
        }, 800);

        // Add a subtle pulse effect to the entire card
        setTimeout(() => {
            statItem.style.animation = 'statCardEntrance 0.8s ease-out forwards, statCardPulse 2s ease-in-out';
        }, 200);
    }

    animateCounter(element, start, end, suffix, duration) {
        const startTime = performance.now();
        const range = end - start;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeProgress = this.easeOutCubic(progress);
            const current = Math.floor(start + (range * easeProgress));
            
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure we end with the exact target
                element.textContent = end + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    addClickEffects() {
        this.statsItems.forEach(item => {
            item.addEventListener('click', () => {
                // Add click ripple effect
                this.createRippleEffect(item);
            });
        });
    }

    createRippleEffect(element) {
        // Remove existing ripples
        const existingRipples = element.querySelectorAll('.ripple');
        existingRipples.forEach(ripple => ripple.remove());

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Easing functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Public methods
    replay() {
        // Reset animations and replay
        this.animated.clear();
        this.statsItems.forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            if (numberElement) {
                // Reset the number and trigger animation again
                numberElement.textContent = '0+';
                this.animateStatItem(item);
            }
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Additional CSS animations to be injected
function injectStatsAnimationCSS() {
    const css = `
        @keyframes statIconPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2) rotate(10deg); }
            100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes statCardPulse {
            0%, 100% { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
            50% { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2); }
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .stat-item {
            cursor: pointer;
        }

        .stat-item:active {
            transform: translateY(-5px) scale(0.98);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .stat-item,
            .stat-icon,
            .stat-number,
            .stat-label {
                animation: none !important;
                transition: none !important;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Initialize Stats Animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject additional CSS
    injectStatsAnimationCSS();
    
    // Initialize stats animator with a delay to ensure elements are ready
    setTimeout(() => {
        window.statsAnimator = new StatsAnimator();
        console.log('✅ Stats Animator initialized successfully');
    }, 200);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsAnimator, injectStatsAnimationCSS };
}

/**
 * Compact Join Us Section Controller
 * Simple and efficient interactions for the compact CTA section
 */
class CompactJoinUsSection {
    constructor() {
        this.section = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.section = document.querySelector('.join-us-section');
        if (!this.section) return;

        this.setupButtonEnhancements();
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        observer.observe(this.section);
    }

    setupButtonEnhancements() {
        const buttons = this.section.querySelectorAll('.join-us-btn');
        
        buttons.forEach(button => {
            // Add click effect
            button.addEventListener('click', (e) => {
                this.createClickEffect(e, button);
            });

            // Add subtle hover feedback
            button.addEventListener('mouseenter', () => {
                button.style.transition = 'all 0.3s ease';
            });
        });
    }

    createClickEffect(event, button) {
        // Simple ripple effect for user feedback
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: compactRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Inject minimal CSS for the compact section
function injectCompactJoinUsCSS() {
    const css = `
        @keyframes compactRipple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .join-us-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .join-us-btn {
            position: relative;
            overflow: hidden;
        }
        
        /* Reduced motion fallback */
        @media (prefers-reduced-motion: reduce) {
            .join-us-btn {
                transition: none !important;
                animation: none !important;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject minimal CSS
    injectCompactJoinUsCSS();
    
    // Initialize the compact join us section
    setTimeout(() => {
        new CompactJoinUsSection();
    }, 100);
});
