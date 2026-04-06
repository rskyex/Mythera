/* =============================================
   MYTHERA — Interaction layer
   ============================================= */

(function () {
  'use strict';

  /* Scroll Reveal */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.philosophy__heading, .philosophy__text, .philosophy__principle, ' +
      '.realm__panel, ' +
      '.works__heading, .work, ' +
      '.archive__heading, .archive__intro, .archive__branch, .archive__coda, ' +
      '.forms__heading, .forms__intro, .forms__field, ' +
      '.closing__mark, .closing__statement, .closing__links'
    );

    targets.forEach(function (el) { el.classList.add('reveal'); });

    var grid = document.querySelector('.works__grid');
    if (grid) grid.classList.add('reveal-stagger');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* Hero parallax */
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var layers = hero.querySelectorAll('[data-parallax]');
    if (!layers.length) return;
    var heroH = hero.offsetHeight;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < heroH * 1.3) {
          layers.forEach(function (l) {
            var r = parseFloat(l.getAttribute('data-parallax')) || 0;
            l.style.transform = 'translate3d(0,' + (y * r) + 'px,0)';
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* Hero fade */
  function initHeroFade() {
    var content = document.querySelector('.hero__content');
    var cue = document.querySelector('.hero__scroll-cue');
    if (!content) return;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var p = Math.min(1, y / 700);
        content.style.opacity = Math.max(0, 1 - p * p);
        if (cue) cue.style.opacity = Math.max(0, (1 - Math.min(1, y / 250)) * 0.4);
        ticking = false;
      });
    }, { passive: true });
  }

  /* Realm image parallax */
  function initRealmParallax() {
    var imgs = document.querySelectorAll('.realm__img[data-parallax]');
    if (!imgs.length) return;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        imgs.forEach(function (img) {
          var rect = img.parentElement.parentElement.getBoundingClientRect();
          if (rect.bottom < -100 || rect.top > vh + 100) return;
          var progress = 1 - (rect.top + rect.height) / (vh + rect.height);
          progress = Math.max(0, Math.min(1, progress));
          var shift = (progress - 0.5) * 30;
          img.style.transform = 'translate3d(0,' + shift + 'px,0) scale(1.06)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* Work panel tilt */
  function initPanelTilt() {
    document.querySelectorAll('.work').forEach(function (panel) {
      panel.addEventListener('mousemove', function (e) {
        var rect = panel.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        panel.style.transform = 'translateY(-3px) rotateY(' + (x * 2.5) + 'deg) rotateX(' + (-y * 2.5) + 'deg)';
      });
      panel.addEventListener('mouseleave', function () {
        panel.style.transform = '';
      });
    });
  }

  /* Init */
  document.addEventListener('DOMContentLoaded', function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initScrollReveal();
    if (!reduced) {
      initHeroParallax();
      initHeroFade();
      initRealmParallax();
      initPanelTilt();
    }
  });

})();
