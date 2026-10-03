/**
 * COSMOS — CORE SITE CONTROLLER & SOUND SYNTHESIZER
 * js/main.js
 */

(function () {
  'use strict';

  // --- 1. Header Scroll Glassmorphism Controller ---
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- 2. Custom Glowing Cosmic Cursor ---
  function initCustomCursor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    let dot = document.querySelector('.custom-cursor-dot');
    let ring = document.querySelector('.custom-cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'custom-cursor-dot';
      document.body.appendChild(dot);
    }

    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'custom-cursor-ring';
      document.body.appendChild(ring);
    }

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    }
    renderRing();

    // Hover state on interactive elements
    const interactiveSelectors = 'a, button, input, .tilt-card, .celestial-item, .filter-btn, .mega-menu-item';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        ring.classList.add('active');
        if (window.cosmosSound && window.cosmosSound.enabled) {
          window.cosmosSound.playHover();
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        ring.classList.remove('active');
      }
    });
  }

  // --- 3. Web Audio API Space Ambient & UI Synthesizer ---
  class CosmosSoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.droneGain = null;
      this.oscillators = [];
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
    }

    startDrone() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stopDrone(); // Clear any existing

      // Master drone gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3);

      // Low pass filter for warm deep-space hum
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      // Sub drone 55Hz (A1)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Harmonic drone 110Hz (A2) with subtle detune
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, this.ctx.currentTime);

      // LFO to slowly modulate filter frequency (breathing effect)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      lfo.start();

      this.oscillators = [osc1, osc2, lfo];
    }

    stopDrone() {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) {}
          });
          this.oscillators = [];
        }, 850);
      }
    }

    playHover() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.055);
      } catch (e) {}
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
      } catch (e) {}
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.startDrone();
      } else {
        this.stopDrone();
      }
      return this.enabled;
    }
  }

  window.cosmosSound = new CosmosSoundEngine();

  function initSoundToggle() {
    const toggleBtns = document.querySelectorAll('.sound-toggle');
    if (!toggleBtns.length) return;

    function updateBtnState(isActive) {
      toggleBtns.forEach(btn => {
        btn.classList.toggle('sound-active', isActive);
        const textSpan = btn.querySelector('.sound-text');
        if (textSpan) {
          textSpan.textContent = isActive ? 'SOUND ON' : 'SOUND OFF';
        }
      });
    }

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const active = window.cosmosSound.toggle();
        updateBtnState(active);
        if (active) window.cosmosSound.playClick();
      });
    });

    // Default state: Sound is OFF until explicitly clicked
    updateBtnState(false);
  }

  // --- 4. Mobile Menu System ---
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (!toggleBtn || !overlay) return;

    function toggleMenu() {
      const isOpen = overlay.classList.toggle('active');
      toggleBtn.classList.toggle('active', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    }

    toggleBtn.addEventListener('click', toggleMenu);

    // Close on navigation link click
    overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  }

  // --- 5. Global Search Engine Data & Controller (search.html) ---
  const SEARCH_DATABASE = [
    // Planets
    { title: 'Mercury', category: 'Planets', url: 'planet-details.html?planet=mercury', desc: 'Smallest planet, closest to the Sun with extreme temperature swings.' },
    { title: 'Venus', category: 'Planets', url: 'planet-details.html?planet=venus', desc: 'Earth\'s toxic twin with runaway greenhouse atmosphere and lead-melting heat.' },
    { title: 'Earth', category: 'Planets', url: 'planet-details.html?planet=earth', desc: 'The Blue Marble, only known harbor of biological life in the cosmos.' },
    { title: 'Mars', category: 'Planets', url: 'planet-details.html?planet=mars', desc: 'The Red Planet, home to Olympus Mons and prime candidate for colonization.' },
    { title: 'Jupiter', category: 'Planets', url: 'planet-details.html?planet=jupiter', desc: 'The colossal gas giant king crowned by the 350-year Great Red Spot storm.' },
    { title: 'Saturn', category: 'Planets', url: 'planet-details.html?planet=saturn', desc: 'The ringed jewel of the solar system with 146 moons including Titan and Enceladus.' },
    { title: 'Uranus', category: 'Planets', url: 'planet-details.html?planet=uranus', desc: 'The sideways tilted ice giant with pristine aquamarine methane clouds.' },
    { title: 'Neptune', category: 'Planets', url: 'planet-details.html?planet=neptune', desc: 'Supersonic cobalt ice giant with the fastest atmospheric winds in the system.' },
    { title: 'Pluto', category: 'Planets', url: 'planet-details.html?planet=pluto', desc: 'Sovereign dwarf planet of the Kuiper Belt with heart-shaped nitrogen glaciers.' },
    // Black Holes
    { title: 'Sagittarius A*', category: 'Black Holes', url: 'black-hole-details.html?bh=sagittarius-a', desc: 'The supermassive black hole at the gravitational center of our Milky Way galaxy.' },
    { title: 'Messier 87* (M87*)', category: 'Black Holes', url: 'black-hole-details.html?bh=m87', desc: 'First black hole directly imaged by the Event Horizon Telescope, 6.5 billion solar masses.' },
    { title: 'Cygnus X-1', category: 'Black Holes', url: 'black-hole-details.html?bh=cygnus-x1', desc: 'Famous stellar-mass black hole and the first confirmed black hole candidate.' },
    { title: 'Event Horizon & Singularity', category: 'Black Holes', url: 'black-holes.html', desc: 'The threshold beyond which light and causality itself cannot escape.' },
    // Galaxies
    { title: 'Milky Way Galaxy', category: 'Galaxies', url: 'galaxy-details.html?galaxy=milky-way', desc: 'Our home barred spiral galaxy spanning 100,000 light-years with 400 billion stars.' },
    { title: 'Andromeda Galaxy (M31)', category: 'Galaxies', url: 'galaxy-details.html?galaxy=andromeda', desc: 'Our nearest major galactic spiral neighbor, currently on collision course in 4.5B years.' },
    { title: 'Sombrero Galaxy (M104)', category: 'Galaxies', url: 'galaxy-details.html?galaxy=sombrero', desc: 'Uncanny lenticular galaxy with an enormous brilliant core and thick dust lane.' },
    { title: 'Whirlpool Galaxy (M51)', category: 'Galaxies', url: 'galaxy-details.html?galaxy=whirlpool', desc: 'Grand-design spiral galaxy locked in gravitational tidal dance with NGC 5195.' },
    { title: 'Triangulum Galaxy (M33)', category: 'Galaxies', url: 'galaxy-details.html?galaxy=triangulum', desc: 'Third-largest spiral member of our Local Group, rich in stellar nurseries.' },
    // Space Missions
    { title: 'Apollo 11', category: 'Missions', url: 'mission-details.html?mission=apollo-11', desc: 'First historic crewed lunar landing by Neil Armstrong and Buzz Aldrin in 1969.' },
    { title: 'James Webb Space Telescope (JWST)', category: 'Missions', url: 'mission-details.html?mission=jwst', desc: 'Next-generation infrared flagship observatory gazing at first cosmic stars.' },
    { title: 'Voyager 1 & 2', category: 'Missions', url: 'mission-details.html?mission=voyager-1', desc: 'Humanity\'s most distant ambassadors, currently voyaging in true interstellar space.' },
    { title: 'Artemis Program', category: 'Missions', url: 'mission-details.html?mission=artemis', desc: 'NASA campaign to return humanity to the Moon and establish permanent lunar bases.' },
    { title: 'Perseverance & Curiosity Rovers', category: 'Missions', url: 'mission-details.html?mission=perseverance', desc: 'Advanced robotic astrobiology mobile laboratories exploring Jezero Crater on Mars.' },
    // Astronauts
    { title: 'Neil Armstrong', category: 'Astronauts', url: 'astronaut-details.html?astronaut=neil-armstrong', desc: 'First human to set foot on the lunar surface: "One small step for man..."' },
    { title: 'Yuri Gagarin', category: 'Astronauts', url: 'astronaut-details.html?astronaut=yuri-gagarin', desc: 'First human in space, completing historic orbit of Earth aboard Vostok 1 in 1961.' },
    { title: 'Kalpana Chawla', category: 'Astronauts', url: 'astronaut-details.html?astronaut=kalpana-chawla', desc: 'Distinguished aerospace engineer and first Indian-born woman in space.' },
    { title: 'Peggy Whitson', category: 'Astronauts', url: 'astronaut-details.html?astronaut=peggy-whitson', desc: 'Record-shattering astronaut with 675 days in space and first female ISS commander twice.' },
    { title: 'Chris Hadfield', category: 'Astronauts', url: 'astronaut-details.html?astronaut=chris-hadfield', desc: 'Canadian astronaut and ISS commander celebrated for global science education.' }
  ];

  function initSearchPage() {
    const input = document.getElementById('search-query-input');
    const resultsContainer = document.getElementById('search-results-grid');
    const categoryFilterBtns = document.querySelectorAll('.search-filter-chip');
    if (!input || !resultsContainer) return;

    let currentFilter = 'All';

    function renderResults(query = '') {
      const q = query.trim().toLowerCase();
      const filtered = SEARCH_DATABASE.filter(item => {
        const matchesCategory = (currentFilter === 'All' || item.category.toLowerCase() === currentFilter.toLowerCase());
        const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });

      resultsContainer.innerHTML = '';

      if (!filtered.length) {
        resultsContainer.innerHTML = `
          <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
            <p style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--starlight-white); margin-bottom: 0.5rem;">NO CELESTIAL SIGNALS DETECTED</p>
            <p style="color: var(--soft-space-gray); font-size: 0.95rem;">No astronomical records matching "${query}" in category "${currentFilter}".</p>
          </div>
        `;
        return;
      }

      filtered.forEach(item => {
        const card = document.createElement('a');
        card.href = item.url;
        card.className = 'glass-card tilt-card';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        card.innerHTML = `
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--cosmic-cyan); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">${item.category}</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--starlight-white); margin-bottom: 0.6rem;">${item.title}</h3>
            <p style="font-size: 0.9rem; color: var(--soft-space-gray); line-height: 1.6; margin-bottom: 1.5rem;">${item.desc}</p>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cosmic-blue); font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem;">
            ACCESS TELEMETRY <span class="arrow">→</span>
          </div>
        `;
        resultsContainer.appendChild(card);
      });

      if (window.initTiltCards) window.initTiltCards();
    }

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    categoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-search-filter');
        renderResults(input.value);
      });
    });

    // Check for URL query param `?q=`
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    if (initialQuery) {
      input.value = initialQuery;
    }
    renderResults(initialQuery);
  }

  // --- Active Link Highlighting in Header Navigation ---
  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initCustomCursor();
    initSoundToggle();
    initMobileMenu();
    initSearchPage();
    setActiveNavLink();
  });
})();
