/**
 * COSMOS — PARALLAX, 3D CARD TILT & SCROLL REVEAL ENGINE
 * js/parallax.js
 */

(function () {
  'use strict';

  // --- 1. Mouse Parallax Engine for Deep Space Layers ---
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const layers = document.querySelectorAll('[data-parallax-depth]');
    if (!layers.length) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX = (e.clientX - centerX);
      mouseY = (e.clientY - centerY);
    }, { passive: true });

    function renderParallax() {
      // Smooth interpolation (lerp)
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 0.02;
        const moveX = currentX * depth;
        const moveY = currentY * depth;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

  // --- 2. 3D Card Tilt Framework (Apple / Interstellar Polish) ---
  window.initTiltCards = function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s ease-out';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  };

  // --- 3. Scroll Reveal System ---
  window.observeRevealElements = function () {
    const targets = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach((target) => observer.observe(target));
  };

  // --- 4. Number Counter System ---
  function initNumberCounters() {
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetStr = el.getAttribute('data-target');
          const isDecimal = targetStr.includes('.');
          const targetNum = parseFloat(targetStr);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetNum * easeProgress;

            el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${targetStr}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    window.initTiltCards();
    window.observeRevealElements();
    initNumberCounters();
  });
})();
