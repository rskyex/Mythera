/* =============================================
   MYTHERA — Minimal interaction layer
   ============================================= */

(function () {
  'use strict';

  // Intersection Observer for fade-in animations
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.section__heading, .section__text, .world, .enter-form, .hero__title, .hero__subtitle, .hero__line'
    );

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      targets.forEach(function (el) {
        el.classList.add('fade-in');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    targets.forEach(function (el, i) {
      // Stagger delay classes
      var delayClass = 'fade-in--delay-' + ((i % 3) + 1);
      el.classList.add(delayClass);
      observer.observe(el);
    });
  }

  // Subtle parallax on hero title
  function initHeroParallax() {
    var hero = document.querySelector('.hero__title');
    if (!hero) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          var offset = scrollY * 0.08;
          var opacity = Math.max(0, 1 - scrollY / 800);
          hero.style.transform = 'translateY(' + offset + 'px)';
          hero.style.opacity = opacity;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initHeroParallax();
  });
})();
