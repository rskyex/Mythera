/* =============================================
   MYTHERA — Interaction layer
   ============================================= */

(function () {
  'use strict';

  /* ---- Scroll Reveal ---- */

  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.manifesto__lead, .manifesto__body, ' +
      '.realm__content, ' +
      '.section__heading, .work, ' +
      '.archive__intro, .archive__branch, .archive__coda, ' +
      '.forms__intro, .forms-field, ' +
      '.closing__rule, .closing__statement, .closing__links'
    );

    targets.forEach(function (el) {
      el.classList.add('reveal');
    });

    // Mark works list for staggered reveal
    var worksList = document.querySelector('.works-list');
    if (worksList) worksList.classList.add('reveal-stagger');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }


  /* ---- Hero Parallax (multi-layer) ---- */

  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var layers = hero.querySelectorAll('[data-parallax]');
    if (!layers.length) return;

    var heroHeight = hero.offsetHeight;
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        var scrollY = window.scrollY;

        // Only animate while hero is in view
        if (scrollY < heroHeight * 1.2) {
          layers.forEach(function (layer) {
            var rate = parseFloat(layer.getAttribute('data-parallax')) || 0;
            var offset = scrollY * rate;
            layer.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
          });
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ---- Hero content fade on scroll ---- */

  function initHeroFade() {
    var content = document.querySelector('.hero__content');
    var scrollCue = document.querySelector('.hero__scroll-cue');
    if (!content) return;

    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        var scrollY = window.scrollY;
        // Ease-out curve for smoother fade
        var progress = Math.min(1, scrollY / 700);
        var opacity = 1 - progress * progress;
        content.style.opacity = Math.max(0, opacity);

        if (scrollCue) {
          var cueProgress = Math.min(1, scrollY / 250);
          scrollCue.style.opacity = Math.max(0, (1 - cueProgress) * 0.5);
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ---- Threshold depth animation ---- */

  function initThresholds() {
    var thresholds = document.querySelectorAll('.threshold');
    if (!thresholds.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
          }
        });
      },
      { threshold: 0.3 }
    );

    thresholds.forEach(function (t) {
      t.style.opacity = '0.6';
      t.style.transition = 'opacity 1.5s ease';
      observer.observe(t);
    });
  }


  /* ---- Realm ambient parallax ---- */

  function initRealmDepth() {
    var realms = document.querySelectorAll('.realm');
    if (!realms.length || !('IntersectionObserver' in window)) return;

    var ticking = false;

    function updateRealms() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        realms.forEach(function (realm) {
          var rect = realm.getBoundingClientRect();
          var vh = window.innerHeight;

          // Only process when in view
          if (rect.bottom < 0 || rect.top > vh) {
            ticking = false;
            return;
          }

          // Progress: 0 when entering bottom, 1 when leaving top
          var progress = 1 - (rect.top + rect.height) / (vh + rect.height);
          progress = Math.max(0, Math.min(1, progress));

          // Subtle shift on the texture layer
          var texture = realm.querySelector('.realm__texture');
          if (texture) {
            var shift = (progress - 0.5) * 15; // max ±7.5px
            texture.style.transform = 'translate3d(0, ' + shift + 'px, 0) scale(1.05)';
          }
        });

        ticking = false;
      });
    }

    window.addEventListener('scroll', updateRealms, { passive: true });
    updateRealms();
  }


  /* ---- Initialize ---- */

  document.addEventListener('DOMContentLoaded', function () {
    // Respect reduced motion
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initScrollReveal();

    if (!prefersReducedMotion) {
      initHeroParallax();
      initHeroFade();
      initThresholds();
      initRealmDepth();
    }
  });

})();
