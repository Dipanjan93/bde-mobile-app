/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * 3D Furniture & Laminate Studio Simulator Engine
 * Parametric Real-time Vector Visualizer & BOM Calculator
 *
 * Supported Structures (18 Models across 5 Categories):
 * --- Wardrobes & Storage ---
 * 1. 2-Door Compact Wardrobe (wardrobe2)
 * 2. 4-Door Modern Wardrobe (wardrobe)
 * 3. Master 6-Door Wardrobe & Lofts (wardrobe6)
 * 4. Full-Wall Storage Suite (fullwall) with 3 layouts (standard, entertainment, full_wardrobe)
 * 5. Classic Wooden Almirah with Mirror & Tijori (almirah)
 *
 * --- Modular Kitchen ---
 * 6. Straight-Line Modular Kitchen (kitchen)
 * 7. L-Shaped Corner Modular Kitchen (kitchen_l)
 * 8. Parallel / Galley Modular Kitchen (kitchen_parallel)
 * 9. Luxury Island Modular Kitchen (kitchen_island)
 *
 * --- Living & Media ---
 * 10. Floating Wall TV Entertainment Unit (tvunit)
 * 11. Grand Media Console with Display Towers (tvunit_console)
 * 12. Room-Divider Partition TV Wall (tvunit_partition)
 *
 * --- Bedroom & Vanity ---
 * 13. Hydraulic Box Bed with Tufted Headboard (bed)
 * 14. Divan Bed with Pull-out Storage Drawers (bed_drawers)
 * 15. LED Arch Dressing Vanity (dressing)
 * 16. Master Full-Height Luxury Vanity Station (dressing_tall)
 *
 * --- Office & Study ---
 * 17. Presidential Executive Desk (office)
 * 18. Modern L-Shaped Corner Workstation (office_lshape)
 * 19. Student Study Table with Overhead Bookshelf (office_study)
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
    activeCategory: 'all',  // 'all', 'wardrobe', 'kitchen', 'living', 'bedroom', 'office'
    dimensions: {
      wardrobe2:        { width: 4.0, height: 7.0, depth: 1.75, label: '4.0 ft (2-Door Compact)' },
      wardrobe:         { width: 6.0, height: 7.0, depth: 2.0,  label: '6.0 ft (4-Door Standard)' },
      wardrobe6:        { width: 10.0, height: 7.5, depth: 2.0, label: '10.0 ft Master 6-Door' },
      fullwall:         { width: 12.0, height: 8.5, depth: 2.0, label: '12.0 ft Full-Wall Suite' },
      almirah:          { width: 4.0, height: 6.5, depth: 1.75, label: '4.0 ft (2-Door + Mirror)' },
      kitchen:          { width: 9.0, height: 7.0, depth: 2.0,  label: '9.0 ft Straight Kitchen' },
      kitchen_l:        { width: 10.0, height: 7.5, depth: 2.0, label: '10.0 ft L-Shaped Kitchen' },
      kitchen_parallel: { width: 10.0, height: 7.5, depth: 2.0, label: '10.0 ft Parallel Kitchen' },
      kitchen_island:   { width: 11.0, height: 7.5, depth: 2.0, label: '11.0 ft Island Kitchen' },
      tvunit:           { width: 7.0, height: 6.0, depth: 1.25, label: '7.0 ft Floating TV Unit' },
      tvunit_console:   { width: 8.5, height: 6.5, depth: 1.5,  label: '8.5 ft Console & Towers' },
      tvunit_partition: { width: 8.0, height: 7.5, depth: 1.5,  label: '8.0 ft Room Partition TV' },
      bed:              { width: 5.5, height: 4.0, length: 6.5, depth: 6.5, label: '5.5 ft Hydraulic Bed' },
      bed_drawers:      { width: 5.5, height: 4.0, length: 6.5, depth: 6.5, label: '5.5 ft Storage Divan' },
      dressing:         { width: 3.5, height: 6.5, depth: 1.5,  label: '3.5 ft LED Arch Vanity' },
      dressing_tall:    { width: 4.5, height: 7.5, depth: 1.5,  label: '4.5 ft Full Vanity Station' },
      office:           { width: 5.0, height: 2.75, depth: 2.5, label: '5.0 ft Executive Desk' },
      office_lshape:    { width: 6.5, height: 2.75, depth: 4.5, label: '6.5 ft L-Shaped Workstation' },
      office_study:     { width: 4.5, height: 6.5, depth: 2.0,  label: '4.5 ft Study Table & Bookshelf' }
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
    { id: 'metallic_brass', name: 'Brushed Champagne Brass', code: 'BDE-501', category: 'fluted', baseColor: '#d4af37', desc: 'Metallic reflective warm golden sheen' },
    // --- Woodgrains (5 Added -> Total 10) ---
    { id: 'ashwood', name: 'Bleached Scandinavian Ash', code: 'BDE-825', category: 'wood', baseColor: '#e5d7c3', desc: 'Airy Nordic blonde wood with subtle straight grain' },
    { id: 'mahogany', name: 'Deep Royal Mahogany', code: 'BDE-830', category: 'wood', baseColor: '#4a150e', desc: 'Opulent crimson-chocolate antique timber tone' },
    { id: 'maple', name: 'Canadian Honey Maple', code: 'BDE-835', category: 'wood', baseColor: '#c89657', desc: 'Silky golden amber grain with satin sheen' },
    { id: 'elm', name: 'Smoked Alpine Grey Elm', code: 'BDE-840', category: 'wood', baseColor: '#59524c', desc: 'Contemporary weathered ash-grey architectural grain' },
    { id: 'macassar', name: 'Macassar Zebra Ebony', code: 'BDE-845', category: 'wood', baseColor: '#1f1610', desc: 'Dramatic alternating obsidian and cognac stripes' },

    // --- Italian Stone & Marble (5 Added -> Total 8) ---
    { id: 'calacatta', name: 'Calacatta Gold Imperial', code: 'BDE-920', category: 'marble', baseColor: '#fbfcf8', desc: 'Warm ivory marble laced with honey-gold ribbon veins' },
    { id: 'statuario', name: 'Statuario Extra White', code: 'BDE-925', category: 'marble', baseColor: '#ffffff', desc: 'Pure alpine white with bold charcoal feather fractures' },
    { id: 'portoro', name: 'Portoro Italian Onyx', code: 'BDE-930', category: 'marble', baseColor: '#080b11', desc: 'Jet-black Italian marble with radiant gold striations' },
    { id: 'terrazzo', name: 'Venetian Terrazzo Pearl', code: 'BDE-935', category: 'marble', baseColor: '#ede8df', desc: 'Modern terrazzo with terracotta and sage mineral flecks' },
    { id: 'concrete', name: 'Industrial Slate Concrete', code: 'BDE-940', category: 'marble', baseColor: '#8c929a', desc: 'Urban micro-cement slate texture with matte stone pores' },

    // --- Modern Super-Matte Solids (5 Added -> Total 10) ---
    { id: 'blush', name: 'Cashmere Blush Rose', code: 'BDE-730', category: 'solid', baseColor: '#d4a59a', desc: 'Velvety warm dusty rose matte for luxury master vanity' },
    { id: 'olive', name: 'Deep Olive Botanical', code: 'BDE-735', category: 'solid', baseColor: '#3c4a3e', desc: 'Rich earthbound moss green with anti-fingerprint surface' },
    { id: 'mustard', name: 'Tuscan Ochre Mustard', code: 'BDE-740', category: 'solid', baseColor: '#d99b26', desc: 'Warm artisanal saffron ochre accent solid' },
    { id: 'teal', name: 'Aegean Dusty Teal', code: 'BDE-745', category: 'solid', baseColor: '#2c5364', desc: 'Sophisticated deep sea-blue green with powdery matte feel' },
    { id: 'greige', name: 'Milanese Minimal Greige', code: 'BDE-750', category: 'solid', baseColor: '#bdb4a6', desc: 'Timeless warm grey-beige neutral for full-wall closets' },

    // --- 3D Fluted Louvers & Metallics (5 Added -> Total 8) ---
    { id: 'fluted_rosegold', name: 'Rose Gold Fluted Louver', code: 'BDE-615', category: 'fluted', baseColor: '#b76e79', desc: '3D slatted acoustic louvers in shimmering rose gold' },
    { id: 'fluted_marble', name: 'Carrara Fluted Scallop', code: 'BDE-620', category: 'fluted', baseColor: '#f1f5f9', desc: 'Vertical sculpted 3D acoustic ribs in white Italian marble' },
    { id: 'metallic_copper', name: 'Brushed Patina Copper', code: 'BDE-508', category: 'fluted', baseColor: '#b87333', desc: 'Warm burnished architectural copper with directional sheen' },
    { id: 'metallic_gunmetal', name: 'Smoked Titanium Gunmetal', code: 'BDE-515', category: 'fluted', baseColor: '#3a3d40', desc: 'High-tech aerospace smoked titanium with satin reflection' },
    { id: 'carbon_fiber', name: 'Stealth Carbon Weave', code: 'BDE-520', category: 'fluted', baseColor: '#18181b', desc: '3D diagonal twill carbon fiber weave with holographic depth' }
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

  const PATTERNED_LAMINATES = [
    'teak', 'walnut', 'oak', 'wenge', 'rosewood',
    'ashwood', 'mahogany', 'maple', 'elm', 'macassar',
    'carrara', 'marquina', 'travertine',
    'calacatta', 'statuario', 'portoro', 'terrazzo', 'concrete',
    'fluted_wood', 'fluted_charcoal', 'metallic_brass',
    'fluted_rosegold', 'fluted_marble', 'metallic_copper', 'metallic_gunmetal', 'carbon_fiber'
  ];

  function getLaminateFill(laminateId) {
    const swatch = getSwatch(laminateId);
    if (PATTERNED_LAMINATES.includes(laminateId)) {
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

        <!-- CNC Jali Lattice Screen Pattern (Partition Wall) -->
        <pattern id="pat-jali" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#2d1c10" />
          <rect x="2" y="2" width="16" height="16" rx="3" fill="#150d07" />
          <polygon points="10,4 16,10 10,16 4,10" fill="#d97706" opacity="0.65" />
          <circle cx="10" cy="10" r="2.5" fill="#fef08a" />
        </pattern>

        <!-- Pin-up Corkboard Pattern (Study Desk) -->
        <pattern id="pat-cork" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#d97706" />
          <circle cx="4" cy="6" r="1.5" fill="#b45309" opacity="0.6" />
          <circle cx="16" cy="14" r="2" fill="#92400e" opacity="0.5" />
          <circle cx="20" cy="4" r="1" fill="#78350f" opacity="0.4" />
          <circle cx="8" cy="18" r="1.5" fill="#b45309" opacity="0.6" />
        </pattern>

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

        <!-- NEW PATTERNS (20 Added Finishes) -->
        <!-- Woodgrains -->
        <pattern id="pat-ashwood" width="30" height="90" patternUnits="userSpaceOnUse">
          <rect width="30" height="90" fill="#e5d7c3" />
          <line x1="8" y1="0" x2="8" y2="90" stroke="#cdbeaa" stroke-width="1.2" opacity="0.6" stroke-dasharray="25,5,15,3" />
          <line x1="18" y1="0" x2="18" y2="90" stroke="#bdae99" stroke-width="1.5" opacity="0.5" stroke-dasharray="10,4,30,6" />
        </pattern>

        <pattern id="pat-mahogany" width="35" height="110" patternUnits="userSpaceOnUse">
          <rect width="35" height="110" fill="#4a150e" />
          <path d="M0,0 Q18,35 35,20 M0,40 Q22,70 35,55 M0,75 Q15,100 35,90" stroke="#2c0b06" stroke-width="2.2" fill="none" opacity="0.75" />
          <path d="M5,15 Q25,50 5,85" stroke="#682218" stroke-width="1" fill="none" opacity="0.4" />
        </pattern>

        <pattern id="pat-maple" width="40" height="100" patternUnits="userSpaceOnUse">
          <rect width="40" height="100" fill="#c89657" />
          <path d="M0,15 Q20,40 40,25 M0,50 Q20,75 40,60 M0,85 Q20,110 40,95" stroke="#a47236" stroke-width="1.6" fill="none" opacity="0.55" />
        </pattern>

        <pattern id="pat-elm" width="30" height="90" patternUnits="userSpaceOnUse">
          <rect width="30" height="90" fill="#59524c" />
          <line x1="6" y1="0" x2="6" y2="90" stroke="#3e3833" stroke-width="1.8" opacity="0.7" stroke-dasharray="18,4,12,3" />
          <line x1="18" y1="0" x2="18" y2="90" stroke="#756d66" stroke-width="1.2" opacity="0.45" />
          <line x1="25" y1="0" x2="25" y2="90" stroke="#3e3833" stroke-width="2" opacity="0.65" />
        </pattern>

        <pattern id="pat-macassar" width="24" height="60" patternUnits="userSpaceOnUse">
          <rect width="24" height="60" fill="#1f1610" />
          <line x1="4" y1="0" x2="4" y2="60" stroke="#92541a" stroke-width="2.5" opacity="0.8" />
          <line x1="12" y1="0" x2="12" y2="60" stroke="#000000" stroke-width="3" opacity="0.9" />
          <line x1="18" y1="0" x2="18" y2="60" stroke="#783e0c" stroke-width="1.5" opacity="0.7" />
        </pattern>

        <!-- Marbles & Stone -->
        <pattern id="pat-calacatta" width="130" height="130" patternUnits="userSpaceOnUse">
          <rect width="130" height="130" fill="#fbfcf8" />
          <path d="M0,25 Q45,35 70,10 T130,45 M15,130 Q55,65 90,85 T130,55" stroke="#d97706" stroke-width="2.2" fill="none" opacity="0.65" stroke-linecap="round" />
          <path d="M5,30 Q48,40 73,15 M20,125 Q58,70 93,90" stroke="#94a3b8" stroke-width="1.2" fill="none" opacity="0.5" />
        </pattern>

        <pattern id="pat-statuario" width="140" height="140" patternUnits="userSpaceOnUse">
          <rect width="140" height="140" fill="#ffffff" />
          <path d="M0,15 Q50,55 85,25 T140,70 M10,140 Q40,80 80,105 T140,40" stroke="#334155" stroke-width="2.8" fill="none" opacity="0.8" stroke-linecap="round" />
          <path d="M15,20 Q55,60 90,30" stroke="#64748b" stroke-width="1" fill="none" opacity="0.5" />
        </pattern>

        <pattern id="pat-portoro" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#080b11" />
          <path d="M0,35 Q50,15 80,60 T120,25 M5,105 Q65,80 95,115 T120,75" stroke="#eab308" stroke-width="2.2" fill="none" opacity="0.85" />
          <path d="M10,40 Q55,20 85,65" stroke="#fef08a" stroke-width="0.8" fill="none" opacity="0.65" />
          <path d="M25,0 Q55,50 35,90" stroke="#ffffff" stroke-width="0.7" fill="none" opacity="0.45" />
        </pattern>

        <pattern id="pat-terrazzo" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#ede8df" />
          <polygon points="5,5 9,3 8,8" fill="#b85d43" opacity="0.85" />
          <polygon points="18,12 24,14 21,19" fill="#2c5364" opacity="0.8" />
          <circle cx="12" cy="22" r="2" fill="#d97706" opacity="0.75" />
          <polygon points="22,4 27,8 24,6" fill="#334155" opacity="0.7" />
        </pattern>

        <pattern id="pat-concrete" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#8c929a" />
          <circle cx="8" cy="12" r="1.5" fill="#64748b" opacity="0.6" />
          <circle cx="28" cy="8" r="1" fill="#475569" opacity="0.7" />
          <circle cx="18" cy="28" r="1.8" fill="#475569" opacity="0.6" />
          <circle cx="34" cy="32" r="1.2" fill="#cbd5e1" opacity="0.45" />
        </pattern>

        <!-- 3D Fluted & Metallics -->
        <pattern id="pat-fluted_rosegold" width="16" height="40" patternUnits="userSpaceOnUse">
          <rect width="16" height="40" fill="#b76e79" />
          <rect x="0" y="0" width="8" height="40" fill="#d48a94" />
          <rect x="8" y="0" width="8" height="40" fill="#8c4752" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#fbcfe8" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="40" stroke="#5f252f" stroke-width="1.2" />
        </pattern>

        <pattern id="pat-fluted_marble" width="16" height="40" patternUnits="userSpaceOnUse">
          <rect width="16" height="40" fill="#f1f5f9" />
          <rect x="0" y="0" width="8" height="40" fill="#ffffff" />
          <rect x="8" y="0" width="8" height="40" fill="#cbd5e1" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#ffffff" stroke-width="0.8" />
          <line x1="8" y1="0" x2="8" y2="40" stroke="#94a3b8" stroke-width="1.2" />
        </pattern>

        <pattern id="pat-metallic_copper" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#b87333" />
          <line x1="0" y1="0" x2="30" y2="30" stroke="#fdba74" stroke-width="0.7" opacity="0.45" />
          <line x1="0" y1="15" x2="30" y2="45" stroke="#7c2d12" stroke-width="0.9" opacity="0.4" />
        </pattern>

        <pattern id="pat-metallic_gunmetal" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#3a3d40" />
          <line x1="0" y1="0" x2="30" y2="30" stroke="#6b7280" stroke-width="0.6" opacity="0.5" />
          <line x1="0" y1="15" x2="30" y2="45" stroke="#1f2937" stroke-width="0.8" opacity="0.6" />
        </pattern>

        <pattern id="pat-carbon_fiber" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#18181b" />
          <rect x="0" y="0" width="6" height="6" fill="#27272a" />
          <rect x="6" y="6" width="6" height="6" fill="#27272a" />
          <line x1="0" y1="0" x2="6" y2="6" stroke="#3f3f46" stroke-width="0.7" />
          <line x1="6" y1="6" x2="12" y2="12" stroke="#3f3f46" stroke-width="0.7" />
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

    const furnH = Math.min(410, Math.max(85, hFt * pxPerFoot));
    const furnW = Math.min(580, Math.max(140, wFt * 36.0));

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

  // =========================================================
  // STRUCTURE RENDERERS (18 MODELS)
  // =========================================================

  // 1. WARDROBES: 2-DOOR COMPACT WARDROBE
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
        <polygon points="${x + 6},${y + loftH} ${x - 30},${y + loftH - 8} ${x - 30},${y + h - plinthH + 8} ${x + 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <polygon points="${x + w - 6},${y + loftH} ${x + w + 30},${y + loftH - 8} ${x + w + 30},${y + h - plinthH + 8} ${x + w - 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      ` : `
        <!-- CLOSED SHUTTERS -->
        <!-- Overhead Lofts -->
        <rect x="${x + 3}" y="${y + 3}" width="${doorW - 5}" height="${loftH - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + doorW + 2}" y="${y + 3}" width="${doorW - 5}" height="${loftH - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <!-- Main Tall Doors -->
        <rect x="${x + 3}" y="${y + loftH + 2}" width="${doorW - 5}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + doorW + 2}" y="${y + loftH + 2}" width="${doorW - 5}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Handles -->
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + doorW - 7}" y="${y + loftH + mainH / 2 - 35}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + doorW + 2}" y="${y + loftH + mainH / 2 - 35}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : `
          <line x1="${x + 3}" y1="${y + loftH + 2}" x2="${x + w - 3}" y2="${y + loftH + 2}" stroke="#0f172a" stroke-width="2" />
        `}
      `}
    `;
  }

  // 2. WARDROBES: 4-DOOR STANDARD WARDROBE
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
        <!-- OPEN INTERIOR BAY -->
        <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - plinthH - 12}" fill="#faf5ee" stroke="#78350f" stroke-width="1.2" />
        <line x1="${x + 6}" y1="${y + loftH}" x2="${x + w - 6}" y2="${y + loftH}" stroke="#b47b48" stroke-width="4" />
        <line x1="${x + w / 2}" y1="${y + loftH}" x2="${x + w / 2}" y2="${y + h - plinthH}" stroke="#b47b48" stroke-width="4" />
        <!-- Left Bay: Hanging Rail -->
        <line x1="${x + 12}" y1="${y + loftH + 20}" x2="${x + w / 2 - 12}" y2="${y + loftH + 20}" stroke="#94a3b8" stroke-width="3" />
        <rect x="${x + 25}" y="${y + loftH + 28}" width="30" height="90" rx="3" fill="#2563eb" opacity="0.8" />
        <rect x="${x + 65}" y="${y + loftH + 28}" width="30" height="100" rx="3" fill="#dc2626" opacity="0.8" />
        <!-- Right Bay: Shelves -->
        <line x1="${x + w / 2}" y1="${y + loftH + mainH * 0.33}" x2="${x + w - 6}" y2="${y + loftH + mainH * 0.33}" stroke="#b47b48" stroke-width="3.5" />
        <line x1="${x + w / 2}" y1="${y + loftH + mainH * 0.66}" x2="${x + w - 6}" y2="${y + loftH + mainH * 0.66}" stroke="#b47b48" stroke-width="3.5" />
        <!-- Swung Doors -->
        <polygon points="${x + 6},${y + loftH} ${x - 35},${y + loftH - 10} ${x - 35},${y + h - plinthH + 10} ${x + 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <polygon points="${x + w - 6},${y + loftH} ${x + w + 35},${y + loftH - 10} ${x + w + 35},${y + h - plinthH + 10} ${x + w - 6},${y + h - plinthH}" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      ` : `
        <!-- CLOSED 4 DOORS + 4 LOFTS -->
        ${[0, 1, 2, 3].map(i => `
          <rect x="${x + i * doorW + 2}" y="${y + 2}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
          <rect x="${x + i * doorW + 2}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        `).join('')}

        ${s.hardware !== 'concealed' ? `
          <rect x="${x + 2 * doorW - 7}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + 2 * doorW + 2}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + doorW - 6}" y="${y + loftH + mainH / 2 - 30}" width="4" height="60" rx="2" fill="${hwFill}" />
          <rect x="${x + 3 * doorW + 2}" y="${y + loftH + mainH / 2 - 30}" width="4" height="60" rx="2" fill="${hwFill}" />
        ` : `
          <line x1="${x + 2}" y1="${y + loftH + 2}" x2="${x + w - 2}" y2="${y + loftH + 2}" stroke="#0f172a" stroke-width="2" />
        `}
      `}
    `;
  }

  // 3. WARDROBES: MASTER 6-DOOR WARDROBE
  function renderWardrobe6Svg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const loftH = Math.round(h * 0.20);
    const mainH = h - loftH - plinthH;
    const doorW = Math.round(w / 6);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 30}" ry="15" fill="url(#sim-floor-shadow)" />
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      ${isOpen ? `
        <!-- 3-BAY INTERIOR VIEW -->
        <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - plinthH - 12}" fill="#faf5ee" stroke="#78350f" stroke-width="1.2" />
        <line x1="${x + 6}" y1="${y + loftH}" x2="${x + w - 6}" y2="${y + loftH}" stroke="#b47b48" stroke-width="4" />
        <line x1="${x + w / 3}" y1="${y + loftH}" x2="${x + w / 3}" y2="${y + h - plinthH}" stroke="#b47b48" stroke-width="4" />
        <line x1="${x + (2 * w) / 3}" y1="${y + loftH}" x2="${x + (2 * w) / 3}" y2="${y + h - plinthH}" stroke="#b47b48" stroke-width="4" />
        <!-- Center Bay Drawer Chest -->
        <rect x="${x + w / 3 + 10}" y="${y + h - plinthH - 85}" width="${w / 3 - 20}" height="75" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <line x1="${x + w / 3 + 10}" y1="${y + h - plinthH - 48}" x2="${x + (2 * w) / 3 - 10}" y2="${y + h - plinthH - 48}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 2}" y="${y + h - plinthH - 62}" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">DRAWER 1</text>
        <text x="${x + w / 2}" y="${y + h - plinthH - 25}" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">DRAWER 2</text>
      ` : `
        <!-- 6 OVERHEAD LOFTS -->
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <rect x="${x + i * doorW + 2}" y="${y + 2}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
          <rect x="${x + i * doorW + 2}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        `).join('')}

        ${s.hardware !== 'concealed' ? [1, 3, 5].map(i => `
          <rect x="${x + i * doorW - 7}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
          <rect x="${x + i * doorW + 2}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
        `).join('') : ''}
      `}
    `;
  }

  // 4. WARDROBES: FULL-WALL STORAGE SUITE (3 LAYOUTS)
  function renderFullWallSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const cfg = s.fullwallConfig || 'standard';
    const { x, y, w, h, plinthH, floorY } = p;

    const loftH = Math.round(h * 0.20);
    const mainH = h - loftH - plinthH;

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

        <!-- LEFT SECTION: Wardrobe -->
        <rect x="${x + 2}" y="${y + loftH}" width="${leftW - 4}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        <line x1="${x + leftW / 2}" y1="${y + loftH}" x2="${x + leftW / 2}" y2="${y + loftH + mainH}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + leftW / 2 - 7}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
          <rect x="${x + leftW / 2 + 2}" y="${y + loftH + mainH / 2 - 40}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}

        <!-- CENTER SECTION: OPEN BACKLIT DISPLAY RACK -->
        <rect x="${x + leftW}" y="${y + loftH}" width="${centerW}" height="${mainH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
        <rect x="${x + leftW}" y="${y + loftH}" width="${centerW}" height="25" fill="url(#led-strip-glow)" />
        ${[1, 2, 3, 4].map(idx => `
          <line x1="${x + leftW}" y1="${y + loftH + (idx * mainH) / 5}" x2="${x + leftW + centerW}" y2="${y + loftH + (idx * mainH) / 5}" stroke="#0f172a" stroke-width="2.5" />
        `).join('')}
        <circle cx="${x + leftW + centerW / 2}" cy="${y + loftH + (mainH / 5) - 14}" r="8" fill="#ca8a04" />
        <rect x="${x + leftW + 15}" y="${y + loftH + (2 * mainH) / 5 - 24}" width="8" height="24" rx="2" fill="#dc2626" />
        <rect x="${x + leftW + 25}" y="${y + loftH + (2 * mainH) / 5 - 20}" width="8" height="20" rx="2" fill="#2563eb" />
        <circle cx="${x + leftW + centerW - 25}" cy="${y + loftH + (2 * mainH) / 5 - 12}" r="10" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
        <!-- Bottom Drawers in Center -->
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

    if (cfg === 'entertainment') {
      const wardW = Math.round(w * 0.33);
      const tvW = w - 2 * wardW;

      return `
        <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 35}" ry="16" fill="url(#sim-floor-shadow)" />
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
        <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

        <!-- Continuous Top Loft Bridge -->
        <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${loftH - 4}" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        <!-- LEFT WARDROBE -->
        <rect x="${x + 2}" y="${y + loftH}" width="${wardW - 4}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + wardW - 12}" y="${y + loftH + mainH / 2 - 35}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}

        <!-- CENTER ENTERTAINMENT TV NICHE -->
        <rect x="${x + wardW}" y="${y + loftH}" width="${tvW}" height="${mainH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
        <rect x="${x + wardW + 15}" y="${y + loftH + 20}" width="${tvW - 30}" height="${mainH - 90}" rx="6" fill="#fef08a" opacity="0.3" filter="blur(6px)" />
        <rect x="${x + wardW + 20}" y="${y + loftH + 25}" width="${tvW - 40}" height="${mainH - 100}" rx="3" fill="#020617" stroke="#334155" stroke-width="2" />
        <text x="${x + wardW + tvW / 2}" y="${y + loftH + (mainH - 100) / 2 + 25}" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">SMART 4K TV</text>
        <rect x="${x + wardW + 10}" y="${y + loftH + mainH - 65}" width="${tvW - 20}" height="55" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + wardW + tvW / 2 - 25}" y="${y + loftH + mainH - 38}" width="50" height="5" rx="2" fill="${hwFill}" />
        ` : ''}

        <!-- RIGHT WARDROBE -->
        <rect x="${x + wardW + tvW + 2}" y="${y + loftH}" width="${wardW - 4}" height="${mainH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + wardW + tvW + 7}" y="${y + loftH + mainH / 2 - 35}" width="5" height="70" rx="2.5" fill="${hwFill}" />
        ` : ''}
      `;
    }

    // Full Wardrobe Wall
    const numDoors = Math.max(6, Math.round(w / 70));
    const doorW = Math.round(w / numDoors);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 35}" ry="16" fill="url(#sim-floor-shadow)" />
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <rect x="${x}" y="${y + h - plinthH}" width="${w}" height="${plinthH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      ${Array.from({ length: numDoors }).map((_, i) => `
        <rect x="${x + i * doorW + 2}" y="${y + 2}" width="${doorW - 4}" height="${loftH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + i * doorW + 2}" y="${y + loftH + 2}" width="${doorW - 4}" height="${mainH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      `).join('')}

      ${s.hardware !== 'concealed' ? Array.from({ length: Math.floor(numDoors / 2) }).map((_, i) => `
        <rect x="${x + (2 * i + 1) * doorW - 7}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
        <rect x="${x + (2 * i + 1) * doorW + 2}" y="${y + loftH + mainH / 2 - 45}" width="5" height="75" rx="2.5" fill="${hwFill}" />
      `).join('') : ''}
    `;
  }

  // 5. WARDROBES: CLASSIC ALMIRAH WITH MIRROR & TIJORI
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
        <rect x="${x + 3}" y="${y + 20}" width="${w / 2 - 5}" height="${h - plinthH - 70}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
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

  // 6. KITCHEN: STRAIGHT-LINE MODULAR KITCHEN
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

      <!-- Upper Wall Cabinets (Zone B) -->
      <rect x="${x}" y="${y}" width="${w / 2 - 50}" height="${wallCabH}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="${x + w / 2 + 50}" y="${y}" width="${w / 2 - 50}" height="${wallCabH}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />

      <!-- Center Chimney Hood -->
      <rect x="${x + w / 2 - 22}" y="${y - 15}" width="44" height="40" fill="url(#hw-chrome)" stroke="#64748b" stroke-width="1.2" />
      <polygon points="${x + w / 2 - 45},${y + wallCabH - 5} ${x + w / 2 + 45},${y + wallCabH - 5} ${x + w / 2 + 22},${y + 25} ${x + w / 2 - 22},${y + 25}" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />

      <!-- Granite Countertop Slab -->
      <rect x="${x - 10}" y="${counterY}" width="${w + 20}" height="18" rx="3" fill="url(#countertop-granite)" stroke="#09090b" stroke-width="2" />

      <!-- Gas Hob Cooktop & Sink -->
      <rect x="${x + w / 2 - 45}" y="${counterY - 4}" width="90" height="8" rx="2" fill="#020617" />
      <circle cx="${x + w / 2 - 25}" cy="${counterY}" r="3" fill="#ef4444" />
      <circle cx="${x + w / 2 + 25}" cy="${counterY}" r="3" fill="#ef4444" />
      <rect x="${x + w - 90}" y="${counterY - 3}" width="70" height="7" rx="2" fill="#94a3b8" />
      <path d="M${x + w - 55},${counterY - 3} L${x + w - 55},${counterY - 22} A10,10 0 0 1 ${x + w - 35},${counterY - 22} L${x + w - 35},${counterY - 16}" fill="none" stroke="url(#hw-chrome)" stroke-width="3" stroke-linecap="round" />

      <!-- Base Modular Cabinets -->
      <rect x="${x}" y="${counterY + 18}" width="${w}" height="${baseH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x}" y="${floorY - plinthH}" width="${w}" height="${plinthH}" fill="#18181b" stroke="#0f172a" stroke-width="1.2" />

      ${isOpen ? `
        <rect x="${x + 6}" y="${counterY + 22}" width="${w / 3 - 10}" height="35" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 6}" y="${counterY + 44}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">🥄 CUTLERY</text>
        <rect x="${x + 6}" y="${counterY + 62}" width="${w / 3 - 10}" height="35" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 6}" y="${counterY + 84}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">🍽️ CUP/SAUCER</text>
        <rect x="${x + 6}" y="${counterY + 102}" width="${w / 3 - 10}" height="35" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <text x="${x + w / 6}" y="${counterY + 124}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">🥘 THALI BASKET</text>
      ` : `
        <rect x="${x + 4}" y="${counterY + 22}" width="${w / 3 - 8}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 4}" y="${counterY + 22 + (baseH - 12) / 3 + 3}" width="${w / 3 - 8}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + 4}" y="${counterY + 22 + (2 * (baseH - 12)) / 3 + 6}" width="${w / 3 - 8}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + w / 3}" y="${counterY + 22}" width="${w / 3}" height="${baseH - 8}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + (2 * w) / 3 + 4}" y="${counterY + 22}" width="${w / 3 - 8}" height="${baseH - 8}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

        ${s.hardware !== 'concealed' ? `
          <rect x="${x + w / 6 - 20}" y="${counterY + 34}" width="40" height="4" rx="2" fill="${hwFill}" />
          <rect x="${x + w / 6 - 20}" y="${counterY + 74}" width="40" height="4" rx="2" fill="${hwFill}" />
          <rect x="${x + w / 6 - 20}" y="${counterY + 114}" width="40" height="4" rx="2" fill="${hwFill}" />
        ` : ''}
      `}
    `;
  }

  // 7. KITCHEN: L-SHAPED CORNER MODULAR KITCHEN
  function renderKitchenLSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const pantryW = Math.min(125, Math.round(w * 0.24));
    const mainW = w - pantryW;
    const wallCabH = Math.round(h * 0.28);
    const dadoH = Math.round(h * 0.30);
    const counterY = y + wallCabH + dadoH;
    const baseH = floorY - counterY - plinthH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- Left Tall Full-Height Pantry Unit (Floor to Ceiling) -->
      <rect x="${x}" y="${y}" width="${pantryW}" height="${h}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />
      <rect x="${x + 3}" y="${y + 3}" width="${pantryW - 6}" height="${h - plinthH - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <text x="${x + pantryW / 2}" y="${y + 24}" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">TALL PANTRY</text>
      ${s.hardware !== 'concealed' ? `
        <rect x="${x + pantryW - 12}" y="${y + h / 2 - 45}" width="5" height="90" rx="2.5" fill="${hwFill}" />
      ` : ''}

      ${isOpen ? `
        <!-- Pantry pullout trays -->
        <rect x="${x + 6}" y="${y + 40}" width="${pantryW - 12}" height="${h - plinthH - 60}" fill="#f8fafc" opacity="0.9" />
        ${[1, 2, 3, 4, 5].map(i => `
          <line x1="${x + 8}" y1="${y + 40 + (i * (h - plinthH - 70)) / 5}" x2="${x + pantryW - 8}" y2="${y + 40 + (i * (h - plinthH - 70)) / 5}" stroke="#b45309" stroke-width="2" />
        `).join('')}
      ` : ''}

      <!-- Main L-Wing Backsplash Dado -->
      <rect x="${x + pantryW}" y="${y + wallCabH}" width="${mainW}" height="${dadoH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="${x + pantryW}" y="${y + wallCabH}" width="${mainW}" height="18" fill="url(#led-strip-glow)" />

      <!-- Upper Glass Cabinets + Chimney -->
      <rect x="${x + pantryW + 6}" y="${y}" width="${mainW * 0.45}" height="${wallCabH}" rx="2" fill="url(#mirror-sheen)" stroke="#0f172a" stroke-width="1.8" />
      <text x="${x + pantryW + (mainW * 0.45) / 2}" y="${y + wallCabH / 2 + 4}" font-size="9" font-weight="bold" fill="#1e3a8a" text-anchor="middle">FROSTED GLASS</text>

      <!-- Chimney Hood over Cooktop -->
      <rect x="${x + pantryW + mainW * 0.55}" y="${y - 12}" width="${mainW * 0.35}" height="${wallCabH + 12}" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
      <polygon points="${x + pantryW + mainW * 0.5},${y + wallCabH} ${x + pantryW + mainW * 0.95},${y + wallCabH} ${x + pantryW + mainW * 0.8},${y + 20} ${x + pantryW + mainW * 0.65},${y + 20}" fill="#334155" stroke="#0f172a" stroke-width="1.2" />

      <!-- L-Shaped Deep Granite Countertop Slab -->
      <rect x="${x + pantryW - 5}" y="${counterY}" width="${mainW + 15}" height="18" rx="2" fill="url(#countertop-granite)" stroke="#09090b" stroke-width="2" />

      <!-- Built-in 3-Burner Hob Cooktop -->
      <rect x="${x + pantryW + mainW * 0.55}" y="${counterY - 3}" width="70" height="7" rx="2" fill="#020617" />
      <circle cx="${x + pantryW + mainW * 0.55 + 18}" cy="${counterY}" r="3" fill="#ef4444" />
      <circle cx="${x + pantryW + mainW * 0.55 + 35}" cy="${counterY}" r="3" fill="#ef4444" />
      <circle cx="${x + pantryW + mainW * 0.55 + 52}" cy="${counterY}" r="3" fill="#ef4444" />

      <!-- Undermount Quartz Sink on Left of Counter -->
      <rect x="${x + pantryW + 20}" y="${counterY - 3}" width="65" height="7" rx="2" fill="#94a3b8" />
      <path d="M${x + pantryW + 50},${counterY - 3} L${x + pantryW + 50},${counterY - 20} A8,8 0 0 1 ${x + pantryW + 66},${counterY - 20} L${x + pantryW + 66},${counterY - 14}" fill="none" stroke="url(#hw-chrome)" stroke-width="3" stroke-linecap="round" />

      <!-- Base Cabinets (Corner Carousel + Tandem Drawers) -->
      <rect x="${x + pantryW}" y="${counterY + 18}" width="${mainW}" height="${baseH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Corner Unit with Diagonal Door -->
      <rect x="${x + pantryW + 4}" y="${counterY + 22}" width="${mainW * 0.42}" height="${baseH - 8}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <text x="${x + pantryW + (mainW * 0.42) / 2}" y="${counterY + baseH / 2 + 10}" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">CORNER CAROUSEL</text>
      <!-- Tandem Drawers Right -->
      <rect x="${x + pantryW + mainW * 0.45}" y="${counterY + 22}" width="${mainW * 0.52}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + pantryW + mainW * 0.45}" y="${counterY + 22 + (baseH - 12) / 3 + 3}" width="${mainW * 0.52}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + pantryW + mainW * 0.45}" y="${counterY + 22 + (2 * (baseH - 12)) / 3 + 6}" width="${mainW * 0.52}" height="${(baseH - 12) / 3}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + pantryW}" y="${floorY - plinthH}" width="${mainW}" height="${plinthH}" fill="#18181b" stroke="#0f172a" stroke-width="1.2" />
    `;
  }

  // 8. KITCHEN: PARALLEL / GALLEY MODULAR KITCHEN
  function renderKitchenParallelSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const counterW = Math.round(w * 0.46);
    const gapW = w - 2 * counterW;
    const rightX = x + counterW + gapW;
    const wallCabH = Math.round(h * 0.28);
    const dadoH = Math.round(h * 0.30);
    const counterY = y + wallCabH + dadoH;
    const baseH = floorY - counterY - plinthH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- Walkway Floor Space Between Counters -->
      <rect x="${x + counterW}" y="${counterY + 25}" width="${gapW}" height="${baseH + plinthH - 10}" fill="#f1f5f9" stroke="#cbd5e1" stroke-dasharray="3,3" />
      <text x="${x + w / 2}" y="${floorY - 20}" font-size="8.5" font-weight="bold" fill="#64748b" text-anchor="middle">WALKWAY</text>

      <!-- COUNTER 1 (LEFT): COOKING ZONE -->
      <rect x="${x}" y="${y + wallCabH}" width="${counterW}" height="${dadoH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="${x}" y="${y}" width="${counterW}" height="${wallCabH}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <polygon points="${x + counterW / 2 - 25},${y + wallCabH - 5} ${x + counterW / 2 + 25},${y + wallCabH - 5} ${x + counterW / 2 + 14},${y + 15} ${x + counterW / 2 - 14},${y + 15}" fill="#1e293b" stroke="#0f172a" stroke-width="1.2" />
      <rect x="${x - 5}" y="${counterY}" width="${counterW + 10}" height="18" rx="2" fill="url(#countertop-granite)" stroke="#09090b" stroke-width="2" />
      <rect x="${x + counterW / 2 - 30}" y="${counterY - 3}" width="60" height="7" rx="2" fill="#020617" />
      <circle cx="${x + counterW / 2 - 15}" cy="${counterY}" r="3" fill="#ef4444" />
      <circle cx="${x + counterW / 2 + 15}" cy="${counterY}" r="3" fill="#ef4444" />
      <!-- Base Cabinets Left -->
      <rect x="${x}" y="${counterY + 18}" width="${counterW}" height="${baseH}" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />
      <rect x="${x + 3}" y="${counterY + 22}" width="${counterW - 6}" height="${baseH - 8}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x}" y="${floorY - plinthH}" width="${counterW}" height="${plinthH}" fill="#18181b" />

      <!-- COUNTER 2 (RIGHT): APPLIANCE & PANTRY TOWER -->
      <rect x="${rightX}" y="${y}" width="${counterW}" height="${h}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Top Loft Cabinet -->
      <rect x="${rightX + 3}" y="${y + 3}" width="${counterW - 6}" height="${wallCabH - 6}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <!-- Built-in Microwave Oven -->
      <rect x="${rightX + 6}" y="${y + wallCabH + 6}" width="${counterW - 12}" height="55" rx="3" fill="#09090b" stroke="#334155" stroke-width="2" />
      <rect x="${rightX + 14}" y="${y + wallCabH + 14}" width="${counterW - 40}" height="38" rx="2" fill="#1e293b" />
      <text x="${rightX + counterW - 18}" y="${y + wallCabH + 28}" font-size="7" font-weight="bold" fill="#38bdf8" text-anchor="middle">12:00</text>
      <!-- Built-in Convection Oven -->
      <rect x="${rightX + 6}" y="${y + wallCabH + 66}" width="${counterW - 12}" height="65" rx="3" fill="#09090b" stroke="#334155" stroke-width="2" />
      <circle cx="${rightX + 24}" cy="${y + wallCabH + 80}" r="4" fill="url(#hw-chrome)" />
      <circle cx="${rightX + 44}" cy="${y + wallCabH + 80}" r="4" fill="url(#hw-chrome)" />
      <rect x="${rightX + 14}" y="${y + wallCabH + 92}" width="${counterW - 28}" height="32" rx="2" fill="#1e293b" />
      <!-- Bottom Deep Storage Drawers -->
      <rect x="${rightX + 4}" y="${counterY + 18}" width="${counterW - 8}" height="${baseH - 4}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${rightX}" y="${floorY - plinthH}" width="${counterW}" height="${plinthH}" fill="#18181b" />
    `;
  }

  // 9. KITCHEN: LUXURY ISLAND MODULAR KITCHEN
  function renderKitchenIslandSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const backH = Math.round(h * 0.75);
    const islandW = Math.round(w * 0.70);
    const islandH = Math.round(h * 0.38);
    const islandX = x + Math.round((w - islandW) / 2);
    const islandY = floorY - islandH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 35}" ry="16" fill="url(#sim-floor-shadow)" />

      <!-- BACKGROUND COOKING WALL (Floor to Upper) -->
      <rect x="${x}" y="${y}" width="${w}" height="${backH}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Upper Cabinets with warm LED backlights -->
      <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${backH * 0.35}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + 6}" y="${y + backH * 0.35 + 6}" width="${w - 12}" height="15" fill="url(#led-strip-glow)" />
      <!-- Built-in Stainless Chimney -->
      <rect x="${x + w / 2 - 35}" y="${y}" width="70" height="${backH * 0.45}" fill="url(#hw-chrome)" stroke="#0f172a" stroke-width="1.2" />

      <!-- Back Wall Countertop & Hob -->
      <rect x="${x}" y="${y + backH * 0.65}" width="${w}" height="15" fill="url(#countertop-granite)" />
      <rect x="${x + w / 2 - 30}" y="${y + backH * 0.65 - 3}" width="60" height="6" rx="2" fill="#020617" />
      <circle cx="${x + w / 2 - 15}" cy="${y + backH * 0.65}" r="3" fill="#ef4444" />
      <circle cx="${x + w / 2 + 15}" cy="${y + backH * 0.65}" r="3" fill="#ef4444" />

      <!-- FOREGROUND ISLAND COUNTER WITH WATERFALL MARBLE EDGE -->
      <!-- Floor Shadow under Island -->
      <ellipse cx="${islandX + islandW / 2}" cy="${floorY + 2}" rx="${islandW / 2 + 15}" ry="12" fill="url(#sim-floor-shadow)" />

      <!-- Island Waterfall Wrap (Granite/Marble slabs on left & right sides) -->
      <rect x="${islandX}" y="${islandY}" width="${islandW}" height="${islandH}" rx="4" fill="url(#countertop-granite)" stroke="#09090b" stroke-width="2.5" />
      <!-- Island Cabinets Inside Waterfall Frame -->
      <rect x="${islandX + 16}" y="${islandY + 16}" width="${islandW - 32}" height="${islandH - 22}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />

      <!-- Built-in Undercounter Wine Rack -->
      <rect x="${islandX + 22}" y="${islandY + 22}" width="${islandW * 0.28}" height="${islandH - 34}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.2" />
      ${[1, 2, 3].map(i => `
        <line x1="${islandX + 22}" y1="${islandY + 22 + (i * (islandH - 34)) / 4}" x2="${islandX + 22 + islandW * 0.28}" y2="${islandY + 22 + (i * (islandH - 34)) / 4}" stroke="#78350f" stroke-width="2" />
        <circle cx="${islandX + 22 + (islandW * 0.28) / 2}" cy="${islandY + 16 + (i * (islandH - 34)) / 4}" r="5" fill="#ca8a04" />
      `).join('')}

      <!-- Twin Breakfast Drawers -->
      <rect x="${islandX + islandW * 0.35}" y="${islandY + 22}" width="${islandW * 0.58}" height="${(islandH - 38) / 2}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${islandX + islandW * 0.35}" y="${islandY + 22 + (islandH - 38) / 2 + 6}" width="${islandW * 0.58}" height="${(islandH - 38) / 2}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="1.5" />

      ${s.hardware !== 'concealed' ? `
        <rect x="${islandX + islandW * 0.5}" y="${islandY + 28}" width="50" height="4" rx="2" fill="${hwFill}" />
        <rect x="${islandX + islandW * 0.5}" y="${islandY + 34 + (islandH - 38) / 2}" width="50" height="4" rx="2" fill="${hwFill}" />
      ` : ''}

      <!-- Bar Stool on Left of Island -->
      <ellipse cx="${islandX - 18}" cy="${islandY + 20}" rx="14" ry="5" fill="#1e293b" stroke="#09090b" stroke-width="1.5" />
      <line x1="${islandX - 18}" y1="${islandY + 22}" x2="${islandX - 18}" y2="${floorY - 2}" stroke="url(#hw-chrome)" stroke-width="3" />
      <line x1="${islandX - 25}" y1="${floorY - 2}" x2="${islandX - 11}" y2="${floorY - 2}" stroke="url(#hw-chrome)" stroke-width="4" stroke-linecap="round" />
    `;
  }

  // 10. LIVING & MEDIA: FLOATING WALL TV UNIT
  function renderTVUnitSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
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

  // 11. LIVING & MEDIA: GRAND MEDIA CONSOLE & DISPLAY TOWERS
  function renderTVUnitConsoleSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const towerW = Math.round(w * 0.22);
    const centerW = w - 2 * towerW;
    const credenzaH = Math.round(h * 0.28);
    const credenzaY = floorY - credenzaH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 30}" ry="16" fill="url(#sim-floor-shadow)" />

      <!-- CENTER MARBLE/FLUTED BACKDROP -->
      <rect x="${x + towerW}" y="${y + 20}" width="${centerW}" height="${h - credenzaH - 20}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- TV Ambient Halo Glow -->
      <rect x="${x + towerW + 20}" y="${y + 40}" width="${centerW - 40}" height="${h * 0.42}" rx="6" fill="#fef08a" opacity="0.3" filter="blur(6px)" />
      <!-- 55-inch Mounted 4K Smart TV -->
      <rect x="${x + towerW + 25}" y="${y + 45}" width="${centerW - 50}" height="${h * 0.40}" rx="3" fill="#020617" stroke="#334155" stroke-width="2" />
      <text x="${x + w / 2}" y="${y + 45 + (h * 0.40) / 2 + 4}" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">55" 4K SMART TV</text>
      <!-- Soundbar Shelf right under TV -->
      <rect x="${x + towerW + 35}" y="${y + 55 + h * 0.40}" width="${centerW - 70}" height="8" rx="3" fill="#0f172a" />

      <!-- LEFT DISPLAY TOWER (Full Height with Glass Door & Interior Spotlights) -->
      <rect x="${x}" y="${y}" width="${towerW}" height="${h}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />
      <rect x="${x + 4}" y="${y + 4}" width="${towerW - 8}" height="${h - plinthH - 8}" rx="2" fill="url(#mirror-sheen)" stroke="#0f172a" stroke-width="1.8" />
      <circle cx="${x + towerW / 2}" cy="${y + 14}" r="3" fill="#fef08a" />
      <!-- 3 Glass Display Shelves -->
      <line x1="${x + 4}" y1="${y + h * 0.28}" x2="${x + towerW - 4}" y2="${y + h * 0.28}" stroke="#cbd5e1" stroke-width="2" />
      <circle cx="${x + towerW / 2}" cy="${y + h * 0.28 - 12}" r="7" fill="#ca8a04" />
      <line x1="${x + 4}" y1="${y + h * 0.55}" x2="${x + towerW - 4}" y2="${y + h * 0.55}" stroke="#cbd5e1" stroke-width="2" />
      <rect x="${x + 12}" y="${y + h * 0.55 - 18}" width="18" height="18" rx="2" fill="#2563eb" />

      <!-- RIGHT DISPLAY TOWER -->
      <rect x="${x + towerW + centerW}" y="${y}" width="${towerW}" height="${h}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />
      <rect x="${x + towerW + centerW + 4}" y="${y + 4}" width="${towerW - 8}" height="${h - plinthH - 8}" rx="2" fill="url(#mirror-sheen)" stroke="#0f172a" stroke-width="1.8" />
      <circle cx="${x + towerW + centerW + towerW / 2}" cy="${y + 14}" r="3" fill="#fef08a" />
      <line x1="${x + towerW + centerW + 4}" y1="${y + h * 0.35}" x2="${x + w - 4}" y2="${y + h * 0.35}" stroke="#cbd5e1" stroke-width="2" />
      <circle cx="${x + towerW + centerW + towerW / 2}" cy="${y + h * 0.35 - 10}" r="8" fill="#10b981" />
      <line x1="${x + towerW + centerW + 4}" y1="${y + h * 0.65}" x2="${x + w - 4}" y2="${y + h * 0.65}" stroke="#cbd5e1" stroke-width="2" />
      <rect x="${x + towerW + centerW + 12}" y="${y + h * 0.65 - 18}" width="20" height="18" rx="2" fill="#dc2626" />

      <!-- BASE FLOOR CREDENZA (Center Section) -->
      <rect x="${x + towerW}" y="${credenzaY}" width="${centerW}" height="${credenzaH}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="2" />
      <!-- 4 Cabinet Door Partitions -->
      ${[1, 2, 3].map(i => `
        <line x1="${x + towerW + (i * centerW) / 4}" y1="${credenzaY}" x2="${x + towerW + (i * centerW) / 4}" y2="${floorY}" stroke="#0f172a" stroke-width="1.5" />
      `).join('')}

      ${s.hardware !== 'concealed' ? `
        <rect x="${x + towerW + centerW / 2 - 30}" y="${credenzaY + 12}" width="60" height="4" rx="2" fill="${hwFill}" />
      ` : ''}

      <!-- Designer Metal Legs -->
      <rect x="${x + towerW + 15}" y="${floorY - 8}" width="6" height="8" fill="#09090b" />
      <rect x="${x + towerW + centerW - 21}" y="${floorY - 8}" width="6" height="8" fill="#09090b" />
    `;
  }

  // 12. LIVING & MEDIA: ROOM-DIVIDER PARTITION TV WALL
  function renderTVUnitPartitionSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const { x, y, w, h, floorY } = p;

    const wingW = Math.round(w * 0.25);
    const centerW = w - 2 * wingW;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- Floor-to-Ceiling Architectural Outer Frame -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="#0f172a" stroke-width="3" />

      <!-- LEFT CNC JALI LATTICE SCREEN -->
      <rect x="${x + 4}" y="${y + 4}" width="${wingW - 8}" height="${h - 8}" rx="2" fill="url(#pat-jali)" stroke="#0f172a" stroke-width="1.5" />

      <!-- RIGHT CNC JALI LATTICE SCREEN -->
      <rect x="${x + wingW + centerW + 4}" y="${y + 4}" width="${wingW - 8}" height="${h - 8}" rx="2" fill="url(#pat-jali)" stroke="#0f172a" stroke-width="1.5" />

      <!-- CENTER TV SWIVEL / MOUNTING CORE -->
      <rect x="${x + wingW}" y="${y}" width="${centerW}" height="${h}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />

      <!-- Mounted TV -->
      <rect x="${x + wingW + 20}" y="${y + h * 0.22}" width="${centerW - 40}" height="${h * 0.44}" rx="4" fill="#020617" stroke="#334155" stroke-width="2.5" />
      <text x="${x + w / 2}" y="${y + h * 0.22 + (h * 0.44) / 2 + 4}" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PARTITION TV</text>

      <!-- Top Display Cubbies (Overhead) -->
      <rect x="${x + wingW + 8}" y="${y + 8}" width="${(centerW - 20) / 2}" height="${h * 0.16}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="${x + wingW + 8 + (centerW - 20) / 4}" cy="${y + 8 + (h * 0.16) / 2}" r="10" fill="#10b981" />
      <rect x="${x + wingW + 12 + (centerW - 20) / 2}" y="${y + 8}" width="${(centerW - 20) / 2}" height="${h * 0.16}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="${x + wingW + 12 + (3 * (centerW - 20)) / 4}" cy="${y + 8 + (h * 0.16) / 2}" r="8" fill="#ca8a04" />

      <!-- Bottom Floating Media Drawer & Plant Shelf -->
      <rect x="${x + wingW + 8}" y="${y + h * 0.72}" width="${centerW - 16}" height="${h * 0.24}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />
      <text x="${x + w / 2}" y="${y + h * 0.72 + (h * 0.24) / 2 + 4}" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">DOUBLE-SIDED STORAGE</text>
    `;
  }

  // 13. BEDROOM: HYDRAULIC BOX BED
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
        <rect x="${x + 10}" y="${y + headboardH - 10}" width="${w - 20}" height="${bedBoxH + 10}" fill="#fef3c7" stroke="#92400e" stroke-width="2" />
        <line x1="${x + w / 2}" y1="${y + headboardH - 10}" x2="${x + w / 2}" y2="${floorY}" stroke="#92400e" stroke-width="5" />
        <rect x="${x + 20}" y="${y + headboardH + 10}" width="${w / 2 - 30}" height="${bedBoxH - 20}" rx="4" fill="#3b82f6" opacity="0.6" />
        <text x="${x + w / 4}" y="${y + headboardH + 35}" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">QUILTS / BLANKETS</text>
        <polygon points="${x + 10},${y + headboardH - 10} ${x + w - 10},${y + headboardH - 10} ${x + w + 15},${y + headboardH - 70} ${x - 5},${y + headboardH - 70}" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <line x1="${x + 40}" y1="${y + headboardH + 10}" x2="${x + 25}" y2="${y + headboardH - 55}" stroke="#000000" stroke-width="4" />
      ` : `
        <rect x="${x + 10}" y="${y + headboardH - 35}" width="${w - 20}" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <rect x="${x + 25}" y="${y + headboardH - 55}" width="${w / 2 - 40}" height="28" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="${x + w / 2 + 15}" y="${y + headboardH - 55}" width="${w / 2 - 40}" height="28" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="${x + 5}" y="${y + headboardH + 10}" width="${w - 10}" height="${bedBoxH - 10}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
        <rect x="${x + 15}" y="${y + headboardH + 20}" width="${w / 2 - 25}" height="${bedBoxH - 26}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + w / 2 + 10}" y="${y + headboardH + 20}" width="${w / 2 - 25}" height="${bedBoxH - 26}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + w / 4 - 15}" y="${y + headboardH + bedBoxH / 2 + 5}" width="30" height="5" rx="2" fill="${hwFill}" />
          <rect x="${x + (3 * w) / 4 - 15}" y="${y + headboardH + bedBoxH / 2 + 5}" width="30" height="5" rx="2" fill="${hwFill}" />
        ` : ''}
      `}
    `;
  }

  // 14. BEDROOM: DIVAN STORAGE BED WITH SIDE PULL-OUT DRAWERS & CHARGING NICHE
  function renderBedDrawersSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, floorY } = p;

    const headboardH = Math.round(h * 0.60);
    const bedBoxH = Math.round(h * 0.40);

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 30}" ry="16" fill="url(#sim-floor-shadow)" />

      <!-- Headboard with Recessed LED Charging Ledge Niche -->
      <rect x="${x}" y="${y}" width="${w}" height="${headboardH}" rx="4" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <!-- Recessed Niche for Phone / Alarm / Books -->
      <rect x="${x + 15}" y="${y + 20}" width="${w - 30}" height="45" rx="3" fill="#0f172a" />
      <rect x="${x + 15}" y="${y + 20}" width="${w - 30}" height="10" fill="url(#led-strip-glow)" />
      <!-- Digital Clock and Charging Phone on Niche -->
      <rect x="${x + 35}" y="${y + 36}" width="28" height="18" rx="2" fill="#1e293b" />
      <text x="${x + 49}" y="${y + 49}" font-size="7" font-weight="bold" fill="#38bdf8" text-anchor="middle">06:30</text>
      <rect x="${x + w - 60}" y="${y + 34}" width="15" height="22" rx="2" fill="#020617" stroke="#475569" stroke-width="1" />

      <!-- Upholstered Headrest Section -->
      <rect x="${x + 15}" y="${y + 75}" width="${w - 30}" height="${headboardH - 85}" rx="3" fill="${fillB}" stroke="#0f172a" stroke-width="1.8" />

      <!-- Mattress & Quilt -->
      <rect x="${x + 10}" y="${y + headboardH - 35}" width="${w - 20}" height="45" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
      <rect x="${x + 25}" y="${y + headboardH - 55}" width="${w / 2 - 40}" height="28" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <rect x="${x + w / 2 + 15}" y="${y + headboardH - 55}" width="${w / 2 - 40}" height="28" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />

      <!-- Bed Base Box -->
      <rect x="${x + 5}" y="${y + headboardH + 10}" width="${w - 10}" height="${bedBoxH - 10}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />

      ${isOpen ? `
        <!-- Pulled-out Side Storage Drawers -->
        <rect x="${x + 10}" y="${y + headboardH + 18}" width="${w / 2 - 18}" height="${bedBoxH - 22}" rx="3" fill="#fef3c7" stroke="#92400e" stroke-width="2" />
        <text x="${x + w / 4}" y="${y + headboardH + bedBoxH / 2 + 10}" font-size="8.5" font-weight="bold" fill="#78350f" text-anchor="middle">LINEN DRAWER (PULLED)</text>
        <rect x="${x + w / 2 + 8}" y="${y + headboardH + 18}" width="${w / 2 - 18}" height="${bedBoxH - 22}" rx="3" fill="#fef3c7" stroke="#92400e" stroke-width="2" />
        <text x="${x + (3 * w) / 4}" y="${y + headboardH + bedBoxH / 2 + 10}" font-size="8.5" font-weight="bold" fill="#78350f" text-anchor="middle">BLANKET DRAWER</text>
      ` : `
        <rect x="${x + 12}" y="${y + headboardH + 16}" width="${w / 2 - 20}" height="${bedBoxH - 22}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        <rect x="${x + w / 2 + 8}" y="${y + headboardH + 16}" width="${w / 2 - 20}" height="${bedBoxH - 22}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
        ${s.hardware !== 'concealed' ? `
          <rect x="${x + w / 4 - 20}" y="${y + headboardH + bedBoxH / 2 + 4}" width="40" height="5" rx="2" fill="${hwFill}" />
          <rect x="${x + (3 * w) / 4 - 20}" y="${y + headboardH + bedBoxH / 2 + 4}" width="40" height="5" rx="2" fill="${hwFill}" />
        ` : ''}
      `}
    `;
  }

  // 15. BEDROOM: LED ARCH DRESSING VANITY
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

  // 16. BEDROOM: MASTER FULL-HEIGHT LUXURY VANITY STATION
  function renderDressingTallSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, plinthH, floorY } = p;

    const towerW = Math.round(w * 0.34);
    const mirrorW = w - towerW;
    const credenzaH = Math.round(h * 0.30);
    const credenzaY = floorY - credenzaH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- Left Full-Height Perfume & Cosmetic Tower -->
      <rect x="${x}" y="${y}" width="${towerW}" height="${h}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />
      <!-- Top Closed Cabinet -->
      <rect x="${x + 3}" y="${y + 3}" width="${towerW - 6}" height="${h * 0.22}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <!-- 4 Open Illuminated Perfume Cubbies -->
      ${[1, 2, 3, 4].map(i => `
        <rect x="${x + 4}" y="${y + h * 0.22 + (i - 1) * (h * 0.60 / 4) + 4}" width="${towerW - 8}" height="${(h * 0.60 / 4) - 6}" rx="2" fill="#0f172a" opacity="0.85" />
        <circle cx="${x + towerW / 2}" cy="${y + h * 0.22 + (i - 1) * (h * 0.60 / 4) + 12}" r="3" fill="#fef08a" />
        <rect x="${x + towerW / 2 - 8}" y="${y + h * 0.22 + (i - 1) * (h * 0.60 / 4) + 20}" width="16" height="22" rx="3" fill="#d97706" opacity="0.8" />
      `).join('')}

      <!-- Center & Right: Full-Length Beveled Mirror with Touch LED Halo -->
      <rect x="${x + towerW + 10}" y="${y + 10}" width="${mirrorW - 15}" height="${h - credenzaH - 15}" rx="8" fill="url(#mirror-sheen)" stroke="#cbd5e1" stroke-width="2.5" />
      <!-- Perimeter LED Glow Line -->
      <rect x="${x + towerW + 16}" y="${y + 16}" width="${mirrorW - 27}" height="${h - credenzaH - 27}" rx="6" fill="none" stroke="#fef08a" stroke-width="2.5" opacity="0.85" />
      <circle cx="${x + towerW + mirrorW / 2}" cy="${y + h - credenzaH - 30}" r="5" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5" />

      <!-- Lower Vanity Credenza (Jewelry Drawer + Stool) -->
      <rect x="${x + towerW}" y="${credenzaY}" width="${mirrorW}" height="${credenzaH}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x + towerW + 6}" y="${credenzaY + 6}" width="${mirrorW - 12}" height="38" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <text x="${x + towerW + mirrorW / 2}" y="${credenzaY + 28}" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">💍 VELVET JEWELRY VAULT</text>

      ${s.hardware !== 'concealed' ? `
        <rect x="${x + towerW + mirrorW / 2 - 20}" y="${credenzaY + 18}" width="40" height="4" rx="2" fill="${hwFill}" />
      ` : ''}

      <!-- Matching Round Vanity Stool -->
      <ellipse cx="${x + towerW + mirrorW / 2}" cy="${floorY - 22}" rx="22" ry="7" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <line x1="${x + towerW + mirrorW / 2 - 12}" y1="${floorY - 22}" x2="${x + towerW + mirrorW / 2 - 12}" y2="${floorY}" stroke="url(#hw-gold)" stroke-width="3" />
      <line x1="${x + towerW + mirrorW / 2 + 12}" y1="${floorY - 22}" x2="${x + towerW + mirrorW / 2 + 12}" y2="${floorY}" stroke="url(#hw-gold)" stroke-width="3" />
    `;
  }

  // 17. OFFICE: PRESIDENTIAL EXECUTIVE DESK
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

  // 18. OFFICE: MODERN L-SHAPED CORNER EXECUTIVE WORKSTATION
  function renderOfficeLshapeSvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, floorY } = p;

    const mainDeskW = Math.round(w * 0.62);
    const returnW = w - mainDeskW;
    const topH = Math.round(h * 0.14);
    const deskTopY = y + h * 0.38;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 25}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- MAIN EXECUTIVE DESK SURFACE (Left Section) -->
      <polygon points="${x - 8},${deskTopY} ${x + mainDeskW + 8},${deskTopY} ${x + mainDeskW},${deskTopY + topH} ${x},${deskTopY + topH}" fill="${fillA}" stroke="#0f172a" stroke-width="2.5" />
      <!-- Leather Blotter Pad on Desk -->
      <rect x="${x + 40}" y="${deskTopY + 2}" width="${mainDeskW * 0.5}" height="8" rx="1" fill="#18181b" />
      <!-- Slim Laptop Screen -->
      <rect x="${x + 55}" y="${deskTopY - 32}" width="42" height="28" rx="2" fill="#020617" stroke="#64748b" stroke-width="1.5" />
      <polygon points="${x + 50},${deskTopY - 2} ${x + 102},${deskTopY - 2} ${x + 98},${deskTopY + 4} ${x + 54},${deskTopY + 4}" fill="#94a3b8" />
      <!-- Desk Lamp -->
      <path d="M${x + 22},${deskTopY} L${x + 22},${deskTopY - 40} L${x + 36},${deskTopY - 45}" fill="none" stroke="url(#hw-gold)" stroke-width="3" />
      <polygon points="${x + 34},${deskTopY - 50} ${x + 48},${deskTopY - 42} ${x + 40},${deskTopY - 38}" fill="#eab308" />

      <!-- Main Desk Front Modesty Privacy Screen -->
      <rect x="${x + 15}" y="${deskTopY + topH}" width="${mainDeskW - 30}" height="${floorY - deskTopY - topH - 10}" fill="${fillA}" stroke="#0f172a" stroke-width="1.8" />
      <!-- Left Sturdy Structural Gable Leg -->
      <rect x="${x}" y="${deskTopY + topH}" width="16" height="${floorY - deskTopY - topH}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />

      <!-- CONNECTED SIDE RETURN CREDENZA (Right Corner Section) -->
      <polygon points="${x + mainDeskW},${deskTopY + 6} ${x + w + 5},${deskTopY + 6} ${x + w},${deskTopY + topH + 4} ${x + mainDeskW},${deskTopY + topH + 4}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x + mainDeskW}" y="${deskTopY + topH + 4}" width="${returnW}" height="${floorY - deskTopY - topH - 4}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />

      <!-- Credenza Filing Pedestal (2 Deep Drawers + CPU Niche) -->
      <rect x="${x + mainDeskW + 6}" y="${deskTopY + topH + 10}" width="${returnW - 12}" height="32" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <text x="${x + mainDeskW + returnW / 2}" y="${deskTopY + topH + 30}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">FILE DRAWER 1</text>
      <rect x="${x + mainDeskW + 6}" y="${deskTopY + topH + 46}" width="${returnW - 12}" height="36" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <text x="${x + mainDeskW + returnW / 2}" y="${deskTopY + topH + 68}" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">FILE DRAWER 2</text>

      ${s.hardware !== 'concealed' ? `
        <rect x="${x + mainDeskW + returnW / 2 - 15}" y="${deskTopY + topH + 24}" width="30" height="4" rx="2" fill="${hwFill}" />
        <rect x="${x + mainDeskW + returnW / 2 - 15}" y="${deskTopY + topH + 60}" width="30" height="4" rx="2" fill="${hwFill}" />
      ` : ''}
    `;
  }

  // 19. OFFICE: STUDENT / HOME OFFICE STUDY TABLE WITH OVERHEAD BOOKSHELF
  function renderOfficeStudySvg(s, p) {
    const fillA = getLaminateFill(s.zoneA);
    const fillB = getLaminateFill(s.zoneB);
    const hwFill = getHardwareFill();
    const isOpen = s.isOpen;
    const { x, y, w, h, floorY } = p;

    const hutchH = Math.round(h * 0.45);
    const corkH = Math.round(h * 0.20);
    const deskH = h - hutchH - corkH;
    const deskY = y + hutchH + corkH;

    return `
      <ellipse cx="${x + w / 2}" cy="${floorY + 2}" rx="${w / 2 + 20}" ry="14" fill="url(#sim-floor-shadow)" />

      <!-- OVERHEAD 2-TIER BOOKSHELF HUTCH -->
      <rect x="${x}" y="${y}" width="${w}" height="${hutchH}" rx="3" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />
      <!-- Top Enclosed Closed Storage Cabinet -->
      <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${hutchH * 0.42}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <line x1="${x + w / 2}" y1="${y + 4}" x2="${x + w / 2}" y2="${y + 4 + hutchH * 0.42}" stroke="#0f172a" stroke-width="1.5" />
      <!-- Open Bookshelf Shelf -->
      <line x1="${x + 4}" y1="${y + hutchH * 0.72}" x2="${x + w - 4}" y2="${y + hutchH * 0.72}" stroke="#0f172a" stroke-width="2" />
      <!-- Books Displayed -->
      <rect x="${x + 18}" y="${y + hutchH * 0.72 - 24}" width="10" height="24" rx="1" fill="#dc2626" />
      <rect x="${x + 30}" y="${y + hutchH * 0.72 - 28}" width="12" height="28" rx="1" fill="#2563eb" />
      <rect x="${x + 44}" y="${y + hutchH * 0.72 - 22}" width="10" height="22" rx="1" fill="#16a34a" />
      <circle cx="${x + w - 35}" cy="${y + hutchH * 0.72 - 12}" r="9" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />

      <!-- MIDDLE PIN-UP CORK / FELT NOTICE BOARD -->
      <rect x="${x + 2}" y="${y + hutchH}" width="${w - 4}" height="${corkH}" fill="url(#pat-cork)" stroke="#0f172a" stroke-width="1.8" />
      <!-- Pinned Sticky Notes -->
      <rect x="${x + 25}" y="${y + hutchH + 12}" width="24" height="24" rx="1" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" />
      <circle cx="${x + 37}" cy="${y + hutchH + 15}" r="2" fill="#ef4444" />
      <rect x="${x + 60}" y="${y + hutchH + 16}" width="28" height="20" rx="1" fill="#bae6fd" stroke="#0284c7" stroke-width="0.8" />
      <circle cx="${x + 74}" cy="${y + hutchH + 19}" r="2" fill="#2563eb" />

      <!-- BASE WRITING DESK SURFACE -->
      <polygon points="${x - 8},${deskY} ${x + w + 8},${deskY} ${x + w},${deskY + 14} ${x},${deskY + 14}" fill="${fillA}" stroke="#0f172a" stroke-width="2.2" />

      <!-- Desk Left Leg & Drawer Box -->
      <rect x="${x}" y="${deskY + 14}" width="16" height="${floorY - deskY - 14}" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <!-- Right 2-Drawer Pedestal -->
      <rect x="${x + w * 0.62}" y="${deskY + 14}" width="${w * 0.38}" height="${floorY - deskY - 14}" rx="2" fill="${fillA}" stroke="#0f172a" stroke-width="2" />
      <rect x="${x + w * 0.62 + 4}" y="${deskY + 18}" width="${w * 0.38 - 8}" height="${(floorY - deskY - 32) / 2}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="${x + w * 0.62 + 4}" y="${deskY + 24 + (floorY - deskY - 32) / 2}" width="${w * 0.38 - 8}" height="${(floorY - deskY - 32) / 2}" rx="2" fill="${fillB}" stroke="#0f172a" stroke-width="1.5" />

      ${s.hardware !== 'concealed' ? `
        <rect x="${x + w * 0.81 - 15}" y="${deskY + 28}" width="30" height="4" rx="2" fill="${hwFill}" />
        <rect x="${x + w * 0.81 - 15}" y="${deskY + 34 + (floorY - deskY - 32) / 2}" width="30" height="4" rx="2" fill="${hwFill}" />
      ` : ''}
    `;
  }

  // --- TECHNICAL DIMENSIONS WIREFRAME OVERLAY ---
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

  // --- MAIN SVG RENDER DISPATCHER ---
  function renderSimulatorSvg() {
    const s = window.SIM_STATE;
    const dim = s.dimensions[s.structure] || { width: 6, height: 7 };
    const p = getPlacement(dim);

    let bodySvg = '';
    if (s.structure === 'wardrobe2') bodySvg = renderWardrobe2Svg(s, p);
    else if (s.structure === 'wardrobe') bodySvg = renderWardrobeSvg(s, p);
    else if (s.structure === 'wardrobe6') bodySvg = renderWardrobe6Svg(s, p);
    else if (s.structure === 'fullwall') bodySvg = renderFullWallSvg(s, p);
    else if (s.structure === 'almirah') bodySvg = renderAlmirahSvg(s, p);
    else if (s.structure === 'kitchen') bodySvg = renderKitchenSvg(s, p);
    else if (s.structure === 'kitchen_l') bodySvg = renderKitchenLSvg(s, p);
    else if (s.structure === 'kitchen_parallel') bodySvg = renderKitchenParallelSvg(s, p);
    else if (s.structure === 'kitchen_island') bodySvg = renderKitchenIslandSvg(s, p);
    else if (s.structure === 'tvunit') bodySvg = renderTVUnitSvg(s, p);
    else if (s.structure === 'tvunit_console') bodySvg = renderTVUnitConsoleSvg(s, p);
    else if (s.structure === 'tvunit_partition') bodySvg = renderTVUnitPartitionSvg(s, p);
    else if (s.structure === 'bed') bodySvg = renderBedSvg(s, p);
    else if (s.structure === 'bed_drawers') bodySvg = renderBedDrawersSvg(s, p);
    else if (s.structure === 'dressing') bodySvg = renderDressingSvg(s, p);
    else if (s.structure === 'dressing_tall') bodySvg = renderDressingTallSvg(s, p);
    else if (s.structure === 'office') bodySvg = renderOfficeSvg(s, p);
    else if (s.structure === 'office_lshape') bodySvg = renderOfficeLshapeSvg(s, p);
    else if (s.structure === 'office_study') bodySvg = renderOfficeStudySvg(s, p);

    const wireframeSvg = s.showWireframe ? renderWireframeDimensions(s.structure, dim, p) : '';
    const humanSvg = renderHumanScaleFigure(p.floorY, p.pxPerFoot);
    const defs = getSvgDefs();

    return `
      <svg id="sim-live-svg" viewBox="0 0 740 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display: block; user-select: none;">
        ${defs}
        <!-- Studio Background Wall -->
        <rect width="740" height="500" fill="#0d1117" />
        <!-- Floor Baseline Horizon -->
        <line x1="0" y1="430" x2="740" y2="430" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5" />
        <rect y="430" width="740" height="70" fill="#161b22" />

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
        <text x="16" y="488" font-size="10" font-weight="900" fill="#f59e0b" opacity="0.6" letter-spacing="1">
          BABA DUGDHESWAR ENTERPRISE • ONDA SHOWROOM 3D STUDIO
        </text>
      </svg>
    `;
  }

  // --- BILL OF MATERIALS (BOM) & MATERIAL QUANTITY ENGINE ---
  function calculateSimulatorBom() {
    const s = window.SIM_STATE;
    const struct = s.structure;
    const dim = s.dimensions[struct] || { width: 6, height: 7 };

                        
    let p18 = 0, p12 = 0, p6 = 0, micaA = 0, micaB = 0, liner = 0, fevicolKg = 0, title = '';

    if (struct === 'wardrobe2') {
      title = `${dim.width} × ${dim.height} ft 2-Door Compact Wardrobe`;
      p18 = 2.5; p12 = 1.0; p6 = 1.0; micaA = 1.5; micaB = 1.5; liner = 2.5; fevicolKg = 5;
      
    } else if (struct === 'wardrobe') {
      title = `${dim.width} × ${dim.height} ft 4-Door Wardrobe`;
      p18 = dim.width >= 8 ? 6 : (dim.width >= 6 ? 4.5 : 3.5);
      p12 = dim.width >= 8 ? 2.5 : 1.5;
      p6 = dim.width >= 8 ? 2.5 : 2.0;
      micaA = 2.0; micaB = dim.width >= 8 ? 3.0 : 2.0;
      liner = micaA + micaB; fevicolKg = dim.width >= 8 ? 10 : 8;
      
    } else if (struct === 'wardrobe6') {
      title = `${dim.width} × ${dim.height} ft Master 6-Door Wardrobe`;
      p18 = dim.height >= 8 ? 8.5 : 7.0;
      p12 = 3.5; p6 = 3.5; micaA = 3.0; micaB = 4.5; liner = 7.0; fevicolKg = 14;
      
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
      
    } else if (struct === 'almirah') {
      title = `${dim.width} × ${dim.height} ft Classic Almirah (with Mirror)`;
      p18 = 3.5; p12 = 1.5; p6 = 1.5; micaA = 1.5; micaB = 1.5; liner = 3.0; fevicolKg = 6;
      
    } else if (struct === 'kitchen') {
      title = `${dim.width} × ${dim.height} ft Straight Modular Kitchen`;
      p18 = dim.width >= 10 ? 8 : 6.5;
      p12 = 3.0; p6 = 2.0; micaA = 2.0; micaB = 4.0; liner = 5.0; fevicolKg = 10;
      
    } else if (struct === 'kitchen_l') {
      title = `${dim.width} × ${dim.height} ft L-Shaped Corner Kitchen`;
      p18 = dim.width >= 12 ? 9.5 : 8.0;
      p12 = 4.0; p6 = 2.5; micaA = 2.5; micaB = 4.5; liner = 6.0; fevicolKg = 12;
      
    } else if (struct === 'kitchen_parallel') {
      title = `${dim.width} × ${dim.height} ft Parallel Galley Kitchen`;
      p18 = dim.width >= 12 ? 10.5 : 9.0;
      p12 = 4.5; p6 = 3.0; micaA = 3.0; micaB = 5.0; liner = 7.0; fevicolKg = 14;
      
    } else if (struct === 'kitchen_island') {
      title = `${dim.width} × ${dim.height} ft Luxury Island Kitchen`;
      p18 = dim.width >= 12 ? 11.5 : 9.5;
      p12 = 4.5; p6 = 2.5; micaA = 3.5; micaB = 5.5; liner = 7.5; fevicolKg = 15;
      
    } else if (struct === 'tvunit') {
      title = `${dim.width} × ${dim.height} ft Floating TV Unit`;
      p18 = 3.5; p12 = 1.0; p6 = 1.5; micaA = 1.5; micaB = 2.0; liner = 2.0; fevicolKg = 5;
      
    } else if (struct === 'tvunit_console') {
      title = `${dim.width} × ${dim.height} ft Media Console & Towers`;
      p18 = dim.width >= 10 ? 6.0 : 5.0;
      p12 = 2.0; p6 = 2.5; micaA = 2.5; micaB = 3.0; liner = 3.5; fevicolKg = 7;
      
    } else if (struct === 'tvunit_partition') {
      title = `${dim.width} × ${dim.height} ft Room Divider TV Wall`;
      p18 = dim.width >= 10 ? 6.5 : 5.5;
      p12 = 2.0; p6 = 1.5; micaA = 3.0; micaB = 3.0; liner = 4.0; fevicolKg = 8;
      
    } else if (struct === 'bed') {
      title = `${dim.width} × ${dim.height} ft Hydraulic Box Bed`;
      p18 = dim.width >= 6 ? 4.5 : 3.5;
      p12 = 2.0; p6 = 0; micaA = 2.0; micaB = 1.5; liner = 2.0; fevicolKg = 6;
      
    } else if (struct === 'bed_drawers') {
      title = `${dim.width} × ${dim.height} ft Storage Divan Bed`;
      p18 = dim.width >= 6 ? 5.0 : 4.0;
      p12 = 2.5; p6 = 1.0; micaA = 2.5; micaB = 2.0; liner = 3.0; fevicolKg = 7;
      
    } else if (struct === 'dressing') {
      title = `${dim.width} × ${dim.height} ft LED Arch Vanity`;
      p18 = 2.5; p12 = 1.0; p6 = 1.0; micaA = 1.5; micaB = 1.0; liner = 2.0; fevicolKg = 4;
      
    } else if (struct === 'dressing_tall') {
      title = `${dim.width} × ${dim.height} ft Full Vanity Station`;
      p18 = dim.width >= 5 ? 5.0 : 4.0;
      p12 = 1.5; p6 = 2.0; micaA = 2.0; micaB = 2.0; liner = 3.0; fevicolKg = 6;
      
    } else if (struct === 'office') {
      title = `${dim.width} × ${dim.height} ft Executive Desk`;
      p18 = 2.5; p12 = 1.0; p6 = 0.5; micaA = 1.5; micaB = 1.0; liner = 1.5; fevicolKg = 4;
      
    } else if (struct === 'office_lshape') {
      title = `${dim.width} × ${dim.height} ft L-Shaped Workstation`;
      p18 = dim.width >= 7 ? 5.5 : 4.5;
      p12 = 2.0; p6 = 1.0; micaA = 2.5; micaB = 2.0; liner = 3.0; fevicolKg = 6;
      
    } else if (struct === 'office_study') {
      title = `${dim.width} × ${dim.height} ft Study Table & Bookshelf`;
      p18 = dim.width >= 5 ? 5.0 : 4.0;
      p12 = 1.5; p6 = 2.0; micaA = 2.0; micaB = 2.5; liner = 3.5; fevicolKg = 6;
          }

    const totalMicaOuter = Math.round((micaA + micaB) * 10) / 10;
                            
    return {
      title,
      items: [
        { name: `18mm ${s.plyGrade === 'marine' ? 'Marine IS:710' : 'BWR IS:303'} Ply (Carcass & Shutters)`, qty: `${p18} Sheets (8x4)` },
        { name: `12mm ${s.plyGrade === 'marine' ? 'Marine IS:710' : 'BWR IS:303'} Ply (Internal Shelves/Drawers)`, qty: `${p12} Sheets (8x4)` },
        ...(p6 > 0 ? [{ name: '6mm Marine Ply (Back Paneling)', qty: `${p6} Sheets (8x4)` }] : []),
        { name: `1.0mm Decorative Outer Sunmica (Zones A & B)`, qty: `${totalMicaOuter} Sheets` },
        { name: `0.8mm White Inner Liner Sunmica`, qty: `${liner} Sheets` },
        { name: `Fevicol Marine / SH Synthetic Adhesive`, qty: `${fevicolKg} Kg` },
        { name: `Hardware Fitting Pack (${s.hardware.toUpperCase()} Finish)`, qty: `1 Complete Kit` }
      ],
      p18Sheets: p18,
      p12Sheets: p12,
      p6Sheets: p6,
      laminateSheets: totalMicaOuter,
      linerSheets: liner,
      totalSheets: Math.round((p18 + p12 + p6 + totalMicaOuter + liner) * 10) / 10,
      totalPlySheets: Math.round((p18 + p12 + p6) * 10) / 10
    };
  }

  // --- DYNAMIC PRESET BUTTONS FOR STRUCTURE ---
  function renderDimensionPresets(struct) {
    const widthContainer = document.getElementById('sim-width-presets');
    const heightContainer = document.getElementById('sim-height-presets');
    if (!widthContainer || !heightContainer) return;

    let wPresets = [4, 6, 8, 10, 12, 16];
    let hPresets = [6.5, 7, 8, 8.5, 10];

    if (['office', 'office_lshape'].includes(struct)) {
      wPresets = [4, 4.5, 5, 6, 7];
      hPresets = [2.5, 2.75, 3.0, 3.5];
    } else if (['bed', 'bed_drawers'].includes(struct)) {
      wPresets = [3.5, 4.5, 5.5, 6.5];
      hPresets = [3.0, 3.5, 4.0, 4.5, 5.0];
    } else if (['tvunit', 'tvunit_console', 'tvunit_partition'].includes(struct)) {
      wPresets = [6, 7, 8, 10, 12];
      hPresets = [5.0, 6.0, 7.0, 8.0];
    } else if (['kitchen', 'kitchen_l', 'kitchen_parallel', 'kitchen_island'].includes(struct)) {
      wPresets = [7, 9, 10, 12, 14, 16];
      hPresets = [6.5, 7.0, 7.5, 8.0, 9.0];
    } else if (['dressing', 'dressing_tall'].includes(struct)) {
      wPresets = [3, 3.5, 4, 4.5, 5.5];
      hPresets = [6.0, 6.5, 7.0, 7.5, 8.5];
    }

    widthContainer.innerHTML = wPresets.map(w => 
      `<button class="sim-preset-btn" onclick="simSetDimensionWidth(${w})">${w} ft</button>`
    ).join('');

    heightContainer.innerHTML = hPresets.map(h => 
      `<button class="sim-preset-btn" onclick="simSetDimensionHeight(${h})">${h} ft</button>`
    ).join('');
  }

  // --- UI CONTROLLER & EVENT LISTENERS ---
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

    // 7. Update Custom Dimension Sliders & Labels (Active for ALL models!)
    const dimPanel = document.getElementById('sim-custom-dim-panel');
    if (dimPanel) {
      dimPanel.style.display = 'block';

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

      // Update Presets dynamically for this structure
      renderDimensionPresets(window.SIM_STATE.structure);

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

    // 11. Recompute BOM & Goods Requirements
    renderSimBomDetails();

    // 12. Update Cockpit Quick Status Pill & Persistent Bottom Bar
    const s = window.SIM_STATE;
    const curDim = s.dimensions[s.structure] || { width: 6, height: 7, label: s.structure };
    const structLabel = curDim.label || s.structure;
    const bomData = calculateSimulatorBom();

    const quickStructName = document.getElementById('sim-quick-struct-name');
    const quickDimLabel = document.getElementById('sim-quick-dim-label');
    const quickSheetBadge = document.getElementById('sim-quick-sheet-badge');
    const barSheetSummary = document.getElementById('sim-bar-sheet-summary');

    if (quickStructName) quickStructName.textContent = structLabel;
    if (quickDimLabel) quickDimLabel.textContent = `${curDim.width.toFixed(1)} × ${curDim.height.toFixed(1)} ft`;
    if (quickSheetBadge) quickSheetBadge.textContent = `📋 ${bomData.totalPlySheets} Sheets`;
    if (barSheetSummary) barSheetSummary.textContent = `Total: ${bomData.totalPlySheets} Ply + ${Math.round((bomData.laminateSheets + bomData.linerSheets) * 10) / 10} Sunmica`;

    // 13. Update Swatch Card Selection States
    document.querySelectorAll('.sim-swatch-card').forEach(card => {
      const id = card.getAttribute('data-swatch-id');
      card.classList.toggle('selected', id === currentSwatchId);
    });
  };

  function renderSimBomDetails() {
    const bom = calculateSimulatorBom();
    const bomListEl = document.getElementById('sim-bom-items');
    const grandTotalEl = document.getElementById('sim-grand-total');
    const structTitleEl = document.getElementById('sim-bom-title');

    if (structTitleEl) structTitleEl.textContent = `📋 Estimated Materials: ${bom.title}`;
    if (grandTotalEl) grandTotalEl.textContent = `${bom.totalPlySheets} Ply + ${Math.round((bom.laminateSheets + bom.linerSheets) * 10) / 10} Sunmica Sheets`;

    if (bomListEl) {
      bomListEl.innerHTML = bom.items.map(it => `
        <div class="bom-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed rgba(245, 158, 11, 0.2); font-size: 12px;">
          <div style="font-weight: 600; color: #f0f6fc; max-width: 62%;">
            ${it.name}
          </div>
          <div style="font-weight: 800; color: #fbbf24; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); padding: 3px 9px; border-radius: 6px; font-size: 11.5px; white-space: nowrap;">
            ${it.qty}
          </div>
        </div>
      `).join('');
    }
  }


  // --- ZERO-SCROLL COCKPIT TAB & FILTER CONTROLLERS ---
  window.simSwitchDeckTab = function (tabName) {
    document.querySelectorAll('.sim-deck-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.sim-deck-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `sim-tab-${tabName}`);
    });
  };

  window.simFilterLaminates = function (cat) {
    document.querySelectorAll('.sim-filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-cat') === cat);
    });
    document.querySelectorAll('.sim-swatch-card').forEach(card => {
      const cardCat = card.getAttribute('data-cat');
      if (cat === 'all' || cardCat === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // --- EVENT HANDLERS ---
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

  // --- HIGH-CONVERSION ACTIONS ---
  window.simSendToWhatsApp = async function () {
    const s = window.SIM_STATE;
    const bom = calculateSimulatorBom();
    const swA = getSwatch(s.zoneA);
    const swB = getSwatch(s.zoneB);
    const hw = window.HARDWARE_CATALOG.find(h => h.id === s.hardware)?.name || s.hardware;

    if (window.STATE && !window.STATE.user) {
      window.STATE.pendingAction = () => window.simSendToWhatsApp();
      if (window.triggerAuthSheet) {
        window.triggerAuthSheet('quote');
        return;
      }
    }

    const user = window.STATE?.user || { name: 'Valued Customer', phone: '9867098952', location: window.STATE?.currentLocality || 'Onda, Bankura' };
    const locality = user.location || window.STATE?.currentLocality || 'Onda, Bankura';

    const materialsText = 
      `• Furniture: ${bom.title} (${s.dimensions[s.structure]?.width || 6} ft W x ${s.dimensions[s.structure]?.height || 7} ft H)\n` +
      `• 18mm Plywood: ${bom.p18Sheets} Sheets (${s.plyGrade === 'marine' ? 'Marine IS:710 Waterproof' : 'Tycon BWR IS:303'})\n` +
      `• 12mm Plywood: ${bom.p12Sheets} Sheets\n` +
      `• 1.0mm Decorative Laminate: ${bom.laminateSheets} Sheets (${swB.name} - ${swB.code})\n` +
      `• 0.8mm Inner Liner: ${bom.linerSheets} Sheets\n` +
      `• Carcass Finish: ${swA.name} (${swA.code})\n` +
      `• Hardware Finish: ${hw}`;

    const payload = {
      customer_name: user.name,
      phone: user.phone,
      delivery_locality: locality,
      quote_type: '3D Studio Design',
      furniture_type: bom.title,
      dimensions: `${s.dimensions[s.structure]?.width || 6} ft W x ${s.dimensions[s.structure]?.height || 7} ft H`,
      materials_breakdown: materialsText,
      notes: `Customized in 3D Studio Simulator with ${s.plyGrade === 'marine' ? 'Club Marine IS:710' : 'BWR IS:303'}`
    };

    if (window.showToast) window.showToast('Logging 3D design enquiry with Onda Showroom...');

    const message = `Namaskar Dipanjan Babu! 👋\nI designed a customized *${bom.title}* on the *Baba Dugdheswar Enterprise 3D Studio Simulator*.\n\n` +
      `🎨 *Design Specifications:*\n` +
      `• Structure: ${s.structure.toUpperCase()}\n` +
      `• Body/Carcass: ${swA.name} (${swA.code})\n` +
      `• Shutters/Fronts: ${swB.name} (${swB.code})\n` +
      `• Hardware Finish: ${hw}\n` +
      `• Plywood Grade: ${s.plyGrade === 'marine' ? 'Club Marine IS:710 Waterproof' : 'Tycon BWR IS:303'}\n\n` +
      `📋 *Required Materials / Goods Quantity:*\n` +
      `• 18mm Plywood: ${bom.p18Sheets} Sheets\n` +
      `• 12mm Plywood: ${bom.p12Sheets} Sheets\n` +
      `• 1.0mm Decorative Laminate: ${bom.laminateSheets} Sheets\n` +
      `• 0.8mm Inner Liner: ${bom.linerSheets} Sheets\n\n` +
      `Please check live stock at Onda Depot and confirm booking/delivery. Thank you!`;

    const encoded = encodeURIComponent(message);
    const defaultWaUrl = `https://wa.me/919867098952?text=${encoded}`;

    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const redirectUrl = data.whatsapp_url || defaultWaUrl;
      setTimeout(() => {
        window.open(redirectUrl, '_blank');
      }, 350);
    } catch (e) {
      console.error('Quote request log error:', e);
      window.open(defaultWaUrl, '_blank');
    }
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

  window.simClaimDiscount = async function () {
    if (window.STATE && !window.STATE.user) {
      window.STATE.pendingAction = () => window.simClaimDiscount();
      if (window.triggerAuthSheet) {
        window.triggerAuthSheet('quote');
        return;
      }
    }
    const s = window.SIM_STATE;
    const bom = calculateSimulatorBom();
    const user = window.STATE?.user || { name: 'Valued Customer', phone: '9867098952', location: window.STATE?.currentLocality || 'Onda, Bankura' };
    const locality = user.location || window.STATE?.currentLocality || 'Onda, Bankura';

    const materialsText = 
      `• Project: ${bom.title}\n` +
      `• Total Goods: ${bom.totalPlySheets} Ply Sheets + ${Math.round((bom.laminateSheets + bom.linerSheets) * 10) / 10} Sunmica Sheets\n` +
      `• Plywood Grade: ${s.plyGrade === 'marine' ? 'Marine IS:710 Waterproof' : 'BWR IS:303'}\n` +
      `• Customer request: Live stock check and truck loading schedule at Onda Depot`;

    const payload = {
      customer_name: user.name,
      phone: user.phone,
      delivery_locality: locality,
      quote_type: 'Depot Stock Check',
      furniture_type: bom.title,
      dimensions: `${s.dimensions[s.structure]?.width || 6} ft W x ${s.dimensions[s.structure]?.height || 7} ft H`,
      materials_breakdown: materialsText,
      notes: 'Customer requested Onda Depot live stock check & loading schedule'
    };

    if (window.showToast) window.showToast('Checking depot stock with showroom manager...');

    const waMsg = `Namaskar Dipanjan Babu! 🙏\nI would like to check live stock & delivery schedule from Onda Depot for my 3D design:\n• Structure: ${bom.title}\n• Total Sheets: ${bom.totalPlySheets} Ply + ${Math.round((bom.laminateSheets + bom.linerSheets) * 10) / 10} Sunmica\n• Locality: ${locality}`;
    const defaultWaUrl = `https://wa.me/919867098952?text=${encodeURIComponent(waMsg)}`;

    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const redirectUrl = data.whatsapp_url || defaultWaUrl;
      setTimeout(() => {
        window.open(redirectUrl, '_blank');
      }, 350);
    } catch (e) {
      console.error('Error logging depot stock check:', e);
      window.open(defaultWaUrl, '_blank');
    }
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
