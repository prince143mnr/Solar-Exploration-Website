/**
 * COSMOS — STARS & SHOOTING STARS ENGINE
 * js/stars.js
 */

(function () {
  'use strict';

  // --- Canvas Starfield Engine ---
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animationFrameId;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function getStarCount() {
    if (window.innerWidth < 768) return 250;
    if (window.innerWidth < 1200) return 500;
    return 850;
  }

  function initStars() {
    stars = [];
    const count = getStarCount();
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.3,
        baseAlpha: Math.random() * 0.7 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: getRandomStarColor(),
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08
      });
    }
  }

  function getRandomStarColor() {
    const colors = [
      'rgba(248, 250, 252,', // Pure white
      'rgba(34, 211, 238,',  // Cyan tint
      'rgba(0, 168, 255,',   // Cosmic blue tint
      'rgba(216, 180, 254,'  // Subtle purple tint
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Twinkle calculation
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) {
        s.alpha = 1;
        s.twinkleDir = -1;
      } else if (s.alpha <= 0.2) {
        s.alpha = 0.2;
        s.twinkleDir = 1;
      }

      // Subtle slow motion
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color} ${s.alpha})`;
      ctx.shadowBlur = s.size > 1.2 ? 6 : 0;
      ctx.shadowColor = 'rgba(0, 168, 255, 0.8)';
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(renderStars);
  }

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });

  initStars();
  renderStars();

  // --- Dynamic Shooting Star System ---
  let shootingContainer = document.querySelector('.shooting-star-container');
  if (!shootingContainer) {
    shootingContainer = document.createElement('div');
    shootingContainer.className = 'shooting-star-container';
    document.body.appendChild(shootingContainer);
  }

  const MAX_ACTIVE_SHOOTING_STARS = 4;
  let activeStarsCount = 0;

  function spawnShootingStar() {
    if (activeStarsCount >= MAX_ACTIVE_SHOOTING_STARS) return;
    if (document.hidden) return;

    activeStarsCount++;
    const starEl = document.createElement('div');
    starEl.className = 'shooting-star';

    // Random start coordinates (upper-left quadrant bias for natural meteor shower angle)
    const startX = Math.random() * (window.innerWidth * 0.85);
    const startY = Math.random() * (window.innerHeight * 0.45);
    const angle = Math.floor(Math.random() * 20) + 30; // 30-50 deg angle
    const duration = (Math.random() * 0.8 + 0.9).toFixed(2); // 0.9s to 1.7s

    starEl.style.left = `${startX}px`;
    starEl.style.top = `${startY}px`;
    starEl.style.transform = `rotate(${angle}deg)`;
    starEl.style.animationDuration = `${duration}s`;

    shootingContainer.appendChild(starEl);

    setTimeout(() => {
      if (starEl.parentNode) {
        starEl.parentNode.removeChild(starEl);
      }
      activeStarsCount--;
    }, duration * 1000 + 100);
  }

  // Schedule shooting stars randomly between 2.5s and 6s
  function scheduleNextShootingStar() {
    const delay = Math.random() * 3500 + 2000;
    setTimeout(() => {
      spawnShootingStar();
      scheduleNextShootingStar();
    }, delay);
  }

  scheduleNextShootingStar();
})();
