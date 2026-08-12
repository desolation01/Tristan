/**
 * Animations v5.0 — 2026 trends
 * Emil Kowalski's design-engineering principles + Lenis smooth scroll.
 * - Custom ease-out curves, UI micro-interactions under 300ms
 * - Stagger 30-80ms between items
 * - Scale from 0.96+, never from 0
 * - Animate transform + opacity only (GPU)
 * - prefers-reduced-motion: reduce, not remove
 * - Lenis lerp 0.1 (bright but responsive); disabled for reduced-motion
 */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

class PortfolioAnimations {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.lenis = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded');
      return;
    }

    this.setupSmoothScroll();
    this.setupScrollProgress();
    this.setupSmoothScrolling();

    if (this.prefersReducedMotion) {
      this.setupReducedMotion();
      return;
    }

    this.setupEntrance();
    this.setupSplitText();
    this.setupScrollReveal();
    this.setupStagger();
    this.setupHeroParallax();

    if (this.canHover) {
      this.setupMagnetic();
    }
  }

  // Phase 1 — Lenis smooth / inertia scroll
  setupSmoothScroll() {
    if (this.prefersReducedMotion) return;
    if (typeof window.Lenis === 'undefined') return;

    this.lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });

    // Sync Lenis with GSAP's ticker + ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(frame => {
      this.lenis.raf(frame * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Entrance animation — the first thing users see
  setupEntrance() {
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.6
      }
    });

    tl.fromTo('.site-header',
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4 }
    );

    tl.fromTo('.hero-copy .eyebrow',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4 },
      0.15
    );

    // Subtitle
    tl.fromTo('.hero-subtitle',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.5
    );

    // CTA buttons stagger
    tl.fromTo('.hero-cta .btn',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
      '-=0.2'
    );

    // Hero meta items
    tl.fromTo('.hero-meta li',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
      '-=0.15'
    );

    // Hero card — scale in from 0.96; the parallax owns `y`
    tl.fromTo('.hero-card',
      { opacity: 0, scale: 0.96, rotateX: 4 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 0.6, transformPerspective: 900 },
      '-=0.35'
    );
  }

  // Phase 2 (signature moment) — word-by-word hero title reveal
  setupSplitText() {
    const lines = gsap.utils.toArray('.hero-title-line');
    if (!lines.length) return;

    lines.forEach((line) => {
      // Wrap each word so we can stagger them
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = '';
      line.setAttribute('aria-label', words.join(' '));

      words.forEach((word) => {
        const mask = document.createElement('span');
        mask.className = 'split-mask';
        const inner = document.createElement('span');
        inner.className = 'split-word';
        inner.textContent = word;
        mask.appendChild(inner);
        line.appendChild(mask);
        // trailing space
        line.appendChild(document.createTextNode(' '));
      });
    });

    gsap.fromTo('.split-mask > span',
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 0.85,
        ease: 'expo.out',
        stagger: 0.045,
        delay: 0.35,
      }
    );
  }

  // Scroll reveal — elements enter as you scroll down
  setupScrollReveal() {
    // Section headers
    gsap.utils.toArray('.section-head').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Timeline items — slide in from left only, subtle
    gsap.utils.toArray('.timeline-item').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // Stagger groups — items in grids enter with 50ms delay between each
  setupStagger() {
    this.staggerGroup('.project-grid .project-card', 0.06);
    this.staggerGroup('.skills-grid .skill-card', 0.05);
    this.staggerGroup('.contact-grid .card', 0.06);
    this.staggerGroup('.pill-list li', 0.03);
  }

  staggerGroup(selector, staggerDelay) {
    const items = gsap.utils.toArray(selector);
    if (!items.length) return;

    const parent = items[0].closest('.container') || items[0].parentElement;

    // Matches the hero-card entrance: scale from 0.96 with a shallow rotateX pop.
    gsap.fromTo(items,
      { opacity: 0, scale: 0.96, rotateX: 4 },
      {
        opacity: 1, scale: 1, rotateX: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: staggerDelay,
        transformPerspective: 900,
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Hero card drifts with scroll for depth
  setupHeroParallax() {
    // Note: CSS orb-drift keyframes own the ::before/::after transform,
    // so they render under the ambient drift — only the card parallax is scroll-driven here.
    gsap.to('.hero-card', {
      y: -24,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Magnetic pull on primary buttons
  setupMagnetic() {
    gsap.utils.toArray('.btn-magnetic').forEach(btn => {
      const strength = 0.3;
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' });

      let rect = null;

      btn.addEventListener('mouseenter', () => {
        rect = btn.getBoundingClientRect();
      });

      btn.addEventListener('mousemove', e => {
        if (!rect) return;
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      });

      btn.addEventListener('mouseleave', () => {
        rect = null;
        xTo(0);
        yTo(0);
      });
    });
  }

  // Scroll progress bar at the top
  setupScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        scrub: 0.3
      }
    });
  }

  // Reduced motion: fade only, no position changes
  setupReducedMotion() {
    gsap.utils.toArray('.section-head, .card, .timeline-item, .hero-copy, .hero-card').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const header = document.querySelector('.site-header');
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        if (this.lenis) {
          this.lenis.scrollTo(top, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
        } else {
          window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        }
      });
    });
  }
}

if (typeof gsap !== 'undefined') {
  const animations = new PortfolioAnimations();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 250);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
}

// Header scroll state
const _headerEl = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (_headerEl) {
    _headerEl.classList.toggle('scrolled', window.scrollY > 50);
  }
}, { passive: true });