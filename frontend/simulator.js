/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * 3D Furniture & Laminate Studio Simulator Engine
 * Real-time Visualizer & Material BOM Calculator
 * Supported Structures:
 * 1. 4-Door Modern Wardrobe
 * 2. Master 6-Door Wardrobe & Lofts
 * 3. Full-Wall Storage Suite (Wardrobe + Display Cabinet Rack + Continuous Lofts)
 * 4. Modern Modular Kitchen (Wall Cabinets, Granite Counter, Chimney, Sink & Tandem Drawers)
 * 5. Classic Wooden Almirah (with Dressing Mirror)
 * 6. Hydraulic Box Bed / Divan
 * 7. Floating Wall TV Entertainment Console
 * 8. Luxury LED Dressing Vanity
 * 9. Executive Office & Study Desk
 */

(function () {
  'use strict';

  // --- 1. SIMULATOR STATE ---
  window.SIM_STATE = {
    structure: 'wardrobe', // 'wardrobe', 'wardrobe6', 'fullwall', 'kitchen', 'almirah', 'bed', 'tvunit', 'dressing', 'office'
    zoneA: 'teak',         // Carcass / Frame / Body / Backsplash
    zoneB: 'carrara',      // Shutters / Doors / Fronts
    activeZone: 'B',       // Current zone selected for swatch: 'A', 'B'
    hardware: 'gold',      // 'gold', 'black', 'chrome', 'concealed'
    isOpen: false,         // Open doors / drawers toggle
    isWarmLight: true,     // Showroom 3000K warm LED spotlight mode
    showWireframe: false,  // Technical architectural dimension lines
    plyGrade: 'marine',    // 'marine' (Club IS:710) or 'commercial' (Tycon IS:303)
    laminateType: 'gloss', // 'gloss' (1.0mm) or 'matt' (0.8mm)
    fullwallConfig: 'standard', // 'standard' (Wardrobe+Rack+Cupboard), 'entertainment' (Dual Wardrobes+Center Niche), 'full_wardrobe' (Full Wardrobe Wall)
    dimensions: {
      wardrobe: { width: 6.0, height: 7.0, depth: 2.0, label: '6.0 ft (3-Door Standard)' },
      wardrobe6: { width: 10.0, height: 7.5, depth: 2.0, label: '10.0 ft Master 6-Door Wardrobe' },
      fullwall: { width: 12.0, height: 8.5, depth: 2.0, label: '12.0 ft Full-Wall Storage Suite' },
      kitchen: { width: 9.0, height: 7.0, depth: 2.0, label: '9.0 ft Modular Kitchen Counter' },
      almirah: { width: 4.0, height: 6.5, depth: 1.75, label: '4.0 ft (2-Door + Mirror)' },
      bed: { width: 5.0, length: 6.5, height: 3.5, label: 'Queen (5.0 ft × 6.5 ft)' },
      tvunit: { width: 7.0, height: 6.0, depth: 1.25, label: '7.0 ft Entertainment Wall' },
      dressing: { width: 3.5, height: 6.5, depth: 1.5, label: '3.5 ft LED Vanity Unit' },
      office: { width: 4.5, height: 2.5, depth: 2.0, label: '4.5 ft Executive Desk' }
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

  // Hardware Finishes
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
        <!-- 1. Burma Teak -->
        <pattern id="pat-teak" width="40" height="120" patternUnits="userSpaceOnUse">
          <rect width="40" height="120" fill="#b47b48" />
          <path d="M0,0 Q20,30 40,15 M0,25 Q15,60 40,40 M0,55 Q25,85 40,70 M0,85 Q10,105 40,95 M0,110 Q20,120 40,115" stroke="#8d5626" stroke-width="1.6" fill="none" opacity="0.55" />
          <path d="M5,10 Q25,45 5,80 M35,20 Q15,70 35,110" stroke="#714119" stroke-width="0.8" fill="none" opacity="0.35" />
        </pattern>

        <!-- 2. Walnut -->
        <pattern id="pat-walnut" width="45" height="130" patternUnits="userSpaceOnUse">
          <rect width="45" height="130" fill="#4a2e1b" />
          <path d="M0,10 Q22,40 45,20 M0,45 Q18,75 45,55 M0,80 Q25,110 45,90 M0,115 Q20,130 45,120" stroke="#311c0f" stroke-width="2.2" fill="none" opacity="0.65" />
          <ellipse cx="22" cy="65" rx="8" ry="18" fill="none" stroke="#25140a" stroke-width="1.2" opacity="0.45" />
        </pattern>

        <!-- 3. Oak -->
        <pattern id="pat-oak" width="30" height="90" patternUnits="userSpaceOnUse">
          <rect width="30" height="90" fill="#d6c0a2" />
          <line x1="6" y1="0" x2="6" y2="90" stroke="#bfaa8f" stroke-width="1.4" opacity="0.6" stroke-dasharray="20,4,10,2" />
          <line x1="16" y1="0" x2="16" y2="90" stroke="#af987d" stroke-width="1.8" opacity="0.65" stroke-dasharray="15,6,35,4" />
          <line x1="24" y1="0" x2="24" y2="90" stroke="#bfaa8f" stroke-width="1.2" opacity="0.55" />
        </pattern>

        <!-- 4. Wenge -->
        <pattern id="pat-wenge" width="25" height="80" patternUnits="userSpaceOnUse">
          <rect width="25" height="80" fill="#241c18" />
          <line x1="5" y1="0" x2="5" y2="80" stroke="#120d0a" stroke-width="1.8" opacity="0.75" />
          <line x1="12" y1="0" x2="12" y2="80" stroke="#3d302a" stroke-width="1" opacity="0.4" />
          <line x1="19" y1="0" x2="19" y2="80" stroke="#120d0a" stroke-width="2.2" opacity="0.8" />
        </pattern>

        <!-- 5. Rosewood -->
        <pattern id="pat-rosewood" width="35" height="110" patternUnits="userSpaceOnUse">
          <rect width="35" height="110" fill="#7a2e20" />
          <path d="M0,0 Q18,30 35,15 M0,35 Q20,65 35,50 M0,70 Q15,95 35,85" stroke="#4a180e" stroke-width="2" fill="none" opacity="0.6" />
          <path d="M0,15 Q25,45 35,30 M0,50 Q10,80 35,65" stroke="#993d2b" stroke-width="1" fill="none" opacity="0.4" />
        </pattern>

        <!-- Marble Patterns -->
        <!-- 6. Carrara White -->
        <pattern id="pat-carrara" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#f8fafc" />
          <path d="M0,20 Q40,40 60,10 T120,35 M20,120 Q50,70 80,95 T120,60 M-10,80 Q30,90 50,60" stroke="#cbd5e1" stroke-width="2.2" fill="none" opacity="0.6" stroke-linecap="round" />
          <path d="M10,25 Q45,45 65,15 M25,115 Q55,65 85,90" stroke="#94a3b8" stroke-width="0.8" fill="none" opacity="0.45" />
        </pattern>

        <!-- 7. Nero Marquina -->
        <pattern id="pat-marquina" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#0f172a" />
          <path d="M0,30 Q45,15 75,50 T120,20 M10,100 Q60,75 90,110 T120,80" stroke="#eab308" stroke-width="1.8" fill="none" opacity="0.75" />
          <path d="M5,35 Q50,20 80,55 M15,95 Q65,70 95,105" stroke="#fef08a" stroke-width="0.7" fill="none" opacity="0.5" />
          <path d="M30,0 Q50,40 40,80" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.35" />
        </pattern>

        <!-- 8. Travertine -->
        <pattern id="pat-travertine" width="60" height="40" patternUnits="userSpaceOnUse">
          <rect width="60" height="40" fill="#e7dec8" />
          <line x1="0" y1="8" x2="60" y2="8" stroke="#d5c8ab" stroke-width="1.5" stroke-dasharray="12,4,8,2" />
          <line x1="0" y1="18" x2="60" y2="18" stroke="#f2ebda" stroke-width="2" stroke-dasharray="20,6,14,3" />
          <line x1="0" y1="28" x2="60" y2="28" stroke="#c8ba99" stroke-width="1.2" stroke-dasharray="8,5,15,4" />
        </pattern>

        <!-- 9. Fluted Teak Louvers (3D Vertical Battens) -->
        <pattern id="pat-fluted_wood" width="16" height="40" patternUnits="userSpaceOnUse">
          <rect width="16" height="40" fill="#a76a36" />
          <rect x="0" y="0" width="8" height="40" fill="#c4854d" />
          <rect x="8" y="0" width="8" height="40" fill="#78471e" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#e0a369" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="40" stroke="#523013" stroke-width="1.2" />
        </pattern>

        <!-- 10. Fluted Midnight Charcoal -->
        <pattern id="pat-fluted_charcoal" width="16" height="40" patternUnits="userSpaceOnUse">
          <rect width="16" height="40" fill="#1e2530" />
          <rect x="0" y="0" width="8" height="40" fill="#334155" />
          <rect x="8" y="0" width="8" height="40" fill="#0f172a" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#475569" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="40" stroke="#020617" stroke-width="1.2" />
        </pattern>

        <!-- 11. Metallic Brass -->
        <pattern id="pat-metallic_brass" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#d4af37" />
          <line x1="0" y1="0" x2="30" y2="30" stroke="#fef08a" stroke-width="0.6" opacity="0.4" />
          <line x1="0" y1="15" x2="30" y2="45" stroke="#a16207" stroke-width="0.8" opacity="0.3" />
        </pattern>
      </defs>
    `;
  }

  // --- 4. STRUCTURE 1: 4-DOOR / 3-DOOR MODERN WARDROBE ---
  function renderWardrobeSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    return `
      <ellipse cx="300" cy="440" rx="190" ry="16" fill="url(#sim-floor-shadow)" />
      <rect x="130" y="50" width="340" height="380" rx="4" fill="${fillA}" stroke="#1e293b" stroke-width="2.5" />
      <rect x="130" y="415" width="340" height="15" fill="${fillA}" stroke="#1e293b" stroke-width="1.5" />
      <line x1="130" y1="415" x2="470" y2="415" stroke="rgba(0,0,0,0.3)" stroke-width="2" />

      ${isOpen ? `
        <rect x="138" y="58" width="324" height="352" fill="#faf5ee" stroke="#78350f" stroke-width="1.5" />
        <line x1="300" y1="58" x2="300" y2="410" stroke="#b47b48" stroke-width="6" />
        <line x1="138" y1="130" x2="462" y2="130" stroke="#b47b48" stroke-width="6" />
        <line x1="144" y1="155" x2="294" y2="155" stroke="#94a3b8" stroke-width="4" />
        <path d="M165,155 L185,175 L145,175 Z" fill="#64748b" opacity="0.7" />
        <rect x="150" y="175" width="30" height="110" rx="3" fill="#3b82f6" opacity="0.65" />
        <path d="M210,155 L230,175 L190,175 Z" fill="#64748b" opacity="0.7" />
        <rect x="195" y="175" width="30" height="125" rx="3" fill="#10b981" opacity="0.65" />
        <path d="M255,155 L275,175 L235,175 Z" fill="#64748b" opacity="0.7" />
        <rect x="240" y="175" width="30" height="115" rx="3" fill="#ec4899" opacity="0.65" />
        <line x1="138" y1="320" x2="297" y2="320" stroke="#b47b48" stroke-width="5" />
        <rect x="150" y="335" width="55" height="30" rx="2" fill="#d97706" opacity="0.8" />
        <text x="177" y="354" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Box 1</text>
        <rect x="225" y="335" width="55" height="30" rx="2" fill="#475569" opacity="0.8" />
        <text x="252" y="354" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Box 2</text>
        <line x1="303" y1="200" x2="462" y2="200" stroke="#b47b48" stroke-width="5" />
        <line x1="303" y1="270" x2="462" y2="270" stroke="#b47b48" stroke-width="5" />
        <line x1="303" y1="340" x2="462" y2="340" stroke="#b47b48" stroke-width="5" />
        <rect x="330" y="175" width="100" height="22" rx="4" fill="#a855f7" opacity="0.7" />
        <rect x="340" y="160" width="80" height="15" rx="3" fill="#f43f5e" opacity="0.7" />
        <rect x="330" y="245" width="105" height="22" rx="4" fill="#06b6d4" opacity="0.7" />
        <rect x="340" y="230" width="85" height="15" rx="3" fill="#eab308" opacity="0.7" />
        <rect x="310" y="278" width="145" height="55" rx="3" fill="${fillB}" stroke="#1e293b" stroke-width="1.5" />
        <circle cx="382" cy="305" r="5" fill="#ca8a04" />
        <text x="382" y="295" font-size="8.5" font-weight="bold" fill="#334155" text-anchor="middle">LOCKER</text>
        <polygon points="138,58 90,45 90,425 138,410" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
        <polygon points="462,58 510,45 510,425 462,410" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      ` : `
        <rect x="135" y="55" width="162" height="75" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="303" y="55" width="162" height="75" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="275" y="112" width="16" height="5" rx="1.5" fill="${hwFill}" />
          <rect x="309" y="112" width="16" height="5" rx="1.5" fill="${hwFill}" />
        ` : `
          <line x1="140" y1="126" x2="292" y2="126" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="308" y1="126" x2="460" y2="126" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
        <rect x="135" y="135" width="78" height="275" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="218" y="135" width="79" height="275" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="303" y="135" width="79" height="275" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="387" y="135" width="78" height="275" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="219" y="340" width="77" height="68" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="304" y="340" width="77" height="68" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="204" y="210" width="5" height="70" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="223" y="210" width="5" height="70" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="372" y="210" width="5" height="70" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="391" y="210" width="5" height="70" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="242" y="370" width="30" height="5" rx="2" fill="${hwFill}" />
          <rect x="328" y="370" width="30" height="5" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="210" y1="140" x2="210" y2="405" stroke="#000000" stroke-width="3" opacity="0.45" />
          <line x1="390" y1="140" x2="390" y2="405" stroke="#000000" stroke-width="3" opacity="0.45" />
          <line x1="225" y1="344" x2="290" y2="344" stroke="#000000" stroke-width="2.5" opacity="0.5" />
          <line x1="310" y1="344" x2="375" y2="344" stroke="#000000" stroke-width="2.5" opacity="0.5" />
        `}
      `}
      <line x1="142" y1="60" x2="142" y2="410" stroke="#ffffff" stroke-width="1.2" opacity="0.35" />
      <line x1="463" y1="60" x2="463" y2="410" stroke="#000000" stroke-width="1.2" opacity="0.35" />
    `;
  }

  // --- 5. STRUCTURE 2: MASTER 6-DOOR WARDROBE & EXTENDED LOFTS ---
  function renderWardrobe6Svg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    // Viewbox 600 x 480. Extra-wide: X=45, Y=45, W=510, H=380
    return `
      <!-- Floor Shadow -->
      <ellipse cx="300" cy="440" rx="265" ry="16" fill="url(#sim-floor-shadow)" />

      <!-- Outer Carcass / Frame (Zone A) -->
      <rect x="45" y="45" width="510" height="380" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="45" y="415" width="510" height="15" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />
      <line x1="45" y1="415" x2="555" y2="415" stroke="rgba(0,0,0,0.3)" stroke-width="2" />

      ${isOpen ? `
        <!-- OPEN MASTER 6-DOOR WARDROBE INTERIOR -->
        <rect x="52" y="52" width="496" height="360" fill="#faf5ee" stroke="#78350f" stroke-width="1.5" />
        
        <!-- Interior Dividers (3 Bay Layout: His | Shared Master Organizers | Hers) -->
        <line x1="216" y1="52" x2="216" y2="412" stroke="#b47b48" stroke-width="5" />
        <line x1="384" y1="52" x2="384" y2="412" stroke="#b47b48" stroke-width="5" />
        <!-- Continuous Loft Divider -->
        <line x1="52" y1="120" x2="548" y2="120" stroke="#b47b48" stroke-width="5" />

        <!-- Bay 1 (Left: "His" Wardrobe) -->
        <line x1="60" y1="140" x2="210" y2="140" stroke="#94a3b8" stroke-width="4" />
        <rect x="70" y="150" width="30" height="115" rx="3" fill="#1e3a8a" opacity="0.7" />
        <rect x="110" y="150" width="30" height="120" rx="3" fill="#334155" opacity="0.7" />
        <rect x="150" y="150" width="30" height="110" rx="3" fill="#0f766e" opacity="0.7" />
        <line x1="52" y1="285" x2="216" y2="285" stroke="#b47b48" stroke-width="4" />
        <text x="134" y="320" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">SUITS &amp; SHIRTS</text>
        <line x1="52" y1="345" x2="216" y2="345" stroke="#b47b48" stroke-width="4" />
        <text x="134" y="380" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">TROUSERS / SHOES</text>

        <!-- Bay 2 (Center: Master Tijori & Glass Drawers) -->
        <rect x="230" y="135" width="140" height="80" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="300" cy="175" r="7" fill="#ca8a04" />
        <text x="300" y="160" font-size="9" font-weight="900" fill="#1e1b4b" text-anchor="middle">TWIN TIJORI VAULT</text>
        
        <!-- Open Glass Drawers -->
        <rect x="230" y="230" width="140" height="40" rx="3" fill="${fillB}" stroke="#1e293b" stroke-width="1.5" />
        <text x="300" y="254" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">JEWELRY TRAY</text>
        <rect x="230" y="280" width="140" height="40" rx="3" fill="${fillB}" stroke="#1e293b" stroke-width="1.5" />
        <text x="300" y="304" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">WATCH &amp; ACCESSORIES</text>
        <rect x="230" y="330" width="140" height="40" rx="3" fill="${fillB}" stroke="#1e293b" stroke-width="1.5" />
        <text x="300" y="354" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">LINEN &amp; TOWELS</text>

        <!-- Bay 3 (Right: "Hers" Saree & Gown Sanctuary) -->
        <line x1="390" y1="140" x2="540" y2="140" stroke="#94a3b8" stroke-width="4" />
        <rect x="400" y="150" width="30" height="160" rx="3" fill="#be123c" opacity="0.75" />
        <rect x="440" y="150" width="30" height="150" rx="3" fill="#7c3aed" opacity="0.75" />
        <rect x="480" y="150" width="30" height="165" rx="3" fill="#db2777" opacity="0.75" />
        <line x1="384" y1="330" x2="548" y2="330" stroke="#b47b48" stroke-width="4" />
        <text x="466" y="370" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">LONG GOWNS &amp; SAREES</text>

        <!-- Foreshortened Swung Doors (Perspective Wings) -->
        <polygon points="52,52 15,35 15,425 52,415" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
        <polygon points="548,52 585,35 585,425 548,415" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      ` : `
        <!-- CLOSED 6-DOOR SHUTTERS & EXTENDED LOFTS -->
        <!-- 3 Pairs of Overhead Lofts (6 Doors total, Width ~82px each) -->
        <rect x="49" y="50" width="81" height="70" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="133" y="50" width="81" height="70" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="218" y="50" width="81" height="70" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="302" y="50" width="81" height="70" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="387" y="50" width="81" height="70" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="471" y="50" width="81" height="70" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 6 Main Tall Shutters (Doors 1 to 6) -->
        <rect x="49" y="125" width="81" height="285" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="133" y="125" width="81" height="285" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="218" y="125" width="81" height="285" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="302" y="125" width="81" height="285" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="387" y="125" width="81" height="285" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="471" y="125" width="81" height="285" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 4 Bottom Accessory Drawers on Doors 2, 3, 4, 5 -->
        <rect x="134" y="340" width="79" height="68" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="219" y="340" width="79" height="68" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="303" y="340" width="79" height="68" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="388" y="340" width="79" height="68" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- 6 Long Profile Handles -->
        ${s.hardware !== 'concealed' ? `
          <rect x="122" y="200" width="5" height="85" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="138" y="200" width="5" height="85" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="291" y="200" width="5" height="85" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="307" y="200" width="5" height="85" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="460" y="200" width="5" height="85" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          <rect x="476" y="200" width="5" height="85" rx="2.5" fill="${hwFill}" stroke="#000000" stroke-width="0.5" />
          
          <!-- Drawer Handles -->
          <rect x="154" y="372" width="36" height="5" rx="2" fill="${hwFill}" />
          <rect x="239" y="372" width="36" height="5" rx="2" fill="${hwFill}" />
          <rect x="323" y="372" width="36" height="5" rx="2" fill="${hwFill}" />
          <rect x="408" y="372" width="36" height="5" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="130" y1="130" x2="130" y2="400" stroke="#000000" stroke-width="3" opacity="0.45" />
          <line x1="299" y1="130" x2="299" y2="400" stroke="#000000" stroke-width="3" opacity="0.45" />
          <line x1="468" y1="130" x2="468" y2="400" stroke="#000000" stroke-width="3" opacity="0.45" />
        `}
      `}
    `;
  }

  // --- 6. STRUCTURE 3: FULL-WALL WARDROBE & INTEGRATED STORAGE CABINET RACK ---
  function renderFullWallSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const cfg = s.fullwallConfig || 'standard';

    // Full wall dimensions: X=25, Y=35, W=550, H=395
    return `
      <!-- Floor Shadow spanning entire wall -->
      <ellipse cx="300" cy="442" rx="280" ry="16" fill="url(#sim-floor-shadow)" />

      <!-- Full-Wall Outer Perimeter Carcass (Zone A) -->
      <rect x="25" y="35" width="550" height="395" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="25" y="415" width="550" height="15" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />
      <line x1="25" y1="415" x2="575" y2="415" stroke="rgba(0,0,0,0.3)" stroke-width="2" />

      <!-- Top Continuous Overhead Loft Bridge (Floor-to-Ceiling Connection) -->
      <rect x="28" y="38" width="544" height="65" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <!-- Loft Vertical Doors (6 Doors across wall) -->
      <line x1="118" y1="38" x2="118" y2="103" stroke="#0f172a" stroke-width="1.5" />
      <line x1="208" y1="38" x2="208" y2="103" stroke="#0f172a" stroke-width="1.5" />
      <line x1="300" y1="38" x2="300" y2="103" stroke="#0f172a" stroke-width="1.5" />
      <line x1="392" y1="38" x2="392" y2="103" stroke="#0f172a" stroke-width="1.5" />
      <line x1="484" y1="38" x2="484" y2="103" stroke="#0f172a" stroke-width="1.5" />

      <!-- SECTION 1 (LEFT): 3-DOOR MODULAR WARDROBE (X=28 to X=250, Width=222) -->
      <rect x="28" y="106" width="222" height="306" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      ${isOpen ? `
        <rect x="33" y="110" width="212" height="298" fill="#faf5ee" stroke="#78350f" stroke-width="1.2" />
        <line x1="140" y1="110" x2="140" y2="408" stroke="#b47b48" stroke-width="4" />
        <!-- Hanging Rod -->
        <line x1="36" y1="135" x2="136" y2="135" stroke="#94a3b8" stroke-width="3.5" />
        <rect x="45" y="145" width="25" height="110" rx="3" fill="#2563eb" opacity="0.75" />
        <rect x="80" y="145" width="25" height="120" rx="3" fill="#059669" opacity="0.75" />
        <!-- Stacked Shelves on Right Half of Wardrobe -->
        <line x1="140" y1="180" x2="245" y2="180" stroke="#b47b48" stroke-width="4" />
        <line x1="140" y1="250" x2="245" y2="250" stroke="#b47b48" stroke-width="4" />
        <line x1="140" y1="320" x2="245" y2="320" stroke="#b47b48" stroke-width="4" />
        <rect x="155" y="155" width="75" height="20" rx="3" fill="#9333ea" opacity="0.75" />
        <rect x="155" y="225" width="75" height="20" rx="3" fill="#d97706" opacity="0.75" />
        <polygon points="33,110 5,95 5,420 33,410" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      ` : `
        <!-- Closed Wardrobe Doors (3 Shutters) -->
        <rect x="30" y="108" width="71" height="302" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="104" y="108" width="71" height="302" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="178" y="108" width="70" height="302" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <!-- Handles -->
        ${s.hardware !== 'concealed' ? `
          <rect x="94" y="210" width="5" height="75" rx="2.5" fill="${hwFill}" />
          <rect x="110" y="210" width="5" height="75" rx="2.5" fill="${hwFill}" />
          <rect x="238" y="210" width="5" height="75" rx="2.5" fill="${hwFill}" />
        ` : `
          <line x1="101" y1="115" x2="101" y2="395" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="175" y1="115" x2="175" y2="395" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
      `}

      <!-- SECTION 2 (CENTER): OPEN STORAGE CABINET RACK / DISPLAY BOOKCASE (X=254 to X=400, Width=146) -->
      <!-- Backlit Display Niche in Zone A with warm ambient lighting -->
      <rect x="254" y="106" width="146" height="306" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Top Warm Spotlight for Display Rack -->
      <rect x="256" y="108" width="142" height="30" fill="url(#led-strip-glow)" />

      <!-- 4 Illuminated Open Display Shelves -->
      <line x1="254" y1="168" x2="400" y2="168" stroke="#0f172a" stroke-width="3" />
      <line x1="254" y1="228" x2="400" y2="228" stroke="#0f172a" stroke-width="3" />
      <line x1="254" y1="288" x2="400" y2="288" stroke="#0f172a" stroke-width="3" />
      <line x1="254" y1="348" x2="400" y2="348" stroke="#0f172a" stroke-width="3" />

      <!-- Luxury Display Items on Shelves -->
      <!-- Shelf 1: Bronze Durga Puja Idol / Artifact -->
      <circle cx="327" cy="140" r="10" fill="#ca8a04" stroke="#eab308" stroke-width="1.5" />
      <rect x="320" y="150" width="14" height="15" rx="2" fill="#ca8a04" />
      <!-- Shelf 2: Hardcover Books & Clock -->
      <rect x="270" y="188" width="10" height="38" rx="2" fill="#dc2626" />
      <rect x="282" y="192" width="10" height="34" rx="2" fill="#2563eb" />
      <rect x="294" y="186" width="12" height="40" rx="2" fill="#16a34a" />
      <circle cx="365" cy="208" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
      <line x1="365" y1="208" x2="365" y2="198" stroke="#0f172a" stroke-width="2" />
      <line x1="365" y1="208" x2="373" y2="208" stroke="#0f172a" stroke-width="2" />
      <!-- Shelf 3: Indoor Bonsai Plant & Frame -->
      <polygon points="280,270 300,270 295,286 285,286" fill="#78350f" />
      <circle cx="290" cy="262" r="10" fill="#15803d" />
      <rect x="340" y="245" width="35" height="40" rx="3" fill="#ffffff" stroke="#ca8a04" stroke-width="2" />
      <circle cx="357" cy="265" r="8" fill="#cbd5e1" />
      <!-- Shelf 4: 2 Bottom Push Drawers in Zone B -->
      <rect x="256" y="352" width="142" height="58" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      <line x1="256" y1="380" x2="398" y2="380" stroke="#0f172a" stroke-width="1.5" />
      ${s.hardware !== 'concealed' ? `
        <rect x="312" y="362" width="30" height="4" rx="2" fill="${hwFill}" />
        <rect x="312" y="392" width="30" height="4" rx="2" fill="${hwFill}" />
      ` : `
        <line x1="270" y1="355" x2="380" y2="355" stroke="#000000" stroke-width="2" opacity="0.35" />
        <line x1="270" y1="383" x2="380" y2="383" stroke="#000000" stroke-width="2" opacity="0.35" />
      `}

      <!-- SECTION 3 (RIGHT): MULTI-UTILITY STORAGE CUPBOARD & LINEN UNIT (X=404 to X=572, Width=168) -->
      <rect x="404" y="106" width="168" height="306" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      ${isOpen ? `
        <rect x="408" y="110" width="160" height="298" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2" />
        <line x1="408" y1="180" x2="568" y2="180" stroke="#ca8a04" stroke-width="4" />
        <line x1="408" y1="260" x2="568" y2="260" stroke="#ca8a04" stroke-width="4" />
        <line x1="408" y1="340" x2="568" y2="340" stroke="#ca8a04" stroke-width="4" />
        <!-- Stacked Quilts & Suitcases -->
        <rect x="430" y="130" width="115" height="45" rx="4" fill="#3b82f6" opacity="0.75" />
        <text x="487" y="157" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">SUITCASES</text>
        <rect x="430" y="200" width="115" height="50" rx="4" fill="#ec4899" opacity="0.75" />
        <text x="487" y="230" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">WINTER QUILTS</text>
        <rect x="430" y="280" width="115" height="50" rx="4" fill="#8b5cf6" opacity="0.75" />
        <text x="487" y="310" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">EXTRA MATTRESSES</text>
        <polygon points="568,110 595,95 595,420 568,410" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      ` : `
        <!-- Closed Double Doors for Utility Storage -->
        <rect x="406" y="108" width="81" height="302" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="489" y="108" width="81" height="302" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="478" y="210" width="5" height="75" rx="2.5" fill="${hwFill}" />
          <rect x="495" y="210" width="5" height="75" rx="2.5" fill="${hwFill}" />
        ` : `
          <line x1="486" y1="115" x2="486" y2="395" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
      `}
    `;
  }

  // --- 7. STRUCTURE 4: MODERN MODULAR KITCHEN ---
  function renderKitchenSvg(s) {
    const fillA = getLaminateFill(s.zoneA); // Backsplash / Carcass / Dado
    const fillB = getLaminateFill(s.zoneB); // Shutters & Tandem Drawer Fronts
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    // Viewbox 600 x 480. Kitchen Layout: X=60 to X=540 (Width 480)
    return `
      <!-- Floor Shadow under base kitchen cabinets -->
      <ellipse cx="300" cy="442" rx="245" ry="16" fill="url(#sim-floor-shadow)" />

      <!-- Backsplash Wall / Dado (Zone A: High-Gloss Marble or Fluted) -->
      <rect x="60" y="130" width="480" height="135" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Under-Cabinet Ambient LED Task Strip Glow -->
      <rect x="60" y="130" width="480" height="25" fill="url(#led-strip-glow)" />

      <!-- Hanging Stainless Steel Utensil Rail & Ladles on Backsplash -->
      <line x1="80" y1="160" x2="230" y2="160" stroke="#cbd5e1" stroke-width="3" />
      <path d="M100,160 L100,190 A6,6 0 0 0 112,190 L112,160" fill="none" stroke="#94a3b8" stroke-width="2" />
      <path d="M130,160 L130,195 M125,195 L135,195" stroke="#94a3b8" stroke-width="2" />
      <path d="M160,160 L160,190 A7,7 0 1 0 174,190 L174,160" fill="none" stroke="#94a3b8" stroke-width="2" />

      <!-- TOP WALL-MOUNTED MODULAR CABINETS (Y=50 to Y=130, Height=80) -->
      <!-- Left Upper Double Cabinet (X=60 to X=200, Width=140) in Zone B -->
      <rect x="60" y="50" width="140" height="80" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      <line x1="130" y1="50" x2="130" y2="130" stroke="#0f172a" stroke-width="1.5" />
      
      <!-- Center Chimney Hood (X=230 to X=370, Width=140) -->
      <!-- Stainless Steel Chimney Duct -->
      <rect x="280" y="25" width="40" height="55" fill="url(#hw-chrome)" stroke="#64748b" stroke-width="1.5" />
      <!-- Tempered Glass & Steel Pyramid Hood Baffle -->
      <polygon points="230,110 370,110 330,80 270,80" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
      <rect x="240" y="110" width="120" height="12" rx="2" fill="url(#hw-chrome)" stroke="#0f172a" stroke-width="1.2" />
      <!-- Twin Chimney LED Spotlights -->
      <circle cx="265" cy="116" r="3.5" fill="#fef08a" />
      <circle cx="335" cy="116" r="3.5" fill="#fef08a" />

      <!-- Right Upper Double Cabinet (X=400 to X=540, Width=140) in Zone B -->
      <rect x="400" y="50" width="140" height="80" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      <line x1="470" y1="50" x2="470" y2="130" stroke="#0f172a" stroke-width="1.5" />

      <!-- JET BLACK GRANITE / QUARTZ LUXURY COUNTERTOP (Y=265 to Y=285) -->
      <rect x="50" y="265" width="500" height="20" rx="3" fill="url(#countertop-granite)" stroke="#09090b" stroke-width="2" />
      <line x1="50" y1="267" x2="550" y2="267" stroke="#ffffff" stroke-width="1.2" opacity="0.35" />

      <!-- ON THE COUNTERTOP: Cooktop & Sink -->
      <!-- 3-Burner Glass Hob Cooktop (under chimney) -->
      <rect x="245" y="260" width="110" height="10" rx="2" fill="#020617" stroke="#475569" stroke-width="1.2" />
      <circle cx="265" cy="265" r="4" fill="#ef4444" />
      <circle cx="300" cy="265" r="5" fill="#ef4444" />
      <circle cx="335" cy="265" r="4" fill="#ef4444" />

      <!-- Undermount Stainless Steel Double Sink & Gooseneck Mixer Faucet (Right Side) -->
      <rect x="420" y="262" width="90" height="8" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1" />
      <!-- Chrome Faucet Arc -->
      <path d="M465,262 L465,240 A12,12 0 0 1 477,228 A12,12 0 0 1 489,240 L489,246" fill="none" stroke="url(#hw-chrome)" stroke-width="3.5" stroke-linecap="round" />

      <!-- BASE MODULAR CABINETS (Y=285 to Y=425, Height=140) -->
      <rect x="60" y="285" width="480" height="140" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Base Plinth Skirting -->
      <rect x="60" y="415" width="480" height="15" fill="#18181b" stroke="#0f172a" stroke-width="1.5" />

      ${isOpen ? `
        <!-- OPEN MODULAR KITCHEN TANDEM BASKETS & SINK STORAGE -->
        <!-- Bay 1 (Left): Pulled-out Cutlery & Thali Tandem Drawers -->
        <rect x="65" y="290" width="135" height="38" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="70" y="293" width="125" height="32" rx="2" fill="#f8fafc" />
        <text x="132" y="314" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">🥄 CUTLERY TRAY</text>

        <rect x="65" y="332" width="135" height="38" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="70" y="335" width="125" height="32" rx="2" fill="#f8fafc" />
        <text x="132" y="356" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">🍽️ CUP &amp; SAUCER</text>

        <rect x="65" y="374" width="135" height="40" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="70" y="377" width="125" height="34" rx="2" fill="#f8fafc" />
        <text x="132" y="399" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">🥘 THALI &amp; POT BASKET</text>

        <!-- Bay 2 (Center): Deep Cookware Pots Drawer -->
        <rect x="205" y="290" width="190" height="60" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="300" y="325" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">PRESSURE COOKERS &amp; KADAIS</text>
        <rect x="205" y="354" width="190" height="60" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="300" y="390" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">SPICE JARS &amp; OILS</text>

        <!-- Bay 3 (Right): Open Sink Cabinet (RO Purifier & Detergents) -->
        <polygon points="400,290 380,310 380,420 400,415" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <polygon points="540,290 560,310 560,420 540,415" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="420" y="310" width="100" height="80" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
        <text x="470" y="355" font-size="9" font-weight="bold" fill="#0369a1" text-anchor="middle">RO PURIFIER &amp; TRASH</text>
      ` : `
        <!-- CLOSED MODULAR KITCHEN BASE SHUTTERS (Zone B) -->
        <!-- Unit 1: 3-Tier Tandem Drawers (Left, X=62 to X=198) -->
        <rect x="63" y="288" width="135" height="39" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="63" y="330" width="135" height="39" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="63" y="372" width="135" height="42" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Unit 2: 2 Deep Pots Drawers under Cooktop (Center, X=203 to X=397) -->
        <rect x="203" y="288" width="194" height="60" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="203" y="352" width="194" height="62" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Unit 3: Under-Sink 2-Door Cabinet (Right, X=402 to X=538) -->
        <rect x="402" y="288" width="66" height="126" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="472" y="288" width="66" height="126" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Kitchen Profile Handles -->
        ${s.hardware !== 'concealed' ? `
          <!-- Drawer Pulls -->
          <rect x="110" y="304" width="40" height="5" rx="2" fill="${hwFill}" />
          <rect x="110" y="346" width="40" height="5" rx="2" fill="${hwFill}" />
          <rect x="110" y="390" width="40" height="5" rx="2" fill="${hwFill}" />
          <rect x="275" y="314" width="50" height="6" rx="2" fill="${hwFill}" />
          <rect x="275" y="378" width="50" height="6" rx="2" fill="${hwFill}" />
          <!-- Sink Handles -->
          <rect x="456" y="340" width="5" height="45" rx="2" fill="${hwFill}" />
          <rect x="478" y="340" width="5" height="45" rx="2" fill="${hwFill}" />
          <!-- Upper Cabinet Knobs -->
          <rect x="120" y="115" width="16" height="4" rx="1.5" fill="${hwFill}" />
          <rect x="460" y="115" width="16" height="4" rx="1.5" fill="${hwFill}" />
        ` : `
          <line x1="68" y1="290" x2="190" y2="290" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="68" y1="332" x2="190" y2="332" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="68" y1="374" x2="190" y2="374" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="210" y1="290" x2="390" y2="290" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="210" y1="354" x2="390" y2="354" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
      `}
    `;
  }

  // --- 8. STRUCTURE 5: CLASSIC ALMIRAH (WITH DRESSING MIRROR) ---
  function renderAlmirahSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    return `
      <ellipse cx="300" cy="442" rx="160" ry="14" fill="url(#sim-floor-shadow)" />
      <polygon points="170,55 180,70 420,70 430,55" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="180" y="70" width="240" height="350" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="175" y="420" width="250" height="15" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="185" y="435" width="25" height="10" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="390" y="435" width="25" height="10" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      ${isOpen ? `
        <rect x="186" y="76" width="228" height="340" fill="#fefce8" stroke="#854d0e" stroke-width="1.5" />
        <line x1="186" y1="130" x2="414" y2="130" stroke="#a16207" stroke-width="5" />
        <line x1="300" y1="130" x2="300" y2="350" stroke="#a16207" stroke-width="5" />
        <line x1="190" y1="150" x2="295" y2="150" stroke="#94a3b8" stroke-width="3" />
        <rect x="200" y="160" width="25" height="90" rx="2" fill="#ef4444" opacity="0.75" />
        <rect x="235" y="160" width="25" height="100" rx="2" fill="#3b82f6" opacity="0.75" />
        <rect x="268" y="160" width="22" height="85" rx="2" fill="#10b981" opacity="0.75" />
        <rect x="195" y="275" width="95" height="70" rx="3" fill="#1e293b" stroke="#ca8a04" stroke-width="1.5" />
        <circle cx="242" cy="310" r="8" fill="#eab308" />
        <text x="242" y="295" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">TIJORI</text>
        <line x1="300" y1="190" x2="414" y2="190" stroke="#a16207" stroke-width="4" />
        <line x1="300" y1="250" x2="414" y2="250" stroke="#a16207" stroke-width="4" />
        <line x1="300" y1="310" x2="414" y2="310" stroke="#a16207" stroke-width="4" />
        <rect x="320" y="165" width="75" height="22" rx="3" fill="#8b5cf6" opacity="0.8" />
        <rect x="320" y="225" width="75" height="22" rx="3" fill="#06b6d4" opacity="0.8" />
        <rect x="320" y="285" width="75" height="22" rx="3" fill="#ec4899" opacity="0.8" />
        <polygon points="186,76 145,65 145,420 186,416" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
        <polygon points="414,76 455,65 455,420 414,416" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      ` : `
        <rect x="185" y="75" width="112" height="270" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="195" y="85" width="92" height="250" rx="2" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" />
        <rect x="303" y="75" width="112" height="270" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="312" y="85" width="94" height="250" rx="4" fill="url(#mirror-sheen)" stroke="#cbd5e1" stroke-width="2" />
        <line x1="320" y1="95" x2="395" y2="230" stroke="#ffffff" stroke-width="3" opacity="0.65" stroke-linecap="round" />
        <line x1="335" y1="95" x2="400" y2="200" stroke="#ffffff" stroke-width="1.5" opacity="0.5" stroke-linecap="round" />
        <text x="359" y="325" font-size="8.5" font-weight="900" fill="#1e3a8a" opacity="0.6" text-anchor="middle">BDE MIRROR</text>
        <rect x="185" y="350" width="112" height="65" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="303" y="350" width="112" height="65" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        ${s.hardware !== 'concealed' ? `
          <circle cx="288" cy="200" r="5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
          <line x1="288" y1="205" x2="288" y2="230" stroke="${hwFill}" stroke-width="3" stroke-linecap="round" />
          <circle cx="310" cy="200" r="5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
          <line x1="310" y1="205" x2="310" y2="230" stroke="${hwFill}" stroke-width="3" stroke-linecap="round" />
          <rect x="228" y="380" width="26" height="5" rx="2" fill="${hwFill}" />
          <rect x="346" y="380" width="26" height="5" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="295" y1="80" x2="295" y2="340" stroke="#000000" stroke-width="2" opacity="0.3" />
        `}
      `}
    `;
  }

  // --- 9. STRUCTURE 6: HYDRAULIC BOX BED / DIVAN ---
  function renderBedSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    return `
      <ellipse cx="300" cy="435" rx="210" ry="20" fill="url(#sim-floor-shadow)" />
      <rect x="110" y="80" width="380" height="200" rx="6" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="130" y="95" width="340" height="150" rx="4" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      <line x1="198" y1="95" x2="198" y2="245" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" />
      <line x1="266" y1="95" x2="266" y2="245" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" />
      <line x1="334" y1="95" x2="334" y2="245" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" />
      <line x1="402" y1="95" x2="402" y2="245" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" />

      ${isOpen ? `
        <rect x="120" y="270" width="360" height="145" fill="#fef3c7" stroke="#92400e" stroke-width="2" />
        <line x1="300" y1="270" x2="300" y2="415" stroke="#92400e" stroke-width="6" />
        <rect x="135" y="300" width="145" height="85" rx="5" fill="#3b82f6" opacity="0.6" />
        <text x="207" y="345" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">QUILTS / BLANKETS</text>
        <rect x="315" y="300" width="145" height="85" rx="5" fill="#ec4899" opacity="0.6" />
        <text x="387" y="345" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">LUGGAGE / MATS</text>
        <polygon points="120,270 480,270 495,175 105,175" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <line x1="160" y1="290" x2="140" y2="195" stroke="#000000" stroke-width="4" />
        <circle cx="160" cy="290" r="4" fill="#ca8a04" />
        <line x1="440" y1="290" x2="460" y2="195" stroke="#000000" stroke-width="4" />
        <circle cx="440" cy="290" r="4" fill="#ca8a04" />
      ` : `
        <rect x="125" y="245" width="350" height="75" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <path d="M140,265 Q200,275 260,265 T380,265 T460,265" fill="none" stroke="#e2e8f0" stroke-width="2" />
        <path d="M140,295 Q200,305 260,295 T380,295 T460,295" fill="none" stroke="#e2e8f0" stroke-width="2" />
        <rect x="150" y="215" width="125" height="42" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="325" y="215" width="125" height="42" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="235" y="235" width="60" height="28" rx="6" fill="${fillB}" stroke="#cbd5e1" stroke-width="1" />
        <rect x="305" y="235" width="60" height="28" rx="6" fill="${fillB}" stroke="#cbd5e1" stroke-width="1" />
        <rect x="120" y="315" width="360" height="105" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
        <rect x="135" y="335" width="155" height="70" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="310" y="335" width="155" height="70" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        ${s.hardware !== 'concealed' ? `
          <rect x="195" y="365" width="35" height="6" rx="2" fill="${hwFill}" />
          <rect x="370" y="365" width="35" height="6" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="140" y1="340" x2="285" y2="340" stroke="#000000" stroke-width="2.5" opacity="0.4" />
          <line x1="315" y1="340" x2="460" y2="340" stroke="#000000" stroke-width="2.5" opacity="0.4" />
        `}
      `}
    `;
  }

  // --- 10. STRUCTURE 7: FLOATING WALL TV ENTERTAINMENT UNIT ---
  function renderTVUnitSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    return `
      <rect x="90" y="40" width="420" height="320" rx="8" fill="#fef08a" opacity="0.22" filter="blur(8px)" />
      <rect x="90" y="40" width="170" height="320" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="260" y="40" width="250" height="320" rx="4" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      <rect x="140" y="65" width="330" height="14" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="165" y="38" width="16" height="27" rx="3" fill="#ca8a04" />
      <circle cx="173" cy="34" r="6" fill="#eab308" />
      <polygon points="410,48 430,48 425,65 415,65" fill="#f87171" />
      <circle cx="420" cy="42" r="8" fill="#22c55e" />

      <rect x="170" y="95" width="260" height="150" rx="4" fill="#020617" stroke="#334155" stroke-width="2" />
      <rect x="174" y="99" width="252" height="142" rx="2" fill="url(#tv-gloss)" />
      <text x="300" y="165" font-size="12" font-weight="bold" fill="#ffffff" opacity="0.65" text-anchor="middle" letter-spacing="2">SMART 4K OLED</text>
      <text x="300" y="180" font-size="8" font-weight="600" fill="#94a3b8" opacity="0.65" text-anchor="middle">BDE Onda Theater Mode</text>
      <circle cx="300" cy="245" r="1.5" fill="#ef4444" />

      <ellipse cx="300" cy="425" rx="190" ry="12" fill="url(#sim-floor-shadow)" />
      <rect x="110" y="340" width="380" height="75" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2" />

      ${isOpen ? `
        <rect x="116" y="346" width="368" height="63" fill="#fafaf9" stroke="#78350f" stroke-width="1.2" />
        <line x1="235" y1="346" x2="235" y2="409" stroke="#b47b48" stroke-width="4" />
        <line x1="365" y1="346" x2="365" y2="409" stroke="#b47b48" stroke-width="4" />
        <rect x="250" y="365" width="100" height="18" rx="2" fill="#09090b" />
        <circle cx="265" cy="374" r="2" fill="#22c55e" />
        <circle cx="275" cy="374" r="2" fill="#3b82f6" />
        <rect x="140" y="358" width="75" height="35" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="380" y="368" width="85" height="15" rx="2" fill="#18181b" />
        <polygon points="116,409 235,409 230,435 121,435" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <polygon points="237,409 363,409 358,435 242,435" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <polygon points="365,409 484,409 479,435 370,435" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      ` : `
        <rect x="116" y="345" width="118" height="65" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="241" y="345" width="118" height="65" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="366" y="345" width="118" height="65" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="160" y="375" width="30" height="5" rx="2" fill="${hwFill}" />
          <rect x="285" y="375" width="30" height="5" rx="2" fill="${hwFill}" />
          <rect x="410" y="375" width="30" height="5" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="120" y1="350" x2="230" y2="350" stroke="#000000" stroke-width="2" opacity="0.4" />
          <line x1="245" y1="350" x2="355" y2="350" stroke="#000000" stroke-width="2" opacity="0.4" />
          <line x1="370" y1="350" x2="480" y2="350" stroke="#000000" stroke-width="2" opacity="0.4" />
        `}
      `}
    `;
  }

  // --- 11. STRUCTURE 8: LUXURY DRESSING TABLE / VANITY ---
  function renderDressingSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    return `
      <ellipse cx="300" cy="440" rx="160" ry="14" fill="url(#sim-floor-shadow)" />
      <rect x="150" y="50" width="300" height="240" rx="6" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <path d="M190,260 L190,130 A65,65 0 0 1 320,130 L320,260 Z" fill="#fef08a" opacity="0.35" filter="blur(6px)" />
      <path d="M195,260 L195,130 A60,60 0 0 1 315,130 L315,260 Z" fill="url(#mirror-sheen)" stroke="#cbd5e1" stroke-width="2.5" />
      <line x1="230" y1="90" x2="295" y2="210" stroke="#ffffff" stroke-width="2.5" opacity="0.75" stroke-linecap="round" />

      <rect x="335" y="80" width="100" height="12" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="335" y="140" width="100" height="12" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="335" y="200" width="100" height="12" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.2" />
      <rect x="350" y="58" width="14" height="22" rx="2" fill="#ec4899" opacity="0.8" />
      <rect x="380" y="52" width="18" height="28" rx="3" fill="#a855f7" opacity="0.8" />
      <rect x="410" y="60" width="12" height="20" rx="2" fill="#38bdf8" opacity="0.8" />

      <polygon points="140,290 460,290 450,305 150,305" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="180" y="355" width="90" height="65" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="175" y="345" width="100" height="14" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="225" y="390" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">POUF STOOL</text>
      <rect x="310" y="305" width="140" height="120" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2" />

      ${isOpen ? `
        <rect x="325" y="312" width="135" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="330" y="350" width="135" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="335" y="388" width="135" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="390" y="332" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">LIPSTICKS / CREAMS</text>
        <text x="395" y="370" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">JEWELRY TRAY</text>
        <text x="400" y="408" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">HAIR DRYER</text>
      ` : `
        <rect x="315" y="312" width="130" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="315" y="350" width="130" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="315" y="388" width="130" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <circle cx="380" cy="328" r="4.5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
          <circle cx="380" cy="366" r="4.5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
          <circle cx="380" cy="404" r="4.5" fill="${hwFill}" stroke="#000000" stroke-width="0.8" />
        ` : `
          <line x1="330" y1="316" x2="430" y2="316" stroke="#000000" stroke-width="2" opacity="0.35" />
          <line x1="330" y1="354" x2="430" y2="354" stroke="#000000" stroke-width="2" opacity="0.35" />
          <line x1="330" y1="392" x2="430" y2="392" stroke="#000000" stroke-width="2" opacity="0.35" />
        `}
      `}
    `;
  }

  // --- 12. STRUCTURE 9: EXECUTIVE OFFICE / STUDY DESK ---
  function renderOfficeSvg(s) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;

    return `
      <ellipse cx="300" cy="435" rx="190" ry="14" fill="url(#sim-floor-shadow)" />
      <polygon points="110,210 490,210 475,230 125,230" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <ellipse cx="440" cy="220" rx="7" ry="3" fill="#64748b" stroke="#0f172a" stroke-width="1" />
      <rect x="125" y="230" width="22" height="190" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="147" y="240" width="183" height="130" fill="${fillA}" opacity="0.85" stroke="#0f172a" stroke-width="1.5" />
      <ellipse cx="235" cy="310" rx="35" ry="40" fill="#334155" opacity="0.6" />
      <rect x="210" y="350" width="50" height="10" rx="3" fill="#1e293b" opacity="0.7" />
      <line x1="235" y1="360" x2="235" y2="400" stroke="#000000" stroke-width="5" />
      <line x1="215" y1="400" x2="255" y2="400" stroke="#000000" stroke-width="3" />
      <rect x="330" y="230" width="145" height="190" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />

      ${isOpen ? `
        <rect x="345" y="240" width="140" height="48" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="350" y="298" width="140" height="48" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <rect x="355" y="356" width="140" height="54" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <text x="415" y="268" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">STATIONERY &amp; PENS</text>
        <text x="420" y="326" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">PROJECT FILES</text>
        <text x="425" y="388" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">LOCKABLE DEEDS</text>
      ` : `
        <rect x="335" y="238" width="135" height="52" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="335" y="296" width="135" height="52" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="335" y="354" width="135" height="58" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <circle cx="452" cy="252" r="3.5" fill="#ca8a04" stroke="#000000" stroke-width="0.8" />
        ${s.hardware !== 'concealed' ? `
          <rect x="382" y="262" width="40" height="5" rx="2" fill="${hwFill}" />
          <rect x="382" y="320" width="40" height="5" rx="2" fill="${hwFill}" />
          <rect x="382" y="381" width="40" height="5" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="345" y1="243" x2="460" y2="243" stroke="#000000" stroke-width="2" opacity="0.35" />
          <line x1="345" y1="301" x2="460" y2="301" stroke="#000000" stroke-width="2" opacity="0.35" />
          <line x1="345" y1="359" x2="460" y2="359" stroke="#000000" stroke-width="2" opacity="0.35" />
        `}
      `}
    `;
  }

  // --- 13. TECHNICAL ARCHITECTURAL WIREFRAME DIMENSION OVERLAY ---
  function renderWireframeDimensions(struct, dim) {
    const w = dim.width || 6.0;
    const h = dim.height || 7.0;
    return `
      <!-- Technical Architectural Dimension Overlay -->
      <g id="sim-wireframe-lines" stroke="#2563eb" stroke-width="1.6" opacity="0.95">
        <!-- Width Dimension Bar (Top) -->
        <line x1="50" y1="25" x2="550" y2="25" stroke-dasharray="4,4" />
        <circle cx="50" cy="25" r="3" fill="#2563eb" />
        <circle cx="550" cy="25" r="3" fill="#2563eb" />
        <rect x="235" y="14" width="130" height="22" rx="5" fill="#1e3a8a" />
        <text x="300" y="29" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">
          Width: ${w.toFixed(1)} ft (${Math.round(w * 304.8)} mm)
        </text>

        <!-- Height Dimension Bar (Right) -->
        <line x1="565" y1="40" x2="565" y2="430" stroke-dasharray="4,4" />
        <circle cx="565" cy="40" r="3" fill="#2563eb" />
        <circle cx="565" cy="430" r="3" fill="#2563eb" />
        <rect x="515" y="225" width="80" height="22" rx="5" fill="#1e3a8a" />
        <text x="555" y="240" font-size="10.5" font-weight="bold" fill="#ffffff" text-anchor="middle">
          Ht: ${h.toFixed(1)} ft
        </text>
      </g>
    `;
  }

  // --- 14. MAIN SVG RENDER DISPATCHER ---
  function renderSimulatorSvg() {
    const s = window.SIM_STATE;
    const dim = s.dimensions[s.structure] || { width: 6, height: 7 };

    let bodySvg = '';
    if (s.structure === 'wardrobe') bodySvg = renderWardrobeSvg(s);
    else if (s.structure === 'wardrobe6') bodySvg = renderWardrobe6Svg(s);
    else if (s.structure === 'fullwall') bodySvg = renderFullWallSvg(s);
    else if (s.structure === 'kitchen') bodySvg = renderKitchenSvg(s);
    else if (s.structure === 'almirah') bodySvg = renderAlmirahSvg(s);
    else if (s.structure === 'bed') bodySvg = renderBedSvg(s);
    else if (s.structure === 'tvunit') bodySvg = renderTVUnitSvg(s);
    else if (s.structure === 'dressing') bodySvg = renderDressingSvg(s);
    else if (s.structure === 'office') bodySvg = renderOfficeSvg(s);

    const wireframeSvg = s.showWireframe ? renderWireframeDimensions(s.structure, dim) : '';
    const defs = getSvgDefs();

    return `
      <svg id="sim-live-svg" viewBox="0 0 600 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display: block; user-select: none;">
        ${defs}
        <rect width="600" height="480" fill="#f8fafc" />
        <line x1="0" y1="430" x2="600" y2="430" stroke="#cbd5e1" stroke-width="1.5" />
        <rect y="430" width="600" height="50" fill="#f1f5f9" />

        <g id="sim-furniture-body">
          ${bodySvg}
        </g>

        ${wireframeSvg}

        ${s.isWarmLight ? `
          <rect width="600" height="480" fill="url(#sim-spotlight)" pointer-events="none" />
        ` : ''}

        <text x="16" y="470" font-size="10" font-weight="900" fill="#94a3b8" opacity="0.75" letter-spacing="1">
          BABA DUGDHESWAR ENTERPRISE • ONDA SHOWROOM 3D
        </text>
      </svg>
    `;
  }

  // --- 15. BILL OF MATERIALS (BOM) & ESTIMATED RETAIL PRICING ENGINE ---
  function calculateSimulatorBom() {
    const s = window.SIM_STATE;
    const struct = s.structure;
    const dim = s.dimensions[struct] || { width: 6, height: 7 };

    const ply18Rate = s.plyGrade === 'marine' ? 2464 : 2042; // IS:710 Marine vs IS:303 BWR (8x4 sheet)
    const ply12Rate = s.plyGrade === 'marine' ? 2112 : 1690; // 12mm sheet
    const ply6Rate = 1126; // 6mm backer sheet
    const micaOuterRate = s.laminateType === 'gloss' ? 1254 : 1045; // 1.0mm decorative laminate
    const micaInnerRate = 560; // 0.8mm inner liner
    const fevicolRate = 352; // per kg Marine glue

    let p18 = 0, p12 = 0, p6 = 0, micaA = 0, micaB = 0, liner = 0, fevicolKg = 0, hwCost = 0, title = '';

    if (struct === 'wardrobe') {
      title = `${dim.width} × ${dim.height} ft 4-Door Wardrobe`;
      p18 = dim.width >= 8 ? 6 : (dim.width >= 6 ? 4.5 : 3.5);
      p12 = dim.width >= 8 ? 2.5 : 1.5;
      p6 = dim.width >= 8 ? 2.5 : 2.0;
      micaA = 2;
      micaB = dim.width >= 8 ? 3 : 2;
      liner = micaA + micaB;
      fevicolKg = dim.width >= 8 ? 10 : 8;
      hwCost = s.hardware === 'gold' ? 3200 : (s.hardware === 'black' ? 2600 : 2100);

    } else if (struct === 'wardrobe6') {
      title = `${dim.width} × ${dim.height} ft Master 6-Door Wardrobe`;
      p18 = dim.height >= 8 ? 8.5 : 7.0;
      p12 = 3.5;
      p6 = 3.5;
      micaA = 3.0; // Outer carcass
      micaB = 4.5; // 6 tall doors, 6 lofts, 4 drawers
      liner = 7.0;
      fevicolKg = 14;
      hwCost = s.hardware === 'gold' ? 5200 : (s.hardware === 'black' ? 4400 : 3800);

    } else if (struct === 'fullwall') {
      title = `${dim.width} × ${dim.height} ft Full-Wall Storage Suite`;
      const wallArea = (dim.width || 12) * (dim.height || 8.5);
      p18 = Math.round((wallArea / 12) * 10) / 10; // ~8.5 to 11 sheets
      p12 = Math.round((wallArea / 24) * 10) / 10; // ~4 to 5 sheets
      p6 = Math.round((wallArea / 26) * 10) / 10;  // ~3.5 to 4.5 sheets
      micaA = Math.round((wallArea / 30) * 10) / 10; // Outer framing & open display rack
      micaB = Math.round((wallArea / 22) * 10) / 10; // Wardrobe doors, drawers & lofts
      liner = Math.round((micaA + micaB) * 10) / 10;
      fevicolKg = Math.round(dim.width * 1.5);
      hwCost = Math.round(4200 + (dim.width * 280)); // Hinges, channels, handles, LED spotlight channels

    } else if (struct === 'kitchen') {
      title = `${dim.width} × ${dim.height} ft Modern Modular Kitchen`;
      p18 = dim.width >= 10 ? 8 : 6.5; // Base & Wall carcasses in BWP Marine
      p12 = 3.0; // Shelves & drawer boxes
      p6 = 2.0;  // Backing panels
      micaA = 2.0; // Dado backsplash / Carcass
      micaB = 4.0; // High-gloss shutters & tandem drawer fronts
      liner = 5.0; // Inner liner
      fevicolKg = 10; // Waterproof Marine adhesive
      hwCost = s.hardware === 'gold' ? 6200 : 5400; // Tandem drawer slides, hydraulic lift-ups, cutlery organizers

    } else if (struct === 'almirah') {
      title = `4.0 × 6.5 ft Classic Almirah (with Mirror)`;
      p18 = 3.5;
      p12 = 1.5;
      p6 = 1.5;
      micaA = 1.5;
      micaB = 1.5;
      liner = 3.0;
      fevicolKg = 6;
      hwCost = 2800; // Beveled mirror glass, locks & antique handles

    } else if (struct === 'bed') {
      title = `${dim.width} × ${dim.length} ft Hydraulic Box Bed`;
      p18 = dim.width >= 6 ? 4.5 : 3.5;
      p12 = 2.0;
      p6 = 0;
      micaA = 2.0;
      micaB = 1.5;
      liner = 2.0;
      fevicolKg = 6;
      hwCost = 3500; // Hydraulic gas lift kit & corner clamps

    } else if (struct === 'tvunit') {
      title = `7.0 × 6.0 ft Floating TV Entertainment Unit`;
      p18 = 3.5;
      p12 = 1.0;
      p6 = 1.5;
      micaA = 1.5;
      micaB = 2.0;
      liner = 2.0;
      fevicolKg = 5;
      hwCost = 2600; // Softclose drop flaps, LED channel & heavy wall brackets

    } else if (struct === 'dressing') {
      title = `3.5 × 6.5 ft Luxury LED Dressing Vanity`;
      p18 = 2.5;
      p12 = 1.0;
      p6 = 1.0;
      micaA = 1.5;
      micaB = 1.0;
      liner = 2.0;
      fevicolKg = 4;
      hwCost = 3200; // Arch Mirror LED touch system + telescopic drawer channels

    } else if (struct === 'office') {
      title = `4.5 × 2.5 ft Executive Office & Study Desk`;
      p18 = 2.5;
      p12 = 1.0;
      p6 = 0.5;
      micaA = 1.5;
      micaB = 1.0;
      liner = 1.5;
      fevicolKg = 4;
      hwCost = 1800; // 3-drawer central lock, telescopic slides & grommet
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

  // --- 16. UI CONTROLLER & EVENT LISTENERS ---
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

    // 5. Update Structure Carousel Pills
    document.querySelectorAll('.sim-struct-pill').forEach(el => {
      const type = el.getAttribute('data-struct');
      el.classList.toggle('active', type === window.SIM_STATE.structure);
    });

    // 6. Show / Hide Custom Dimension Panel (especially prominent for fullwall, wardrobe6, kitchen)
    const dimPanel = document.getElementById('sim-custom-dim-panel');
    if (dimPanel) {
      const isCustomizable = ['fullwall', 'wardrobe6', 'kitchen', 'wardrobe'].includes(window.SIM_STATE.structure);
      dimPanel.style.display = isCustomizable ? 'block' : 'none';
      
      const widthVal = window.SIM_STATE.dimensions[window.SIM_STATE.structure]?.width || 12;
      const heightVal = window.SIM_STATE.dimensions[window.SIM_STATE.structure]?.height || 8.5;
      
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
      }
    }

    // 7. Update Active Swatch Zone Labels & Highlights
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

    // 8. Update Swatch Grid Selection Circles
    const currentSwatchId = window.SIM_STATE.activeZone === 'A' ? window.SIM_STATE.zoneA : window.SIM_STATE.zoneB;
    document.querySelectorAll('.sim-swatch-circle').forEach(c => {
      const id = c.getAttribute('data-swatch-id');
      c.classList.toggle('selected', id === currentSwatchId);
    });

    // 9. Update Hardware Buttons
    document.querySelectorAll('.sim-hw-btn').forEach(b => {
      const h = b.getAttribute('data-hw');
      b.classList.toggle('active', h === window.SIM_STATE.hardware);
    });

    // 10. Recompute BOM & Price
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

  // --- 17. EVENT HANDLERS ---
  window.simSelectStructure = function (struct) {
    window.SIM_STATE.structure = struct;
    window.updateSimulatorUI();
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

  // Custom Dimensions & Wall Sliders
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

  // --- 18. HIGH-CONVERSION ACTIONS ---
  // A. WhatsApp Spec Sheet
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

  // B. Download Design Snapshot (PNG)
  window.simDownloadSnapshot = function () {
    const svgElem = document.getElementById('sim-live-svg');
    if (!svgElem) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElem);
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 960;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = function () {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add Watermark Header Bar
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, canvas.width, 45);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('BABA DUGDHESWAR ENTERPRISE • ONDA, BANKURA', 25, 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.fillText('3D Studio Custom Specification | Call: 9867098952', 800, 30);

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

  // C. Claim 5% Discount Coupon
  window.simClaimDiscount = function () {
    alert('🎉 Congratulations!\nYour 3D Studio Exclusive Counter Code: "BDE-STUDIO-PUJA"\nShow this code at the Onda showroom counter or WhatsApp to claim an extra 5% instant discount on your laminate & plywood booking!');
  };

  // D. Find Mistri for this furniture
  window.simFindMistri = function () {
    if (window.switchView) {
      window.switchView('mistris');
      if (window.showToast) window.showToast(`Showing verified Onda mistris for your ${window.SIM_STATE.structure}!`);
    }
  };

  // Auto-init when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      if (document.getElementById('sim-svg-stage')) {
        window.updateSimulatorUI();
      }
    }, 200);
  });

})();
