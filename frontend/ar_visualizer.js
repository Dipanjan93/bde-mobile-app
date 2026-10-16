/**
 * BABA DUGDHESWAR ENTERPRISE — Onda, Bankura
 * Advanced AR "Laminate on Your Wall" Visualizer Engine
 * 
 * Features:
 * 1. Mobile WebAR via navigator.mediaDevices.getUserMedia with camera switch & freeze frame.
 * 2. Pure HTML5 Canvas 8x8 bilinear triangular subdivision perspective texture mapping.
 * 3. 4-Corner Pin draggable quad with crosshair precision & loupe magnifier.
 * 4. Realistic procedural textures for 16 Sunmica styles (Teak, Walnut, Marble, Fluted Louvers, Matte).
 * 5. Lighting, rotation, scale, and blend-mode filters (Multiply, Gloss, Matte).
 * 6. Non-AR / Desktop fallback with 3 room presets + custom room photo upload.
 * 7. Live sq.ft calculation, sheet estimation, WhatsApp quote generator & 3D Studio transfer.
 */

(function () {
  'use strict';

  // --- 1. GLOBAL AR STATE ---
  window.AR_STATE = {
    isOpen: false,
    videoStream: null,
    facingMode: 'environment', // 'environment' (back) or 'user' (front)
    isFrozen: false,
    frozenCanvas: null,
    isFallback: false,
    currentPreset: 'bedroom',
    activeLaminateId: 'teak',
    activeCategory: 'all',
    calibratedWidthFt: 8.0,
    textureRepeat: 2,
    textureRotation: 0, // 0 or 90 degrees
    brightness: 0, // -50 to +50
    opacity: 85, // 20% to 100%
    blendMode: 'multiply', // 'multiply', 'normal', 'gloss'
    isSheetMinimized: false,
    
    // 4 Corner points (normalized 0..1 relative to canvas width/height)
    // Initialized well within the visible upper viewport above the bottom drawer (~20% inward margins)
    corners: [
      { x: 0.20, y: 0.20 }, // 0: Top-Left
      { x: 0.80, y: 0.20 }, // 1: Top-Right
      { x: 0.80, y: 0.58 }, // 2: Bottom-Right
      { x: 0.20, y: 0.58 }  // 3: Bottom-Left
    ],
    
    draggingCorner: -1,
    touchOffset: { x: 0, y: 0 },
    magnifierActive: false,
    magnifierPos: { x: 0, y: 0 }
  };

  // --- 2. LAMINATE CATALOG & SWATCHES ---
  const AR_LAMINATES = [
    // Woodgrains
    { id: 'teak', name: 'Royal Burma Teak', code: 'BDE-801', category: 'wood', baseColor: '#b47b48', finish: '1.0mm Gloss / Suede', desc: 'Warm golden teak with rhythmic vertical grain' },
    { id: 'walnut', name: 'Smoked American Walnut', code: 'BDE-805', category: 'wood', baseColor: '#5c3a21', finish: '1.0mm Natural Grain', desc: 'Deep espresso chocolate wavy timber' },
    { id: 'oak', name: 'Scandinavian White Oak', code: 'BDE-809', category: 'wood', baseColor: '#d6c0a2', finish: '1.0mm Matt Suede', desc: 'Blonde minimalist woodgrain' },
    { id: 'wenge', name: 'Ebony Dark Wenge', code: 'BDE-814', category: 'wood', baseColor: '#2b231d', finish: '1.0mm Textured', desc: 'Deep charcoal-brown fine striped timber' },
    { id: 'rosewood', name: 'Sheesham Rosewood', code: 'BDE-820', category: 'wood', baseColor: '#8a3324', finish: '1.0mm Gloss', desc: 'Vibrant reddish-amber rustic grain' },

    // Italian Marbles
    { id: 'carrara', name: 'Carrara White Marble', code: 'BDE-901', category: 'marble', baseColor: '#f1f5f9', finish: '1.0mm High-Gloss Lucida', desc: 'Polished white marble with smoky grey veining' },
    { id: 'marquina', name: 'Nero Marquina Black', code: 'BDE-908', category: 'marble', baseColor: '#0f172a', finish: '1.0mm High-Gloss Gold', desc: 'Obsidian black marble with golden lightning veins' },
    { id: 'travertine', name: 'Roman Travertine', code: 'BDE-915', category: 'marble', baseColor: '#e7dec8', finish: '1.0mm Satin Stone', desc: 'Porous linear limestone texture' },

    // 3D Fluted Louvers & Metallics
    { id: 'fluted_wood', name: 'Fluted Teak Louvers', code: 'BDE-601', category: 'fluted', baseColor: '#a76a36', finish: '12mm 3D Fluted Panel', desc: '3D slatted acoustic wooden battens' },
    { id: 'fluted_charcoal', name: 'Fluted Midnight Louver', code: 'BDE-608', category: 'fluted', baseColor: '#1e2530', finish: '12mm 3D Charcoal', desc: 'Architectural ribbed acoustic charcoal slats' },
    { id: 'metallic_brass', name: 'Brushed Champagne Brass', code: 'BDE-501', category: 'fluted', baseColor: '#d4af37', finish: '1.0mm Metallic Foil', desc: 'Brushed metallic warm golden sheen' },

    // Modern Super-Matte Solids
    { id: 'charcoal', name: 'Slate Charcoal Matte', code: 'BDE-701', category: 'solid', baseColor: '#334155', finish: '1.0mm Anti-Fingerprint', desc: 'Ultra-luxurious slate grey matte' },
    { id: 'white', name: 'Nordic Off-White / Pearl', code: 'BDE-704', category: 'solid', baseColor: '#fdfbf7', finish: '1.0mm Velvet Matte', desc: 'Crisp minimalist reflective off-white' },
    { id: 'sage', name: 'Earthy Sage Green', code: 'BDE-711', category: 'solid', baseColor: '#627264', finish: '1.0mm Velvet Matte', desc: 'Trending organic botanical pastel' },
    { id: 'navy', name: 'Royal Midnight Navy', code: 'BDE-718', category: 'solid', baseColor: '#1e293b', finish: '1.0mm Velvet Matte', desc: 'Deep royal blue with velvet finish' },
    { id: 'terracotta', name: 'Tuscan Terracotta', code: 'BDE-725', category: 'solid', baseColor: '#b85d43', finish: '1.0mm Architectural Matte', desc: 'Warm architectural burnt clay tone' }
  ];

  // Texture Cache
  const TEXTURE_CACHE = {};

  // --- 3. PROCEDURAL TEXTURE SYNTHESIZER ---
  function getLaminateTexture(laminateId) {
    if (TEXTURE_CACHE[laminateId]) {
      return TEXTURE_CACHE[laminateId];
    }

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const swatch = AR_LAMINATES.find(l => l.id === laminateId) || AR_LAMINATES[0];

    // Base background fill
    ctx.fillStyle = swatch.baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Procedural surface details
    if (swatch.category === 'wood') {
      renderProceduralWoodgrain(ctx, laminateId);
    } else if (swatch.category === 'marble') {
      renderProceduralMarble(ctx, laminateId);
    } else if (swatch.category === 'fluted') {
      renderProceduralFluted(ctx, laminateId);
    } else {
      renderProceduralMatte(ctx, laminateId);
    }

    TEXTURE_CACHE[laminateId] = canvas;
    return canvas;
  }

  function renderProceduralWoodgrain(ctx, id) {
    const isTeak = (id === 'teak');
    const isWalnut = (id === 'walnut');
    const isOak = (id === 'oak');
    const isWenge = (id === 'wenge');
    const isRosewood = (id === 'rosewood');

    const grainColor = isTeak ? '#78431b' : isWalnut ? '#2a160a' : isOak ? '#af987d' : isWenge ? '#120d0a' : '#4a180e';
    const subColor = isTeak ? '#d49b6a' : isWalnut ? '#6e4426' : isOak ? '#e8dcce' : isWenge ? '#3a2c24' : '#b84d39';

    // Rhythmic vertical grain lines
    ctx.lineWidth = isWenge ? 1.5 : 2.5;
    ctx.strokeStyle = grainColor;
    ctx.globalAlpha = isWenge ? 0.75 : 0.45;

    for (let x = 0; x < 512; x += (isWenge ? 8 : 16)) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let cx = x;
      for (let y = 0; y < 512; y += 40) {
        cx += (Math.sin((y + x * 2) * 0.03) * 6);
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // Parabolic grain loops / cathedrals
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 4; i++) {
      const cx = 100 + i * 110;
      const cy = 120 + i * 90;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 35 + i * 5, 120 + i * 20, 0, 0, Math.PI * 2);
      ctx.strokeStyle = grainColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, 20 + i * 4, 80 + i * 15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = subColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Micro wood pores
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = grainColor;
    for (let i = 0; i < 400; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      ctx.fillRect(px, py, 1.2, 5 + Math.random() * 10);
    }
    ctx.globalAlpha = 1.0;
  }

  function renderProceduralMarble(ctx, id) {
    const isCarrara = (id === 'carrara');
    const isMarquina = (id === 'marquina');

    // Soft crystalline marble shading
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    if (isCarrara) {
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.5, '#e2e8f0');
      grad.addColorStop(1, '#f1f5f9');
    } else if (isMarquina) {
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.5, '#131b2e');
      grad.addColorStop(1, '#070a10');
    } else { // Travertine
      grad.addColorStop(0, '#e7dec8');
      grad.addColorStop(0.5, '#d6cbaf');
      grad.addColorStop(1, '#ebe3d1');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    if (id === 'travertine') {
      // Linear horizontal sediment bands
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#b8a686';
      for (let y = 0; y < 512; y += 12) {
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y + (Math.sin(y * 0.1) * 3));
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      return;
    }

    // Branching organic veins
    const veinColor = isCarrara ? '#94a3b8' : '#d4af37';
    const subVein = isCarrara ? '#cbd5e1' : '#fef08a';

    function drawVein(startX, startY, len, angle, depth) {
      if (depth <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      let curX = startX;
      let curY = startY;
      const steps = 14;
      for (let s = 0; s < steps; s++) {
        curX += Math.cos(angle) * (len / steps) + (Math.random() - 0.5) * 14;
        curY += Math.sin(angle) * (len / steps) + (Math.random() - 0.5) * 14;
        ctx.lineTo(curX, curY);
      }
      ctx.strokeStyle = depth > 1 ? veinColor : subVein;
      ctx.lineWidth = depth * 1.8;
      ctx.globalAlpha = depth > 1 ? 0.65 : 0.4;
      ctx.stroke();
      ctx.restore();

      // Branching
      if (Math.random() > 0.35 && depth > 1) {
        drawVein(curX, curY, len * 0.6, angle + 0.65, depth - 1);
        drawVein(curX, curY, len * 0.5, angle - 0.55, depth - 1);
      }
    }

    drawVein(40, 20, 360, 0.78, 3);
    drawVein(480, 80, 320, 2.3, 3);
    drawVein(120, 480, 280, -0.6, 2);

    // High-gloss polished sheen gradient
    const gloss = ctx.createLinearGradient(0, 0, 512, 512);
    gloss.addColorStop(0, 'rgba(255,255,255,0.25)');
    gloss.addColorStop(0.35, 'rgba(255,255,255,0.05)');
    gloss.addColorStop(0.6, 'rgba(255,255,255,0.18)');
    gloss.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gloss;
    ctx.fillRect(0, 0, 512, 512);
  }

  function renderProceduralFluted(ctx, id) {
    const isBrass = (id === 'metallic_brass');
    const isCharcoal = (id === 'fluted_charcoal');
    const slatWidth = 32;

    if (isBrass) {
      // Brushed metallic champagne brass
      const brassGrad = ctx.createLinearGradient(0, 0, 512, 0);
      brassGrad.addColorStop(0, '#ca8a04');
      brassGrad.addColorStop(0.3, '#fde047');
      brassGrad.addColorStop(0.6, '#eab308');
      brassGrad.addColorStop(1, '#a16207');
      ctx.fillStyle = brassGrad;
      ctx.fillRect(0, 0, 512, 512);

      // Fine anisotropic brush streaks
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = '#fef08a';
      for (let y = 0; y < 512; y += 4) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      return;
    }

    // 3D vertical acoustic slats with highlight & shadow
    for (let x = 0; x < 512; x += slatWidth) {
      const slatGrad = ctx.createLinearGradient(x, 0, x + slatWidth, 0);
      if (isCharcoal) {
        slatGrad.addColorStop(0, '#090d14');     // Left deep shadow
        slatGrad.addColorStop(0.2, '#1e2633');   // Batten face
        slatGrad.addColorStop(0.85, '#2d3748');  // Slat highlight
        slatGrad.addColorStop(1, '#090d14');     // Right drop groove
      } else {
        slatGrad.addColorStop(0, '#663717');     // Left wood shadow
        slatGrad.addColorStop(0.25, '#a76a36');  // Teak batten face
        slatGrad.addColorStop(0.8, '#d49b6a');   // Warm highlight
        slatGrad.addColorStop(1, '#53290d');     // Slat groove
      }
      ctx.fillStyle = slatGrad;
      ctx.fillRect(x, 0, slatWidth, 512);

      // Slat shadow line
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(x + slatWidth - 3, 0, 3, 512);
    }
  }

  function renderProceduralMatte(ctx, id) {
    // Ultra-fine tactile matte texture
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 1500; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.2, 1.2);
    }
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 1500; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.2, 1.2);
    }
    ctx.globalAlpha = 1.0;
  }

  // --- 4. PRESET ROOMS (DESKTOP & NON-AR FALLBACK) ---
  const ROOM_PRESETS = {
    bedroom: {
      name: 'Master Bedroom Wardrobe',
      defaultCorners: [
        { x: 0.20, y: 0.16 },
        { x: 0.80, y: 0.16 },
        { x: 0.80, y: 0.58 },
        { x: 0.20, y: 0.58 }
      ],
      draw: function(ctx, w, h) {
        // Wall background
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);

        // Floor
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, h * 0.60, w, h * 0.40);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.60);
        ctx.lineTo(w, h * 0.60);
        ctx.stroke();

        // Bare wardrobe wooden frame skeleton
        const wx = w * 0.20, wy = h * 0.16, ww = w * 0.60, wh = h * 0.42;
        ctx.fillStyle = '#2d1c10';
        ctx.fillRect(wx - 8, wy - 8, ww + 16, wh + 16);
        ctx.fillStyle = '#452b19';
        ctx.fillRect(wx, wy, ww, wh);

        // Internal dividing lines
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(wx, wy, ww, wh);
        ctx.beginPath();
        ctx.moveTo(wx + ww * 0.5, wy);
        ctx.lineTo(wx + ww * 0.5, wy + wh);
        ctx.moveTo(wx, wy + wh * 0.25);
        ctx.lineTo(wx + ww, wy + wh * 0.25);
        ctx.stroke();

        // Ambient bedroom ceiling spotlight
        const spot = ctx.createRadialGradient(w * 0.5, h * 0.3, 20, w * 0.5, h * 0.3, w * 0.6);
        spot.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
        spot.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, w, h);
      }
    },
    living: {
      name: 'Living Room TV Feature Wall',
      defaultCorners: [
        { x: 0.16, y: 0.15 },
        { x: 0.84, y: 0.15 },
        { x: 0.84, y: 0.58 },
        { x: 0.16, y: 0.58 }
      ],
      draw: function(ctx, w, h) {
        // Room background
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, w, h);

        // Wooden flooring
        ctx.fillStyle = '#1c130d';
        ctx.fillRect(0, h * 0.60, w, h * 0.40);

        // Accent wall recess
        const ax = w * 0.16, ay = h * 0.15, aw = w * 0.68, ah = h * 0.43;
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(ax, ay, aw, ah);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.strokeRect(ax, ay, aw, ah);

        // Floating TV Screen in center
        const tvw = w * 0.40, tvh = h * 0.22;
        const tvx = (w - tvw) / 2, tvy = ay + 25;
        ctx.fillStyle = '#020617';
        ctx.fillRect(tvx, tvy, tvw, tvh);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.strokeRect(tvx, tvy, tvw, tvh);

        // LED Backlight behind TV
        const led = ctx.createRadialGradient(w * 0.5, tvy + tvh * 0.5, 20, w * 0.5, tvy + tvh * 0.5, tvw * 0.7);
        led.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
        led.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = led;
        ctx.fillRect(tvx - 20, tvy - 20, tvw + 40, tvh + 40);
      }
    },
    plywood: {
      name: 'Raw Plywood Workshop Carcass',
      defaultCorners: [
        { x: 0.18, y: 0.16 },
        { x: 0.82, y: 0.16 },
        { x: 0.82, y: 0.58 },
        { x: 0.18, y: 0.58 }
      ],
      draw: function(ctx, w, h) {
        // Workshop background
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, w, h);

        // Concrete floor
        ctx.fillStyle = '#1e2430';
        ctx.fillRect(0, h * 0.60, w, h * 0.40);

        // Raw calibrated Gurjan core plywood carcass
        const px = w * 0.18, py = h * 0.16, pw = w * 0.64, ph = h * 0.42;
        ctx.fillStyle = '#9a6b47';
        ctx.fillRect(px, py, pw, ph);

        // Ply layers and grain stripes
        ctx.strokeStyle = 'rgba(74, 38, 14, 0.35)';
        for (let y = py; y < py + ph; y += 16) {
          ctx.beginPath();
          ctx.moveTo(px, y);
          ctx.lineTo(px + pw, y);
          ctx.stroke();
        }

        // Calibrated Gurjan Stamp
        ctx.fillStyle = 'rgba(185, 28, 28, 0.65)';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('BDE ONDA • 100% GURJAN BWP 710', px + 30, py + ph - 40);
      }
    }
  };

  // --- 5. CAMERA & STREAM LIFECYCLE ---
  async function initCamera() {
    const video = document.getElementById('ar-video-stream');
    const fallbackImg = document.getElementById('ar-photo-fallback');
    if (!video) return;

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia not supported in this browser, activating Room Photo fallback.');
      activateFallbackMode('Camera access not supported on this device. Using interactive Room Simulator.');
      return;
    }

    try {
      if (window.AR_STATE.videoStream) {
        window.AR_STATE.videoStream.getTracks().forEach(t => t.stop());
        window.AR_STATE.videoStream = null;
      }

      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: window.AR_STATE.facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      window.AR_STATE.videoStream = stream;
      video.srcObject = stream;
      video.style.display = 'block';
      if (fallbackImg) fallbackImg.style.display = 'none';
      window.AR_STATE.isFallback = false;
      window.AR_STATE.isFrozen = false;

      await video.play();
      updateHudNotice('✨ Point camera at wall/wardrobe. Drag 4 corners to fit.');
    } catch (err) {
      console.warn('Camera permission denied or failed:', err);
      activateFallbackMode('Camera permission denied or unavailable. Switched to Room Simulator.');
    }
  }

  function stopCamera() {
    if (window.AR_STATE.videoStream) {
      window.AR_STATE.videoStream.getTracks().forEach(t => t.stop());
      window.AR_STATE.videoStream = null;
    }
    const video = document.getElementById('ar-video-stream');
    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }

  function activateFallbackMode(reasonMsg) {
    window.AR_STATE.isFallback = true;
    stopCamera();
    const video = document.getElementById('ar-video-stream');
    if (video) video.style.display = 'none';

    // Show room preset controls in settings
    const presetsRow = document.getElementById('ar-presets-selector-container');
    if (presetsRow) presetsRow.style.display = 'flex';

    if (reasonMsg && window.showToast) {
      window.showToast(reasonMsg, 'warning');
    }
    updateHudNotice('🖼️ Room Photo Simulator Active. Drag 4 corners to fit.');
  }

  // --- 6. 8x8 BILINEAR TRIANGULAR PERSPECTIVE WARPING ENGINE ---
  // Subdivides the quad into an 8x8 grid of quads (128 triangles)
  // and applies exact affine transforms to render perspective skewing
  function drawAffineTriangle(ctx, img, s0, t0, s1, t1, s2, t2, d0, e0, d1, e1, d2, e2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(d0, e0);
    ctx.lineTo(d1, e1);
    ctx.lineTo(d2, e2);
    ctx.closePath();
    ctx.clip();

    const delta = s0 * (t1 - t2) - s1 * (t0 - t2) + s2 * (t0 - t1);
    if (Math.abs(delta) < 1e-5) {
      ctx.restore();
      return;
    }

    const deltaA = d0 * (t1 - t2) - d1 * (t0 - t2) + d2 * (t0 - t1);
    const deltaB = s0 * (d1 - d2) - s1 * (d0 - d2) + s2 * (d0 - d1);
    const deltaC = s0 * (t1 * d2 - t2 * d1) - s1 * (t0 * d2 - t2 * d0) + s2 * (t0 * d1 - t1 * d0);

    const deltaD = e0 * (t1 - t2) - e1 * (t0 - t2) + e2 * (t0 - t1);
    const deltaE = s0 * (e1 - e2) - s1 * (e0 - e2) + s2 * (e0 - e1);
    const deltaF = s0 * (t1 * e2 - t2 * e1) - s1 * (t0 * e2 - t2 * e0) + s2 * (t0 * e1 - t1 * e0);

    ctx.transform(
      deltaA / delta, deltaD / delta,
      deltaB / delta, deltaE / delta,
      deltaC / delta, deltaF / delta
    );
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }

  function renderPerspectiveQuad(ctx, textureImg, p0, p1, p2, p3) {
    const SUBDIVISIONS = 8;
    const texW = textureImg.width;
    const texH = textureImg.height;

    // Bilinear interpolation formula
    function getPoint(u, v) {
      const x = (1 - u) * (1 - v) * p0.x + u * (1 - v) * p1.x + u * v * p2.x + (1 - u) * v * p3.x;
      const y = (1 - u) * (1 - v) * p0.y + u * (1 - v) * p1.y + u * v * p2.y + (1 - u) * v * p3.y;
      return { x, y };
    }

    for (let i = 0; i < SUBDIVISIONS; i++) {
      const u0 = i / SUBDIVISIONS;
      const u1 = (i + 1) / SUBDIVISIONS;

      for (let j = 0; j < SUBDIVISIONS; j++) {
        const v0 = j / SUBDIVISIONS;
        const v1 = (j + 1) / SUBDIVISIONS;

        const pt00 = getPoint(u0, v0);
        const pt10 = getPoint(u1, v0);
        const pt11 = getPoint(u1, v1);
        const pt01 = getPoint(u0, v1);

        const s00 = u0 * texW, t00 = v0 * texH;
        const s10 = u1 * texW, t10 = v0 * texH;
        const s11 = u1 * texW, t11 = v1 * texH;
        const s01 = u0 * texW, t01 = v1 * texH;

        // Upper triangle: (0,0), (1,0), (0,1)
        drawAffineTriangle(ctx, textureImg, s00, t00, s10, t10, s01, t01, pt00.x, pt00.y, pt10.x, pt10.y, pt01.x, pt01.y);
        // Lower triangle: (1,0), (1,1), (0,1)
        drawAffineTriangle(ctx, textureImg, s10, t10, s11, t11, s01, t01, pt10.x, pt10.y, pt11.x, pt11.y, pt01.x, pt01.y);
      }
    }
  }

  // --- 7. RENDERING LOOP ---
  function renderARFrame() {
    if (!window.AR_STATE.isOpen) return;

    const canvas = document.getElementById('ar-render-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Fallback Preset or Frozen frame if active
    if (window.AR_STATE.isFrozen && window.AR_STATE.frozenCanvas) {
      ctx.drawImage(window.AR_STATE.frozenCanvas, 0, 0, w, h);
    } else if (window.AR_STATE.isFallback) {
      const preset = ROOM_PRESETS[window.AR_STATE.currentPreset] || ROOM_PRESETS.bedroom;
      preset.draw(ctx, w, h);
    }

    // 2. Compute absolute screen coordinates for 4 corners
    const c = window.AR_STATE.corners;
    const p0 = { x: c[0].x * w, y: c[0].y * h };
    const p1 = { x: c[1].x * w, y: c[1].y * h };
    const p2 = { x: c[2].x * w, y: c[2].y * h };
    const p3 = { x: c[3].x * w, y: c[3].y * h };

    // 3. Render Projected Laminate Surface
    const texture = getLaminateTexture(window.AR_STATE.activeLaminateId);
    if (texture) {
      ctx.save();

      // Configure blend mode & dynamic opacity
      const opacityVal = (window.AR_STATE.opacity !== undefined ? window.AR_STATE.opacity : 85);
      const opacityNorm = Math.max(0.20, Math.min(1.0, opacityVal / 100));

      if (window.AR_STATE.blendMode === 'multiply') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = opacityNorm;
      } else if (window.AR_STATE.blendMode === 'gloss') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = opacityNorm;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = opacityNorm;
      }

      // Brightness filter
      if (window.AR_STATE.brightness !== 0) {
        ctx.filter = `brightness(${100 + window.AR_STATE.brightness}%)`;
      }

      renderPerspectiveQuad(ctx, texture, p0, p1, p2, p3);

      ctx.restore();

      // 4. Gloss specular reflection sheen if in gloss mode
      if (window.AR_STATE.blendMode === 'gloss') {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.clip();

        const sheenGrad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        sheenGrad.addColorStop(0, `rgba(255, 255, 255, ${0.40 * opacityNorm})`);
        sheenGrad.addColorStop(0.35, `rgba(255, 255, 255, ${0.05 * opacityNorm})`);
        sheenGrad.addColorStop(0.55, `rgba(255, 255, 255, ${0.25 * opacityNorm})`);
        sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }

    // 5. Draw 4-Corner Pin Guides & Draggable Handles
    drawQuadGuidelines(ctx, p0, p1, p2, p3);

    // 6. Draw Corner Magnifier Loupe if currently dragging
    if (window.AR_STATE.magnifierActive && window.AR_STATE.draggingCorner >= 0) {
      drawMagnifierLoupe(ctx, canvas);
    }

    requestAnimationFrame(renderARFrame);
  }

  function drawQuadGuidelines(ctx, p0, p1, p2, p3) {
    ctx.save();

    // Polygon boundary glow
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Edge Dimension Labels
    const topW = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const sideH = Math.hypot(p3.x - p0.x, p3.y - p0.y);
    const estSqft = calculateEstimatedSqft(p0, p1, p2, p3);

    drawDimensionTag(ctx, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2 - 12, `${window.AR_STATE.calibratedWidthFt.toFixed(1)} ft`);
    drawDimensionTag(ctx, p0.x - 28, (p0.y + p3.y) / 2, `${(window.AR_STATE.calibratedWidthFt * (sideH / (topW || 1))).toFixed(1)} ft`);

    // 4 Draggable Corner Handles
    const points = [p0, p1, p2, p3];
    points.forEach((p, idx) => {
      const isDragging = (window.AR_STATE.draggingCorner === idx);

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, isDragging ? 26 : 20, 0, Math.PI * 2);
      ctx.fillStyle = isDragging ? 'rgba(245, 158, 11, 0.45)' : 'rgba(22, 27, 34, 0.85)';
      ctx.fill();
      ctx.strokeStyle = isDragging ? '#fbbf24' : '#f59e0b';
      ctx.lineWidth = isDragging ? 3 : 2;
      ctx.stroke();

      // Inner glowing core
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Precision crosshair
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x - 12, p.y);
      ctx.lineTo(p.x + 12, p.y);
      ctx.moveTo(p.x, p.y - 12);
      ctx.lineTo(p.x, p.y + 12);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawDimensionTag(ctx, x, y, text) {
    ctx.save();
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    const textW = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(22, 27, 34, 0.9)';
    ctx.fillRect(x - textW / 2 - 6, y - 9, textW + 12, 18);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - textW / 2 - 6, y - 9, textW + 12, 18);
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawMagnifierLoupe(ctx, canvas) {
    const idx = window.AR_STATE.draggingCorner;
    if (idx < 0) return;
    const pt = {
      x: window.AR_STATE.corners[idx].x * canvas.width,
      y: window.AR_STATE.corners[idx].y * canvas.height
    };

    const loupeRadius = 42;
    const loupeX = pt.x;
    const loupeY = Math.max(loupeRadius + 20, pt.y - 85); // 85px above finger

    ctx.save();
    ctx.beginPath();
    ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
    ctx.clip();

    // Magnify underlying video/canvas by 2x
    const zoom = 2.0;
    const video = document.getElementById('ar-video-stream');
    if (!window.AR_STATE.isFallback && video && video.readyState >= 2) {
      ctx.drawImage(
        video,
        (pt.x / canvas.width) * video.videoWidth - (loupeRadius / zoom),
        (pt.y / canvas.height) * video.videoHeight - (loupeRadius / zoom),
        (loupeRadius * 2) / zoom,
        (loupeRadius * 2) / zoom,
        loupeX - loupeRadius,
        loupeY - loupeRadius,
        loupeRadius * 2,
        loupeRadius * 2
      );
    } else {
      ctx.fillStyle = '#161b22';
      ctx.fillRect(loupeX - loupeRadius, loupeY - loupeRadius, loupeRadius * 2, loupeRadius * 2);
    }

    // Crosshair inside loupe
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(loupeX - 16, loupeY);
    ctx.lineTo(loupeX + 16, loupeY);
    ctx.moveTo(loupeX, loupeY - 16);
    ctx.lineTo(loupeX, loupeY + 16);
    ctx.stroke();

    ctx.restore();

    // Loupe Border Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  // --- 8. TOUCH & DRAG EVENT HANDLERS ---
  function setupInteractionListeners() {
    const canvas = document.getElementById('ar-render-canvas');
    if (!canvas) return;

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function onStart(e) {
      const coords = getCoords(e);
      const w = canvas.width;
      const h = canvas.height;
      const hitRadius = 38; // Generous mobile touch target

      let found = -1;
      let minDist = hitRadius;

      window.AR_STATE.corners.forEach((c, idx) => {
        const dist = Math.hypot(c.x * w - coords.x, c.y * h - coords.y);
        if (dist < minDist) {
          minDist = dist;
          found = idx;
        }
      });

      if (found >= 0) {
        e.preventDefault();
        window.AR_STATE.draggingCorner = found;
        window.AR_STATE.magnifierActive = true;
      }
    }

    function getBottomDrawerHeight() {
      const sheet = document.getElementById('ar-bottom-sheet');
      if (!sheet) return 180;
      if (window.AR_STATE.isSheetMinimized) return 46;
      return sheet.offsetHeight || 180;
    }

    function getSafeBottomFraction(canvasHeight) {
      const drawerH = getBottomDrawerHeight();
      return Math.max(0.40, Math.min(0.95, (canvasHeight - drawerH - 18) / canvasHeight));
    }

    function onMove(e) {
      if (window.AR_STATE.draggingCorner < 0) return;
      e.preventDefault();
      const coords = getCoords(e);
      const w = canvas.width;
      const h = canvas.height;

      // Clamping: ensure pins stay strictly inside the visible interactive viewport
      // and cannot be dragged behind the bottom drawer or above the header
      const minSafeY = 0.08;
      const maxSafeY = getSafeBottomFraction(h);
      const nx = Math.max(0.04, Math.min(0.96, coords.x / w));
      const ny = Math.max(minSafeY, Math.min(maxSafeY, coords.y / h));

      window.AR_STATE.corners[window.AR_STATE.draggingCorner] = { x: nx, y: ny };
      updateLiveAreaEstimate();
    }

    function onEnd(e) {
      window.AR_STATE.draggingCorner = -1;
      window.AR_STATE.magnifierActive = false;
    }

    // Touch events
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);
    canvas.addEventListener('touchcancel', onEnd);

    // Mouse events (Desktop)
    canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  }

  // --- 9. DIMENSION & QUOTATION ESTIMATOR ---
  function calculateEstimatedSqft(p0, p1, p2, p3) {
    // Gauss shoelace formula for convex quad area in pixels
    const pxArea = 0.5 * Math.abs(
      (p0.x * p1.y - p1.x * p0.y) +
      (p1.x * p2.y - p2.x * p1.y) +
      (p2.x * p3.y - p3.x * p2.y) +
      (p3.x * p0.y - p0.x * p3.y)
    );

    // Calibrate pixel area to real-world square feet based on calibrated width
    const topPxW = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
    const pxPerFt = topPxW / window.AR_STATE.calibratedWidthFt;
    const sqft = pxArea / (pxPerFt * pxPerFt);
    return Math.max(4.0, Math.round(sqft * 10) / 10);
  }

  function updateLiveAreaEstimate() {
    const canvas = document.getElementById('ar-render-canvas');
    if (!canvas) return;
    const c = window.AR_STATE.corners;
    const p0 = { x: c[0].x * canvas.width, y: c[0].y * canvas.height };
    const p1 = { x: c[1].x * canvas.width, y: c[1].y * canvas.height };
    const p2 = { x: c[2].x * canvas.width, y: c[2].y * canvas.height };
    const p3 = { x: c[3].x * canvas.width, y: c[3].y * canvas.height };

    const sqft = calculateEstimatedSqft(p0, p1, p2, p3);
    const sheets = Math.ceil(sqft / 32);

    updateHudNotice(`🪵 Wall Area: ~${sqft} sq.ft (${sheets} Sunmica Sheets 8x4)`);
    const metaVal = document.getElementById('ar-meta-val');
    if (metaVal) {
      const activeSwatch = AR_LAMINATES.find(l => l.id === window.AR_STATE.activeLaminateId);
      metaVal.textContent = `${activeSwatch.name} • ${sqft} sq.ft`;
    }
  }

  function updateHudNotice(text) {
    const textEl = document.getElementById('ar-hud-text');
    if (textEl) textEl.textContent = text;
  }

  // --- 10. SWATCH DRAWER & CATEGORY FILTERING ---
  function populateSwatchDrawer() {
    const scroller = document.getElementById('ar-swatches-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    const filtered = AR_LAMINATES.filter(l => {
      if (window.AR_STATE.activeCategory === 'all') return true;
      return l.category === window.AR_STATE.activeCategory;
    });

    filtered.forEach(swatch => {
      const card = document.createElement('div');
      card.className = `ar-swatch-card ${swatch.id === window.AR_STATE.activeLaminateId ? 'active' : ''}`;
      card.id = `ar-swatch-${swatch.id}`;
      card.onclick = () => selectArLaminate(swatch.id);

      // Mini preview thumbnail using procedural texture
      const tex = getLaminateTexture(swatch.id);
      const dataUrl = tex.toDataURL('image/jpeg', 0.6);

      card.innerHTML = `
        <div class="ar-swatch-thumb" style="background-image: url('${dataUrl}'); background-size: cover; background-position: center;">
          <div class="ar-swatch-active-badge">✓</div>
        </div>
        <span class="ar-swatch-code">${swatch.code}</span>
        <span class="ar-swatch-name" title="${swatch.name}">${swatch.name}</span>
      `;
      scroller.appendChild(card);
    });
  }

  window.selectArCategory = function (category) {
    window.AR_STATE.activeCategory = category;
    document.querySelectorAll('.ar-cat-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById(`ar-tab-${category}`);
    if (activeTab) activeTab.classList.add('active');
    populateSwatchDrawer();
  };

  window.selectArLaminate = function (swatchId) {
    window.AR_STATE.activeLaminateId = swatchId;
    document.querySelectorAll('.ar-swatch-card').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(`ar-swatch-${swatchId}`);
    if (target) target.classList.add('active');

    const swatch = AR_LAMINATES.find(l => l.id === swatchId) || AR_LAMINATES[0];
    const metaVal = document.getElementById('ar-meta-val');
    if (metaVal) {
      const canvas = document.getElementById('ar-render-canvas');
      const c = window.AR_STATE.corners;
      const p0 = { x: c[0].x * canvas.width, y: c[0].y * canvas.height };
      const p1 = { x: c[1].x * canvas.width, y: c[1].y * canvas.height };
      const p2 = { x: c[2].x * canvas.width, y: c[2].y * canvas.height };
      const p3 = { x: c[3].x * canvas.width, y: c[3].y * canvas.height };
      const sqft = calculateEstimatedSqft(p0, p1, p2, p3);
      metaVal.textContent = `${swatch.name} • ${sqft} sq.ft`;
    }

    if (window.showToast) {
      window.showToast(`Applied: ${swatch.name} (${swatch.code})`);
    }
  };

  // --- 11. CONTROLS: FREEZE, CAMERA FLIP, CORNER RESETS ---
  window.arToggleFreeze = function () {
    const video = document.getElementById('ar-video-stream');
    const canvas = document.getElementById('ar-render-canvas');
    const btn = document.getElementById('ar-freeze-btn');

    if (!window.AR_STATE.isFrozen) {
      // Freeze frame: capture video frame
      if (video && video.videoWidth > 0) {
        const fc = document.createElement('canvas');
        fc.width = canvas.width;
        fc.height = canvas.height;
        const fctx = fc.getContext('2d');
        fctx.drawImage(video, 0, 0, fc.width, fc.height);
        window.AR_STATE.frozenCanvas = fc;
      }
      window.AR_STATE.isFrozen = true;
      if (btn) {
        btn.classList.add('active');
        btn.innerHTML = '▶️<span class="label">Resume</span>';
      }
      updateHudNotice('📸 Frame Frozen. Hold comfortably & browse finishes.');
    } else {
      // Unfreeze
      window.AR_STATE.isFrozen = false;
      window.AR_STATE.frozenCanvas = null;
      if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = '📷<span class="label">Freeze</span>';
      }
      updateHudNotice('✨ Live Camera Active.');
    }
  };

  window.arFlipCamera = async function () {
    window.AR_STATE.facingMode = (window.AR_STATE.facingMode === 'environment') ? 'user' : 'environment';
    await initCamera();
  };

  window.arResetCorners = function () {
    const canvas = document.getElementById('ar-render-canvas');
    const h = canvas ? canvas.height : window.innerHeight;
    const drawerH = (document.getElementById('ar-bottom-sheet') || {}).offsetHeight || 180;
    const safeBottom = Math.min(0.58, (h - drawerH - 20) / h);

    window.AR_STATE.corners = [
      { x: 0.20, y: 0.20 },
      { x: 0.80, y: 0.20 },
      { x: 0.80, y: safeBottom },
      { x: 0.20, y: safeBottom }
    ];
    updateLiveAreaEstimate();
  };

  window.arExpandCorners = function () {
    const canvas = document.getElementById('ar-render-canvas');
    const h = canvas ? canvas.height : window.innerHeight;
    const drawerH = (document.getElementById('ar-bottom-sheet') || {}).offsetHeight || 180;
    const safeBottom = Math.min(0.64, (h - drawerH - 15) / h);

    window.AR_STATE.corners = [
      { x: 0.10, y: 0.14 },
      { x: 0.90, y: 0.14 },
      { x: 0.90, y: safeBottom },
      { x: 0.10, y: safeBottom }
    ];
    updateLiveAreaEstimate();
  };

  window.arSetOpacity = function (val) {
    const intVal = parseInt(val, 10);
    window.AR_STATE.opacity = intVal;

    const opSlider = document.getElementById('ar-opacity-slider');
    const opVal = document.getElementById('ar-opacity-val');
    const opQuickSlider = document.getElementById('ar-opacity-quick-slider');
    const opQuickVal = document.getElementById('ar-opacity-quick-val');

    if (opSlider && opSlider.value != intVal) opSlider.value = intVal;
    if (opVal) opVal.textContent = `${intVal}%`;
    if (opQuickSlider && opQuickSlider.value != intVal) opQuickSlider.value = intVal;
    if (opQuickVal) opQuickVal.textContent = `${intVal}%`;
  };

  window.arToggleOpacityPopup = function () {
    const popup = document.getElementById('ar-opacity-popup');
    const btn = document.getElementById('ar-opacity-btn');
    if (popup) {
      popup.classList.toggle('active');
      if (btn) btn.classList.toggle('active', popup.classList.contains('active'));
    }
  };

  window.arToggleBottomSheet = function () {
    const sheet = document.getElementById('ar-bottom-sheet');
    if (!sheet) return;
    sheet.classList.toggle('minimized');
    window.AR_STATE.isSheetMinimized = sheet.classList.contains('minimized');

    // Update collapsed badge
    const badge = document.getElementById('ar-collapsed-finish-badge');
    if (badge) {
      const activeSwatch = AR_LAMINATES.find(l => l.id === window.AR_STATE.activeLaminateId);
      if (activeSwatch) badge.textContent = `${activeSwatch.name} (${activeSwatch.code})`;
    }
  };

  window.arToggleSettings = function () {
    const drawer = document.getElementById('ar-settings-drawer');
    if (drawer) drawer.classList.toggle('active');
  };

  window.arSetBlendMode = function (mode) {
    window.AR_STATE.blendMode = mode;
    document.querySelectorAll('.ar-blend-toggle').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`ar-blend-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');
  };

  window.arSetRotation = function (deg) {
    window.AR_STATE.textureRotation = deg;
    document.querySelectorAll('.ar-rot-toggle').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`ar-rot-${deg}`);
    if (activeBtn) activeBtn.classList.add('active');
  };

  window.arChangePreset = function (presetKey) {
    window.AR_STATE.currentPreset = presetKey;
    document.querySelectorAll('.ar-preset-chip').forEach(c => c.classList.remove('active'));
    const activeChip = document.getElementById(`ar-preset-${presetKey}`);
    if (activeChip) activeChip.classList.add('active');

    const preset = ROOM_PRESETS[presetKey];
    if (preset && preset.defaultCorners) {
      window.AR_STATE.corners = JSON.parse(JSON.stringify(preset.defaultCorners));
    }
    updateLiveAreaEstimate();
  };

  window.arUploadRoomPhoto = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.getElementById('ar-render-canvas');
        const fc = document.createElement('canvas');
        fc.width = canvas.width;
        fc.height = canvas.height;
        const fctx = fc.getContext('2d');

        // Draw image cover
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;
        fctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);

        window.AR_STATE.frozenCanvas = fc;
        window.AR_STATE.isFrozen = true;
        window.AR_STATE.isFallback = true;
        stopCamera();
        updateHudNotice('🖼️ Custom Photo Loaded. Drag 4 corners to fit surface.');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- 12. INSTANT AR QUOTE & ORDER ENGINE ---
  window.openArQuotationSheet = function () {
    const canvas = document.getElementById('ar-render-canvas');
    const c = window.AR_STATE.corners;
    const p0 = { x: c[0].x * canvas.width, y: c[0].y * canvas.height };
    const p1 = { x: c[1].x * canvas.width, y: c[1].y * canvas.height };
    const p2 = { x: c[2].x * canvas.width, y: c[2].y * canvas.height };
    const p3 = { x: c[3].x * canvas.width, y: c[3].y * canvas.height };

    const sqft = calculateEstimatedSqft(p0, p1, p2, p3);
    const sheets = Math.ceil(sqft / 32);
    const fevicolKg = (sqft * 0.045).toFixed(1);
    const activeSwatch = AR_LAMINATES.find(l => l.id === window.AR_STATE.activeLaminateId) || AR_LAMINATES[0];

    // Populate Quote Sheet UI
    document.getElementById('ar-quote-finish-name').textContent = `${activeSwatch.name} (${activeSwatch.code})`;
    document.getElementById('ar-quote-finish-desc').textContent = `${activeSwatch.finish} • ${activeSwatch.desc}`;
    document.getElementById('ar-quote-sqft').textContent = `~${sqft} sq.ft`;
    document.getElementById('ar-quote-sheets').textContent = `${sheets} Sheets (8ft × 4ft)`;
    document.getElementById('ar-quote-fevicol').textContent = `~${fevicolKg} Kg (Fevicol Marine / SH)`;

    // Show modal sheet
    const sheet = document.getElementById('ar-quote-sheet');
    if (sheet) sheet.classList.add('active');
  };

  window.closeArQuotationSheet = function () {
    const sheet = document.getElementById('ar-quote-sheet');
    if (sheet) sheet.classList.remove('active');
  };

  window.submitArWhatsAppOrder = function () {
    const canvas = document.getElementById('ar-render-canvas');
    const c = window.AR_STATE.corners;
    const p0 = { x: c[0].x * canvas.width, y: c[0].y * canvas.height };
    const p1 = { x: c[1].x * canvas.width, y: c[1].y * canvas.height };
    const p2 = { x: c[2].x * canvas.width, y: c[2].y * canvas.height };
    const p3 = { x: c[3].x * canvas.width, y: c[3].y * canvas.height };

    const sqft = calculateEstimatedSqft(p0, p1, p2, p3);
    const sheets = Math.ceil(sqft / 32);
    const activeSwatch = AR_LAMINATES.find(l => l.id === window.AR_STATE.activeLaminateId) || AR_LAMINATES[0];
    const locality = (document.getElementById('current-location-text') || {}).innerText || 'Onda Majhpara, Bankura';

    const waMsg = 
      `Namaskar Baba Dugdheswar Enterprise! 🪵✨\n` +
      `I used the AR "Laminate on Your Wall" Visualizer on my phone:\n` +
      `  • Selected Finish: ${activeSwatch.name} (${activeSwatch.code})\n` +
      `  • Grade: ${activeSwatch.finish}\n` +
      `  • Wall / Wardrobe Area: ~${sqft} sq.ft\n` +
      `  • Required Sunmica: ${sheets} Sheets (8ft x 4ft)\n` +
      `  • Delivery Location: ${locality}\n\n` +
      `Please confirm live stock at Onda Depot and best counter rate. Dhanyabad!`;

    const waUrl = `https://wa.me/919867098952?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');
  };

  window.transferArTo3DStudio = function () {
    closeArQuotationSheet();
    closeArVisualizer();

    if (window.switchView) {
      window.switchView('simulator');
    }
    if (window.simSelectLaminate) {
      window.simSelectLaminate(window.AR_STATE.activeLaminateId);
    }
    if (window.showToast) {
      window.showToast(`Transferred finish to 3D Furniture Studio!`);
    }
  };

  // --- 13. MODAL OPEN / CLOSE LIFECYCLE ---
  window.openArVisualizer = async function (preselectedLaminateId) {
    const modal = document.getElementById('ar-visualizer-modal');
    if (!modal) return;

    window.AR_STATE.isOpen = true;
    modal.classList.add('active');

    // Resize canvas to full window
    const canvas = document.getElementById('ar-render-canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Ensure all 4 corner pins are initialized well inside the visible upper viewport
    const drawerH = (document.getElementById('ar-bottom-sheet') || {}).offsetHeight || 180;
    const safeBottom = Math.min(0.58, (window.innerHeight - drawerH - 20) / (window.innerHeight || 1));
    window.AR_STATE.corners = [
      { x: 0.20, y: 0.20 },
      { x: 0.80, y: 0.20 },
      { x: 0.80, y: safeBottom },
      { x: 0.20, y: safeBottom }
    ];

    if (preselectedLaminateId) {
      window.AR_STATE.activeLaminateId = preselectedLaminateId;
    }

    // Sync opacity UI sliders
    arSetOpacity(window.AR_STATE.opacity || 85);

    populateSwatchDrawer();
    setupInteractionListeners();

    // Start video camera
    await initCamera();

    // Start 60fps render loop
    requestAnimationFrame(renderARFrame);
  };

  window.closeArVisualizer = function () {
    window.AR_STATE.isOpen = false;
    stopCamera();
    const modal = document.getElementById('ar-visualizer-modal');
    if (modal) modal.classList.remove('active');
  };

  // Window resize handler
  window.addEventListener('resize', function () {
    if (window.AR_STATE.isOpen) {
      const canvas = document.getElementById('ar-render-canvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }
  });

  // Handle URL hash #ar
  window.addEventListener('load', function () {
    if (window.location.hash === '#ar') {
      window.openArVisualizer();
    }
  });

})();
