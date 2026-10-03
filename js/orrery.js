/**
 * COSMOS — CINEMATIC GRAND CELESTIAL ORRERY SIMULATION
 * High-performance, high-precision orbital physics and rendering engine
 * js/orrery.js
 */

(function () {
  'use strict';

  const canvas = document.getElementById('orrery-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  let dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;

  // Configuration & Simulation State
  const state = {
    warpMultiplier: 1,
    isPaused: false,
    showOrbits: true,
    showLabels: true,
    showTrails: true,
    viewMode: '3d', // '3d' or 'top'
    tiltAngle: 0.48, // Radian compression for 3D tilt perspective
    rotationYaw: 0,
    selectedPlanet: null,
    hoveredPlanet: null,
    scale: 1,
    panX: 0,
    panY: 0
  };

  // Planetary Orbital Data (Scaled dynamically to fit viewport while preserving Keplerian hierarchy)
  const PLANET_DEFINITIONS = [
    {
      id: 'mercury',
      name: 'Mercury',
      orbitRadius: 85,
      radius: 5,
      speed: 4.15, // Speed relative to Earth (1 / 0.24)
      color: '#CBD5E1',
      glow: 'rgba(148, 163, 184, 0.6)',
      angle: 0.5,
      trail: [],
      info: {
        type: 'Terrestrial World',
        distAU: '0.39 AU (57.9M km)',
        velocity: '47.4 km/s',
        temp: '-180°C to 430°C',
        moons: '0'
      }
    },
    {
      id: 'venus',
      name: 'Venus',
      orbitRadius: 130,
      radius: 8,
      speed: 1.62, // 1 / 0.62
      color: '#FDE68A',
      atmosphere: 'rgba(217, 119, 6, 0.4)',
      glow: 'rgba(217, 119, 6, 0.7)',
      angle: 1.8,
      trail: [],
      info: {
        type: 'Toxic Greenhouse',
        distAU: '0.72 AU (108.2M km)',
        velocity: '35.0 km/s',
        temp: '465°C',
        moons: '0'
      }
    },
    {
      id: 'earth',
      name: 'Earth',
      orbitRadius: 185,
      radius: 9,
      speed: 1.0, // Baseline: 1 Earth Year
      color: '#38BDF8',
      atmosphere: 'rgba(34, 211, 238, 0.5)',
      glow: 'rgba(56, 189, 248, 0.8)',
      angle: 3.2,
      trail: [],
      hasMoon: true,
      moonAngle: 0,
      info: {
        type: 'Living Blue Oasis',
        distAU: '1.00 AU (149.6M km)',
        velocity: '29.8 km/s',
        temp: '15°C Mean',
        moons: '1 (The Moon)'
      }
    },
    {
      id: 'mars',
      name: 'Mars',
      orbitRadius: 240,
      radius: 6.5,
      speed: 0.53, // 1 / 1.88
      color: '#F87171',
      atmosphere: 'rgba(220, 38, 38, 0.35)',
      glow: 'rgba(220, 38, 38, 0.7)',
      angle: 4.6,
      trail: [],
      hasMoons: true, // Phobos & Deimos
      moonsAngle: 0,
      info: {
        type: 'The Crimson Frontier',
        distAU: '1.52 AU (227.9M km)',
        velocity: '24.1 km/s',
        temp: '-60°C Mean',
        moons: '2 (Phobos, Deimos)'
      }
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      orbitRadius: 335,
      radius: 22,
      speed: 0.28, // Visually scaled for magnificent cinematic pace
      color: '#FBBF24',
      glow: 'rgba(217, 119, 6, 0.7)',
      angle: 0.2,
      trail: [],
      isGasGiant: true,
      hasGalileanMoons: true,
      moonsAngle: 0,
      info: {
        type: 'King of Planets (Gas Giant)',
        distAU: '5.20 AU (778.5M km)',
        velocity: '13.1 km/s',
        temp: '-110°C',
        moons: '95 Confirmed'
      }
    },
    {
      id: 'saturn',
      name: 'Saturn',
      orbitRadius: 430,
      radius: 17,
      speed: 0.18,
      color: '#FDE047',
      glow: 'rgba(202, 138, 4, 0.6)',
      angle: 2.1,
      trail: [],
      hasRings: true,
      info: {
        type: 'Ringed Wonder (Gas Giant)',
        distAU: '9.58 AU (1.43B km)',
        velocity: '9.7 km/s',
        temp: '-140°C',
        moons: '146 Confirmed'
      }
    },
    {
      id: 'uranus',
      name: 'Uranus',
      orbitRadius: 515,
      radius: 12,
      speed: 0.12,
      color: '#A7F3D0',
      glow: 'rgba(13, 148, 136, 0.6)',
      angle: 3.9,
      trail: [],
      hasTiltedRings: true,
      info: {
        type: 'Sideways Ice Giant',
        distAU: '19.2 AU (2.87B km)',
        velocity: '6.8 km/s',
        temp: '-224°C',
        moons: '28 Confirmed'
      }
    },
    {
      id: 'neptune',
      name: 'Neptune',
      orbitRadius: 590,
      radius: 11.5,
      speed: 0.08,
      color: '#60A5FA',
      glow: 'rgba(37, 99, 235, 0.7)',
      angle: 5.4,
      trail: [],
      info: {
        type: 'Supersonic Wind World',
        distAU: '30.1 AU (4.50B km)',
        velocity: '5.4 km/s',
        temp: '-218°C',
        moons: '16 Confirmed'
      }
    }
  ];

  // Asteroid Belt Particles (Orbiting between Mars & Jupiter)
  const ASTEROID_COUNT = 240;
  const asteroids = [];

  function initAsteroids() {
    asteroids.length = 0;
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      asteroids.push({
        orbitRadius: 265 + (Math.random() * 45 - 22),
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.15 + 0.35) * (Math.random() > 0.5 ? 1 : 1),
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.5 + 0.25
      });
    }
  }

  // Solar Prominence / Flares system
  let solarFlares = [];
  function initSolarFlares() {
    solarFlares = [];
    for (let i = 0; i < 12; i++) {
      solarFlares.push({
        angle: (i / 12) * Math.PI * 2,
        length: Math.random() * 14 + 10,
        speed: Math.random() * 0.02 + 0.01,
        width: Math.random() * 0.2 + 0.1
      });
    }
  }

  // Coordinate Projection Helper (handles 3D tilt perspective projection)
  function project(orbitRadius, angle) {
    const rawX = Math.cos(angle) * orbitRadius * state.scale;
    const rawY = Math.sin(angle) * orbitRadius * state.scale;

    // Apply tilt in 3D perspective mode
    const tiltMultiplier = state.viewMode === '3d' ? state.tiltAngle : 1;
    const projY = rawY * tiltMultiplier;

    return {
      x: centerX + rawX + state.panX,
      y: centerY + projY + state.panY,
      depthScale: state.viewMode === '3d' ? (1 + (rawY / 600) * 0.22) : 1
    };
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = Math.max(rect.height, 650);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    centerX = width / 2;
    centerY = height / 2;

    // Responsive scaling factor based on container width
    if (width < 600) {
      state.scale = 0.52;
    } else if (width < 900) {
      state.scale = 0.72;
    } else if (width < 1300) {
      state.scale = 0.88;
    } else {
      state.scale = 1.0;
    }
  }

  // --- RENDER METHODS ---

  // 1. Central Thermonuclear Sun
  let solarPulse = 0;
  function drawSun() {
    solarPulse += 0.03;
    const sunRadius = 34 * state.scale;
    const pulseFactor = Math.sin(solarPulse) * 3;

    ctx.save();
    ctx.translate(centerX + state.panX, centerY + state.panY);

    // Deep cosmic solar corona rays
    const coronaGrad = ctx.createRadialGradient(0, 0, sunRadius * 0.5, 0, 0, (sunRadius * 3.5) + pulseFactor);
    coronaGrad.addColorStop(0, 'rgba(255, 247, 237, 0.95)');
    coronaGrad.addColorStop(0.2, 'rgba(251, 191, 36, 0.7)');
    coronaGrad.addColorStop(0.45, 'rgba(234, 88, 12, 0.35)');
    coronaGrad.addColorStop(0.7, 'rgba(154, 52, 18, 0.12)');
    coronaGrad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(0, 0, (sunRadius * 3.5) + pulseFactor, 0, Math.PI * 2);
    ctx.fillStyle = coronaGrad;
    ctx.fill();

    // Solar Prominence / Flares
    for (let f of solarFlares) {
      f.angle += f.speed;
      const flLen = (sunRadius + f.length + Math.sin(solarPulse + f.angle * 3) * 5);
      const x1 = Math.cos(f.angle - f.width) * sunRadius;
      const y1 = Math.sin(f.angle - f.width) * sunRadius;
      const x2 = Math.cos(f.angle + f.width) * sunRadius;
      const y2 = Math.sin(f.angle + f.width) * sunRadius;
      const tipX = Math.cos(f.angle) * flLen;
      const tipY = Math.sin(f.angle) * flLen;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(tipX * 1.05, tipY * 1.05, tipX, tipY);
      ctx.quadraticCurveTo(x2 * 0.95, y2 * 0.95, x2, y2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.fill();
    }

    // Main incandescent core
    const coreGrad = ctx.createRadialGradient(-sunRadius * 0.25, -sunRadius * 0.25, sunRadius * 0.1, 0, 0, sunRadius);
    coreGrad.addColorStop(0, '#FFFFFF');
    coreGrad.addColorStop(0.2, '#FFFBEB');
    coreGrad.addColorStop(0.5, '#FBBF24');
    coreGrad.addColorStop(0.85, '#EA580C');
    coreGrad.addColorStop(1, '#9A3412');

    ctx.beginPath();
    ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#F59E0B';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label for Sun
    if (state.showLabels) {
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FDE68A';
      ctx.textAlign = 'center';
      ctx.fillText('THE SUN', 0, sunRadius + 22);
    }

    ctx.restore();
  }

  // 2. Orbital Lines
  function drawOrbitLines() {
    if (!state.showOrbits) return;

    ctx.save();
    const tilt = state.viewMode === '3d' ? state.tiltAngle : 1;

    for (let p of PLANET_DEFINITIONS) {
      const isHighlighted = (state.hoveredPlanet === p.id || state.selectedPlanet === p.id);
      const rad = p.orbitRadius * state.scale;

      ctx.beginPath();
      ctx.ellipse(
        centerX + state.panX,
        centerY + state.panY,
        rad,
        rad * tilt,
        0,
        0,
        Math.PI * 2
      );

      if (isHighlighted) {
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
      } else {
        ctx.strokeStyle = 'rgba(0, 168, 255, 0.14)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // 3. Asteroid Belt
  function drawAsteroidBelt() {
    ctx.save();
    for (let a of asteroids) {
      if (!state.isPaused) {
        a.angle += 0.003 * a.speed * state.warpMultiplier;
      }
      const pt = project(a.orbitRadius, a.angle);

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, a.size * pt.depthScale * state.scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148, 163, 184, ${a.alpha})`;
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. Planets & Atmospheric Detail
  function drawPlanets() {
    for (let p of PLANET_DEFINITIONS) {
      // Step orbit angle
      if (!state.isPaused) {
        p.angle += (0.008 * p.speed * state.warpMultiplier);
      }

      const pos = project(p.orbitRadius, p.angle);
      const planetRadius = Math.max(3, p.radius * pos.depthScale * state.scale);
      p.currentX = pos.x;
      p.currentY = pos.y;
      p.currentRadius = planetRadius;

      // Orbital Trail
      if (state.showTrails) {
        p.trail.push({ x: pos.x, y: pos.y });
        if (p.trail.length > 25) p.trail.shift();

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.25;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      const isSelected = state.selectedPlanet === p.id;
      const isHovered = state.hoveredPlanet === p.id;

      // Selection / Target Lock Ring
      if (isSelected || isHovered) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, planetRadius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(34, 211, 238, 1)';
        ctx.stroke();
        ctx.restore();
      }

      // Atmospheric Glow Layer
      ctx.save();
      const atmoGrad = ctx.createRadialGradient(pos.x, pos.y, planetRadius * 0.7, pos.x, pos.y, planetRadius * 2.2);
      atmoGrad.addColorStop(0, p.glow);
      atmoGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, planetRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = atmoGrad;
      ctx.fill();
      ctx.restore();

      // Saturn Rings (drawn behind planet first for proper occlusion if tilted)
      if (p.hasRings) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(-0.35); // 20 deg ring inclination

        const ringWidth = planetRadius * 2.8;
        const ringHeight = planetRadius * 0.75;

        // Outer Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, ringWidth, ringHeight, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)';
        ctx.lineWidth = 5 * state.scale;
        ctx.stroke();

        // Inner Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, ringWidth * 0.78, ringHeight * 0.78, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(202, 138, 4, 0.5)';
        ctx.lineWidth = 2.5 * state.scale;
        ctx.stroke();

        ctx.restore();
      }

      // Uranus Tilted Rings
      if (p.hasTiltedRings) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(1.4); // Tilted ~90 deg

        ctx.beginPath();
        ctx.ellipse(0, 0, planetRadius * 2.2, planetRadius * 0.4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 243, 208, 0.4)';
        ctx.lineWidth = 2 * state.scale;
        ctx.stroke();
        ctx.restore();
      }

      // Planetary Sphere with Realistic Spherical Shading
      ctx.save();
      const planetGrad = ctx.createRadialGradient(
        pos.x - (planetRadius * 0.35),
        pos.y - (planetRadius * 0.35),
        planetRadius * 0.1,
        pos.x,
        pos.y,
        planetRadius
      );
      planetGrad.addColorStop(0, '#FFFFFF');
      planetGrad.addColorStop(0.3, p.color);
      planetGrad.addColorStop(0.85, p.color);
      planetGrad.addColorStop(1, '#02040A'); // Deep space nightside shadow

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.shadowBlur = isSelected ? 20 : 8;
      ctx.shadowColor = p.glow;
      ctx.fill();
      ctx.restore();

      // Gas Giant Cloud Bands (Jupiter)
      if (p.isGasGiant) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, planetRadius - 1, 0, Math.PI * 2);
        ctx.clip();

        ctx.strokeStyle = 'rgba(146, 64, 14, 0.45)';
        ctx.lineWidth = 3 * state.scale;
        ctx.beginPath();
        ctx.moveTo(pos.x - planetRadius, pos.y - 4);
        ctx.lineTo(pos.x + planetRadius, pos.y - 4);
        ctx.moveTo(pos.x - planetRadius, pos.y + 3);
        ctx.lineTo(pos.x + planetRadius, pos.y + 3);
        ctx.stroke();

        // Great Red Spot
        ctx.beginPath();
        ctx.arc(pos.x + (planetRadius * 0.35), pos.y + 4, 3 * state.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();

        ctx.restore();
      }

      // Earth's Moon (Luna)
      if (p.hasMoon) {
        if (!state.isPaused) p.moonAngle += 0.05 * state.warpMultiplier;
        const mDist = planetRadius + 14;
        const mx = pos.x + Math.cos(p.moonAngle) * mDist;
        const my = pos.y + Math.sin(p.moonAngle) * mDist * (state.viewMode === '3d' ? state.tiltAngle : 1);

        ctx.beginPath();
        ctx.arc(mx, my, 2 * state.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#E2E8F0';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Jupiter's Galilean Moons (Io, Europa, Ganymede, Callisto)
      if (p.hasGalileanMoons) {
        if (!state.isPaused) p.moonsAngle += 0.03 * state.warpMultiplier;
        const moonOffsets = [1.5, 2.1, 2.7, 3.4];
        for (let i = 0; i < 4; i++) {
          const ma = p.moonsAngle * (i + 1) * 0.7;
          const md = planetRadius * moonOffsets[i];
          const mx = pos.x + Math.cos(ma) * md;
          const my = pos.y + Math.sin(ma) * md * (state.viewMode === '3d' ? state.tiltAngle : 1);

          ctx.beginPath();
          ctx.arc(mx, my, 1.6 * state.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#FDE68A';
          ctx.fill();
        }
      }

      // Planet Name & Velocity Labels
      if (state.showLabels) {
        ctx.save();
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#22D3EE' : '#F8FAFC';
        ctx.textAlign = 'center';
        ctx.fillText(p.name.toUpperCase(), pos.x, pos.y + planetRadius + 15);

        if (isSelected || isHovered) {
          ctx.font = '500 9px "JetBrains Mono", monospace';
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(p.info.velocity, pos.x, pos.y + planetRadius + 27);
        }
        ctx.restore();
      }
    }
  }

  // --- MAIN ANIMATION LOOP ---
  function render() {
    ctx.clearRect(0, 0, width, height);

    drawOrbitLines();
    drawAsteroidBelt();
    drawSun();
    drawPlanets();

    requestAnimationFrame(render);
  }

  // --- HIT DETECTION & INTERACTION ---
  function getPlanetAtPoint(mx, my) {
    for (let p of PLANET_DEFINITIONS) {
      if (!p.currentX) continue;
      const dx = mx - p.currentX;
      const dy = my - p.currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= p.currentRadius + 14) {
        return p;
      }
    }
    return null;
  }

  function updateHud(planet) {
    const hud = document.getElementById('orrery-hud-panel');
    if (!hud) return;

    if (!planet) {
      hud.classList.remove('active');
      return;
    }

    hud.classList.add('active');
    const nameEl = hud.querySelector('.orrery-hud-title');
    const tagEl = hud.querySelector('.orrery-hud-tag');
    const distEl = hud.querySelector('.hud-dist');
    const velEl = hud.querySelector('.hud-vel');
    const tempEl = hud.querySelector('.hud-temp');
    const moonsEl = hud.querySelector('.hud-moons');
    const exploreBtn = hud.querySelector('.orrery-hud-btn');

    if (nameEl) nameEl.textContent = planet.name.toUpperCase();
    if (tagEl) tagEl.textContent = planet.info.type;
    if (distEl) distEl.textContent = planet.info.distAU;
    if (velEl) velEl.textContent = planet.info.velocity;
    if (tempEl) tempEl.textContent = planet.info.temp;
    if (moonsEl) moonsEl.textContent = planet.info.moons;
    if (exploreBtn) {
      exploreBtn.href = `planet-details.html?planet=${planet.id}`;
      exploreBtn.innerHTML = `ANALYZE ${planet.name.toUpperCase()} <span class="arrow">→</span>`;
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = getPlanetAtPoint(mx, my);
    if (hit) {
      state.hoveredPlanet = hit.id;
      canvas.style.cursor = 'pointer';
    } else {
      state.hoveredPlanet = null;
      canvas.style.cursor = 'default';
    }
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = getPlanetAtPoint(mx, my);
    if (hit) {
      state.selectedPlanet = hit.id;
      updateHud(hit);
      if (window.cosmosSound && window.cosmosSound.enabled) {
        window.cosmosSound.playClick();
      }
    } else {
      // Clicked on empty space
      state.selectedPlanet = null;
      updateHud(null);
    }
  });

  // --- UI CONTROLS WIRING ---
  function initControls() {
    // Warp Buttons
    const warpBtns = document.querySelectorAll('[data-orrery-warp]');
    warpBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        warpBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const warp = parseFloat(btn.getAttribute('data-orrery-warp'));
        state.warpMultiplier = warp;
        state.isPaused = (warp === 0);
      });
    });

    // View Perspective Toggle
    const viewBtns = document.querySelectorAll('[data-orrery-view]');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.viewMode = btn.getAttribute('data-orrery-view');
      });
    });

    // Toggle Checkboxes/Buttons (Orbits, Trails, Labels)
    const toggleOrbits = document.getElementById('toggle-orrery-orbits');
    if (toggleOrbits) {
      toggleOrbits.addEventListener('click', () => {
        state.showOrbits = !state.showOrbits;
        toggleOrbits.classList.toggle('active', state.showOrbits);
      });
    }

    const toggleTrails = document.getElementById('toggle-orrery-trails');
    if (toggleTrails) {
      toggleTrails.addEventListener('click', () => {
        state.showTrails = !state.showTrails;
        toggleTrails.classList.toggle('active', state.showTrails);
        if (!state.showTrails) {
          PLANET_DEFINITIONS.forEach(p => p.trail = []);
        }
      });
    }

    const toggleLabels = document.getElementById('toggle-orrery-labels');
    if (toggleLabels) {
      toggleLabels.addEventListener('click', () => {
        state.showLabels = !state.showLabels;
        toggleLabels.classList.toggle('active', state.showLabels);
      });
    }

    // Quick Planet Focus Chips
    const planetChips = document.querySelectorAll('[data-orrery-select]');
    planetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const pid = chip.getAttribute('data-orrery-select');
        const planet = PLANET_DEFINITIONS.find(p => p.id === pid);
        if (planet) {
          state.selectedPlanet = planet.id;
          updateHud(planet);
          planetChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          if (window.cosmosSound && window.cosmosSound.enabled) {
            window.cosmosSound.playClick();
          }
        }
      });
    });
  }

  window.addEventListener('resize', resize);

  // Initialize
  resize();
  initAsteroids();
  initSolarFlares();
  initControls();
  render();

  // Set Earth selected by default to showcase live HUD immediately
  const defaultPlanet = PLANET_DEFINITIONS.find(p => p.id === 'earth');
  if (defaultPlanet) {
    state.selectedPlanet = 'earth';
    updateHud(defaultPlanet);
  }
})();
