/* ===================================================
   WEDDING PAGE — INTERACTIVITY
   - Password gate (static keyword check)
   - Scroll-reveal via Intersection Observer
   =================================================== */

(function () {
  'use strict';

  // ---------- CONFIG ----------
  // ✏️ Pakeiskite slaptažodį čia, jei reikia
  var PASSWORD = 'rodykprivaciainformacija';
  var STORAGE_KEY = 'wedding_unlocked';

  // ---------- DOM ----------
  var gate     = document.getElementById('password-gate');
  var input    = document.getElementById('password-input');
  var btn      = document.getElementById('password-btn');
  var error    = document.getElementById('password-error');
  var privates = document.querySelectorAll('.private-section');

  // ---------- UNLOCK LOGIC ----------
  function unlock() {
    // Reveal every private section
    for (var i = 0; i < privates.length; i++) {
      privates[i].classList.add('unlocked');
    }
    // Hide the password gate
    gate.style.display = 'none';
    // Remember for this session
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ok */ }
    // Trigger reveal animations for newly visible elements
    observeRevealElements();
  }

  function tryPassword() {
    var value = (input.value || '').trim().toLowerCase();
    if (value === PASSWORD.toLowerCase()) {
      unlock();
    } else {
      error.classList.add('visible');
      input.focus();
      // Remove error after a moment
      setTimeout(function () {
        error.classList.remove('visible');
      }, 2500);
    }
  }

  // Button click
  btn.addEventListener('click', tryPassword);

  // Enter key
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryPassword();
  });

  // Auto-unlock if already authenticated in this session
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      unlock();
    }
  } catch (e) { /* ok */ }

  // ---------- SCROLL REVEAL ----------
  function observeRevealElements() {
    var reveals = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      for (var i = 0; i < reveals.length; i++) {
        reveals[i].classList.add('visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    for (var j = 0; j < reveals.length; j++) {
      observer.observe(reveals[j]);
    }
  }

  // Initial observation for public sections
  observeRevealElements();

})();
