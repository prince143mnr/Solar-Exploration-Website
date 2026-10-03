/**
 * COSMOS — AMBIENT COSMIC DUST & PARTICLES ENGINE
 * js/particles.js
 */

(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let mouse = { x: width / 2, y: height / 2, moved: false };

  function getParticleCount() {
    if (window.innerWidth < 768) return 35;
    return 75;
  }

  class CosmicParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15); // Upward float
      this.alpha = Math.random() * 0.5 + 0.1;
      this.maxAlpha = this.alpha;
      this.hue = Math.random() > 0.6 ? 195 : 270; // Cyan or violet
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse influence on desktop
      if (mouse.moved && window.innerWidth > 991) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.8)`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      particles.push(new CosmicParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }, 150);
  });

  initParticles();
  animate();
})();
