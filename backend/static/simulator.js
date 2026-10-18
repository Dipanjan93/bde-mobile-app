/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * 3D Furniture & Laminate Studio Simulator Engine
 * Fixed Origin (0,0,0) Three.js WebGL Interactive Studio & Real-time BOM Estimator
 * With Procedural 3D Bump & Realistic Multi-layered Texture Synthesis
 */

(function () {
  'use strict';

  // ----------------------------------------------------
  // 1. 40+ Master Laminate Catalog with Realistic Texture Profiles
  // ----------------------------------------------------
  const LAMINATE_FINISHES = {
    glossy: [
      { id: 'g1', name: 'Imperial White Gloss Lacquer', hex: '#FFFFFF', gloss: 0.95, roughness: 0.05, code: 'GL-101', pattern: 'lacquer', bumpScale: 0.01 },
      { id: 'g2', name: 'Italian Carrara Marble', hex: '#F0F2F5', gloss: 0.90, roughness: 0.08, code: 'GL-102', pattern: 'carrara_marble', bumpScale: 0.03 },
      { id: 'g3', name: 'Piano Jet Black Onyx', hex: '#111111', gloss: 0.98, roughness: 0.02, code: 'GL-103', pattern: 'black_onyx', bumpScale: 0.02 },
      { id: 'g4', name: 'High Gloss Ruby Wine', hex: '#7A1C2C', gloss: 0.92, roughness: 0.06, code: 'GL-104', pattern: 'ruby_metallic', bumpScale: 0.02 },
      { id: 'g5', name: 'Midnight Ocean Blue Resin', hex: '#0B2545', gloss: 0.93, roughness: 0.05, code: 'GL-105', pattern: 'ocean_swirl', bumpScale: 0.03 },
      { id: 'g6', name: 'Royal Emerald Green Marble', hex: '#0F4D3A', gloss: 0.90, roughness: 0.07, code: 'GL-106', pattern: 'emerald_marble', bumpScale: 0.04 },
      { id: 'g7', name: 'Champagne Metallic Shimmer', hex: '#D4AF37', gloss: 0.88, roughness: 0.10, code: 'GL-107', pattern: 'brushed_champagne', bumpScale: 0.03 },
      { id: 'g8', name: 'American Walnut High Gloss', hex: '#4A2E1B', gloss: 0.85, roughness: 0.12, code: 'GL-108', pattern: 'walnut_gloss', bumpScale: 0.04 },
      { id: 'g9', name: 'Spanish Grey Mirror Onyx', hex: '#8E9AA8', gloss: 0.94, roughness: 0.04, code: 'GL-109', pattern: 'grey_onyx', bumpScale: 0.03 },
      { id: 'g10', name: 'Rose Gold Metallic Luster', hex: '#B76E79', gloss: 0.90, roughness: 0.08, code: 'GL-110', pattern: 'rose_gold', bumpScale: 0.03 }
    ],
    matt: [
      { id: 'm1', name: 'Silk Slate Grey Matt', hex: '#4A5568', gloss: 0.10, roughness: 0.75, code: 'MT-201', pattern: 'fine_slate', bumpScale: 0.02 },
      { id: 'm2', name: 'Powder Cashmere Matt', hex: '#D8C7B5', gloss: 0.15, roughness: 0.70, code: 'MT-202', pattern: 'cashmere_stipple', bumpScale: 0.02 },
      { id: 'm3', name: 'Urban Charcoal Matt', hex: '#262626', gloss: 0.08, roughness: 0.82, code: 'MT-203', pattern: 'charcoal_matte', bumpScale: 0.02 },
      { id: 'm4', name: 'Desert Sand Warm Beige', hex: '#D2B48C', gloss: 0.12, roughness: 0.72, code: 'MT-204', pattern: 'sand_limestone', bumpScale: 0.03 },
      { id: 'm5', name: 'Nordic Sage Green Matt', hex: '#7D8C71', gloss: 0.14, roughness: 0.74, code: 'MT-205', pattern: 'sage_stipple', bumpScale: 0.02 },
      { id: 'm6', name: 'Terracotta Earth Matt', hex: '#B85D43', gloss: 0.10, roughness: 0.78, code: 'MT-206', pattern: 'clay_matte', bumpScale: 0.03 },
      { id: 'm7', name: 'Deep Indigo Blue Matt', hex: '#1E293B', gloss: 0.09, roughness: 0.80, code: 'MT-207', pattern: 'indigo_matte', bumpScale: 0.02 },
      { id: 'm8', name: 'Bone Ivory Whisper', hex: '#FAF0E6', gloss: 0.15, roughness: 0.68, code: 'MT-208', pattern: 'ivory_matte', bumpScale: 0.02 },
      { id: 'm9', name: 'Mocha Espresso Matt', hex: '#3B2F2F', gloss: 0.11, roughness: 0.76, code: 'MT-209', pattern: 'espresso_matte', bumpScale: 0.02 },
      { id: 'm10', name: 'Smoky Olive Matt', hex: '#556B2F', gloss: 0.13, roughness: 0.73, code: 'MT-210', pattern: 'olive_matte', bumpScale: 0.02 }
    ],
    textured: [
      { id: 't1', name: 'Natural Crown Teakwood', hex: '#8B5A2B', gloss: 0.35, roughness: 0.55, code: 'TX-301', pattern: 'crown_teak', bumpScale: 0.08 },
      { id: 't2', name: 'Saw-Cut Golden Pine', hex: '#C19A6B', gloss: 0.28, roughness: 0.60, code: 'TX-302', pattern: 'sawcut_pine', bumpScale: 0.09 },
      { id: 't3', name: 'Smoked Vintage Oak', hex: '#5C4033', gloss: 0.30, roughness: 0.58, code: 'TX-303', pattern: 'vintage_oak', bumpScale: 0.09 },
      { id: 't4', name: 'Woven Jute & Linen Fabric', hex: '#C2B280', gloss: 0.18, roughness: 0.85, code: 'TX-304', pattern: 'woven_linen', bumpScale: 0.08 },
      { id: 't5', name: 'Industrial Concrete Stucco', hex: '#808080', gloss: 0.15, roughness: 0.90, code: 'TX-305', pattern: 'concrete_stucco', bumpScale: 0.08 },
      { id: 't6', name: 'Brushed Bronze Patina Metal', hex: '#6E4D25', gloss: 0.45, roughness: 0.42, code: 'TX-306', pattern: 'brushed_bronze', bumpScale: 0.06 },
      { id: 't7', name: 'Silver Ashwood Relief', hex: '#A9A9A9', gloss: 0.32, roughness: 0.57, code: 'TX-307', pattern: 'ashwood_relief', bumpScale: 0.08 },
      { id: 't8', name: 'Chiseled Black Rock Slate', hex: '#1E2430', gloss: 0.22, roughness: 0.75, code: 'TX-308', pattern: 'chiseled_rock', bumpScale: 0.12 },
      { id: 't9', name: 'Raw Travertine & Banded Onyx', hex: '#E3DAC9', gloss: 0.25, roughness: 0.65, code: 'TX-309', pattern: 'banded_onyx', bumpScale: 0.07 },
      { id: 't10', name: 'Terrazzo Quartz Stone Chips', hex: '#ECE9E2', gloss: 0.24, roughness: 0.68, code: 'TX-310', pattern: 'terrazzo_chips', bumpScale: 0.07 }
    ],
    '3d': [
      { id: 'd1', name: 'Fluted Vertical Slat 3D', hex: '#7A5230', gloss: 0.40, roughness: 0.50, code: '3D-401', pattern: 'fluted_slat', bumpScale: 0.14 },
      { id: 'd2', name: 'Gold Hexagon Honeycomb 3D', hex: '#1C242D', gloss: 0.50, roughness: 0.38, code: '3D-402', pattern: 'gold_hexagon', bumpScale: 0.12 },
      { id: 'd3', name: 'Scooped Dimpled Wood Relief 3D', hex: '#CFB79E', gloss: 0.35, roughness: 0.55, code: '3D-403', pattern: 'dimpled_wood', bumpScale: 0.13 },
      { id: 'd4', name: 'Sinuous Ripple Wavefront 3D', hex: '#16A085', gloss: 0.45, roughness: 0.45, code: '3D-404', pattern: 'ripple_wave', bumpScale: 0.11 },
      { id: 'd5', name: 'Origami Diamond Prism 3D', hex: '#ECF0F1', gloss: 0.60, roughness: 0.35, code: '3D-405', pattern: 'diamond_prism', bumpScale: 0.12 },
      { id: 'd6', name: 'Chevron Parquet Herringbone 3D', hex: '#6E2C00', gloss: 0.38, roughness: 0.52, code: '3D-406', pattern: 'chevron_parquet', bumpScale: 0.10 },
      { id: 'd7', name: 'Hammered Clay Gouged Stucco 3D', hex: '#B85D43', gloss: 0.25, roughness: 0.70, code: '3D-407', pattern: 'hammered_clay', bumpScale: 0.12 },
      { id: 'd8', name: 'Crinkled Silk & Hammered Foil 3D', hex: '#D4AC0D', gloss: 0.50, roughness: 0.40, code: '3D-408', pattern: 'crinkled_foil', bumpScale: 0.11 },
      { id: 'd9', name: 'Combed Bark Wood Relief 3D', hex: '#3E2718', gloss: 0.32, roughness: 0.62, code: '3D-409', pattern: 'bark_relief', bumpScale: 0.13 },
      { id: 'd10', name: 'Acoustic Hexagon Hive 3D', hex: '#E67E22', gloss: 0.35, roughness: 0.55, code: '3D-410', pattern: 'acoustic_hive', bumpScale: 0.11 }
    ]
  };

  // ----------------------------------------------------
  // 2. Simulator State
  // ----------------------------------------------------
  const state = {
    productType: 'wardrobe', // 'wardrobe' | 'bed' | 'kitchen' | 'table' | 'sofa' | 'dressing'
    wardrobeDoors: 4, // 2, 4, 6
    productStyle: 1, // 1 to 5
    bedSize: 'Queen (5x6.5 ft)',
    kitchenLayout: 'L-Shape',
    tableShape: 'Rectangular (6-Seater)',
    sofaConfig: 'L-Shape Sectional',
    dressingModel: 'Vanity with Hollywood Lights',

    // Laminate Finish
    finishCategory: 'glossy',
    selectedFinish: LAMINATE_FINISHES.glossy[0],

    // Interaction State
    isConnectModalOpen: false
  };

  // Three.js References
  let scene = null;
  let renderer = null;
  let camera = null;
  let currentMeshGroup = null;
  let animationFrameId = null;
  let canvasContainer = null;

  // Orbit camera angles around origin (0,0,0)
  const cameraRotation = { theta: 0, phi: 0.35, radius: 7.5 };
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let initialPinchDistance = null;

  // ----------------------------------------------------
  // 3. Photorealistic Procedural Texture & Bump Generator
  // ----------------------------------------------------
  const textureCache = {};

  function getLaminateTexture(finish) {
    if (!finish) finish = LAMINATE_FINISHES.glossy[0];
    if (textureCache[finish.id]) {
      return textureCache[finish.id];
    }

    const size = 512;
    // 1. Color (Diffuse) Canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 2. Grayscale Bump Canvas
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = size;
    bumpCanvas.height = size;
    const bCtx = bumpCanvas.getContext('2d');

    // Paint pattern into both canvases
    drawLaminatePattern(ctx, bCtx, size, finish);

    let map = null;
    let bumpMap = null;
    if (window.THREE) {
      const THREE = window.THREE;
      map = new THREE.CanvasTexture(canvas);
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;

      bumpMap = new THREE.CanvasTexture(bumpCanvas);
      bumpMap.wrapS = THREE.RepeatWrapping;
      bumpMap.wrapT = THREE.RepeatWrapping;
    }

    const previewDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const bumpScale = finish.bumpScale || 0.05;

    const result = {
      canvas,
      bumpCanvas,
      map,
      bumpMap,
      previewDataUrl,
      bumpScale
    };

    textureCache[finish.id] = result;
    return result;
  }

  function drawLaminatePattern(ctx, bCtx, size, finish) {
    const p = finish.pattern;
    const hex = finish.hex;

    // Helper: Fill base background on both canvases
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    switch (p) {
      // ------------------------------------------------
      // 1. Woodgrains (Teak, Pine, Oak, Walnut, Ashwood)
      // ------------------------------------------------
      case 'crown_teak':
      case 'walnut_gloss':
      case 'vintage_oak':
      case 'sawcut_pine':
      case 'ashwood_relief': {
        const isTeak = p === 'crown_teak';
        const isPine = p === 'sawcut_pine';
        const isOak = p === 'vintage_oak';
        const darkTone = isTeak ? '#5a3517' : isOak ? '#2b1b12' : isPine ? '#916d41' : '#311a0c';
        const lightTone = isTeak ? '#b88147' : isOak ? '#8c6145' : isPine ? '#e8be89' : '#6b432a';

        // 1. Cathedral Grain Arches
        for (let i = 0; i < 9; i++) {
          const yPos = 40 + i * 55;
          const curveWidth = 60 + (i % 3) * 40;

          ctx.beginPath();
          ctx.strokeStyle = (i % 2 === 0) ? darkTone : lightTone;
          ctx.lineWidth = 3 + (i % 3);
          ctx.globalAlpha = 0.55;
          ctx.moveTo(0, yPos);
          ctx.bezierCurveTo(size * 0.35, yPos - curveWidth, size * 0.65, yPos - curveWidth, size, yPos);
          ctx.stroke();

          // Bump Map
          bCtx.beginPath();
          bCtx.strokeStyle = (i % 2 === 0) ? '#404040' : '#c0c0c0';
          bCtx.lineWidth = 3 + (i % 3);
          bCtx.globalAlpha = 0.65;
          bCtx.moveTo(0, yPos);
          bCtx.bezierCurveTo(size * 0.35, yPos - curveWidth, size * 0.65, yPos - curveWidth, size, yPos);
          bCtx.stroke();
        }

        // 2. Micro-grain linear fibers
        ctx.globalAlpha = 0.25;
        bCtx.globalAlpha = 0.35;
        for (let x = 0; x < size; x += 3) {
          const jitter = (Math.sin(x * 0.15) * 6);
          ctx.beginPath();
          ctx.strokeStyle = darkTone;
          ctx.lineWidth = 1;
          ctx.moveTo(x, 0);
          ctx.lineTo(x + jitter, size);
          ctx.stroke();

          bCtx.beginPath();
          bCtx.strokeStyle = (x % 6 === 0) ? '#303030' : '#b0b0b0';
          bCtx.lineWidth = 1;
          bCtx.moveTo(x, 0);
          bCtx.lineTo(x + jitter, size);
          bCtx.stroke();
        }

        // 3. Saw-Cut Chatter Marks (Pine)
        if (isPine) {
          ctx.globalAlpha = 0.3;
          bCtx.globalAlpha = 0.5;
          for (let y = 0; y < size; y += 18) {
            ctx.fillStyle = '#614320';
            ctx.fillRect(0, y, size, 2);
            bCtx.fillStyle = '#303030';
            bCtx.fillRect(0, y, size, 2);
          }
        }

        ctx.globalAlpha = 1.0;
        bCtx.globalAlpha = 1.0;
        break;
      }

      // ------------------------------------------------
      // 2. 3D Fluted Slat Battens (Image 1 & 4)
      // ------------------------------------------------
      case 'fluted_slat': {
        const slatCount = 16;
        const slatWidth = size / slatCount;

        for (let i = 0; i < slatCount; i++) {
          const startX = i * slatWidth;

          // Color Gradient: dark shadow -> warm wood -> bright crown highlight -> deep trough
          const grad = ctx.createLinearGradient(startX, 0, startX + slatWidth, 0);
          grad.addColorStop(0.00, '#381f0d');
          grad.addColorStop(0.18, '#70431f');
          grad.addColorStop(0.50, '#c79258');
          grad.addColorStop(0.82, '#854f24');
          grad.addColorStop(1.00, '#221206');
          ctx.fillStyle = grad;
          ctx.fillRect(startX, 0, slatWidth, size);

          // Bump Gradient: Cylindrical curved batten
          const bGrad = bCtx.createLinearGradient(startX, 0, startX + slatWidth, 0);
          bGrad.addColorStop(0.00, '#101010'); // Deep recessed groove
          bGrad.addColorStop(0.50, '#ffffff'); // Raised cylindrical crest
          bGrad.addColorStop(1.00, '#101010'); // Deep recessed groove
          bCtx.fillStyle = bGrad;
          bCtx.fillRect(startX, 0, slatWidth, size);
        }
        break;
      }

      // ------------------------------------------------
      // 3. Gold Hexagon Honeycomb Lattice (Image 4)
      // ------------------------------------------------
      case 'gold_hexagon': {
        ctx.fillStyle = '#151b24';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#181818';
        bCtx.fillRect(0, 0, size, size);

        const r = 36;
        const h = r * Math.sqrt(3);

        function drawHex(x, y, radius) {
          ctx.beginPath();
          bCtx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 3) * a;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (a === 0) {
              ctx.moveTo(px, py);
              bCtx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
              bCtx.lineTo(px, py);
            }
          }
          ctx.closePath();
          bCtx.closePath();

          ctx.strokeStyle = '#d4af37';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          bCtx.strokeStyle = '#ffffff';
          bCtx.lineWidth = 3.5;
          bCtx.stroke();
        }

        for (let row = -1; row < 10; row++) {
          for (let col = -1; col < 10; col++) {
            const cx = col * (r * 1.5);
            const cy = row * h + (col % 2 === 0 ? 0 : h / 2);
            drawHex(cx, cy, r - 3);
          }
        }
        break;
      }

      // ------------------------------------------------
      // 4. Scooped Dimpled Wood Relief (Image 1 center-top)
      // ------------------------------------------------
      case 'dimpled_wood': {
        ctx.fillStyle = '#cfb79e';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#d0d0d0';
        bCtx.fillRect(0, 0, size, size);

        const cols = 7;
        const rows = 7;
        const spacing = size / cols;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const offsetX = (r % 2 === 0) ? 0 : spacing / 2;
            const cx = c * spacing + offsetX + (Math.sin(r + c) * 6);
            const cy = r * spacing + (Math.cos(r * c) * 6);
            const rad = 24 + ((r + c) % 3) * 3;

            // Color: Inner scoop shadow top-left, bright highlight bottom-right
            const grad = ctx.createRadialGradient(cx - 7, cy - 7, 2, cx, cy, rad);
            grad.addColorStop(0.0, '#755b46');
            grad.addColorStop(0.65, '#9f826a');
            grad.addColorStop(0.90, '#e5d7c8');
            grad.addColorStop(1.0, '#cfb79e');

            ctx.beginPath();
            ctx.arc(cx, cy, rad, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Bump: Deep crater
            const bGrad = bCtx.createRadialGradient(cx, cy, 2, cx, cy, rad);
            bGrad.addColorStop(0.0, '#101010');
            bGrad.addColorStop(0.85, '#e0e0e0');
            bGrad.addColorStop(1.0, '#d0d0d0');

            bCtx.beginPath();
            bCtx.arc(cx, cy, rad, 0, Math.PI * 2);
            bCtx.fillStyle = bGrad;
            bCtx.fill();
          }
        }
        break;
      }

      // ------------------------------------------------
      // 5. Chiseled Black Rock Slate (Image 1 top-right & Image 2)
      // ------------------------------------------------
      case 'chiseled_rock': {
        ctx.fillStyle = '#1c222b';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#303030';
        bCtx.fillRect(0, 0, size, size);

        // Fractured Voronoi-like stone facets
        const points = [];
        for (let i = 0; i < 55; i++) {
          points.push({
            x: Math.random() * size,
            y: Math.random() * size,
            shade: Math.floor(25 + Math.random() * 80)
          });
        }

        // Draw rocky angular facet strokes
        points.forEach(function (pt) {
          const w = 45 + Math.random() * 65;
          const h = 30 + Math.random() * 45;

          const grad = ctx.createLinearGradient(pt.x, pt.y, pt.x + w, pt.y + h);
          grad.addColorStop(0.0, `rgb(${pt.shade + 40}, ${pt.shade + 45}, ${pt.shade + 55})`);
          grad.addColorStop(0.8, `rgb(${pt.shade}, ${pt.shade + 5}, ${pt.shade + 10})`);
          grad.addColorStop(1.0, '#0a0d11');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt.x + w, pt.y + h * 0.3);
          ctx.lineTo(pt.x + w * 0.7, pt.y + h);
          ctx.lineTo(pt.x - w * 0.3, pt.y + h * 0.8);
          ctx.closePath();
          ctx.fill();

          // Bump map: sharp rocky height
          const bGrad = bCtx.createLinearGradient(pt.x, pt.y, pt.x + w, pt.y + h);
          bGrad.addColorStop(0.0, '#ffffff');
          bGrad.addColorStop(0.5, '#707070');
          bGrad.addColorStop(1.0, '#000000');

          bCtx.fillStyle = bGrad;
          bCtx.beginPath();
          bCtx.moveTo(pt.x, pt.y);
          bCtx.lineTo(pt.x + w, pt.y + h * 0.3);
          bCtx.lineTo(pt.x + w * 0.7, pt.y + h);
          bCtx.lineTo(pt.x - w * 0.3, pt.y + h * 0.8);
          bCtx.closePath();
          bCtx.fill();
        });
        break;
      }

      // ------------------------------------------------
      // 6. Chevron Parquet Herringbone 3D (Image 4)
      // ------------------------------------------------
      case 'chevron_parquet': {
        const colWidth = size / 4;
        const blockHeight = 44;
        const woodTones = ['#6e2c00', '#934008', '#4d1e02', '#ba5a12'];

        for (let col = 0; col < 4; col++) {
          const isLeft = col % 2 === 0;
          for (let y = -blockHeight; y < size + blockHeight; y += blockHeight) {
            const tone = woodTones[(col + Math.floor(y / blockHeight)) % woodTones.length];
            const startX = col * colWidth;

            ctx.fillStyle = tone;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + colWidth, y + (isLeft ? blockHeight : -blockHeight));
            ctx.lineTo(startX + colWidth, y + (isLeft ? blockHeight * 2 : 0));
            ctx.lineTo(startX, y + (isLeft ? blockHeight : -blockHeight) + blockHeight);
            ctx.closePath();
            ctx.fill();

            // Recessed joint seam
            ctx.strokeStyle = '#220e03';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Bump
            bCtx.fillStyle = '#b0b0b0';
            bCtx.fill();
            bCtx.strokeStyle = '#101010';
            bCtx.lineWidth = 2.5;
            bCtx.stroke();
          }
        }
        break;
      }

      // ------------------------------------------------
      // 7. Woven Jute & Linen Fabric (Image 5)
      // ------------------------------------------------
      case 'woven_linen': {
        ctx.fillStyle = '#c2b280';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, size, size);

        const thread = 5;
        for (let y = 0; y < size; y += thread) {
          ctx.fillStyle = (Math.floor(y / thread) % 2 === 0) ? '#a89868' : '#d8caa0';
          ctx.fillRect(0, y, size, 2.5);
          bCtx.fillStyle = (Math.floor(y / thread) % 2 === 0) ? '#505050' : '#b0b0b0';
          bCtx.fillRect(0, y, size, 2.5);
        }
        for (let x = 0; x < size; x += thread) {
          ctx.fillStyle = (Math.floor(x / thread) % 2 === 0) ? 'rgba(92,80,52,0.45)' : 'rgba(235,225,198,0.45)';
          ctx.fillRect(x, 0, 2.5, size);
          bCtx.fillStyle = (Math.floor(x / thread) % 2 === 0) ? 'rgba(30,30,30,0.5)' : 'rgba(220,220,220,0.5)';
          bCtx.fillRect(x, 0, 2.5, size);
        }
        break;
      }

      // ------------------------------------------------
      // 8. Terrazzo Stone Chips (Image 2 top-left)
      // ------------------------------------------------
      case 'terrazzo_chips': {
        ctx.fillStyle = '#ece9e2';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#909090';
        bCtx.fillRect(0, 0, size, size);

        const chipColors = ['#1e293b', '#b45309', '#d97706', '#64748b', '#78350f', '#0f172a'];
        for (let i = 0; i < 90; i++) {
          const cx = Math.random() * size;
          const cy = Math.random() * size;
          const rad = 4 + Math.random() * 16;
          const color = chipColors[Math.floor(Math.random() * chipColors.length)];

          ctx.fillStyle = color;
          ctx.beginPath();
          const sides = 4 + Math.floor(Math.random() * 3);
          for (let s = 0; s < sides; s++) {
            const angle = (Math.PI * 2 / sides) * s;
            const px = cx + rad * Math.cos(angle) * (0.7 + Math.random() * 0.6);
            const py = cy + rad * Math.sin(angle) * (0.7 + Math.random() * 0.6);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();

          // Bump elevation
          bCtx.fillStyle = '#d0d0d0';
          bCtx.fill();
        }
        break;
      }

      // ------------------------------------------------
      // 9. Italian Carrara & Emerald Marble (Image 4)
      // ------------------------------------------------
      case 'carrara_marble':
      case 'emerald_marble':
      case 'black_onyx':
      case 'grey_onyx': {
        const isWhite = p === 'carrara_marble';
        const isEmerald = p === 'emerald_marble';
        const isBlack = p === 'black_onyx';

        ctx.fillStyle = isWhite ? '#f8fafc' : isEmerald ? '#093628' : isBlack ? '#111111' : '#8e9aa8';
        ctx.fillRect(0, 0, size, size);

        const veinColor = isWhite ? 'rgba(100,116,139,0.5)' : isEmerald ? 'rgba(240,240,240,0.6)' : isBlack ? 'rgba(212,175,55,0.7)' : 'rgba(245,245,245,0.65)';
        const smokyColor = isWhite ? 'rgba(148,163,184,0.18)' : isEmerald ? 'rgba(2,26,19,0.35)' : isBlack ? 'rgba(40,40,40,0.35)' : 'rgba(70,80,95,0.25)';

        // Smoky cloudy patches
        for (let s = 0; s < 8; s++) {
          const sx = Math.random() * size;
          const sy = Math.random() * size;
          const sGrad = ctx.createRadialGradient(sx, sy, 10, sx, sy, 140);
          sGrad.addColorStop(0, smokyColor);
          sGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = sGrad;
          ctx.fillRect(0, 0, size, size);
        }

        // Branching Veins
        function drawVein(startX, startY, len, angle, width) {
          ctx.beginPath();
          bCtx.beginPath();
          ctx.strokeStyle = veinColor;
          bCtx.strokeStyle = isWhite ? '#404040' : '#e0e0e0';
          ctx.lineWidth = width;
          bCtx.lineWidth = width;

          let cx = startX;
          let cy = startY;
          ctx.moveTo(cx, cy);
          bCtx.moveTo(cx, cy);

          for (let step = 0; step < len; step++) {
            cx += Math.cos(angle) * 8 + (Math.random() - 0.5) * 6;
            cy += Math.sin(angle) * 8 + (Math.random() - 0.5) * 6;
            ctx.lineTo(cx, cy);
            bCtx.lineTo(cx, cy);

            if (Math.random() < 0.15 && width > 1) {
              drawVein(cx, cy, Math.floor(len * 0.4), angle + (Math.random() - 0.5) * 1.2, width * 0.6);
            }
          }
          ctx.stroke();
          bCtx.stroke();
        }

        drawVein(20, 40, 50, Math.PI * 0.25, 3.5);
        drawVein(120, 0, 45, Math.PI * 0.32, 2.5);
        drawVein(0, 220, 40, Math.PI * 0.20, 2.8);
        drawVein(size * 0.4, 0, 48, Math.PI * 0.35, 3.0);
        break;
      }

      // ------------------------------------------------
      // 10. Raw Travertine & Banded Onyx (Image 2 center)
      // ------------------------------------------------
      case 'banded_onyx': {
        const bands = ['#e8ded1', '#c7ab91', '#f3ede4', '#9e8065', '#d9c5b2', '#7a604a'];
        for (let y = 0; y < size; y += 14) {
          const col = bands[Math.floor(y / 14) % bands.length];
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x <= size; x += 40) {
            const wave = Math.sin(x * 0.02 + y * 0.05) * 12;
            ctx.lineTo(x, y + wave);
          }
          ctx.lineTo(size, y + 25);
          ctx.lineTo(0, y + 25);
          ctx.closePath();
          ctx.fill();

          // Bump Map
          bCtx.fillStyle = (Math.floor(y / 14) % 2 === 0) ? '#b0b0b0' : '#606060';
          bCtx.fill();
        }
        break;
      }

      // ------------------------------------------------
      // 11. Combed Bark Wood Relief 3D (Image 1 top-left & bottom-right)
      // ------------------------------------------------
      case 'bark_relief': {
        ctx.fillStyle = '#3e2718';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#404040';
        bCtx.fillRect(0, 0, size, size);

        for (let x = 0; x < size; x += 8) {
          const isFissure = x % 24 === 0;
          ctx.beginPath();
          bCtx.beginPath();
          ctx.strokeStyle = isFissure ? '#1a0f08' : '#784725';
          bCtx.strokeStyle = isFissure ? '#000000' : '#ffffff';
          ctx.lineWidth = isFissure ? 4 : 2;
          bCtx.lineWidth = isFissure ? 4 : 2;

          ctx.moveTo(x, 0);
          bCtx.moveTo(x, 0);
          for (let y = 0; y <= size; y += 20) {
            const wX = x + Math.sin(y * 0.04) * 4;
            ctx.lineTo(wX, y);
            bCtx.lineTo(wX, y);
          }
          ctx.stroke();
          bCtx.stroke();
        }
        break;
      }

      // ------------------------------------------------
      // 12. Crinkled Silk & Hammered Foil 3D (Image 5 top-left)
      // ------------------------------------------------
      case 'crinkled_foil': {
        ctx.fillStyle = '#d4ac0d';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, size, size);

        for (let k = 0; k < 60; k++) {
          const x1 = Math.random() * size;
          const y1 = Math.random() * size;
          const x2 = x1 + (Math.random() - 0.5) * 120;
          const y2 = y1 + (Math.random() - 0.5) * 120;

          ctx.beginPath();
          bCtx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          bCtx.moveTo(x1, y1);
          bCtx.lineTo(x2, y2);

          ctx.strokeStyle = (k % 2 === 0) ? '#fff275' : '#735c03';
          bCtx.strokeStyle = (k % 2 === 0) ? '#ffffff' : '#101010';
          ctx.lineWidth = 2.5;
          bCtx.lineWidth = 2.5;
          ctx.stroke();
          bCtx.stroke();
        }
        break;
      }

      // ------------------------------------------------
      // 13. Hammered Clay Gouged Stucco 3D (Image 1 center-right)
      // ------------------------------------------------
      case 'hammered_clay': {
        ctx.fillStyle = '#b85d43';
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#707070';
        bCtx.fillRect(0, 0, size, size);

        for (let k = 0; k < 50; k++) {
          const cx = Math.random() * size;
          const cy = Math.random() * size;
          const rad = 18 + Math.random() * 26;

          const grad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, rad);
          grad.addColorStop(0, '#662817');
          grad.addColorStop(0.7, '#a34830');
          grad.addColorStop(1, '#e3846b');

          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          const bGrad = bCtx.createRadialGradient(cx, cy, 2, cx, cy, rad);
          bGrad.addColorStop(0, '#101010');
          bGrad.addColorStop(0.8, '#e0e0e0');
          bGrad.addColorStop(1, '#808080');

          bCtx.beginPath();
          bCtx.arc(cx, cy, rad, 0, Math.PI * 2);
          bCtx.fillStyle = bGrad;
          bCtx.fill();
        }
        break;
      }

      // ------------------------------------------------
      // Default: Clean Subtle Micro-stipple (Matt / Solids)
      // ------------------------------------------------
      default: {
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, size, size);
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, size, size);

        // Add fine micro-texture stipple
        ctx.globalAlpha = 0.08;
        bCtx.globalAlpha = 0.15;
        for (let y = 0; y < size; y += 4) {
          for (let x = 0; x < size; x += 4) {
            if ((x + y) % 3 === 0) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(x, y, 2, 2);
              bCtx.fillStyle = '#ffffff';
              bCtx.fillRect(x, y, 2, 2);
            } else if ((x + y) % 5 === 0) {
              ctx.fillStyle = '#000000';
              ctx.fillRect(x, y, 2, 2);
              bCtx.fillStyle = '#000000';
              bCtx.fillRect(x, y, 2, 2);
            }
          }
        }
        ctx.globalAlpha = 1.0;
        bCtx.globalAlpha = 1.0;
        break;
      }
    }
  }

  // ----------------------------------------------------
  // 4. Mathematical Bill of Materials (BOM) Calculator
  // ----------------------------------------------------
  function calculateBOM() {
    let ply18mmSheets = 6;
    let ply12mmSheets = 3;
    let laminateFaceSheets = 4;
    let laminateBackerSheets = 3;
    let hingesPairs = 8;
    let drawerChannels = 4;
    let edgeBandMeters = 35;
    let fevicolKg = 10;
    let carpenterDays = 6;

    if (state.productType === 'wardrobe') {
      const factor = state.wardrobeDoors / 2;
      ply18mmSheets = Math.round(5 * factor);
      ply12mmSheets = Math.round(3 * factor);
      laminateFaceSheets = Math.round(3.5 * factor);
      laminateBackerSheets = Math.round(2.5 * factor);
      hingesPairs = state.wardrobeDoors * 4;
      drawerChannels = state.wardrobeDoors * 2;
      edgeBandMeters = Math.round(30 * factor);
      fevicolKg = Math.round(8 * factor);
      carpenterDays = Math.round(4 * factor);
    } else if (state.productType === 'bed') {
      const sizeMult = state.bedSize.includes('King') ? 1.25 : state.bedSize.includes('Queen') ? 1.0 : 0.7;
      ply18mmSheets = Math.round(7 * sizeMult);
      ply12mmSheets = Math.round(4 * sizeMult);
      laminateFaceSheets = Math.round(4 * sizeMult);
      laminateBackerSheets = Math.round(3 * sizeMult);
      hingesPairs = 4; // Hydraulic lift kit
      drawerChannels = 2;
      edgeBandMeters = 28;
      fevicolKg = 12;
      carpenterDays = 5;
    } else if (state.productType === 'kitchen') {
      const kMult = state.kitchenLayout === 'U-Shape' ? 1.6 : state.kitchenLayout === 'L-Shape' ? 1.2 : 0.9;
      ply18mmSheets = Math.round(10 * kMult);
      ply12mmSheets = Math.round(6 * kMult);
      laminateFaceSheets = Math.round(8 * kMult);
      laminateBackerSheets = Math.round(6 * kMult);
      hingesPairs = Math.round(18 * kMult);
      drawerChannels = Math.round(8 * kMult);
      edgeBandMeters = Math.round(55 * kMult);
      fevicolKg = 18;
      carpenterDays = 10;
    } else if (state.productType === 'table') {
      ply18mmSheets = 3;
      ply12mmSheets = 1;
      laminateFaceSheets = 2;
      laminateBackerSheets = 1;
      hingesPairs = 0;
      drawerChannels = 2;
      edgeBandMeters = 16;
      fevicolKg = 4;
      carpenterDays = 3;
    } else if (state.productType === 'sofa') {
      ply18mmSheets = 5;
      ply12mmSheets = 2;
      laminateFaceSheets = 2;
      laminateBackerSheets = 1;
      hingesPairs = 0;
      drawerChannels = 0;
      edgeBandMeters = 10;
      fevicolKg = 6;
      carpenterDays = 5;
    } else if (state.productType === 'dressing') {
      ply18mmSheets = 4;
      ply12mmSheets = 2;
      laminateFaceSheets = 3;
      laminateBackerSheets = 2;
      hingesPairs = 6;
      drawerChannels = 3;
      edgeBandMeters = 22;
      fevicolKg = 6;
      carpenterDays = 4;
    }

    return {
      ply18mmSheets,
      ply12mmSheets,
      totalPlySheets: ply18mmSheets + ply12mmSheets,
      laminateFaceSheets,
      laminateBackerSheets,
      totalLaminateSheets: laminateFaceSheets + laminateBackerSheets,
      hingesPairs,
      drawerChannels,
      edgeBandMeters,
      fevicolKg,
      carpenterDays
    };
  }

  // ----------------------------------------------------
  // 6. Three.js Scene Setup & Fixed Origin (0,0,0) Orbit
  // ----------------------------------------------------
  function updateCameraPosition() {
    if (!camera) return;
    cameraRotation.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraRotation.phi));
    camera.position.x = cameraRotation.radius * Math.sin(cameraRotation.theta) * Math.cos(cameraRotation.phi);
    camera.position.y = cameraRotation.radius * Math.sin(cameraRotation.phi);
    camera.position.z = cameraRotation.radius * Math.cos(cameraRotation.theta) * Math.cos(cameraRotation.phi);
    camera.lookAt(0, 0, 0);
  }

  function initThreeScene() {
    canvasContainer = document.getElementById('sim-three-container');
    if (!canvasContainer) return;

    if (!window.THREE) {
      setTimeout(initThreeScene, 200);
      return;
    }

    const THREE = window.THREE;
    const width = canvasContainer.clientWidth || 700;
    const height = canvasContainer.clientHeight || 480;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a202c); // sleek studio dark slate

    // 2. Camera centered on origin (0,0,0)
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRotation.theta = 0;
    cameraRotation.phi = 0.35;
    cameraRotation.radius = 7.5;
    updateCameraPosition();

    // 3. WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
    }

    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(renderer.domElement);
    renderer.domElement.className = 'sim-three-canvas';

    // 4. Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(6, 10, 6);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffd600, 0.45); // Warm golden rim accent
    dirLight2.position.set(-6, 4, -4);
    scene.add(dirLight2);

    // 5. Studio Pedestal / Floor Grid at coordinate (0, 0, 0)
    const floorGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.1, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.55;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular Gold Glow Ring
    const ringGeo = new THREE.RingGeometry(4.45, 4.55, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd600, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.49;
    scene.add(ring);

    // Studio Coordinate Grid
    const grid = new THREE.GridHelper(9, 18, 0xffd600, 0x374151);
    grid.position.y = -1.49;
    scene.add(grid);

    // 6. Fixed Origin Drag & Touch Orbit Listeners
    const dom = renderer.domElement;

    // Mouse drag
    dom.addEventListener('mousedown', function (e) {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraRotation.theta -= deltaX * 0.008;
      cameraRotation.phi += deltaY * 0.008;
      updateCameraPosition();

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Mouse Wheel Zoom
    dom.addEventListener('wheel', function (e) {
      e.preventDefault();
      cameraRotation.radius = Math.max(3.8, Math.min(13.0, cameraRotation.radius + e.deltaY * 0.006));
      updateCameraPosition();
    }, { passive: false });

    // Touch Support for Mobile / Android
    dom.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        cameraRotation.theta -= deltaX * 0.01;
        cameraRotation.phi += deltaY * 0.01;
        updateCameraPosition();

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && initialPinchDistance) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = initialPinchDistance - currentDistance;
        cameraRotation.radius = Math.max(3.8, Math.min(13.0, cameraRotation.radius + diff * 0.015));
        updateCameraPosition();
        initialPinchDistance = currentDistance;
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
      initialPinchDistance = null;
    }, { passive: true });

    // Window Resize Observer
    window.addEventListener('resize', handleCanvasResize);

    // Animation Loop
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
    animate();

    // Render Initial Model
    rebuild3DModel();
  }

  function handleCanvasResize() {
    if (!canvasContainer || !renderer || !camera) return;
    const newW = canvasContainer.clientWidth;
    const newH = canvasContainer.clientHeight;
    if (newW > 0 && newH > 0) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }
  }

  // ----------------------------------------------------
  // 7. Dynamic 3D Model Generator with Procedural Bump Materials
  // ----------------------------------------------------
  function rebuild3DModel() {
    if (!scene || !window.THREE) return;
    const THREE = window.THREE;

    // Dispose old mesh group
    if (currentMeshGroup) {
      scene.remove(currentMeshGroup);
      currentMeshGroup.traverse(function (child) {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(function (m) { m.dispose(); });
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      currentMeshGroup = null;
    }

    const group = new THREE.Group();
    currentMeshGroup = group;

    // Generated Procedural Texture & Bump Map
    const texData = getLaminateTexture(state.selectedFinish);

    // Selected Laminate Material Properties with true 3D surface depth
    const laminateMat = new THREE.MeshStandardMaterial({
      map: texData.map,
      bumpMap: texData.bumpMap,
      bumpScale: texData.bumpScale || 0.08,
      roughness: state.selectedFinish.roughness,
      metalness: state.selectedFinish.pattern.includes('metallic') || state.selectedFinish.pattern.includes('gold') ? 0.65 : 0.05
    });

    const carcassMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.65
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.18
    });

    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xeef2f7,
      metalness: 0.96,
      roughness: 0.02
    });

    // --------------------------------------------------
    // BUILD 3D PRODUCT MODEL
    // --------------------------------------------------
    if (state.productType === 'wardrobe') {
        const width = state.wardrobeDoors === 2 ? 1.8 : state.wardrobeDoors === 4 ? 3.2 : 4.4;
        const height = 3.2;
        const depth = 1.0;

        // Main Carcass Body
        const carcassGeo = new THREE.BoxGeometry(width, height, depth);
        const carcassMesh = new THREE.Mesh(carcassGeo, carcassMat);
        carcassMesh.position.y = 0.1;
        carcassMesh.castShadow = true;
        carcassMesh.receiveShadow = true;
        group.add(carcassMesh);

        // Individual Doors
        const doorWidth = width / state.wardrobeDoors;
        const doorDepth = 0.08;
        for (let i = 0; i < state.wardrobeDoors; i++) {
          const doorGeo = new THREE.BoxGeometry(doorWidth - 0.02, height - 0.06, doorDepth);
          const isMirror = state.productStyle === 2 && (i === 1 || i === state.wardrobeDoors - 2);
          const doorMesh = new THREE.Mesh(doorGeo, isMirror ? mirrorMat : laminateMat);

          const xPos = -width / 2 + doorWidth / 2 + i * doorWidth;
          doorMesh.position.set(xPos, 0.1, depth / 2 + doorDepth / 2 + 0.01);
          doorMesh.castShadow = true;
          group.add(doorMesh);

          // Designer Door Handle
          const handleGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.42, 16);
          const handleMesh = new THREE.Mesh(handleGeo, goldTrimMat);
          const handleX = i % 2 === 0 ? xPos + doorWidth / 2 - 0.08 : xPos - doorWidth / 2 + 0.08;
          handleMesh.position.set(handleX, 0.1, depth / 2 + doorDepth + 0.03);
          group.add(handleMesh);
        }

        // Style Variations
        if (state.productStyle === 3) {
          // 3D Fluted Slats Accent
          for (let s = -width / 2 + 0.06; s < width / 2; s += 0.12) {
            const slatGeo = new THREE.BoxGeometry(0.035, height - 0.1, 0.03);
            const slatMesh = new THREE.Mesh(slatGeo, goldTrimMat);
            slatMesh.position.set(s, 0.1, depth / 2 + doorDepth + 0.025);
            group.add(slatMesh);
          }
        } else if (state.productStyle === 4) {
          // Shaker Trim Frame
          const trimTop = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.1, depth + 0.04), goldTrimMat);
          trimTop.position.set(0, height / 2 + 0.15, 0);
          group.add(trimTop);
        } else if (state.productStyle === 5) {
          // Top Loft Storage Unit
          const loftGeo = new THREE.BoxGeometry(width, 0.75, depth);
          const loftMesh = new THREE.Mesh(loftGeo, laminateMat);
          loftMesh.position.set(0, height / 2 + 0.48, 0);
          loftMesh.castShadow = true;
          group.add(loftMesh);
        }
      } else if (state.productType === 'bed') {
        const bedW = state.bedSize.includes('King') ? 3.2 : state.bedSize.includes('Queen') ? 2.6 : 1.8;
        const bedL = 3.6;
        const baseH = 0.7;

        // Base frame platform
        const baseGeo = new THREE.BoxGeometry(bedW, baseH, bedL);
        const baseMesh = new THREE.Mesh(baseGeo, laminateMat);
        baseMesh.position.set(0, -1.5 + baseH / 2, 0);
        baseMesh.castShadow = true;
        group.add(baseMesh);

        // Mattress
        const matGeo = new THREE.BoxGeometry(bedW - 0.1, 0.4, bedL - 0.1);
        const matMesh = new THREE.Mesh(matGeo, new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9 }));
        matMesh.position.set(0, -1.5 + baseH + 0.2, 0);
        group.add(matMesh);

        // Headboard
        const headH = state.productStyle === 3 ? 2.6 : 1.8;
        const headGeo = new THREE.BoxGeometry(bedW + 0.3, headH, 0.2);
        const headMesh = new THREE.Mesh(headGeo, state.productStyle === 3 ? goldTrimMat : laminateMat);
        headMesh.position.set(0, -1.5 + headH / 2, -bedL / 2 + 0.1);
        headMesh.castShadow = true;
        group.add(headMesh);

        // Accent Pillows
        const pillowGeo = new THREE.BoxGeometry(0.8, 0.15, 0.5);
        const p1 = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xffd600 }));
        p1.position.set(-bedW / 4, -1.5 + baseH + 0.45, -bedL / 2 + 0.6);
        group.add(p1);

        const p2 = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xffd600 }));
        p2.position.set(bedW / 4, -1.5 + baseH + 0.45, -bedL / 2 + 0.6);
        group.add(p2);
      } else if (state.productType === 'kitchen') {
        const counterH = 1.2;
        const counterD = 1.0;

        // Base Cabinets
        const baseGeo = new THREE.BoxGeometry(3.6, counterH, counterD);
        const baseMesh = new THREE.Mesh(baseGeo, laminateMat);
        baseMesh.position.set(0, -1.5 + counterH / 2, 0);
        baseMesh.castShadow = true;
        group.add(baseMesh);

        // Quartz / Granite Countertop
        const topGeo = new THREE.BoxGeometry(3.7, 0.1, counterD + 0.1);
        const topMesh = new THREE.Mesh(topGeo, mirrorMat);
        topMesh.position.set(0, -1.5 + counterH + 0.05, 0);
        group.add(topMesh);

        // Overhead Cabinets
        const overGeo = new THREE.BoxGeometry(3.6, 1.0, 0.6);
        const overMesh = new THREE.Mesh(overGeo, laminateMat);
        overMesh.position.set(0, 0.9, -0.2);
        overMesh.castShadow = true;
        group.add(overMesh);

        // Chimney Hood Accent
        const hoodGeo = new THREE.BoxGeometry(1.0, 0.7, 0.7);
        const hoodMesh = new THREE.Mesh(hoodGeo, new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 }));
        hoodMesh.position.set(0, 0.75, -0.15);
        group.add(hoodMesh);

        // Layout arm: L-Shape, U-Shape or Parallel
        if (state.kitchenLayout === 'L-Shape' || state.kitchenLayout === 'U-Shape') {
          const lGeo = new THREE.BoxGeometry(1.0, counterH, 2.4);
          const lMesh = new THREE.Mesh(lGeo, laminateMat);
          lMesh.position.set(1.8 - 0.5, -1.5 + counterH / 2, 1.2);
          group.add(lMesh);

          const lTopGeo = new THREE.BoxGeometry(1.1, 0.1, 2.5);
          const lTopMesh = new THREE.Mesh(lTopGeo, mirrorMat);
          lTopMesh.position.set(1.8 - 0.5, -1.5 + counterH + 0.05, 1.2);
          group.add(lTopMesh);
        }
        if (state.kitchenLayout === 'U-Shape') {
          const uGeo = new THREE.BoxGeometry(1.0, counterH, 2.4);
          const uMesh = new THREE.Mesh(uGeo, laminateMat);
          uMesh.position.set(-1.8 + 0.5, -1.5 + counterH / 2, 1.2);
          group.add(uMesh);

          const uTopGeo = new THREE.BoxGeometry(1.1, 0.1, 2.5);
          const uTopMesh = new THREE.Mesh(uTopGeo, mirrorMat);
          uTopMesh.position.set(-1.8 + 0.5, -1.5 + counterH + 0.05, 1.2);
          group.add(uTopMesh);
        }
      } else if (state.productType === 'table') {
        const tableH = 1.2;
        let topMesh;

        if (state.tableShape.includes('Round')) {
          const cylGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 32);
          topMesh = new THREE.Mesh(cylGeo, laminateMat);
        } else {
          const rectGeo = new THREE.BoxGeometry(3.2, 0.1, 1.8);
          topMesh = new THREE.Mesh(rectGeo, laminateMat);
        }
        topMesh.position.set(0, -1.5 + tableH, 0);
        topMesh.castShadow = true;
        group.add(topMesh);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.06, 0.04, tableH - 0.1, 16);
        const legOffsets = [
          [-1.3, -0.7],
          [1.3, -0.7],
          [-1.3, 0.7],
          [1.3, 0.7]
        ];
        legOffsets.forEach(function (off) {
          const leg = new THREE.Mesh(legGeo, goldTrimMat);
          leg.position.set(off[0], -1.5 + (tableH - 0.1) / 2, off[1]);
          leg.castShadow = true;
          group.add(leg);
        });
      } else if (state.productType === 'sofa') {
        const seatGeo = new THREE.BoxGeometry(3.0, 0.5, 1.2);
        const seatMesh = new THREE.Mesh(seatGeo, laminateMat);
        seatMesh.position.set(0, -1.5 + 0.45, 0);
        group.add(seatMesh);

        const backGeo = new THREE.BoxGeometry(3.0, 1.0, 0.3);
        const backMesh = new THREE.Mesh(backGeo, laminateMat);
        backMesh.position.set(0, -1.5 + 0.9, -0.45);
        group.add(backMesh);

        const armGeo = new THREE.BoxGeometry(0.3, 0.8, 1.2);
        const armL = new THREE.Mesh(armGeo, goldTrimMat);
        armL.position.set(-1.6, -1.5 + 0.6, 0);
        group.add(armL);

        const armR = new THREE.Mesh(armGeo, goldTrimMat);
        armR.position.set(1.6, -1.5 + 0.6, 0);
        group.add(armR);
      } else if (state.productType === 'dressing') {
        const baseH = 1.0;
        const baseGeo = new THREE.BoxGeometry(2.0, baseH, 0.8);
        const baseMesh = new THREE.Mesh(baseGeo, laminateMat);
        baseMesh.position.set(0, -1.5 + baseH / 2, 0);
        group.add(baseMesh);

        const mirGeo = new THREE.BoxGeometry(1.6, 2.0, 0.05);
        const mirMesh = new THREE.Mesh(mirGeo, mirrorMat);
        mirMesh.position.set(0, -1.5 + baseH + 1.0, -0.35);
        group.add(mirMesh);

        const archGeo = new THREE.BoxGeometry(1.7, 2.1, 0.03);
        const archMesh = new THREE.Mesh(archGeo, goldTrimMat);
        archMesh.position.set(0, -1.5 + baseH + 1.0, -0.37);
        group.add(archMesh);
      }

    scene.add(group);
  }

  // ----------------------------------------------------
  // 8. UI Rendering & DOM Updates
  // ----------------------------------------------------
  function renderSimulator() {
    const bom = calculateBOM();
    const texData = getLaminateTexture(state.selectedFinish);

    // 1. Update Top Left Viewport Badge
    const badgeTitleEl = document.getElementById('sim-badge-title');
    if (badgeTitleEl) {
      const prodName = state.productType.toUpperCase();
      const extra = state.productType === 'wardrobe' ? ` (${state.wardrobeDoors}-DOOR)` : '';
      badgeTitleEl.textContent = `${prodName}${extra}`;
    }

    // 2. Update Bottom Left Viewport Badge with Real Texture Thumbnail
    const finishBoxEl = document.getElementById('sim-mini-swatch-box');
    const finishNameEl = document.getElementById('sim-mini-finish-name');
    const finishCodeEl = document.getElementById('sim-mini-finish-code');
    if (finishBoxEl) {
      finishBoxEl.style.backgroundColor = state.selectedFinish.hex;
      if (texData && texData.previewDataUrl) {
        finishBoxEl.style.backgroundImage = `url('${texData.previewDataUrl}')`;
      }
    }
    if (finishNameEl) finishNameEl.textContent = state.selectedFinish.name;
    if (finishCodeEl) finishCodeEl.textContent = `${state.finishCategory.toUpperCase()} • ${state.selectedFinish.code}`;

    // 3. Update Product Type Buttons & Active Sub-options
    const prodButtons = document.querySelectorAll('.sim-prod-btn');
    prodButtons.forEach(function (btn) {
      const pType = btn.getAttribute('data-prod');
      if (pType === state.productType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    ['wardrobe', 'bed', 'kitchen', 'table', 'sofa', 'dressing'].forEach(function (pt) {
      const subSec = document.getElementById(`sim-subopt-${pt}`);
      if (subSec) subSec.style.display = (pt === state.productType) ? 'grid' : 'none';
    });

    if (state.productType === 'wardrobe') {
      [2, 4, 6].forEach(function (d) {
        const dBtn = document.getElementById(`sim-btn-doors-${d}`);
        if (dBtn) {
          if (d === state.wardrobeDoors) {
            dBtn.classList.add('active');
          } else {
            dBtn.classList.remove('active');
          }
        }
      });
    }

    // 5. Update 4 Category Swatch Tabs
    ['glossy', 'matt', 'textured', '3d'].forEach(function (cat) {
      const catBtn = document.getElementById(`sim-cat-btn-${cat}`);
      if (catBtn) {
        if (cat === state.finishCategory) {
          catBtn.classList.add('active');
        } else {
          catBtn.classList.remove('active');
        }
      }
    });

    // Render 10 Swatches Grid with Real Texture Previews
    renderSwatchesGrid();

    // Update Applied Banner
    const appNameEl = document.getElementById('sim-applied-finish-name');
    const appCodeEl = document.getElementById('sim-applied-finish-code');
    if (appNameEl) appNameEl.textContent = state.selectedFinish.name;
    if (appCodeEl) appCodeEl.textContent = state.selectedFinish.code;

    // 6. Update BOM Matrix Values
    const b18El = document.getElementById('sim-bom-ply18');
    const b12El = document.getElementById('sim-bom-ply12');
    const bLamEl = document.getElementById('sim-bom-laminate');
    const bLamCodeEl = document.getElementById('sim-bom-laminate-code');
    const bHingesEl = document.getElementById('sim-bom-hinges');
    const bChannelsEl = document.getElementById('sim-bom-channels');
    const bEdgeEl = document.getElementById('sim-bom-edgeband');
    const bLaborEl = document.getElementById('sim-bom-labor-days');

    if (b18El) b18El.textContent = bom.ply18mmSheets;
    if (b12El) b12El.textContent = bom.ply12mmSheets;
    if (bLamEl) bLamEl.textContent = bom.totalLaminateSheets;
    if (bLamCodeEl) bLamCodeEl.textContent = `Sheets (${state.selectedFinish.code})`;
    if (bHingesEl) bHingesEl.textContent = bom.hingesPairs;
    if (bChannelsEl) bChannelsEl.textContent = bom.drawerChannels;
    if (bEdgeEl) bEdgeEl.textContent = bom.edgeBandMeters;
    if (bLaborEl) bLaborEl.textContent = `~${bom.carpenterDays} Working Days`;
  }

  function renderSwatchesGrid() {
    const swatchesContainer = document.getElementById('sim-swatches-grid');
    if (!swatchesContainer) return;

    const list = LAMINATE_FINISHES[state.finishCategory] || [];
    let html = '';

    list.forEach(function (item) {
      const isSelected = item.id === state.selectedFinish.id;
      const checkColor = item.roughness < 0.25 && item.hex.toLowerCase() !== '#111111' ? '#1e3a8a' : '#ffffff';
      const itemTex = getLaminateTexture(item);

      html += `
        <button class="sim-swatch-item-btn ${isSelected ? 'selected' : ''}" onclick="window.simSelectFinish('${item.id}')" title="${item.name} (${item.code})">
          <div class="sim-swatch-preview-square" style="background-color: ${item.hex}; background-image: url('${itemTex.previewDataUrl}');">
            ${isSelected ? `<span class="sim-swatch-check" style="color: ${checkColor};">✓</span>` : ''}
          </div>
          <span class="sim-swatch-code-label">${item.code}</span>
        </button>
      `;
    });

    swatchesContainer.innerHTML = html;
  }

  // ----------------------------------------------------
  // 9. Public Interaction Methods (Attached to window)
  // ----------------------------------------------------
  window.simSetStudioMode = function () {};

  window.simSetProductType = function (pType) {
    state.productType = pType;
    state.productStyle = 1;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetWardrobeDoors = function (doors) {
    state.wardrobeDoors = parseInt(doors, 10);
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetProductStyle = function (styleVal) {
    state.productStyle = parseInt(styleVal, 10);
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetBedSize = function (size) {
    state.bedSize = size;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetKitchenLayout = function (layout) {
    state.kitchenLayout = layout;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetTableShape = function (shape) {
    state.tableShape = shape;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetSofaConfig = function (cfg) {
    state.sofaConfig = cfg;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetDressingModel = function (model) {
    state.dressingModel = model;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetRoomType = function () {};
  window.simSetRoomDim = function () {};
  window.simSetRoomPreset = function () {};
  window.simToggleRoomItem = function () {};

  window.simSetFinishCategory = function (cat) {
    state.finishCategory = cat;
    if (LAMINATE_FINISHES[cat] && LAMINATE_FINISHES[cat].length > 0) {
      state.selectedFinish = LAMINATE_FINISHES[cat][0];
    }
    renderSimulator();
    rebuild3DModel();
  };

  window.simSelectFinish = function (finishId) {
    const list = LAMINATE_FINISHES[state.finishCategory] || [];
    const found = list.find(function (f) { return f.id === finishId; });
    if (found) {
      state.selectedFinish = found;
      renderSimulator();
      rebuild3DModel();
    }
  };

  window.simResetCamera = function () {
    cameraRotation.theta = 0;
    cameraRotation.phi = 0.35;
    cameraRotation.radius = 7.5;
    updateCameraPosition();
  };

  // WhatsApp Pre-filled Lead Message
  window.simSendWhatsApp = function () {
    const bom = calculateBOM();
    const productName = state.productType.toUpperCase() + (state.productType === 'wardrobe' ? ` (${state.wardrobeDoors}-Door)` : '');

    const text = encodeURIComponent(
      `*Baba Dugdheswar Enterprise — 3D Studio Estimate*\n` +
      `(Plywood, Hardware & Complete Interior Solutions)\n` +
      `Product: ${productName}\n` +
      `Selected 3D Finish: ${state.selectedFinish.name} (${state.selectedFinish.code})\n` +
      `Calculated Product Requirement:\n` +
      `• 18mm Plywood (8×4 ft): ${bom.ply18mmSheets} Sheets\n` +
      `• 12mm Internal Ply (8×4 ft): ${bom.ply12mmSheets} Sheets\n` +
      `• Total Laminates: ${bom.totalLaminateSheets} Sheets (${state.selectedFinish.code})\n` +
      `• Soft-Close Hydraulic Hinges: ${bom.hingesPairs} Pairs\n` +
      `• Telescopic Drawer Channels: ${bom.drawerChannels} Sets\n` +
      `• PVC Edge Banding: ${bom.edgeBandMeters} Meters\n` +
      `• Estimated Carpenter Labor: ~${bom.carpenterDays} Working Days\n` +
      `Please provide contractor wholesale quotation & delivery availability at Onda Depot.`
    );
    window.open(`https://wa.me/919800012345?text=${text}`, '_blank');
  };

  // Connect Carpenter Lead Modal
  window.simOpenCarpenterModal = function () {
    const modal = document.getElementById('sim-carpenter-modal');
    if (!modal) return;

    const bom = calculateBOM();
    const summaryTitle = document.getElementById('sim-modal-summary-title');
    const summaryDesc = document.getElementById('sim-modal-summary-desc');

    if (summaryTitle) {
      summaryTitle.textContent = `${state.productType.toUpperCase()} (${state.selectedFinish.name})`;
    }
    if (summaryDesc) {
      summaryDesc.textContent = `Total Ply: ${bom.totalPlySheets} sheets • Laminates: ${bom.totalLaminateSheets} sheets • ~${bom.carpenterDays} days`;
    }

    modal.style.display = 'flex';
  };

  window.simCloseCarpenterModal = function () {
    const modal = document.getElementById('sim-carpenter-modal');
    if (modal) modal.style.display = 'none';
  };

  window.simSubmitCarpenterLead = function (e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('sim-lead-name');
    const phoneInput = document.getElementById('sim-lead-phone');
    const reasonInput = document.getElementById('sim-lead-reason');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const reason = reasonInput ? reasonInput.value : 'Full Home Interior Execution';

    if (!phone) {
      alert('Please enter your WhatsApp phone number.');
      return;
    }

    const bom = calculateBOM();
    const breakdown = `3D Studio Estimate: ${state.productType.toUpperCase()} | Finish: ${state.selectedFinish.name} (${state.selectedFinish.code}) | Ply: ${bom.totalPlySheets} sheets | Laminates: ${bom.totalLaminateSheets} sheets | Service: ${reason}`;

    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name || '3D Studio Customer',
        phone: phone,
        quote_type: 'Carpenter Lead',
        delivery_locality: 'Onda / Bankura',
        materials_breakdown: breakdown,
        notes: `Customer requested verified carpenter consultation. Preferred service: ${reason}`
      })
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        if (typeof window.showToast === 'function') {
          window.showToast('✅ Inquiry & 3D estimate registered! Our Onda store & local carpenter will contact you shortly.');
        } else {
          alert('Inquiry sent! We will connect you with a verified Onda carpenter shortly.');
        }
        window.simCloseCarpenterModal();
      })
      .catch(function () {
        if (typeof window.showToast === 'function') {
          window.showToast('✅ Estimate noted! Connecting via WhatsApp...');
        }
        window.simCloseCarpenterModal();
        window.simSendWhatsApp();
      });
  };

  // Called when view switches to 'simulator'
  window.updateSimulatorUI = function () {
    renderSimulator();
    setTimeout(handleCanvasResize, 100);
  };

  // Initialize on script load or DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initThreeScene();
      renderSimulator();
    });
  } else {
    initThreeScene();
    renderSimulator();
  }

})();
