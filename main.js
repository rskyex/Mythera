/* =============================================
   MYTHERA — Click-based world interaction
   ============================================= */

(function () {
  'use strict';

  var body = document.body;
  var depth = document.getElementById('depth');
  var surface = document.getElementById('surface');

  /* ---- View state ---- */

  function enterDepth(realmId) {
    // Hide all chambers, show the right one
    document.querySelectorAll('.chamber').forEach(function (c) {
      c.classList.remove('is-active');
    });
    var chamber = document.querySelector('[data-chamber="' + realmId + '"]');
    if (chamber) chamber.classList.add('is-active');

    // Close any open workviews
    document.querySelectorAll('.workview.is-active').forEach(function (w) {
      w.classList.remove('is-active');
    });

    // Update realm nav active state
    document.querySelectorAll('.depth__realm-link').forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-realm') === realmId);
    });

    // Transition
    body.classList.add('in-depth');
    depth.setAttribute('aria-hidden', 'false');
    depth.scrollTop = 0;

    // Push state so browser back works
    history.pushState({ realm: realmId }, '', '#realm-' + realmId);
  }

  function exitDepth() {
    body.classList.remove('in-depth');
    depth.setAttribute('aria-hidden', 'true');

    // Close workviews
    document.querySelectorAll('.workview.is-active').forEach(function (w) {
      w.classList.remove('is-active');
    });

    history.pushState({}, '', '#gateway');
  }

  function openWork(workId) {
    // Close any other open workview in same chamber
    var activeChamber = document.querySelector('.chamber.is-active');
    if (!activeChamber) return;
    activeChamber.querySelectorAll('.workview.is-active').forEach(function (w) {
      w.classList.remove('is-active');
    });

    var view = activeChamber.querySelector('[data-workview="' + workId + '"]');
    if (view) view.classList.add('is-active');
  }

  function closeWork() {
    document.querySelectorAll('.workview.is-active').forEach(function (w) {
      w.classList.remove('is-active');
    });
  }


  /* ---- Event listeners ---- */

  // Portal clicks → enter realm
  document.querySelectorAll('[data-realm]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      enterDepth(btn.getAttribute('data-realm'));
    });
  });

  // Back button
  document.querySelectorAll('[data-back]').forEach(function (btn) {
    btn.addEventListener('click', exitDepth);
  });

  // Realm nav links within depth (switch between realms)
  document.querySelectorAll('.depth__realm-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-realm');
      enterDepth(id);
    });
  });

  // Work node clicks → open work detail
  document.querySelectorAll('[data-work]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openWork(btn.getAttribute('data-work'));
    });
  });

  // Close work detail
  document.querySelectorAll('[data-close-work]').forEach(function (btn) {
    btn.addEventListener('click', closeWork);
  });

  // Nav links
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var action = link.getAttribute('data-nav');
      if (action === 'home') {
        e.preventDefault();
        if (body.classList.contains('in-depth')) exitDepth();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (action === 'gateway') {
        e.preventDefault();
        if (body.classList.contains('in-depth')) exitDepth();
        setTimeout(function () {
          document.getElementById('gateway').scrollIntoView({ behavior: 'smooth' });
        }, body.classList.contains('in-depth') ? 600 : 0);
      } else if (action === 'all-works') {
        e.preventDefault();
        // Enter realm 1 as default works view
        enterDepth('1');
      }
    });
  });

  // Browser back/forward
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.realm) {
      enterDepth(e.state.realm);
    } else {
      if (body.classList.contains('in-depth')) {
        body.classList.remove('in-depth');
        depth.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Escape key closes depth or workview
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openWork = document.querySelector('.workview.is-active');
      if (openWork) {
        closeWork();
      } else if (body.classList.contains('in-depth')) {
        exitDepth();
      }
    }
  });


  /* ---- Scroll Reveal (surface only) ---- */

  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.threshold__label, .threshold__text, .threshold__warning, ' +
      '.gateway__heading, .gateway__subtitle, .portal, ' +
      '.closing__mark, .closing__statement, .closing__links'
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
      if (ticking || body.classList.contains('in-depth')) return;
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

    // Handle direct URL entry with hash
    var hash = window.location.hash;
    if (hash.startsWith('#realm-')) {
      var id = hash.replace('#realm-', '');
      enterDepth(id);
    }
  });

})();
