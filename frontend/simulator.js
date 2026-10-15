/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * 3D Furniture & Laminate Studio Simulator Engine
 * Parametric Real-time Vector Visualizer & BOM Calculator
 *
 * Supported Structures:
 * 1. 2-Door Compact Wardrobe (wardrobe2)
 * 2. 4-Door Modern Wardrobe (wardrobe)
 * 3. Master 6-Door Wardrobe & Lofts (wardrobe6)
 * 4. Full-Wall Storage Suite (fullwall) with 3 layouts:
 *    - Standard (Wardrobe + Center Display Rack + Utility Cabinet)
 *    - Entertainment (Dual Wardrobes + Center Open TV Niche)
 *    - Full Wardrobe (Continuous Monolithic Wall)
 * 5. Modern Modular Kitchen (kitchen)
 * 6. Classic Wooden Almirah with Mirror (almirah)
 * 7. Hydraulic Box Bed / Divan (bed)
 * 8. Floating Wall TV Entertainment Unit (tvunit)
 * 9. Luxury LED Dressing Vanity (dressing)
 * 10. Executive Office & Study Desk (office)
 */

(function () {
  'use strict';

  // --- 1. SIMULATOR STATE ---
  window.SIM_STATE = {
    structure: 'wardrobe',  // Default structure
    zoneA: 'teak',          // Carcass / Frame / Body / Backsplash
    zoneB: 'carrara',       // Shutters / Doors / Fronts
    activeZone: 'B',        // Current zone selected for swatch: 'A' or 'B'
    hardware: 'gold',       // 'gold', 'black', 'chrome', 'concealed'
    isOpen: false,          // Open doors / drawers toggle
    isWarmLight: true,      // Showroom 3000K warm LED spotlight mode
    showWireframe: false,   // Technical dimension wireframe
    showHumanScale: true,   // 5.5 ft Human Reference Silhouette
    plyGrade: 'marine',     // 'marine' (Club IS:710) or 'commercial' (Tycon IS:303)
    laminateType: 'gloss',  // 'gloss' (1.0mm) or 'matt' (0.8mm)
    fullwallConfig: 'standard', // 'standard', 'entertainment', 'full_wardrobe'
    activeCategory: 'all',  // 'all', 'wardrobes', 'kitchen', 'bedroom', 'living'
    dimensions: {
      wardrobe2: { width: 4.0, height: 7.0, depth: 1.75, label: '4.0 ft (2-Door Compact)' },
      wardrobe:  { width: 6.0, height: 7.0, depth: 2.0,  label: '6.0 ft (4-Door Standard)' },
      wardrobe6: { width: 10.0, height: 7.5, depth: 2.0, label: '10.0 ft Master 6-Door' },
      fullwall:  { width: 12.0, height: 8.5, depth: 2.0, label: '12.0 ft Full-Wall Suite' },
      kitchen:   { width: 9.0, height: 7.0, depth: 2.0,  label: '9.0 ft Modular Kitchen' },
      almirah:   { width: 4.0, height: 6.5, depth: 1.75, label: '4.0 ft (2-Door + Mirror)' },
      bed:       { width: 5.0, length: 6.5, height: 3.5, label: 'Queen (5.0 ft × 6.5 ft)' },
      tvunit:    { width: 7.0, height: 6.0, depth: 1.25, label: '7.0 ft Entertainment Wall' },
      dressing:  { width: 3.5, height: 6.5, depth: 1.5,  label: '3.5 ft LED Vanity Unit' },
      office:    { width: 4.5, height: 2.5, depth: 2.0,  label: '4.5 ft Executive Desk' }
    }
  };

  // --- 2. LAMINATE CATALOG & SWATCHES ---
  window.LAMINATE_CATALOG = [
    // Woodgrains
    { id: 'teak', name: 'Royal Burma Teak', code: 'BDE-801', category: 'wood', baseColor: '#b47b48', desc: 'Warm golden teak with rich linear grain' },
    { id: 'walnut', name: 'Smoked American Walnut', code: 'BDE-805', category: 'wood', baseColor: '#5c3a21', desc: 'Deep espresso chocolate wavy grain' },
    { id: 'oak', name: 'Scandinavian White Oak', code: 'BDE-809', category: 'wood', baseColor: '#d6c0a2', desc: 'Modern light blonde woodgrain' },
    { id: 'wenge', name: 'Ebony Dark Wenge', code: 'BDE-814', category: 'wood', baseColor: '#2b231d', desc: 'Contemporary dark charcoal-brown timber' },
    { id: 'rosewood', name: 'Sheesham Rosewood', code: 'BDE-820', category: 'wood', baseColor: '#8a3324', desc: 'Vibrant reddish-amber rustic grain' },

    // Italian Marble & Stones
    { id: 'carrara', name: 'Carrara White Marble', code: 'BDE-901', category: 'marble', baseColor: '#f1f5f9', desc: 'High-gloss white with smoky gray veining' },
    { id: 'marquina', name: 'Nero Marquina Black', code: 'BDE-908', category: 'marble', baseColor: '#0f172a', desc: 'Obsidian black stone with gold metallic veins' },
    { id: 'travertine', name: 'Roman Travertine', code: 'BDE-915', category: 'marble', baseColor: '#e7dec8', desc: 'Warm porous linear limestone texture' },

    // Modern Super-Matte Solids
    { id: 'charcoal', name: 'Slate Charcoal Matte', code: 'BDE-701', category: 'solid', baseColor: '#334155', desc: 'Ultra-luxurious anti-fingerprint slate grey' },
    { id: 'white', name: 'Nordic Off-White / Pearl', code: 'BDE-704', category: 'solid', baseColor: '#fdfbf7', desc: 'Clean, crisp, reflective minimalist matte' },
    { id: 'sage', name: 'Earthy Sage Green', code: 'BDE-711', category: 'solid', baseColor: '#627264', desc: 'Trending organic botanical pastel' },
    { id: 'navy', name: 'Royal Midnight Navy', code: 'BDE-718', category: 'solid', baseColor: '#1e293b', desc: 'Deep royal blue with velvet finish' },
    { id: 'terracotta', name: 'Tuscan Terracotta', code: 'BDE-725', category: 'solid', baseColor: '#b85d43', desc: 'Warm architectural burnt clay tone' },

    // 3D Fluted Louvers & Metallics
    { id: 'fluted_wood', name: 'Fluted Teak Louvers', code: 'BDE-601', category: 'fluted', baseColor: '#a76a36', desc: 'Vertical 3D slatted acoustic wooden battens' },
    { id: 'fluted_charcoal', name: 'Fluted Midnight Louver', code: 'BDE-608', category: 'fluted', baseColor: '#1e2530', desc: 'Architectural ribbed acoustic charcoal slats' },
    { id: 'metallic_brass', name: 'Brushed Champagne Brass', code: 'BDE-501', category: 'fluted', baseColor: '#d4af37', desc: 'Metallic reflective warm golden sheen' }
  ];

  window.HARDWARE_CATALOG = [
    { id: 'gold', name: 'Brushed Champagne Gold', color: '#eab308', icon: '✨' },
    { id: 'black', name: 'Matte Midnight Black', color: '#18181b', icon: '🖤' },
    { id: 'chrome', name: 'Mirror Polished Chrome', color: '#cbd5e1', icon: '🔘' },
    { id: 'concealed', name: 'J-Profile Edge (No Handles)', color: '#64748b', icon: '➖' }
  ];

  function getSwatch(id) {
    return window.LAMINATE_CATALOG.find(s => s.id === id) || window.LAMINATE_CATALOG[0];
  }

  function getLaminateFill(laminateId) {
    const swatch = getSwatch(laminateId);
    if (['teak', 'walnut', 'oak', 'wenge', 'rosewood', 'carrara', 'marquina', 'travertine', 'fluted_wood', 'fluted_charcoal', 'metallic_brass'].includes(laminateId)) {
      return `url(#pat-${laminateId})`;
    }
    return swatch.baseColor;
  }

  function getHardwareFill() {
    if (window.SIM_STATE.hardware === 'gold') return 'url(#hw-gold)';
    if (window.SIM_STATE.hardware === 'black') return 'url(#hw-black)';
    if (window.SIM_STATE.hardware === 'chrome') return 'url(#hw-chrome)';
    return 'none';
  }

  // --- 3. SVG PATTERNS & SHADERS INJECTION ---
  function getSvgDefs() {
    return `
      <defs>
        <!-- Filter: Showroom Warm Spotlight Glow -->
        <radialGradient id="sim-spotlight" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.32" />
          <stop offset="60%" stop-color="#fef3c7" stop-opacity="0.10" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
        </radialGradient>

        <!-- Filter: Studio Floor Perspective Drop Shadow -->
        <radialGradient id="sim-floor-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(15,23,42,0.45)" />
          <stop offset="70%" stop-color="rgba(15,23,42,0.12)" />
          <stop offset="100%" stop-color="rgba(15,23,42,0)" />
        </radialGradient>

        <!-- Hardware Gradients -->
        <linearGradient id="hw-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#CA8A04" />
          <stop offset="35%" stop-color="#FDE047" />
          <stop offset="65%" stop-color="#EAB308" />
          <stop offset="100%" stop-color="#A16207" />
        </linearGradient>

        <linearGradient id="hw-black" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#09090b" />
          <stop offset="50%" stop-color="#27272a" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>

        <linearGradient id="hw-chrome" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="30%" stop-color="#f8fafc" />
          <stop offset="70%" stop-color="#cbd5e1" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>

        <!-- Mirror Glass Sheen -->
        <linearGradient id="mirror-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.85" />
          <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.65" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="65%" stop-color="#bae6fd" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.80" />
        </linearGradient>

        <!-- TV Screen Gloss -->
        <linearGradient id="tv-gloss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="45%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>

        <!-- Kitchen Countertop Granite -->
        <linearGradient id="countertop-granite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#18181b" />
          <stop offset="40%" stop-color="#27272a" />
          <stop offset="50%" stop-color="#3f3f46" />
          <stop offset="60%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>

        <!-- LED Ambient Backlight Glow -->
        <linearGradient id="led-strip-glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0.0" />
        </linearGradient>

        <!-- Woodgrain Patterns -->
        <pattern id="pat-teak" width="40" height="120" patternUnits="userSpaceOnUse">
          <rect width="40" height="120" fill="#b47b48" />
          <path d="M0,0 Q20,30 40,15 M0,25 Q15,60 40,40 M0,55 Q25,85 40,70 M0,85 Q10,105 40,95 M0,110 Q20,120 40,115" stroke="#8d5626" stroke-width="1.6" fill="none" opacity="0.55" />
          <path d="M5,10 Q25,45 5,80 M35,20 Q15,70 35,110" stroke="#714119" stroke-width="0.8" fill="none" opacity="0.35" />
        </pattern>

        <pattern id="pat-walnut" width="45" height="130" patternUnits="userSpaceOnUse">
          <rect width="45" height="130" fill="#4a2e1b" />
          <path d="M0,10 Q22,40 45,20 M0,45 Q18,75 45,55 M0,80 Q25,110 45,90 M0,115 Q20,130 45,120" stroke="#311c0f" stroke-width="2.2" fill="none" opacity="0.65" />
          <ellipse cx="22" cy="65" rx="8" ry="18" fill="none" stroke="#25140a" stroke-width="1.2" opacity="0.45" />
        </pattern>

        <pattern id="pat-oak" width="30" height="90" patternUnits="userSpaceOnUse">
          <rect width="30" height="90" fill="#d6c0a2" />
          <line x1="6" y1="0" x2="6" y2="90" stroke="#bfaa8f" stroke-width="1.4" opacity="0.6" stroke-dasharray="20,4,10,2" />
          <line x1="16" y1="0" x2="16" y2="90" stroke="#af987d" stroke-width="1.8" opacity="0.65" stroke-dasharray="15,6,35,4" />
          <line x1="24" y1="0" x2="24" y2="90" stroke="#bfaa8f" stroke-width="1.2" opacity="0.55" />
        </pattern>

        <pattern id="pat-wenge" width="25" height="80" patternUnits="userSpaceOnUse">
          <rect width="25" height="80" fill="#241c18" />
          <line x1="5" y1="0" x2="5" y2="80" stroke="#120d0a" stroke-width="1.8" opacity="0.75" />
          <line x1="12" y1="0" x2="12" y2="80" stroke="#3d302a" stroke-width="1" opacity="0.4" />
          <line x1="19" y1="0" x2="19" y2="80" stroke="#120d0a" stroke-width="2.2" opacity="0.8" />
        </pattern>

        <pattern id="pat-rosewood" width="35" height="110" patternUnits="userSpaceOnUse">
          <rect width="35" height="110" fill="#7a2e20" />
          <path d="M0,0 Q18,30 35,15 M0,35 Q20,65 35,50 M0,70 Q15,95 35,85" stroke="#4a180e" stroke-width="2" fill="none" opacity="0.6" />
          <path d="M0,15 Q25,45 35,30 M0,50 Q10,80 35,65" stroke="#993d2b" stroke-width="1" fill="none" opacity="0.4" />
        </pattern>

        <!-- Marble Patterns -->
        <pattern id="pat-carrara" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#f8fafc" />
          <path d="M0,20 Q40,40 60,10 T120,35 M20,120 Q50,70 80,95 T120,60 M-10,80 Q30,90 50,60" stroke="#cbd5e1" stroke-width="2.2" fill="none" opacity="0.6" stroke-linecap="round" />
          <path d="M10,25 Q45,45 65,15 M25,115 Q55,65 85,90" stroke="#94a3b8" stroke-width="0.8" fill="none" opacity="0.45" />
        </pattern>

        <pattern id="pat-marquina" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#0f172a" />
          <path d="M0,30 Q45,15 75,50 T120,20 M10,100 Q60,75 90,110 T120,80" stroke="#eab308" stroke-width="1.8" fill="none" opacity="0.75" />
          <path d="M5,35 Q50,20 80,55 M15,95 Q65,70 95,105" stroke="#fef08a" stroke-width="0.7" fill="none" opacity="0.5" />
          <path d="M30,0 Q50,40 40,80" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.35" />
        </pattern>

        <pattern id="pat-travertine" width="60" height="40" patternUnits="userSpaceOnUse">
          <rect width="60" height="40" fill="#e7dec8" />
          <line x1="0" y1="8" x2="60" y2="8" stroke="#d5c8ab" stroke-width="1.5" stroke-dasharray="12,4,8,2" />
          <line x1="0" y1="18" x2="60" y2="18" stroke="#f2ebda" stroke-width="2" stroke-dasharray="20,6,14,3" />
          <line x1="0" y1="28" x2="60" y2="28" stroke="#c8ba99" stroke-width="1.2" stroke-dasharray="8,5,15,4" />
        </pattern>

        <pattern id="pat-fluted_wood" width="16" height="40" patternUnits="userSpaceOnUse">
          <rect width="16" height="40" fill="#a76a36" />
          <rect x="0" y="0" width="8" height="40" fill="#c4854d" />
          <rect x="8" y="0" width="8" height="40" fill="#78471e" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#e0a369" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="40" stroke="#523013" stroke-width="1.2" />
        </pattern>

        <pattern id="pat-fluted_charcoal" width="16" height="40" patternUnits="userSpaceOnUse">
          <rect width="16" height="40" fill="#1e2530" />
          <rect x="0" y="0" width="8" height="40" fill="#334155" />
          <rect x="8" y="0" width="8" height="40" fill="#0f172a" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#475569" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="40" stroke="#020617" stroke-width="1.2" />
        </pattern>

        <pattern id="pat-metallic_brass" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#d4af37" />
          <line x1="0" y1="0" x2="30" y2="30" stroke="#fef08a" stroke-width="0.6" opacity="0.4" />
          <line x1="0" y1="15" x2="30" y2="45" stroke="#a16207" stroke-width="0.8" opacity="0.3" />
        </pattern>
      </defs>
    `;
  }

  // --- 4. HUMAN REFERENCE SILHOUETTE (5.5 ft / 168 cm) ---
  function renderHumanScaleFigure(floorY, pxPerFoot) {
    if (!window.SIM_STATE.showHumanScale) return '';

    // A 5.5 ft person height in pixels
    const personHeight = 5.5 * pxPerFoot;
    const feetY = floorY;
    const headTopY = feetY - personHeight;
    const posX = 70; // Position on left of stage

    return `
      <!-- Human 5.5 ft Reference Silhouette -->
      <g id="sim-human-figure" opacity="0.85">
        <!-- Floor Shadow under feet -->
        <ellipse cx="${posX}" cy="${feetY + 2}" rx="14" ry="4" fill="rgba(15,23,42,0.3)" />

        <!-- Head -->
        <circle cx="${posX}" cy="${headTopY + 12}" r="9" fill="#475569" />

        <!-- Neck & Torso -->
        <path d="M${posX - 9},${headTopY + 24} Q${posX},${headTopY + 20} ${posX + 9},${headTopY + 24} L${posX + 8},${headTopY + 95} L${posX - 8},${headTopY + 95} Z" fill="#334155" />

        <!-- Arms -->
        <path d="M${posX - 9},${headTopY + 26} L${posX - 13},${headTopY + 80} L${posX - 10},${headTopY + 82} L${posX - 6},${headTopY + 34} Z" fill="#334155" />
        <path d="M${posX + 9},${headTopY + 26} L${posX + 13},${headTopY + 80} L${posX + 10},${headTopY + 82} L${posX + 6},${headTopY + 34} Z" fill="#334155" />

        <!-- Legs & Trousers -->
        <line x1="${posX - 4}" y1="${headTopY + 95}" x2="${posX - 4}" y2="${feetY - 5}" stroke="#1e293b" stroke-width="6" stroke-linecap="round" />
        <line x1="${posX + 4}" y1="${headTopY + 95}" x2="${posX + 4}" y2="${feetY - 5}" stroke="#1e293b" stroke-width="6" stroke-linecap="round" />

        <!-- Shoes -->
        <ellipse cx="${posX - 5}" cy="${feetY - 2}" rx="5" ry="3" fill="#09090b" />
        <ellipse cx="${posX + 5}" cy="${feetY - 2}" rx="5" ry="3" fill="#09090b" />

        <!-- Height Measurement Guide Line -->
        <line x1="${posX - 18}" y1="${headTopY}" x2="${posX - 18}" y2="${feetY}" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="3,3" />
        <circle cx="${posX - 18}" cy="${headTopY}" r="2.5" fill="#2563eb" />
        <circle cx="${posX - 18}" cy="${feetY}" r="2.5" fill="#2563eb" />

        <!-- Height Badge -->
        <rect x="${posX - 48}" y="${headTopY + (personHeight / 2) - 10}" width="60" height="18" rx="4" fill="#1e3a8a" />
        <text x="${posX - 18}" y="${headTopY + (personHeight / 2) + 3}" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">5.5 ft</text>
      </g>
    `;
  }

  // Helper to compute responsive parametric placement on canvas (viewBox: 0 0 740 500)
  function getPlacement(dim) {
    const floorY = 430;
    const pxPerFoot = 43.0; // 1 foot = ~43 px

    // Compute furniture dimensions in pixels based on width and height
    const wFt = dim.width || 6.0;
    const hFt = dim.height || 7.0;

    const furnH = Math.min(410, Math.max(120, hFt * pxPerFoot));
    const furnW = Math.min(580, Math.max(160, wFt * 36.0));

    // Center furniture in right area (X from 130 to 720, center is 425)
    const centerX = 425;
    const furnX = Math.round(centerX - (furnW / 2));
    const furnY = Math.round(floorY - furnH);

    return {
      floorY,
      pxPerFoot,
      x: furnX,
      y: furnY,
      w: furnW,
      h: furnH,
      plinthH: 14
    };
  }

  // --- 5. STRUCTURE 1: 2-DOOR COMPACT WARDROBE ---
  function renderWardrobe2Svg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const loftH = Math.round(h * 0.22);
    const mainH = h - loftH - plinthH;
    const doorW = Math.round(w / 2);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 20}" ry="12" fill="url(#sim-floor-shadow)" />
      <!-- Carcass -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />
      <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.2" />

      ${isOpen ? `
        <!-- OPEN 2-DOOR INTERIOR -->
        <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - plinthH - 12}" fill="#faf5ee" stroke="#78350f" stroke-width="1.2" />
        <line x1="${x + 6}" y1="${y + loftH}" x2="${x + w - 6}" y2="${y + loftH}" stroke="#b47b48" stroke-width="4" />
        <!-- Hanging Rod -->
        <line x1="${x + 12}" y1="${y + loftH + 20}" x2="${x + w - 12}" y2="${y + loftH + 20}" stroke="#94a3b8" stroke-width="3.5" />
        <rect x="${x + 20}" y="${y + loftH + 28}" width="28" height="95" rx="3" fill="#2563eb" opacity="0.75" />
        <rect x="${x + 58}" y="${y + loftH + 28}" width="28" height="105" rx="3" fill="#059669" opacity="0.75" />
        <!-- Lower Shelf -->
        <line x1="${x + 6}" y1="${y + h - plinthH - 65}" x2="${x + w - 6}" y2="${y + h - plinthH - 65}" stroke="#b47b48" stroke-width="4" />
        <text x="${x + w / 2}" y="${y + h - plinthH - 28}" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">FOLDED CLOTHES / BOXES</text>
        <!-- Swung Doors -->
        <polygon points="${x + 6},${y + 6} ${x - 30},${y - 5} ${x - 30},${y + h} ${x + 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <polygon points="${x + w - 6},${y + 6} ${x + w + 30},${y - 5} ${x + w + 30},${y + h} ${x + w - 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      ` : `
        <!-- CLOSED SHUTTERS -->
        <!-- Top Lofts (2 overhead doors) -->
        <rect x="${x + 3}" y="${y + 3}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + doorW + 1}" y="${y + 3}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 2 Main Tall Doors -->
        <rect x="${x + 3}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 50}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + doorW + 1}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 50}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 1 Wide Bottom Drawer -->
        <rect x="${x + 3}" y="${y + h - plinthH - 46}" width="${w - 6}" height="44" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Handles -->
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + doorW - 8}" y="${y + loftH + mainH / 2 - 40}" width="5" height="65" rx="2.5" fill="${hwFill}" />
          <rect x="${x + doorW + 3}" y="${y + loftH + mainH / 2 - 40}" width="5" height="65" rx="2.5" fill="${hwFill}" />
          <rect x="${x + w / 2 - 20}" y="${y + h - plinthH - 26}" width="40" height="5" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="${x + doorW}" y1="${y + loftH + 10}" x2="${x + doorW}" y2="${y + h - plinthH - 50}" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
      `}
    `;
  }

  // --- 6. STRUCTURE 2: 4-DOOR MODERN WARDROBE ---
  function renderWardrobeSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const loftH = Math.round(h * 0.22);
    const mainH = h - loftH - plinthH;
    const doorW = Math.round(w / 4);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      ${isOpen ? `
        <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - plinthH - 12}" fill="#faf5ee" stroke="#78350f" stroke-width="1.5" />
        <line x1="${x + w / 2}" y1="${y + 6}" x2="${x + w / 2}" y2="${y + h - plinthH}" stroke="#b47b48" stroke-width="5" />
        <line x1="${x + 6}" y1="${y + loftH}" x2="${x + w - 6}" y2="${y + loftH}" stroke="#b47b48" stroke-width="5" />
        <line x1="${x + 10}" y1="${y + loftH + 22}" x2="${x + w / 2 - 10}" y2="${y + loftH + 22}" stroke="#94a3b8" stroke-width="4" />
        <rect x="${x + 20}" y="${y + loftH + 30}" width="26" height="100" rx="3" fill="#2563eb" opacity="0.7" />
        <rect x="${x + 55}" y="${y + loftH + 30}" width="26" height="110" rx="3" fill="#059669" opacity="0.7" />
        <line x1="${x + w / 2}" y1="${y + loftH + 80}" x2="${x + w - 6}" y2="${y + loftH + 80}" stroke="#b47b48" stroke-width="4" />
        <line x1="${x + w / 2}" y1="${y + loftH + 150}" x2="${x + w - 6}" y2="${y + loftH + 150}" stroke="#b47b48" stroke-width="4" />
        <rect x="${x + w / 2 + 15}" y="${y + loftH + 160}" width="${w / 2 - 30}" height="45" rx="3" fill="${fillB}" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="${x + (3 * w) / 4}" cy="${y + loftH + 182}" r="5" fill="#ca8a04" />
        <polygon points="${x + 6},${y + 6} ${x - 35},${y - 8} ${x - 35},${y + h} ${x + 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
        <polygon points="${x + w - 6},${y + 6} ${x + w + 35},${y - 8} ${x + w + 35},${y + h} ${x + w - 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      ` : `
        <!-- Top Lofts (2 pairs) -->
        <rect x="${x + 3}" y="${y + 3}" width="${w / 2 - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + w / 2 + 1}" y="${y + 3}" width="${w / 2 - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 4 Tall Doors -->
        <rect x="${x + 3}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + doorW + 1}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 2 * doorW + 1}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 3 * doorW + 1}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 2 Center Bottom Drawers -->
        <rect x="${x + doorW + 2}" y="${y + h - plinthH - 55}" width="${doorW - 6}" height="53" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 2 * doorW + 2}" y="${y + h - plinthH - 55}" width="${doorW - 6}" height="53" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Handles -->
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + doorW - 7}" y="${y + loftH + mainH / 2 - 45}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + doorW + 3}" y="${y + loftH + mainH / 2 - 45}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + 3 * doorW - 7}" y="${y + loftH + mainH / 2 - 45}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + 3 * doorW + 3}" y="${y + loftH + mainH / 2 - 45}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : `
          <line x1="${x + doorW}" y1="${y + loftH + 10}" x2="${x + doorW}" y2="${y + h - plinthH - 10}" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="${x + 3 * doorW}" y1="${y + loftH + 10}" x2="${x + 3 * doorW}" y2="${y + h - plinthH - 10}" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
      `}
    `;
  }

  // --- 7. STRUCTURE 3: MASTER 6-DOOR WARDROBE ---
  function renderWardrobe6Svg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const loftH = Math.round(h * 0.22);
    const mainH = h - loftH - plinthH;
    const doorW = Math.round(w / 6);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 30}" ry="16" fill="url(#sim-floor-shadow)" />
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      ${isOpen ? `
        <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - plinthH - 12}" fill="#faf5ee" stroke="#78350f" stroke-width="1.5" />
        <line x1="${x + w / 3}" y1="${y + 6}" x2="${x + w / 3}" y2="${y + h - plinthH}" stroke="#b47b48" stroke-width="5" />
        <line x1="${x + (2 * w) / 3}" y1="${y + 6}" x2="${x + (2 * w) / 3}" y2="${y + h - plinthH}" stroke="#b47b48" stroke-width="5" />
        <line x1="${x + 6}" y1="${y + loftH}" x2="${x + w - 6}" y2="${y + loftH}" stroke="#b47b48" stroke-width="5" />

        <!-- Left Bay ("His") -->
        <line x1="${x + 12}" y1="${y + loftH + 20}" x2="${x + w / 3 - 12}" y2="${y + loftH + 20}" stroke="#94a3b8" stroke-width="3.5" />
        <rect x="${x + 20}" y="${y + loftH + 28}" width="28" height="110" rx="3" fill="#1e3a8a" opacity="0.75" />
        <rect x="${x + 55}" y="${y + loftH + 28}" width="28" height="115" rx="3" fill="#334155" opacity="0.75" />

        <!-- Center Bay (Twin Tijori & Glass Drawers) -->
        <rect x="${x + w / 3 + 12}" y="${y + loftH + 20}" width="${w / 3 - 24}" height="70" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="${x + w / 2}" cy="${y + loftH + 55}" r="7" fill="#ca8a04" />
        <text x="${x + w / 2}" y="${y + loftH + 42}" font-size="8.5" font-weight="900" fill="#1e1b4b" text-anchor="middle">TWIN TIJORI VAULT</text>

        <!-- Right Bay ("Hers" Sarees & Gowns) -->
        <line x1="${x + (2 * w) / 3 + 12}" y1="${y + loftH + 20}" x2="${x + w - 12}" y2="${y + loftH + 20}" stroke="#94a3b8" stroke-width="3.5" />
        <rect x="${x + (2 * w) / 3 + 20}" y="${y + loftH + 28}" width="28" height="140" rx="3" fill="#be123c" opacity="0.75" />
        <rect x="${x + (2 * w) / 3 + 55}" y="${y + loftH + 28}" width="28" height="145" rx="3" fill="#7c3aed" opacity="0.75" />

        <polygon points="${x + 6},${y + 6} ${x - 40},${y - 8} ${x - 40},${y + h} ${x + 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
        <polygon points="${x + w - 6},${y + 6} ${x + w + 40},${y - 8} ${x + w + 40},${y + h} ${x + w - 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      ` : `
        <!-- 6 Overhead Lofts -->
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <rect x="${x + i * doorW + 2}" y="${y + 2}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        `).join('')}

        <!-- 6 Tall Doors -->
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <rect x="${x + i * doorW + 2}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        `).join('')}

        <!-- Handles -->
        ${s.hardware !== 'concealed' ? [0, 2, 4].map(i => `
          <rect x="${x + (i + 1) * doorW - 7}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
          <rect x="${x + (i + 1) * doorW + 2}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
        `).join('') : ''}
      `}
    `;
  }

  // --- 8. STRUCTURE 4: FULL-WALL STORAGE SUITE (3 CONFIGURATIONS) ---
  function renderFullWallSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const cfg = s.fullwallConfig || 'standard';
    const { x, y, w, h, plinthH, floorY } = p;

    const loftH = Math.round(h * 0.20);
    const mainH = h - loftH - plinthH;

    // CONFIG 1: STANDARD (Wardrobe Left + Center Display Rack + Cabinet Right)
    if (cfg === 'standard') {
      const leftW = Math.round(w * 0.40);
      const centerW = Math.round(w * 0.30);
      const rightW = w - leftW - centerW;

      return `
        <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 35}" ry="16" fill="url(#sim-floor-shadow)" />
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
        <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Continuous Top Loft Bridge -->
        <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${loftH - 4}" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <line x1="${x + leftW}" y1="${y}" x2="${x + leftW}" y2="${y + loftH}" stroke="#0f172a" stroke-width="1.8" />
        <line x1="${x + leftW + centerW}" y1="${y}" x2="${x + leftW + centerW}" y2="${y + loftH}" stroke="#0f172a" stroke-width="1.8" />

        <!-- LEFT SECTION: 2/3-Door Wardrobe -->
        <rect x="${x + 2}" y="${y + loftH}" width="${leftW - 4}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <line x1="${x + leftW / 2}" y1="${y + loftH}" x2="${x + leftW / 2}" y2="${y + loftH + mainH}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + leftW / 2 - 7}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + leftW / 2 + 2}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}

        <!-- CENTER SECTION: OPEN BACKLIT DISPLAY RACK -->
        <rect x="${x + leftW}" y="${y + loftH}" width="${centerW}" height="${mainH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
        <rect x="${x + leftW}" y="${y + loftH}" width="${centerW}" height="25" fill="url(#led-strip-glow)" />
        <!-- 4 Display Shelves -->
        ${[1, 2, 3, 4].map(idx => `
          <line x1="${x + leftW}" y1="${y + loftH + (idx * mainH) / 5}" x2="${x + leftW + centerW}" y2="${y + loftH + (idx * mainH) / 5}" stroke="#0f172a" stroke-width="2.5" />
        `).join('')}
        <!-- Artifacts on display -->
        <circle cx="${x + leftW + centerW / 2}" cy="${y + loftH + (mainH / 5) - 14}" r="8" fill="#ca8a04" />
        <rect x="${x + leftW + 15}" y="${y + loftH + (2 * mainH) / 5 - 24}" width="8" height="24" rx="2" fill="#dc2626" />
        <rect x="${x + leftW + 25}" y="${y + loftH + (2 * mainH) / 5 - 20}" width="8" height="20" rx="2" fill="#2563eb" />
        <circle cx="${x + leftW + centerW - 25}" cy="${y + loftH + (2 * mainH) / 5 - 12}" r="10" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
        <!-- Bottom 2 Drawers in Center -->
        <rect x="${x + leftW + 2}" y="${y + loftH + (4 * mainH) / 5 + 2}" width="${centerW - 4}" height="${mainH / 5 - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- RIGHT SECTION: Multi-Utility Storage Cabinet -->
        <rect x="${x + leftW + centerW}" y="${y + loftH}" width="${rightW - 2}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <line x1="${x + leftW + centerW + rightW / 2}" y1="${y + loftH}" x2="${x + leftW + centerW + rightW / 2}" y2="${y + loftH + mainH}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + leftW + centerW + rightW / 2 - 7}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + leftW + centerW + rightW / 2 + 2}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}
      `;
    }

    // CONFIG 2: ENTERTAINMENT (Dual Wardrobes Left & Right + Center TV Niche)
    if (cfg === 'entertainment') {
      const wardW = Math.round(w * 0.33);
      const tvW = w - 2 * wardW;

      return `
        <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 35}" ry="16" fill="url(#sim-floor-shadow)" />
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
        <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Continuous Top Loft Bridge -->
        <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${loftH - 4}" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- LEFT WARDROBE (Zone B) -->
        <rect x="${x + 2}" y="${y + loftH}" width="${wardW - 4}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + wardW - 12}" y="${y + loftH + mainH / 2 - 35}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}

        <!-- CENTER ENTERTAINMENT TV NICHE -->
        <rect x="${x + wardW}" y="${y + loftH}" width="${tvW}" height="${mainH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
        <!-- TV Backlight Ambient Halo -->
        <rect x="${x + wardW + 15}" y="${y + loftH + 20}" width="${tvW - 30}" height="${mainH - 90}" rx="6" fill="#fef08a" opacity="0.3" filter="blur(6px)" />
        <!-- 4K Smart TV -->
        <rect x="${x + wardW + 20}" y="${y + loftH + 25}" width="${tvW - 40}" height="${mainH - 100}" rx="3" fill="#020617" stroke="#334155" stroke-width="2" />
        <text x="${x + wardW + tvW / 2}" y="${y + loftH + (mainH - 100) / 2 + 25}" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">SMART 4K TV</text>
        <!-- Floating Media Drawer Console below TV -->
        <rect x="${x + wardW + 10}" y="${y + loftH + mainH - 65}" width="${tvW - 20}" height="55" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + wardW + tvW / 2 - 25}" y="${y + loftH + mainH - 38}" width="50" height="5" rx="2" fill="${hwFill}" />
        ` : ''}

        <!-- RIGHT WARDROBE (Zone B) -->
        <rect x="${x + wardW + tvW + 2}" y="${y + loftH}" width="${wardW - 4}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + wardW + tvW + 7}" y="${y + loftH + mainH / 2 - 35}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}
      `;
    }

    // CONFIG 3: FULL WARDROBE WALL (Continuous Monolithic Wall)
    const numDoors = Math.max(6, Math.round(w / 70));
    const doorW = Math.round(w / numDoors);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 35}" ry="16" fill="url(#sim-floor-shadow)" />
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      <!-- Continuous Overhead Lofts across entire width -->
      ${Array.from({ length: numDoors }).map((_, i) => `
        <rect x="${x + i * doorW + 2}" y="${y + 2}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      `).join('')}

      <!-- Continuous Main Tall Shutters across entire width -->
      ${Array.from({ length: numDoors }).map((_, i) => `
        <rect x="${x + i * doorW + 2}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      `).join('')}

      <!-- Profile Handles -->
      ${s.hardware !== 'concealed' ? Array.from({ length: Math.floor(numDoors / 2) }).map((_, i) => `
        <rect x="${x + (2 * i + 1) * doorW - 7}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
        <rect x="${x + (2 * i + 1) * doorW + 2}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
      `).join('') : ''}
    `;
  }

  // --- 9. STRUCTURE 5: MODERN MODULAR KITCHEN ---
  function renderKitchenSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const wallCabH = Math.round(h * 0.28);
    const dadoH = Math.round(h * 0.32);
    const counterY = y + wallCabH + dadoH;
    const baseH = floorY - counterY - plinthH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- Backsplash Wall Dado (Zone A) -->
      <rect x="${x}" y="${y + wallCabH}" width="${w}" height="${dadoH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x}" y="${y + wallCabH}" width="${w}" height="20" fill="url(#led-strip-glow)" />

      <!-- Hanging Utensil Rail -->
      <line x1="${x + 20}" y1="${y + wallCabH + 30}" x2="${x + w / 2 - 20}" y2="${y + wallCabH + 30}" stroke="#cbd5e1" stroke-width="2.5" />
      <path d="M${x + 40},${y + wallCabH + 30} L${x + 40},${y + wallCabH + 55} A5,5 0 0 0 ${x + 50},${y + wallCabH + 55}" fill="none" stroke="#94a3b8" stroke-width="2" />
      <path d="M${x + 80},${y + wallCabH + 30} L${x + 80},${y + wallCabH + 60}" stroke="#94a3b8" stroke-width="2" />

      <!-- Upper Wall Cabinets (Zone B) -->
      <rect x="${x}" y="${y}" width="${w / 2 - 50}" height="${wallCabH}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="${x + w / 2 + 50}" y="${y}" width="${w / 2 - 50}" height="${wallCabH}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />

      <!-- Center Chimney Hood -->
      <rect x="${x + w / 2 - 22}" y="${y - 15}" width="44" height="40" fill="url(#hw-chrome)" stroke="#64748b" stroke-width="1.2" />
      <polygon points="${x + w / 2 - 45},${y + wallCabH - 5} ${x + w / 2 + 45},${y + wallCabH - 5} ${x + w / 2 + 22},${y + 25} ${x + w / 2 - 22},${y + 25}" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="${x + w / 2 - 20}" cy="${y + wallCabH - 10}" r="3" fill="#fef08a" />
      <circle cx="${x + w / 2 + 20}" cy="${y + wallCabH - 10}" r="3" fill="#fef08a" />

      <!-- Granite Countertop Slab -->
      <rect x="${x - 10}" y="${counterY}" width="${w + 20}" height="18" rx="3" fill="url(#countertop-granite)" stroke="#09090b" stroke-width="2" />

      <!-- Gas Hob Cooktop & Sink on Counter -->
      <rect x="${x + w / 2 - 45}" y="${counterY - 4}" width="90" height="8" rx="2" fill="#020617" />
      <circle cx="${x + w / 2 - 25}" cy="${counterY}" r="3" fill="#ef4444" />
      <circle cx="${x + w / 2}" cy="${counterY}" r="4" fill="#ef4444" />
      <circle cx="${x + w / 2 + 25}" cy="${counterY}" r="3" fill="#ef4444" />

      <!-- Sink & Faucet -->
      <rect x="${x + w - 90}" y="${counterY - 3}" width="70" height="7" rx="2" fill="#94a3b8" />
      <path d="M${x + w - 55},${counterY - 3} L${x + w - 55},${counterY - 22} A10,10 0 0 1 ${x + w - 35},${counterY - 22} L${x + w - 35},${counterY - 16}" fill="none" stroke="url(#hw-chrome)" stroke-width="3" stroke-linecap="round" />

      <!-- Base Modular Cabinets (Zone B) -->
      <rect x="${x}" y="${counterY + 18}" width="${w}" height="${baseH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x}" y="${floorY - plinthH}" width="${w}" height="${plinthH}" fill="#18181b" stroke="#0f172a" stroke-width="1.2" />

      ${isOpen ? `
        <!-- Pulled-out Tandem Drawers -->
        <rect x="${x + 6}" y="${counterY + 22}" width="${w / 3 - 10}" height="35" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 6}" y="${counterY + 44}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">🥄 CUTLERY TRAY</text>
        <rect x="${x + 6}" y="${counterY + 62}" width="${w / 3 - 10}" height="35" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 6}" y="${counterY + 84}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">🍽️ CUP &amp; SAUCER</text>
        <rect x="${x + 6}" y="${counterY + 102}" width="${w / 3 - 10}" height="35" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 6}" y="${counterY + 124}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">🥘 THALI BASKET</text>
      ` : `
        <!-- Closed Modular Shutters -->
        <rect x="${x + 4}" y="${counterY + 22}" width="${w / 3 - 8}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 4}" y="${counterY + 22 + (baseH - 12) / 3 + 3}" width="${w / 3 - 8}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 4}" y="${counterY + 22 + (2 * (baseH - 12)) / 3 + 6}" width="${w / 3 - 8}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <rect x="${x + w / 3}" y="${counterY + 22}" width="${w / 3}" height="${baseH - 8}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + (2 * w) / 3 + 4}" y="${counterY + 22}" width="${w / 3 - 8}" height="${baseH - 8}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Handles -->
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + w / 6 - 20}" y="${counterY + 34}" width="40" height="4" rx="2" fill="${hwFill}" />
          <rect x="${x + w / 6 - 20}" y="${counterY + 74}" width="40" height="4" rx="2" fill="${hwFill}" />
          <rect x="${x + w / 6 - 20}" y="${counterY + 114}" width="40" height="4" rx="2" fill="${hwFill}" />
        ` : ''}
      `}
    `;
  }

  // --- 10. STRUCTURE 6: CLASSIC ALMIRAH (WITH DRESSING MIRROR) ---
  function renderAlmirahSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 20}" ry="14" fill="url(#sim-floor-shadow)" />
      <polygon points="${x - 10},${y} ${x},${y + 15} ${x + w},${y + 15} ${x + w + 10},${y}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x}" y="${y + 15}" width="${w}" height="${h - 15}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x - 5}" y="${floorY - plinthH}" width="${w + 10}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />

      ${isOpen ? `
        <rect x="${x + 6}" y="${y + 20}" width="${w - 12}" height="${h - plinthH - 26}" fill="#fefce8" stroke="#854d0e" stroke-width="1.5" />
        <line x1="${x + 6}" y1="${y + h * 0.3}" x2="${x + w - 6}" y2="${y + h * 0.3}" stroke="#a16207" stroke-width="4" />
        <line x1="${x + w / 2}" y1="${y + h * 0.3}" x2="${x + w / 2}" y2="${floorY - plinthH}" stroke="#a16207" stroke-width="4" />
        <rect x="${x + 12}" y="${y + h * 0.55}" width="${w / 2 - 24}" height="55" rx="3" fill="#1e293b" stroke="#ca8a04" stroke-width="1.5" />
        <circle cx="${x + w / 4}" cy="${y + h * 0.55 + 28}" r="6" fill="#eab308" />
        <text x="${x + w / 4}" y="${y + h * 0.55 + 18}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">TIJORI</text>
        <polygon points="${x + 6},${y + 20} ${x - 30},${y + 10} ${x - 30},${floorY} ${x + 6},${floorY - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <polygon points="${x + w - 6},${y + 20} ${x + w + 30},${y + 10} ${x + w + 30},${floorY} ${x + w - 6},${floorY - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      ` : `
        <!-- Left Door -->
        <rect x="${x + 3}" y="${y + 20}" width="${w / 2 - 5}" height="${h - plinthH - 70}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <!-- Right Door with BEVELED MIRROR -->
        <rect x="${x + w / 2 + 2}" y="${y + 20}" width="${w / 2 - 5}" height="${h - plinthH - 70}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="${x + w / 2 + 8}" y="${y + 26}" width="${w / 2 - 17}" height="${h - plinthH - 82}" rx="3" fill="url(#mirror-sheen)" stroke="#cbd5e1" stroke-width="2" />
        <line x1="${x + w / 2 + 15}" y1="${y + 35}" x2="${x + w - 20}" y2="${y + h * 0.4}" stroke="#ffffff" stroke-width="2.5" opacity="0.6" stroke-linecap="round" />
        <text x="${x + (3 * w) / 4}" y="${y + h - plinthH - 88}" font-size="8" font-weight="bold" fill="#1e3a8a" opacity="0.65" text-anchor="middle">BDE MIRROR</text>

        <!-- 2 Bottom Lockable Drawers -->
        <rect x="${x + 3}" y="${floorY - plinthH - 46}" width="${w / 2 - 5}" height="42" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="${x + w / 2 + 2}" y="${floorY - plinthH - 46}" width="${w / 2 - 5}" height="42" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />

        ${s.hardware !== 'concealed' ? `
          <circle cx="${x + w / 2 - 12}" cy="${y + h * 0.45}" r="5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
          <circle cx="${x + w / 2 + 8}" cy="${y + h * 0.45}" r="5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
        ` : ''}
      `}
    `;
  }

  // --- 11. STRUCTURE 7: HYDRAULIC BOX BED / DIVAN ---
  function renderBedSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, floorY } = p;

    const headboardH = Math.round(h * 0.65);
    const bedBoxH = Math.round(h * 0.35);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 30}" ry="16" fill="url(#sim-floor-shadow)" />
      <!-- Headboard Outer Frame -->
      <rect x="${x}" y="${y}" width="${w}" height="${headboardH}" rx="6" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x + 15}" y="${y + 12}" width="${w - 30}" height="${headboardH - 24}" rx="4" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />

      ${isOpen ? `
        <!-- Lifted Mattress & Storage Compartments -->
        <rect x="${x + 10}" y="${y + headboardH - 10}" width="${w - 20}" height="${bedBoxH + 10}" fill="#fef3c7" stroke="#92400e" stroke-width="2" />
        <line x1="${x + w / 2}" y1="${y + headboardH - 10}" x2="${x + w / 2}" y2="${floorY}" stroke="#92400e" stroke-width="5" />
        <rect x="${x + 20}" y="${y + headboardH + 10}" width="${w / 2 - 30}" height="${bedBoxH - 20}" rx="4" fill="#3b82f6" opacity="0.6" />
        <text x="${x + w / 4}" y="${y + headboardH + 35}" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">QUILTS / BLANKETS</text>
        <!-- Lifted Bed Top -->
        <polygon points="${x + 10},${y + headboardH - 10} ${x + w - 10},${y + headboardH - 10} ${x + w + 15},${y + headboardH - 70} ${x - 5},${y + headboardH - 70}" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <line x1="${x + 40}" y1="${y + headboardH + 10}" x2="${x + 25}" y2="${y + headboardH - 55}" stroke="#000000" stroke-width="4" />
      ` : `
        <!-- Mattress & Pillows -->
        <rect x="${x + 10}" y="${y + headboardH - 35}" width="${w - 20}" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <rect x="${x + 25}" y="${y + headboardH - 55}" width="${w / 2 - 40}" height="28" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="${x + w / 2 + 15}" y="${y + headboardH - 55}" width="${w / 2 - 40}" height="28" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        <!-- Bed Base Box (Zone A) -->
        <rect x="${x + 5}" y="${y + headboardH + 10}" width="${w - 10}" height="${bedBoxH - 10}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
        <!-- Pull-out Drawers -->
        <rect x="${x + 15}" y="${y + headboardH + 20}" width="${w / 2 - 25}" height="${bedBoxH - 26}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + w / 2 + 10}" y="${y + headboardH + 20}" width="${w / 2 - 25}" height="${bedBoxH - 26}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + w / 4 - 15}" y="${y + headboardH + bedBoxH / 2 + 5}" width="30" height="5" rx="2" fill="${hwFill}" />
          <rect x="${x + (3 * w) / 4 - 15}" y="${y + headboardH + bedBoxH / 2 + 5}" width="30" height="5" rx="2" fill="${hwFill}" />
        ` : ''}
      `}
    `;
  }

  // --- 12. STRUCTURE 8: FLOATING WALL TV UNIT ---
  function renderTVUnitSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, floorY } = p;

    return `
      <!-- Ambient Halo Glow -->
      <rect x="${x}" y="${y}" width="${w}" height="${h * 0.8}" rx="8" fill="#fef08a" opacity="0.25" filter="blur(8px)" />
      <!-- Left Fluted/Louver Wall (40%) -->
      <rect x="${x}" y="${y}" width="${w * 0.4}" height="${h * 0.8}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Right Marble Slab Wall (60%) -->
      <rect x="${x + w * 0.4}" y="${y}" width="${w * 0.6}" height="${h * 0.8}" rx="4" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      <!-- Mounted Smart TV -->
      <rect x="${x + w * 0.2}" y="${y + 35}" width="${w * 0.6}" height="${h * 0.45}" rx="3" fill="#020617" stroke="#334155" stroke-width="2" />
      <text x="${x + w / 2}" y="${y + 35 + (h * 0.45) / 2}" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">SMART 4K TV</text>

      <!-- Floating Media Console -->
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 10}" ry="10" fill="url(#sim-floor-shadow)" />
      <rect x="${x + 10}" y="${y + h * 0.85}" width="${w - 20}" height="${h * 0.15}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x + 15}" y="${y + h * 0.85 + 3}" width="${(w - 30) / 3}" height="${h * 0.15 - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="${x + 15 + (w - 30) / 3}" y="${y + h * 0.85 + 3}" width="${(w - 30) / 3}" height="${h * 0.15 - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="${x + 15 + (2 * (w - 30)) / 3}" y="${y + h * 0.85 + 3}" width="${(w - 30) / 3}" height="${h * 0.15 - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.2" />
    `;
  }

  // --- 13. STRUCTURE 9: LUXURY DRESSING VANITY ---
  function renderDressingSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const { x, y, w, h, floorY } = p;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 15}" ry="12" fill="url(#sim-floor-shadow)" />
      <rect x="${x}" y="${y}" width="${w}" height="${h * 0.6}" rx="6" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Arch LED Mirror -->
      <path d="M${x + 25},${y + h * 0.55} L${x + 25},${y + 40} A${w * 0.25},${w * 0.25} 0 0 1 ${x + w * 0.5 + 25},${y + 40} L${x + w * 0.5 + 25},${y + h * 0.55} Z" fill="url(#mirror-sheen)" stroke="#cbd5e1" stroke-width="2.5" />
      <!-- Vanity Tabletop -->
      <polygon points="${x - 10},${y + h * 0.6} ${x + w + 10},${y + h * 0.6} ${x + w},${y + h * 0.64} ${x},${y + h * 0.64}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- 3-Tier Side Cosmetic Drawers -->
      <rect x="${x + w * 0.55}" y="${y + h * 0.64}" width="${w * 0.45}" height="${h * 0.36}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="${x + w * 0.55 + 4}" y="${y + h * 0.64 + 4}" width="${w * 0.45 - 8}" height="${(h * 0.36 - 16) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="${x + w * 0.55 + 4}" y="${y + h * 0.64 + (h * 0.36 - 16) / 3 + 8}" width="${w * 0.45 - 8}" height="${(h * 0.36 - 16) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="${x + w * 0.55 + 4}" y="${y + h * 0.64 + (2 * (h * 0.36 - 16)) / 3 + 12}" width="${w * 0.45 - 8}" height="${(h * 0.36 - 16) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.2" />
    `;
  }

  // --- 14. STRUCTURE 10: EXECUTIVE OFFICE DESK ---
  function renderOfficeSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const { x, y, w, h, floorY } = p;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 20}" ry="12" fill="url(#sim-floor-shadow)" />
      <!-- Desktop Chamfer Surface -->
      <polygon points="${x - 10},${y + h * 0.4} ${x + w + 10},${y + h * 0.4} ${x + w},${y + h * 0.46} ${x},${y + h * 0.46}" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <!-- Left Gable Leg -->
      <rect x="${x + 5}" y="${y + h * 0.46}" width="18" height="${h * 0.54}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Modesty Privacy Panel -->
      <rect x="${x + 23}" y="${y + h * 0.5}" width="${w * 0.5}" height="${h * 0.35}" fill="${fillA}" opacity="0.85" stroke="#0f172a" stroke-width="1.5" />
      <!-- 3-Drawer Pedestal on Right -->
      <rect x="${x + w * 0.6}" y="${y + h * 0.46}" width="${w * 0.38}" height="${h * 0.54}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x + w * 0.6 + 4}" y="${y + h * 0.46 + 4}" width="${w * 0.38 - 8}" height="${(h * 0.54 - 16) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + w * 0.6 + 4}" y="${y + h * 0.46 + (h * 0.54 - 16) / 3 + 8}" width="${w * 0.38 - 8}" height="${(h * 0.54 - 16) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + w * 0.6 + 4}" y="${y + h * 0.46 + (2 * (h * 0.54 - 16)) / 3 + 12}" width="${w * 0.38 - 8}" height="${(h * 0.54 - 16) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
    `;
  }

  // --- 15. TECHNICAL DIMENSIONS WIREFRAME OVERLAY ---
  function renderWireframeDimensions(struct, dim, p) {
    const wFt = dim.width || 6.0;
    const hFt = dim.height || 7.0;
    const { x, y, w, h } = p;

    return `
      <g id="sim-wireframe-lines" stroke="#2563eb" stroke-width="1.6" opacity="0.95">
        <!-- Width Dimension Bar (Top) -->
        <line x1="${x}" y1="${Math.max(16, y - 18)}" x2="${x + w}" y2="${Math.max(16, y - 18)}" stroke-dasharray="4,4" />
        <circle cx="${x}" cy="${Math.max(16, y - 18)}" r="3" fill="#2563eb" />
        <circle cx="${x + w}" cy="${Math.max(16, y - 18)}" r="3" fill="#2563eb" />
        <rect x="${x + w / 2 - 60}" y="${Math.max(5, y - 30)}" width="120" height="20" rx="4" fill="#1e3a8a" />
        <text x="${x + w / 2}" y="${Math.max(19, y - 16)}" font-size="10.5" font-weight="bold" fill="#ffffff" text-anchor="middle">
          Width: ${wFt.toFixed(1)} ft
        </text>

        <!-- Height Dimension Bar (Right) -->
        <line x1="${x + w + 16}" y1="${y}" x2="${x + w + 16}" y2="${y + h}" stroke-dasharray="4,4" />
        <circle cx="${x + w + 16}" cy="${y}" r="3" fill="#2563eb" />
        <circle cx="${x + w + 16}" cy="${y + h}" r="3" fill="#2563eb" />
        <rect x="${x + w + 20}" y="${y + h / 2 - 10}" width="70" height="20" rx="4" fill="#1e3a8a" />
        <text x="${x + w + 55}" y="${y + h / 2 + 4}" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">
          Ht: ${hFt.toFixed(1)} ft
        </text>
      </g>
    `;
  }

  // --- 16. MAIN SVG RENDER DISPATCHER ---
  function renderSimulatorSvg() {
    const s = window.SIM_STATE;
    const dim = s.dimensions[s.structure] || { width: 6, height: 7 };
    const p = getPlacement(dim);

    let bodySvg = '';
    if (s.structure === 'wardrobe2') bodySvg = renderWardrobe2Svg(s, p);
    else if (s.structure === 'wardrobe') bodySvg = renderWardrobeSvg(s, p);
    else if (s.structure === 'wardrobe6') bodySvg = renderWardrobe6Svg(s, p);
    else if (s.structure === 'fullwall') bodySvg = renderFullWallSvg(s, p);
    else if (s.structure === 'kitchen') bodySvg = renderKitchenSvg(s, p);
    else if (s.structure === 'almirah') bodySvg = renderAlmirahSvg(s, p);
    else if (s.structure === 'bed') bodySvg = renderBedSvg(s, p);
    else if (s.structure === 'tvunit') bodySvg = renderTVUnitSvg(s, p);
    else if (s.structure === 'dressing') bodySvg = renderDressingSvg(s, p);
    else if (s.structure === 'office') bodySvg = renderOfficeSvg(s, p);

    const wireframeSvg = s.showWireframe ? renderWireframeDimensions(s.structure, dim, p) : '';
    const humanSvg = renderHumanScaleFigure(p.floorY, p.pxPerFoot);
    const defs = getSvgDefs();

    return `
      <svg id="sim-live-svg" viewBox="0 0 740 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display: block; user-select: none;">
        ${defs}
        <!-- Studio Background Wall -->
        <rect width="740" height="500" fill="#f8fafc" />
        <!-- Floor Baseline Horizon -->
        <line x1="0" y1="430" x2="740" y2="430" stroke="#cbd5e1" stroke-width="1.5" />
        <rect y="430" width="740" height="70" fill="#f1f5f9" />

        <!-- Human 5.5 ft Scale Silhouette -->
        ${humanSvg}

        <!-- Parametric Furniture Graphic -->
        <g id="sim-furniture-body">
          ${bodySvg}
        </g>

        <!-- Technical Wireframe Overlay -->
        ${wireframeSvg}

        <!-- Showroom 3000K Warm Spotlight Overlay -->
        ${s.isWarmLight ? `
          <rect width="740" height="500" fill="url(#sim-spotlight)" pointer-events="none" />
        ` : ''}

        <!-- Watermark -->
        <text x="16" y="488" font-size="10" font-weight="900" fill="#94a3b8" opacity="0.75" letter-spacing="1">
          BABA DUGDHESWAR ENTERPRISE • ONDA SHOWROOM 3D STUDIO
        </text>
      </svg>
    `;
  }

  // --- 17. BILL OF MATERIALS (BOM) & ESTIMATED RETAIL PRICING ENGINE ---
  function calculateSimulatorBom() {
    const s = window.SIM_STATE;
    const struct = s.structure;
    const dim = s.dimensions[struct] || { width: 6, height: 7 };

    const ply18Rate = s.plyGrade === 'marine' ? 2464 : 2042;
    const ply12Rate = s.plyGrade === 'marine' ? 2112 : 1690;
    const ply6Rate = 1126;
    const micaOuterRate = s.laminateType === 'gloss' ? 1254 : 1045;
    const micaInnerRate = 560;
    const fevicolRate = 352;

    let p18 = 0, p12 = 0, p6 = 0, micaA = 0, micaB = 0, liner = 0, fevicolKg = 0, hwCost = 0, title = '';

    if (struct === 'wardrobe2') {
      title = `${dim.width} × ${dim.height} ft 2-Door Compact Wardrobe`;
      p18 = 2.5;
      p12 = 1.0;
      p6 = 1.0;
      micaA = 1.5;
      micaB = 1.5;
      liner = 2.5;
      fevicolKg = 5;
      hwCost = s.hardware === 'gold' ? 2200 : 1800;

    } else if (struct === 'wardrobe') {
      title = `${dim.width} × ${dim.height} ft 4-Door Wardrobe`;
      p18 = dim.width >= 8 ? 6 : (dim.width >= 6 ? 4.5 : 3.5);
      p12 = dim.width >= 8 ? 2.5 : 1.5;
      p6 = dim.width >= 8 ? 2.5 : 2.0;
      micaA = 2.0;
      micaB = dim.width >= 8 ? 3.0 : 2.0;
      liner = micaA + micaB;
      fevicolKg = dim.width >= 8 ? 10 : 8;
      hwCost = s.hardware === 'gold' ? 3200 : 2600;

    } else if (struct === 'wardrobe6') {
      title = `${dim.width} × ${dim.height} ft Master 6-Door Wardrobe`;
      p18 = dim.height >= 8 ? 8.5 : 7.0;
      p12 = 3.5;
      p6 = 3.5;
      micaA = 3.0;
      micaB = 4.5;
      liner = 7.0;
      fevicolKg = 14;
      hwCost = s.hardware === 'gold' ? 5200 : 4400;

    } else if (struct === 'fullwall') {
      title = `${dim.width} × ${dim.height} ft Full-Wall Storage Suite`;
      const wallArea = (dim.width || 12) * (dim.height || 8.5);
      p18 = Math.round((wallArea / 12) * 10) / 10;
      p12 = Math.round((wallArea / 24) * 10) / 10;
      p6 = Math.round((wallArea / 26) * 10) / 10;
      micaA = Math.round((wallArea / 30) * 10) / 10;
      micaB = Math.round((wallArea / 22) * 10) / 10;
      liner = Math.round((micaA + micaB) * 10) / 10;
      fevicolKg = Math.round(dim.width * 1.5);
      hwCost = Math.round(4200 + (dim.width * 280));

    } else if (struct === 'kitchen') {
      title = `${dim.width} × ${dim.height} ft Modern Modular Kitchen`;
      p18 = dim.width >= 10 ? 8 : 6.5;
      p12 = 3.0;
      p6 = 2.0;
      micaA = 2.0;
      micaB = 4.0;
      liner = 5.0;
      fevicolKg = 10;
      hwCost = s.hardware === 'gold' ? 6200 : 5400;

    } else if (struct === 'almirah') {
      title = `4.0 × 6.5 ft Classic Almirah (with Mirror)`;
      p18 = 3.5;
      p12 = 1.5;
      p6 = 1.5;
      micaA = 1.5;
      micaB = 1.5;
      liner = 3.0;
      fevicolKg = 6;
      hwCost = 2800;

    } else if (struct === 'bed') {
      title = `${dim.width} × ${dim.length} ft Hydraulic Box Bed`;
      p18 = dim.width >= 6 ? 4.5 : 3.5;
      p12 = 2.0;
      p6 = 0;
      micaA = 2.0;
      micaB = 1.5;
      liner = 2.0;
      fevicolKg = 6;
      hwCost = 3500;

    } else if (struct === 'tvunit') {
      title = `7.0 × 6.0 ft Floating TV Entertainment Unit`;
      p18 = 3.5;
      p12 = 1.0;
      p6 = 1.5;
      micaA = 1.5;
      micaB = 2.0;
      liner = 2.0;
      fevicolKg = 5;
      hwCost = 2600;

    } else if (struct === 'dressing') {
      title = `3.5 × 6.5 ft Luxury LED Dressing Vanity`;
      p18 = 2.5;
      p12 = 1.0;
      p6 = 1.0;
      micaA = 1.5;
      micaB = 1.0;
      liner = 2.0;
      fevicolKg = 4;
      hwCost = 3200;

    } else if (struct === 'office') {
      title = `4.5 × 2.5 ft Executive Office & Study Desk`;
      p18 = 2.5;
      p12 = 1.0;
      p6 = 0.5;
      micaA = 1.5;
      micaB = 1.0;
      liner = 1.5;
      fevicolKg = 4;
      hwCost = 1800;
    }

    const totalMicaOuter = Math.round((micaA + micaB) * 10) / 10;
    const costP18 = p18 * ply18Rate;
    const costP12 = p12 * ply12Rate;
    const costP6 = p6 * ply6Rate;
    const costMicaOuter = totalMicaOuter * micaOuterRate;
    const costLiner = liner * micaInnerRate;
    const costGlue = fevicolKg * fevicolRate;
    const grandTotal = Math.round(costP18 + costP12 + costP6 + costMicaOuter + costLiner + costGlue + hwCost);

    return {
      title,
      items: [
        { name: `18mm ${s.plyGrade === 'marine' ? 'Marine IS:710' : 'BWR IS:303'} Ply (Carcass & Shutters)`, qty: `${p18} Sheets (8x4)`, cost: costP18 },
        { name: `12mm ${s.plyGrade === 'marine' ? 'Marine IS:710' : 'BWR IS:303'} Ply (Internal Shelves/Drawers)`, qty: `${p12} Sheets (8x4)`, cost: costP12 },
        ...(p6 > 0 ? [{ name: '6mm Marine Ply (Back Paneling)', qty: `${p6} Sheets (8x4)`, cost: costP6 }] : []),
        { name: `1.0mm Decorative Outer Sunmica (Zones A & B)`, qty: `${totalMicaOuter} Sheets`, cost: costMicaOuter },
        { name: `0.8mm White Inner Liner Sunmica`, qty: `${liner} Sheets`, cost: costLiner },
        { name: `Fevicol Marine / SH Synthetic Adhesive`, qty: `${fevicolKg} Kg`, cost: costGlue },
        { name: `Hardware Fitting Pack (${s.hardware.toUpperCase()} Finish)`, qty: `1 Complete Kit`, cost: hwCost }
      ],
      p18Sheets: p18,
      p12Sheets: p12,
      p6Sheets: p6,
      laminateSheets: totalMicaOuter,
      linerSheets: liner,
      grandTotal: grandTotal
    };
  }

  // --- 18. UI CONTROLLER & EVENT LISTENERS ---
  window.updateSimulatorUI = function () {
    const stage = document.getElementById('sim-svg-stage');
    if (!stage) return;

    // 1. Render Live Vector Canvas
    stage.innerHTML = renderSimulatorSvg();

    // 2. Update Door Toggle Button Text
    const btnDoors = document.getElementById('btn-sim-doors');
    if (btnDoors) {
      btnDoors.innerHTML = window.SIM_STATE.isOpen ? '🚪 Close Doors' : '🚪 Open Doors';
      btnDoors.classList.toggle('active', window.SIM_STATE.isOpen);
    }

    // 3. Update Light Button
    const btnLight = document.getElementById('btn-sim-light');
    if (btnLight) {
      btnLight.innerHTML = window.SIM_STATE.isWarmLight ? '💡 3000K Spotlights' : '☀️ Day Light';
      btnLight.classList.toggle('active', window.SIM_STATE.isWarmLight);
    }

    // 4. Update Dimension Wireframe Button
    const btnWire = document.getElementById('btn-sim-wireframe');
    if (btnWire) {
      btnWire.classList.toggle('active', window.SIM_STATE.showWireframe);
    }

    // 5. Update Human Scale Button
    const btnHuman = document.getElementById('btn-sim-human');
    if (btnHuman) {
      btnHuman.innerHTML = window.SIM_STATE.showHumanScale ? '🧍 Human Scale: ON' : '🧍 Human Scale: OFF';
      btnHuman.classList.toggle('active', window.SIM_STATE.showHumanScale);
    }

    // 6. Update Structure Carousel Pills
    document.querySelectorAll('.sim-struct-pill').forEach(el => {
      const type = el.getAttribute('data-struct');
      el.classList.toggle('active', type === window.SIM_STATE.structure);
    });

    // 7. Update Custom Dimension Sliders & Labels
    const dimPanel = document.getElementById('sim-custom-dim-panel');
    if (dimPanel) {
      const isCustomizable = ['fullwall', 'wardrobe6', 'kitchen', 'wardrobe', 'wardrobe2'].includes(window.SIM_STATE.structure);
      dimPanel.style.display = isCustomizable ? 'block' : 'none';

      const currentDim = window.SIM_STATE.dimensions[window.SIM_STATE.structure] || { width: 6, height: 7 };
      const widthVal = currentDim.width;
      const heightVal = currentDim.height;

      const widthLabel = document.getElementById('sim-dim-width-val');
      const heightLabel = document.getElementById('sim-dim-height-val');
      const widthInput = document.getElementById('sim-slider-width');
      const heightInput = document.getElementById('sim-slider-height');

      if (widthLabel) widthLabel.textContent = `${widthVal.toFixed(1)} ft`;
      if (heightLabel) heightLabel.textContent = `${heightVal.toFixed(1)} ft`;
      if (widthInput) widthInput.value = widthVal;
      if (heightInput) heightInput.value = heightVal;

      // Full wall rack config pills
      const rackConfigRow = document.getElementById('sim-rack-config-row');
      if (rackConfigRow) {
        rackConfigRow.style.display = (window.SIM_STATE.structure === 'fullwall') ? 'flex' : 'none';
        document.querySelectorAll('.sim-config-pill').forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-config') === window.SIM_STATE.fullwallConfig);
        });
      }
    }

    // 8. Update Active Swatch Zone Labels & Highlights
    const zoneLabelA = document.getElementById('sim-zone-label-a');
    const zoneLabelB = document.getElementById('sim-zone-label-b');
    const swatchA = getSwatch(window.SIM_STATE.zoneA);
    const swatchB = getSwatch(window.SIM_STATE.zoneB);

    if (zoneLabelA) zoneLabelA.textContent = `${swatchA.name} (${swatchA.code})`;
    if (zoneLabelB) zoneLabelB.textContent = `${swatchB.name} (${swatchB.code})`;

    document.querySelectorAll('.sim-zone-tab').forEach(tab => {
      const z = tab.getAttribute('data-zone');
      tab.classList.toggle('active', z === window.SIM_STATE.activeZone);
    });

    // 9. Update Swatch Grid Selection Circles
    const currentSwatchId = window.SIM_STATE.activeZone === 'A' ? window.SIM_STATE.zoneA : window.SIM_STATE.zoneB;
    document.querySelectorAll('.sim-swatch-circle').forEach(c => {
      const id = c.getAttribute('data-swatch-id');
      c.classList.toggle('selected', id === currentSwatchId);
    });

    // 10. Update Hardware Buttons
    document.querySelectorAll('.sim-hw-btn').forEach(b => {
      const h = b.getAttribute('data-hw');
      b.classList.toggle('active', h === window.SIM_STATE.hardware);
    });

    // 11. Recompute BOM & Price
    renderSimBomDetails();
  };

  function renderSimBomDetails() {
    const bom = calculateSimulatorBom();
    const bomListEl = document.getElementById('sim-bom-items');
    const grandTotalEl = document.getElementById('sim-grand-total');
    const structTitleEl = document.getElementById('sim-bom-title');

    if (structTitleEl) structTitleEl.textContent = `📋 Estimated Materials: ${bom.title}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${bom.grandTotal.toLocaleString('en-IN')}`;

    if (bomListEl) {
      bomListEl.innerHTML = bom.items.map(it => `
        <div class="bom-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12px;">
          <div style="font-weight: 600; color: #1e293b; max-width: 65%;">
            ${it.name}
            <div style="font-size: 10.5px; color: #64748b;">${it.qty}</div>
          </div>
          <div style="font-weight: 800; color: #4338ca;">₹${Math.round(it.cost).toLocaleString('en-IN')}</div>
        </div>
      `).join('');
    }
  }

  // --- 19. EVENT HANDLERS ---
  window.simSelectStructure = function (struct) {
    window.SIM_STATE.structure = struct;
    window.updateSimulatorUI();
  };

  window.simSelectCategory = function (cat) {
    window.SIM_STATE.activeCategory = cat;
    document.querySelectorAll('.sim-struct-pill').forEach(pill => {
      const pCat = pill.getAttribute('data-cat') || 'all';
      if (cat === 'all' || pCat.split(' ').includes(cat)) {
        pill.style.display = 'inline-flex';
      } else {
        pill.style.display = 'none';
      }
    });

    // If active structure is not in selected category, switch to first visible
    const visiblePills = Array.from(document.querySelectorAll('.sim-struct-pill')).filter(p => p.style.display !== 'none');
    const isCurrentVisible = visiblePills.some(p => p.getAttribute('data-struct') === window.SIM_STATE.structure);
    if (!isCurrentVisible && visiblePills.length > 0) {
      const newStruct = visiblePills[0].getAttribute('data-struct');
      if (newStruct) window.simSelectStructure(newStruct);
    }
  };

  window.simToggleDoors = function () {
    window.SIM_STATE.isOpen = !window.SIM_STATE.isOpen;
    window.updateSimulatorUI();
  };

  window.simToggleLighting = function () {
    window.SIM_STATE.isWarmLight = !window.SIM_STATE.isWarmLight;
    window.updateSimulatorUI();
  };

  window.simToggleWireframe = function () {
    window.SIM_STATE.showWireframe = !window.SIM_STATE.showWireframe;
    window.updateSimulatorUI();
  };

  window.simToggleHumanScale = function () {
    window.SIM_STATE.showHumanScale = !window.SIM_STATE.showHumanScale;
    window.updateSimulatorUI();
  };

  window.simSelectZone = function (zone) {
    window.SIM_STATE.activeZone = zone;
    window.updateSimulatorUI();
  };

  window.simSelectLaminate = function (swatchId) {
    if (window.SIM_STATE.activeZone === 'A') {
      window.SIM_STATE.zoneA = swatchId;
    } else {
      window.SIM_STATE.zoneB = swatchId;
    }
    window.updateSimulatorUI();
  };

  window.simSelectHardware = function (hwId) {
    window.SIM_STATE.hardware = hwId;
    window.updateSimulatorUI();
  };

  window.simChangePlyGrade = function (grade) {
    window.SIM_STATE.plyGrade = grade;
    window.updateSimulatorUI();
  };

  window.simChangeLaminateType = function (type) {
    window.SIM_STATE.laminateType = type;
    window.updateSimulatorUI();
  };

  window.simSetDimensionWidth = function (val) {
    const num = parseFloat(val);
    const struct = window.SIM_STATE.structure;
    if (window.SIM_STATE.dimensions[struct]) {
      window.SIM_STATE.dimensions[struct].width = num;
      window.updateSimulatorUI();
    }
  };

  window.simSetDimensionHeight = function (val) {
    const num = parseFloat(val);
    const struct = window.SIM_STATE.structure;
    if (window.SIM_STATE.dimensions[struct]) {
      window.SIM_STATE.dimensions[struct].height = num;
      window.updateSimulatorUI();
    }
  };

  window.simSetFullWallConfig = function (cfg) {
    window.SIM_STATE.fullwallConfig = cfg;
    document.querySelectorAll('.sim-config-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-config') === cfg);
    });
    window.updateSimulatorUI();
  };

  // --- 20. HIGH-CONVERSION ACTIONS ---
  window.simSendToWhatsApp = function () {
    const s = window.SIM_STATE;
    const bom = calculateSimulatorBom();
    const swA = getSwatch(s.zoneA);
    const swB = getSwatch(s.zoneB);
    const hw = window.HARDWARE_CATALOG.find(h => h.id === s.hardware)?.name || s.hardware;

    const message = `Namaskar Dipanjan Babu! 👋\nI designed a customized *${bom.title}* on the *Baba Dugdheswar Enterprise 3D Studio Simulator*.\n\n` +
      `🎨 *Design Specifications:*\n` +
      `• Structure: ${s.structure.toUpperCase()}\n` +
      `• Body/Carcass: ${swA.name} (${swA.code})\n` +
      `• Shutters/Fronts: ${swB.name} (${swB.code})\n` +
      `• Hardware Finish: ${hw}\n` +
      `• Plywood Grade: ${s.plyGrade === 'marine' ? 'Club Marine IS:710 Waterproof' : 'Tycon BWR IS:303'}\n\n` +
      `📋 *Estimated Bill of Materials:*\n` +
      `• 18mm Plywood: ${bom.p18Sheets} Sheets\n` +
      `• 12mm Plywood: ${bom.p12Sheets} Sheets\n` +
      `• 1.0mm Decorative Laminate: ${bom.laminateSheets} Sheets\n` +
      `• 0.8mm Inner Liner: ${bom.linerSheets} Sheets\n` +
      `• Total Material Estimate: ₹${bom.grandTotal.toLocaleString('en-IN')}\n\n` +
      `Please check live stock at Onda Depot and confirm booking/delivery. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919867098952?text=${encoded}`, '_blank');
  };

  window.simDownloadSnapshot = function () {
    const svgElem = document.getElementById('sim-live-svg');
    if (!svgElem) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElem);
      const canvas = document.createElement('canvas');
      canvas.width = 1480;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = function () {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, canvas.width, 50);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('BABA DUGDHESWAR ENTERPRISE • ONDA, BANKURA', 30, 34);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.fillText('3D Studio Custom Specification | Call: 9867098952', 950, 34);

        URL.revokeObjectURL(blobURL);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `BDE_3D_Design_${window.SIM_STATE.structure}_${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        if (window.showToast) window.showToast('📸 3D Design Snapshot downloaded!');
      };

      img.src = blobURL;
    } catch (e) {
      console.error('Snapshot export error:', e);
      if (window.showToast) window.showToast('Please take a quick screenshot of your design!');
    }
  };

  window.simClaimDiscount = function () {
    alert('🎉 Congratulations!\nYour 3D Studio Exclusive Counter Code: "BDE-STUDIO-PUJA"\nShow this code at the Onda showroom counter or WhatsApp to claim an extra 5% instant discount on your laminate & plywood booking!');
  };

  window.simFindMistri = function () {
    if (window.switchView) {
      window.switchView('mistris');
      if (window.showToast) window.showToast(`Showing verified Onda mistris for your ${window.SIM_STATE.structure}!`);
    }
  };

  // Auto-init when DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      if (document.getElementById('sim-svg-stage')) {
        window.updateSimulatorUI();
      }
    }, 200);
  });

})();
