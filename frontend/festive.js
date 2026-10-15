/**
 * BABA DUGDHESWAR ENTERPRISE — FESTIVAL DECORATION ENGINE (PLUG & PLAY)
 * Completely isolated from core eCommerce logic. Pointer-events: none.
 */

(function() {
  'use strict';

  let currentTheme = 'none';
  let isUserMuted = localStorage.getItem('bde_festive_muted') === 'true';

  // SVG Artwork Assets
  const ARTWORKS = {
    // 1. Traditional Bengali Royal Maa Durga Trinayani (Non-cartoonish, authentic Alta/Sindoor & Gold)
    durgaTrinayani: `
      <svg class="durga-trinayani-badge" viewBox="0 0 240 110" width="160" height="74" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="#EAB308"/>
            <stop offset="100%" stop-color="#CA8A04"/>
          </linearGradient>
          <linearGradient id="vermillionGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#DC2626"/>
            <stop offset="100%" stop-color="#991B1B"/>
          </linearGradient>
        </defs>
        <!-- Sacred Background Aura -->
        <ellipse cx="120" cy="55" rx="85" ry="38" fill="rgba(234, 179, 8, 0.12)" class="durga-halo"/>
        
        <!-- Left Eye (Almond shaped traditional Kumartuli eye) -->
        <g transform="translate(18, 28)">
          <!-- Red Kohl Outline -->
          <path d="M 10 32 C 30 14, 65 14, 85 32 C 65 46, 30 46, 10 32 Z" fill="#FFFFFF" stroke="#7F1D1D" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M 0 34 C 18 24, 35 12, 55 12 C 78 12, 95 24, 100 34" fill="none" stroke="#991B1B" stroke-width="3.2" stroke-linecap="round"/>
          <!-- Iris & Pupil -->
          <circle cx="50" cy="31" r="10.5" fill="#18181B"/>
          <circle cx="50" cy="31" r="9.5" fill="#27272A"/>
          <circle cx="53" cy="28" r="3.2" fill="#FFFFFF"/>
          <!-- Kohl Wing Curve -->
          <path d="M 85 32 C 92 31, 98 27, 102 22" fill="none" stroke="#7F1D1D" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- Right Eye -->
        <g transform="translate(122, 28)">
          <!-- Red Kohl Outline -->
          <path d="M 15 32 C 35 14, 70 14, 90 32 C 70 46, 35 46, 15 32 Z" fill="#FFFFFF" stroke="#7F1D1D" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M 0 34 C 5 24, 22 12, 45 12 C 65 12, 82 24, 100 34" fill="none" stroke="#991B1B" stroke-width="3.2" stroke-linecap="round"/>
          <!-- Iris & Pupil -->
          <circle cx="50" cy="31" r="10.5" fill="#18181B"/>
          <circle cx="50" cy="31" r="9.5" fill="#27272A"/>
          <circle cx="53" cy="28" r="3.2" fill="#FFFFFF"/>
          <!-- Kohl Wing Curve -->
          <path d="M 15 32 C 8 31, 2 27, -2 22" fill="none" stroke="#7F1D1D" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- Third Eye (Trinetra on Forehead) -->
        <g transform="translate(108, 6)">
          <path d="M 12 0 C 22 12, 22 26, 12 38 C 2 26, 2 12, 12 0 Z" fill="url(#vermillionGrad)" stroke="url(#goldGrad)" stroke-width="1.6"/>
          <circle cx="12" cy="19" r="4.2" fill="#18181B"/>
          <circle cx="13" cy="18" r="1.4" fill="#FFFFFF"/>
        </g>

        <!-- Royal Chandan Bindi & Crescent Moon -->
        <circle cx="120" cy="52" r="4.5" fill="url(#goldGrad)"/>
        <path d="M 112 50 C 117 56, 123 56, 128 50 C 124 53, 116 53, 112 50 Z" fill="#DC2626"/>
      </svg>
    `,

    // 2. Realistic Swaying Marigold (Genda Phool) Toran with Green Mango Leaves
    marigoldToran: `
      <svg class="marigold-toran" viewBox="0 0 800 65" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Marigold Flower Radial -->
          <radialGradient id="mgOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F97316"/>
            <stop offset="60%" stop-color="#EA580C"/>
            <stop offset="100%" stop-color="#C2410C"/>
          </radialGradient>
          <radialGradient id="mgYellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF08A"/>
            <stop offset="50%" stop-color="#FACC15"/>
            <stop offset="100%" stop-color="#EAB308"/>
          </radialGradient>
        </defs>
        <!-- Golden Thread -->
        <path d="M 0 10 Q 200 35, 400 10 Q 600 35, 800 10" fill="none" stroke="#D97706" stroke-width="2.5" stroke-dasharray="6,2"/>
        
        <!-- Loop 1 Flower Garland -->
        ${generateFlowerChain(0, 400, 10, 35)}
        <!-- Loop 2 Flower Garland -->
        ${generateFlowerChain(400, 800, 10, 35)}
      </svg>
    `,

    // 3. Traditional Brass Diya with Flickering Flame
    diya: `
      <svg viewBox="0 0 60 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Flame -->
        <path class="diya-flame" d="M 30 6 C 36 18, 38 24, 30 32 C 22 24, 24 18, 30 6 Z" fill="url(#flameGrad)" />
        <!-- Brass Diya Body -->
        <path d="M 12 32 C 16 44, 44 44, 48 32 C 40 38, 20 38, 12 32 Z" fill="#B45309" stroke="#F59E0B" stroke-width="1.5" />
        <ellipse cx="30" cy="32" rx="18" ry="4" fill="#78350F" />
        <ellipse cx="30" cy="42" rx="10" ry="2.5" fill="#92400E" />
        <defs>
          <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#EA580C"/>
            <stop offset="50%" stop-color="#F59E0B"/>
            <stop offset="90%" stop-color="#FEF08A"/>
            <stop offset="100%" stop-color="#FFFFFF"/>
          </linearGradient>
        </defs>
      </svg>
    `,

    // 4. Ashoka Chakra
    ashokaChakra: `
      <svg viewBox="0 0 60 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="26" fill="none" stroke="#000080" stroke-width="2.5"/>
        <circle cx="30" cy="30" r="4.5" fill="#000080"/>
        ${Array.from({length: 24}).map((_, i) => `<line x1="30" y1="30" x2="${30 + 24 * Math.cos(i * 15 * Math.PI / 180)}" y2="${30 + 24 * Math.sin(i * 15 * Math.PI / 180)}" stroke="#000080" stroke-width="1.2"/>`).join('')}
      </svg>
    `,

    // 5. Bengali Noboborsho Mangal Ghat
    noboborshoGhat: `
      <svg viewBox="0 0 60 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Coconut on top -->
        <circle cx="30" cy="20" r="9" fill="#78350F" stroke="#451A03" stroke-width="1.2"/>
        <!-- Mango leaves -->
        <path d="M 22 26 C 14 18, 12 12, 10 10 C 16 14, 22 20, 24 25 Z" fill="#15803D"/>
        <path d="M 38 26 C 46 18, 48 12, 50 10 C 44 14, 38 20, 36 25 Z" fill="#15803D"/>
        <!-- Copper Ghat -->
        <path d="M 18 28 C 14 42, 18 52, 30 52 C 42 52, 46 42, 42 28 Z" fill="#EA580C" stroke="#C2410C" stroke-width="1.5"/>
        <!-- Red Swastik / Tilak on Ghat -->
        <circle cx="30" cy="40" r="3" fill="#DC2626"/>
      </svg>
    `
  };

  // Helper to build realistic marigold chain loops
  function generateFlowerChain(xStart, xEnd, yStart, yDip) {
    const steps = 14;
    let flowers = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = xStart + (xEnd - xStart) * t;
      const y = yStart + 4 * yDip * t * (1 - t);
      const isYellow = (i % 2 === 0);
      const fillId = isYellow ? 'url(#mgYellow)' : 'url(#mgOrange)';
      const r = isYellow ? 8.5 : 7.5;
      
      // Leaves between every 3 flowers
      let leaf = '';
      if (i % 3 === 0 && i > 0 && i < steps) {
        leaf = `<path d="M ${x-2} ${y+2} Q ${x+8} ${y+16}, ${x} ${y+20} Q ${x-6} ${y+14}, ${x-2} ${y+2}" fill="#166534" opacity="0.9" />`;
      }
      
      flowers += `
        ${leaf}
        <g transform="translate(${x}, ${y})">
          <circle cx="0" cy="0" r="${r}" fill="${fillId}" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"/>
          <circle cx="0" cy="0" r="${r*0.4}" fill="#78350F" opacity="0.25"/>
        </g>
      `;
    }
    return flowers;
  }

  // --- Particle Firecracker Engine ---
  function launchFirecrackers() {
    const canvas = document.getElementById('firecracker-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FACC15', '#F59E0B', '#EF4444', '#10B981', '#38BDF8', '#FFFFFF'];

    function createBurst(x, y) {
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          size: Math.random() * 3 + 1.5
        });
      }
    }

    // Launch 3 graceful bursts across screen
    setTimeout(() => createBurst(canvas.width * 0.25, canvas.height * 0.2), 200);
    setTimeout(() => createBurst(canvas.width * 0.75, canvas.height * 0.22), 650);
    setTimeout(() => createBurst(canvas.width * 0.5, canvas.height * 0.15), 1100);

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    }
    render();
  }

  // --- Apply Festive Theme ---
  window.applyFestiveTheme = function(theme) {
    currentTheme = theme || 'none';
    const container = document.getElementById('festive-overlay-container');
    if (!container) return;

    // Reset previous theme classes
    container.className = '';
    container.innerHTML = '';

    if (currentTheme === 'none' || isUserMuted) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    container.classList.add(`theme-${currentTheme}`);

    // Inject Theme Elements
    if (currentTheme === 'durga-puja') {
      container.innerHTML = `
        ${ARTWORKS.marigoldToran}
        <div style="position: absolute; top: 38px; left: 0; right: 0; text-align: center; pointer-events: none;">
          ${ARTWORKS.durgaTrinayani}
        </div>
      `;
    } else if (currentTheme === 'diwali') {
      container.innerHTML = `
        <div class="fairy-lights-garland">
          ${Array.from({length: 18}).map((_, i) => {
            const colors = ['gold', 'ruby', 'emerald', 'sapphire'];
            return `<div class="diwali-bulb ${colors[i % 4]}"></div>`;
          }).join('')}
        </div>
        <div class="corner-diya left">${ARTWORKS.diya}</div>
        <div class="corner-diya right">${ARTWORKS.diya}</div>
        <canvas id="firecracker-canvas"></canvas>
      `;
      launchFirecrackers();
    } else if (currentTheme === 'holi') {
      container.innerHTML = `
        <div class="holi-splash splash-1"></div>
        <div class="holi-splash splash-2"></div>
        <div class="holi-splash splash-3"></div>
      `;
    } else if (currentTheme === 'independence-day') {
      container.innerHTML = `
        <div class="tiranga-top-bar"></div>
        <div class="chakra-badge">${ARTWORKS.ashokaChakra}</div>
      `;
    } else if (currentTheme === 'noboborsho') {
      container.innerHTML = `
        <div class="alpana-border"></div>
        <div class="noboborsho-ghat">${ARTWORKS.noboborshoGhat}</div>
      `;
    }
  };

  // --- Initialize Festive Engine ---
  async function initFestiveEngine() {
    // 1. Create Overlay Container if not present
    let container = document.getElementById('festive-overlay-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'festive-overlay-container';
      document.body.prepend(container);
    }

    // 2. Create User Mute/Unmute Pill
    let toggleBtn = document.getElementById('festive-toggle-pill');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.id = 'festive-toggle-pill';
      toggleBtn.className = 'festive-mood-toggle';
      toggleBtn.innerHTML = isUserMuted ? '🪔 Festive Decor: OFF' : '🪔 Festive Decor: ON';
      toggleBtn.onclick = function() {
        isUserMuted = !isUserMuted;
        localStorage.setItem('bde_festive_muted', isUserMuted ? 'true' : 'false');
        toggleBtn.innerHTML = isUserMuted ? '🪔 Festive Decor: OFF' : '🪔 Festive Decor: ON';
        window.applyFestiveTheme(currentTheme);
      };
      document.body.appendChild(toggleBtn);
    }

    // 3. Performance Optimization: Pause animations on heavy scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        container.classList.add('paused');
      } else {
        container.classList.remove('paused');
      }
    }, { passive: true });

    // 4. Fetch Active Theme from Backend
    try {
      const res = await fetch('/api/festival-theme');
      if (res.ok) {
        const data = await res.json();
        window.applyFestiveTheme(data.theme);
      }
    } catch (err) {
      console.warn('Could not load festival theme, defaulting to durga-puja:', err);
      window.applyFestiveTheme('durga-puja');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFestiveEngine);
  } else {
    initFestiveEngine();
  }
})();
