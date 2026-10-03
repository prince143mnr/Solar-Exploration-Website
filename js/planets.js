/**
 * COSMOS — CELESTIAL DATABASE & PLANETS ENGINE
 * js/planets.js
 */

const CELESTIAL_DATA = {
  sun: {
    id: 'sun',
    name: 'The Sun',
    tag: 'Yellow Dwarf Star (G2V)',
    category: 'star',
    diameter: '1,392,700 km',
    distanceFromSun: '0 km (Center)',
    moons: '8 Planets, 5 Dwarf Planets',
    orbitalPeriod: '230 Million Years (Galactic)',
    temperature: '5,500°C (Surface) / 15M°C (Core)',
    dayLength: '27 Earth Days',
    gravity: '274 m/s²',
    summary: 'The radiant heart of our solar system, containing 99.86% of all mass in the system. A thermonuclear furnace powered by hydrogen fusion.',
    atmosphere: '73% Hydrogen, 25% Helium, traces of Oxygen, Carbon, Neon, and Iron in extreme plasma state.',
    missions: 'Parker Solar Probe, SOHO, Solar Orbiter, SDO',
    facts: [
      'Over 1.3 million Earths could fit inside the Sun.',
      'The Sun produces a solar wind of charged particles streaming at 450 km/s.',
      'Light from the Sun takes approximately 8 minutes and 20 seconds to reach Earth.'
    ],
    gradient: 'radial-gradient(circle, #FFF7ED 10%, #FBBF24 50%, #EA580C 85%, #9A3412 100%)',
    glow: '0 0 70px #F59E0B'
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    tag: 'The Swift Iron Planet',
    category: 'terrestrial',
    diameter: '4,879 km',
    distanceFromSun: '57.9 million km',
    moons: '0',
    orbitalPeriod: '88 Earth Days',
    temperature: '-180°C to 430°C',
    dayLength: '59 Earth Days',
    gravity: '3.7 m/s²',
    summary: 'The smallest planet and closest to the Sun. Mercury experiences the most extreme temperature swings in the solar system due to having virtually no atmosphere.',
    atmosphere: 'Exosphere composed of trace Oxygen, Sodium, Hydrogen, Helium, and Potassium blasted off by solar wind.',
    missions: 'Mariner 10, MESSENGER, BepiColombo',
    facts: [
      'Mercury has a massive metallic core that makes up roughly 85% of its radius.',
      'Despite being closest to the Sun, water ice exists inside permanently shadowed polar craters.',
      'A year on Mercury is just 88 days, but a single solar day lasts 176 Earth days.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #CBD5E1, #64748B, #1E293B)',
    glow: '0 0 25px rgba(148, 163, 184, 0.5)'
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    tag: 'The Shrouded Inferno',
    category: 'terrestrial',
    diameter: '12,104 km',
    distanceFromSun: '108.2 million km',
    moons: '0',
    orbitalPeriod: '224.7 Earth Days',
    temperature: '465°C (Hottest in Solar System)',
    dayLength: '243 Earth Days (Retrograde)',
    gravity: '8.87 m/s²',
    summary: 'Earth’s toxic twin, encased in runaway greenhouse gases and sulfuric acid clouds. Surface pressures equal the ocean 900 meters underwater.',
    atmosphere: '96.5% Carbon Dioxide, 3.5% Nitrogen, with thick reflective clouds of concentrated sulfuric acid.',
    missions: 'Venera 7–14, Magellan, Venus Express, Akatsuki, DAVINCI+, VERITAS',
    facts: [
      'Venus rotates backwards compared to most planets; the Sun rises in the west.',
      'Surface temperatures are hot enough to melt lead at all times, day and night.',
      'It has more volcanoes than any other planet in the solar system.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #FDE68A, #D97706, #78350F)',
    glow: '0 0 30px rgba(217, 119, 6, 0.5)'
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    tag: 'The Blue Oasis of Life',
    category: 'terrestrial',
    diameter: '12,742 km',
    distanceFromSun: '149.6 million km (1 AU)',
    moons: '1 (The Moon)',
    orbitalPeriod: '365.25 Days',
    temperature: '-88°C to 58°C (Mean 15°C)',
    dayLength: '23h 56m 04s',
    gravity: '9.807 m/s²',
    summary: 'The only known cradle of life in the universe. Dynamic oceans, shifting tectonic plates, and a protective magnetosphere safeguard millions of species.',
    atmosphere: '78.08% Nitrogen, 20.95% Oxygen, 0.93% Argon, 0.04% Carbon Dioxide and water vapor.',
    missions: 'Apollo, Landsat, Terra, Aqua, ISS, Sentinel constellations',
    facts: [
      'Oceans cover approximately 70.8% of the surface, holding 1.3 billion cubic kilometers of water.',
      'Earth’s molten nickel-iron core produces a magnetic shield blocking deadly solar radiation.',
      'The atmosphere stretches beyond 10,000 km into the geocorona.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #38BDF8, #0284C7, #0F172A)',
    glow: '0 0 35px rgba(56, 189, 248, 0.7)'
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    tag: 'The Crimson Frontier',
    category: 'terrestrial',
    diameter: '6,779 km',
    distanceFromSun: '227.9 million km',
    moons: '2 (Phobos & Deimos)',
    orbitalPeriod: '687 Earth Days',
    temperature: '-140°C to 20°C (Mean -60°C)',
    dayLength: '24h 37m 22s (1 Sol)',
    gravity: '3.721 m/s²',
    summary: 'The prime candidate for future human colonization. A dusty, desert world home to Olympus Mons—the tallest volcano in the solar system.',
    atmosphere: '95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon, trace Oxygen and water vapor.',
    missions: 'Viking 1 & 2, Pathfinder, Spirit & Opportunity, Curiosity, Perseverance, Ingenuity',
    facts: [
      'Olympus Mons stands 21.9 km high, nearly 2.5 times taller than Mount Everest.',
      'Valles Marineris is a colossal canyon system stretching over 4,000 km across the equator.',
      'Mars possesses vast subsurface reservoirs of water ice.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #F87171, #DC2626, #450A0A)',
    glow: '0 0 30px rgba(220, 38, 38, 0.6)'
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    tag: 'King of the Planets',
    category: 'gas-giant',
    diameter: '139,820 km',
    distanceFromSun: '778.5 million km',
    moons: '95 Recognized (Europa, Ganymede, Io, Callisto)',
    orbitalPeriod: '11.86 Earth Years',
    temperature: '-110°C (Cloud Tops)',
    dayLength: '9h 55m (Fastest Rotation)',
    gravity: '24.79 m/s²',
    summary: 'A behemoth gas giant with more mass than all other planets combined. Crowned by the iconic Great Red Spot, a hurricane raging for over 350 years.',
    atmosphere: '89.8% Molecular Hydrogen, 10.2% Helium, traces of Methane, Ammonia, and Water ice.',
    missions: 'Pioneer 10 & 11, Voyager 1 & 2, Galileo, Juno, Europa Clipper, JUICE',
    facts: [
      'Jupiter’s Great Red Spot is wider than Earth and possesses winds exceeding 430 km/h.',
      'Its moon Ganymede is larger than Mercury and is the only moon with its own magnetic field.',
      'Acts as a cosmic vacuum cleaner, deflecting comets and asteroids away from the inner planets.'
    ],
    gradient: 'repeating-linear-gradient(0deg, #FDE68A, #D97706 15px, #92400E 30px, #FEF3C7 45px)',
    glow: '0 0 45px rgba(217, 119, 6, 0.6)'
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    tag: 'Jewel of the Solar System',
    category: 'gas-giant',
    diameter: '116,460 km',
    distanceFromSun: '1.434 billion km',
    moons: '146 Recognized (Titan, Enceladus, Mimas)',
    orbitalPeriod: '29.45 Earth Years',
    temperature: '-140°C',
    dayLength: '10h 33m',
    gravity: '10.44 m/s²',
    summary: 'Famed for its dazzling ring system composed of billions of chunks of ice and rock. So low in density that it would float in a gigantic cosmic ocean.',
    atmosphere: '96.3% Molecular Hydrogen, 3.25% Helium, trace Ammonia, Acetylene, and Methane.',
    missions: 'Pioneer 11, Voyager 1 & 2, Cassini-Huygens, Dragonfly (Upcoming)',
    facts: [
      'Its rings span up to 282,000 km across, yet are only around 10 meters to 1 km thick.',
      'Moon Enceladus spews geothermal geysers of salty water into space from a subsurface ocean.',
      'Titan has a thick nitrogen atmosphere, methane lakes, and liquid river cycles.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #FDE047, #CA8A04, #713F12)',
    glow: '0 0 35px rgba(202, 138, 4, 0.5)'
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    tag: 'The Sideways Ice Giant',
    category: 'ice-giant',
    diameter: '50,724 km',
    distanceFromSun: '2.871 billion km',
    moons: '28 Recognized (Miranda, Titania, Oberon)',
    orbitalPeriod: '84 Earth Years',
    temperature: '-224°C (Coldest Atmosphere)',
    dayLength: '17h 14m (Retrograde)',
    gravity: '8.69 m/s²',
    summary: 'An ice giant tilted 98 degrees on its side, rolling around the Sun like a ball. Shrouded in pristine cyan methane clouds over a mantle of icy slush.',
    atmosphere: '83% Hydrogen, 15% Helium, 2.3% Methane, giving it a luminous aquamarine hue.',
    missions: 'Voyager 2 (1986 flyby)',
    facts: [
      'Rotates almost completely on its side, causing extreme 42-year long seasons of continuous day or night.',
      'Possesses 13 faint concentric dark rings discovered in 1977.',
      'Miranda features Verona Rupes, a 20 km vertical cliff—the tallest known cliff face in the system.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #A7F3D0, #0D9488, #115E59)',
    glow: '0 0 35px rgba(13, 148, 136, 0.6)'
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    tag: 'The Mystic Wind World',
    category: 'ice-giant',
    diameter: '49,244 km',
    distanceFromSun: '4.495 billion km',
    moons: '16 Recognized (Triton, Proteus)',
    orbitalPeriod: '164.8 Earth Years',
    temperature: '-218°C',
    dayLength: '16h 06m',
    gravity: '11.15 m/s²',
    summary: 'The most distant major planet in the solar system. A vibrant cobalt giant swept by supersonic winds exceeding 2,100 km/h—the fastest in the solar system.',
    atmosphere: '80% Hydrogen, 19% Helium, 1.5% Methane, with high-altitude cirrus clouds of frozen methane crystals.',
    missions: 'Voyager 2 (1989 flyby)',
    facts: [
      'Winds here reach speeds over 2,100 km/h, breaking the sound barrier.',
      'First planet mathematically predicted before being observed with a telescope.',
      'Triton orbits backward and features active cryovolcanoes erupting liquid nitrogen.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #60A5FA, #2563EB, #1E3A8A)',
    glow: '0 0 35px rgba(37, 99, 235, 0.7)'
  },
  pluto: {
    id: 'pluto',
    name: 'Pluto',
    tag: 'Sovereign of the Kuiper Belt',
    category: 'dwarf',
    diameter: '2,376 km',
    distanceFromSun: '5.906 billion km',
    moons: '5 (Charon, Styx, Nix, Kerberos, Hydra)',
    orbitalPeriod: '248 Earth Years',
    temperature: '-232°C',
    dayLength: '153.3 Hours (6.4 Earth Days)',
    gravity: '0.62 m/s²',
    summary: 'The king of the Kuiper Belt. Features a gigantic heart-shaped nitrogen glacier named Tombaugh Regio, red tholin plains, and towering water-ice mountains.',
    atmosphere: 'Tenacious seasonal exosphere of Nitrogen, Methane, and Carbon Monoxide that condenses and freezes when Pluto moves farther from the Sun.',
    missions: 'New Horizons (2015 historic flyby)',
    facts: [
      'Pluto and its largest moon Charon form a binary dwarf planet system, mutually tidally locked.',
      'Tombaugh Regio holds a convecting glacier of nitrogen ice larger than Texas.',
      'Water ice on Pluto is so cold it behaves like solid granite bedrock.'
    ],
    gradient: 'radial-gradient(circle at 35% 35%, #E2E8F0, #A1A1AA, #3F3F46)',
    glow: '0 0 20px rgba(161, 161, 170, 0.4)'
  }
};

// --- Horizontal Solar System Simulation (index.html & solar-system.html) ---
function initHorizontalSolarSystem() {
  const track = document.getElementById('solar-system-track');
  const drawer = document.getElementById('planet-telemetry-drawer');
  if (!track || !drawer) return;

  const items = track.querySelectorAll('.celestial-item');

  function updateDrawer(id) {
    const data = CELESTIAL_DATA[id];
    if (!data) return;

    const orbEl = drawer.querySelector('.drawer-preview-orb');
    const titleEl = drawer.querySelector('.drawer-title');
    const subEl = drawer.querySelector('.drawer-subtitle');
    const distEl = drawer.querySelector('.drawer-dist');
    const diamEl = drawer.querySelector('.drawer-diam');
    const moonsEl = drawer.querySelector('.drawer-moons');
    const periodEl = drawer.querySelector('.drawer-period');
    const ctaBtn = drawer.querySelector('.drawer-explore-btn');

    if (orbEl) {
      orbEl.style.background = data.gradient;
      orbEl.style.boxShadow = data.glow;
    }
    if (titleEl) titleEl.textContent = data.name;
    if (subEl) subEl.textContent = data.tag;
    if (distEl) distEl.textContent = data.distanceFromSun;
    if (diamEl) diamEl.textContent = data.diameter;
    if (moonsEl) moonsEl.textContent = data.moons;
    if (periodEl) periodEl.textContent = data.orbitalPeriod;

    if (ctaBtn) {
      ctaBtn.href = `planet-details.html?planet=${data.id}`;
      ctaBtn.innerHTML = `EXPLORE ${data.name.toUpperCase()} <span class="arrow">→</span>`;
    }

    items.forEach(el => el.classList.toggle('active', el.dataset.planet === id));
  }

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const pid = item.getAttribute('data-planet');
      updateDrawer(pid);
    });
  });

  // Default to Earth initially
  updateDrawer('earth');
}

// --- Dynamic Planet Details Page Engine (planet-details.html) ---
function initPlanetDetailsPage() {
  const container = document.getElementById('planet-details-root');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  let planetId = (params.get('planet') || 'jupiter').toLowerCase();
  if (!CELESTIAL_DATA[planetId]) planetId = 'jupiter';

  const data = CELESTIAL_DATA[planetId];

  // Update Page Title
  document.title = `${data.name.toUpperCase()} — COSMOS Exploration Telemetry`;

  // Populate dynamic DOM fields
  const heroName = document.getElementById('pd-name');
  const heroTag = document.getElementById('pd-tag');
  const heroSummary = document.getElementById('pd-summary');
  const heroVisual = document.getElementById('pd-visual');
  const specDiam = document.getElementById('pd-spec-diam');
  const specDist = document.getElementById('pd-spec-dist');
  const specMoons = document.getElementById('pd-spec-moons');
  const specPeriod = document.getElementById('pd-spec-period');
  const specTemp = document.getElementById('pd-spec-temp');
  const specDay = document.getElementById('pd-spec-day');
  const specGravity = document.getElementById('pd-spec-gravity');
  const atmosContent = document.getElementById('pd-atmosphere-text');
  const missionsContent = document.getElementById('pd-missions-text');
  const factsList = document.getElementById('pd-facts-list');

  if (heroName) heroName.textContent = data.name;
  if (heroTag) heroTag.textContent = data.tag;
  if (heroSummary) heroSummary.textContent = data.summary;

  if (heroVisual) {
    heroVisual.style.background = data.gradient;
    heroVisual.style.boxShadow = data.glow;
  }

  if (specDiam) specDiam.textContent = data.diameter;
  if (specDist) specDist.textContent = data.distanceFromSun;
  if (specMoons) specMoons.textContent = data.moons;
  if (specPeriod) specPeriod.textContent = data.orbitalPeriod;
  if (specTemp) specTemp.textContent = data.temperature;
  if (specDay) specDay.textContent = data.dayLength;
  if (specGravity) specGravity.textContent = data.gravity;
  if (atmosContent) atmosContent.textContent = data.atmosphere;
  if (missionsContent) missionsContent.textContent = data.missions;

  if (factsList) {
    factsList.innerHTML = '';
    data.facts.forEach((fact) => {
      const li = document.createElement('li');
      li.className = 'glass-card';
      li.style.marginBottom = '1rem';
      li.innerHTML = `<strong>•</strong> ${fact}`;
      factsList.appendChild(li);
    });
  }

  // Planet selector buttons in sub-nav
  const quickLinks = document.querySelectorAll('[data-planet-switch]');
  quickLinks.forEach((btn) => {
    const target = btn.getAttribute('data-planet-switch');
    btn.classList.toggle('active', target === planetId);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `planet-details.html?planet=${target}`;
    });
  });

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane[data-tab-content]');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const activePane = document.querySelector(`.tab-pane[data-tab-content="${tabKey}"]`);
      if (activePane) activePane.style.display = 'block';
    });
  });
}

// --- Planet Category Filters (planets.html) ---
function initPlanetFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const cards = document.querySelectorAll('.planet-catalog-card[data-category]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
          card.classList.add('revealed');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHorizontalSolarSystem();
  initPlanetDetailsPage();
  initPlanetFilters();
});
