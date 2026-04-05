/* =============================================
   MYTHERA — Phase 1: Minimal interaction layer
   ============================================= */

(function () {
  'use strict';

  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.manifesto__lead, .manifesto__body, ' +
      '.realm__content, ' +
      '.section__heading, .work, ' +
      '.forms-field, ' +
      '.closing__symbol, .closing__statement, .closing__links'
    );

    targets.forEach(function (el) {
      el.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
  });
})();
