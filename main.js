/* =============================================
   MYTHERA — Immersive interaction layer
   ============================================= */

(function () {
  'use strict';

  /* ---- Scroll Reveal ---- */

  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.manifesto__lead, .manifesto__body, ' +
      '.realm__content, ' +
      '.section__heading, .work-panel, ' +
      '.archive__intro, .archive__branch, .archive__coda, ' +
      '.forms__intro, .forms-field, ' +
      '.closing__mark, .closing__statement, .closing__links'
    );

    targets.forEach(function (el) { el.classList.add('reveal'); });

    var worksGrid = document.querySelector('.works-grid');
    if (worksGrid) worksGrid.classList.add('reveal-stagger');

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


  /* ---- Hero Parallax ---- */

  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var layers = hero.querySelectorAll('[data-parallax]');
    if (!layers.length) return;

    var heroH = hero.offsetHeight;
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < heroH * 1.3) {
          layers.forEach(function (layer) {
            var rate = parseFloat(layer.getAttribute('data-parallax')) || 0;
            layer.style.transform = 'translate3d(0,' + (y * rate) + 'px,0)';
          });
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ---- Hero content fade ---- */

  function initHeroFade() {
    var content = document.querySelector('.hero__content');
    var cue = document.querySelector('.hero__scroll-cue');
    if (!content) return;

    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var p = Math.min(1, y / 700);
        content.style.opacity = Math.max(0, 1 - p * p);
        if (cue) cue.style.opacity = Math.max(0, (1 - Math.min(1, y / 250)) * 0.4);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ---- Mouse drift for hero 3D objects ---- */

  function initMouseDrift() {
    var driftEls = document.querySelectorAll('[data-drift]');
    if (!driftEls.length) return;

    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var ticking = false;

    document.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var dx = (e.clientX - cx) / cx;
        var dy = (e.clientY - cy) / cy;

        driftEls.forEach(function (el) {
          var rate = parseFloat(el.getAttribute('data-drift')) || 0;
          var rect = el.getBoundingClientRect();
          // Only drift if element is in viewport
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            var x = dx * rate * 100;
            var y = dy * rate * 80;
            el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
          }
        });

        ticking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', function () {
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
    });
  }


  /* ---- Realm image parallax ---- */

  function initRealmDepth() {
    var realms = document.querySelectorAll('.realm');
    if (!realms.length) return;

    var ticking = false;

    function update() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        realms.forEach(function (realm) {
          var rect = realm.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) { return; }

          var progress = 1 - (rect.top + rect.height) / (vh + rect.height);
          progress = Math.max(0, Math.min(1, progress));

          var img = realm.querySelector('.realm__image');
          if (img) {
            var shift = (progress - 0.5) * 20;
            img.style.transform = 'translate3d(0,' + shift + 'px,0) scale(1.08)';
          }
        });
        ticking = false;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ---- Work panel tilt on hover ---- */

  function initPanelTilt() {
    var panels = document.querySelectorAll('.work-panel');
    panels.forEach(function (panel) {
      panel.addEventListener('mousemove', function (e) {
        var rect = panel.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        panel.style.transform =
          'translateY(-4px) rotateY(' + (x * 3) + 'deg) rotateX(' + (-y * 3) + 'deg)';
      });

      panel.addEventListener('mouseleave', function () {
        panel.style.transform = '';
      });
    });
  }


  /* ---- Initialize ---- */

  document.addEventListener('DOMContentLoaded', function () {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initScrollReveal();

    if (!reducedMotion) {
      initHeroParallax();
      initHeroFade();
      initMouseDrift();
      initRealmDepth();
      initPanelTilt();
    }
  });

})();
