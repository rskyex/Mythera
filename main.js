/* =============================================
   MYTHERA — Scroll-based editorial experience
   ============================================= */

(function () {
  'use strict';

  var body = document.body;


  /* ---- Nav smooth scrolling ---- */

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var action = link.getAttribute('data-nav');
      if (action === 'home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (action === 'realms' || action === 'works' || action === 'about') {
        e.preventDefault();
        var target = document.getElementById(action);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ---- Scroll Reveal ---- */

  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.about__label, .about__text, .about__creator, ' +
      '.realms__heading, .realm-card, ' +
      '.works__heading, .work-card'
    );

    targets.forEach(function (el) { el.classList.add('reveal'); });

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


  /* ---- Hero parallax + fade ---- */

  function initHeroEffects() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var layers = hero.querySelectorAll('[data-parallax]');
    var content = hero.querySelector('.hero__content');
    var cue = hero.querySelector('.hero__scroll-cue');
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
          if (content) {
            var p = Math.min(1, y / 700);
            content.style.opacity = Math.max(0, 1 - p * p);
          }
          if (cue) {
            cue.style.opacity = Math.max(0, (1 - Math.min(1, y / 250)) * 0.4);
          }
        }
        ticking = false;
      });
    }, { passive: true });
  }


  /* ---- Init ---- */

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      initHeroEffects();
    }
  });

})();
