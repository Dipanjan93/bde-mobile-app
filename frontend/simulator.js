/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * 3D Furniture & Laminate Studio Simulator Engine
 * Fixed Origin (0,0,0) Three.js WebGL Interactive Studio & Real-time BOM Estimator
 */

(function () {
  'use strict';

  // ----------------------------------------------------
  // 1. 40+ Master Laminate Catalog (Glossy, Matt, Textured, 3D)
  // ----------------------------------------------------
  const LAMINATE_FINISHES = {
    glossy: [
      { id: 'g1', name: 'Imperial White Gloss', hex: '#FFFFFF', gloss: 0.95, roughness: 0.05, code: 'GL-101', pattern: 'solid' },
      { id: 'g2', name: 'Italian Carrara Marble', hex: '#F0F2F5', gloss: 0.9, roughness: 0.08, code: 'GL-102', pattern: 'marble' },
      { id: 'g3', name: 'Piano Jet Black', hex: '#111111', gloss: 0.98, roughness: 0.02, code: 'GL-103', pattern: 'solid' },
      { id: 'g4', name: 'High Gloss Ruby Wine', hex: '#7A1C2C', gloss: 0.92, roughness: 0.06, code: 'GL-104', pattern: 'metallic' },
      { id: 'g5', name: 'Midnight Ocean Blue', hex: '#0B2545', gloss: 0.93, roughness: 0.05, code: 'GL-105', pattern: 'solid' },
      { id: 'g6', name: 'Royal Emerald Gloss', hex: '#0F4D3A', gloss: 0.9, roughness: 0.07, code: 'GL-106', pattern: 'solid' },
      { id: 'g7', name: 'Champagne Metallic Shimmer', hex: '#D4AF37', gloss: 0.88, roughness: 0.1, code: 'GL-107', pattern: 'metallic' },
      { id: 'g8', name: 'American Walnut Gloss', hex: '#4A2E1B', gloss: 0.85, roughness: 0.12, code: 'GL-108', pattern: 'wood' },
      { id: 'g9', name: 'Spanish Grey Mirror', hex: '#8E9AA8', gloss: 0.94, roughness: 0.04, code: 'GL-109', pattern: 'solid' },
      { id: 'g10', name: 'Rose Gold Metallic', hex: '#B76E79', gloss: 0.9, roughness: 0.08, code: 'GL-110', pattern: 'metallic' }
    ],
    matt: [
      { id: 'm1', name: 'Silk Slate Grey Matt', hex: '#4A5568', gloss: 0.1, roughness: 0.75, code: 'MT-201', pattern: 'solid' },
      { id: 'm2', name: 'Powder Cashmere Matt', hex: '#D8C7B5', gloss: 0.15, roughness: 0.7, code: 'MT-202', pattern: 'solid' },
      { id: 'm3', name: 'Urban Charcoal Matt', hex: '#262626', gloss: 0.08, roughness: 0.82, code: 'MT-203', pattern: 'solid' },
      { id: 'm4', name: 'Desert Sand Warm Beige', hex: '#D2B48C', gloss: 0.12, roughness: 0.72, code: 'MT-204', pattern: 'solid' },
      { id: 'm5', name: 'Nordic Sage Green Matt', hex: '#7D8C71', gloss: 0.14, roughness: 0.74, code: 'MT-205', pattern: 'solid' },
      { id: 'm6', name: 'Terracotta Earth Matt', hex: '#B85D43', gloss: 0.1, roughness: 0.78, code: 'MT-206', pattern: 'solid' },
      { id: 'm7', name: 'Deep Indigo Blue Matt', hex: '#1E293B', gloss: 0.09, roughness: 0.8, code: 'MT-207', pattern: 'solid' },
      { id: 'm8', name: 'Bone Ivory Whisper', hex: '#FAF0E6', gloss: 0.15, roughness: 0.68, code: 'MT-208', pattern: 'solid' },
      { id: 'm9', name: 'Mocha Espresso Matt', hex: '#3B2F2F', gloss: 0.11, roughness: 0.76, code: 'MT-209', pattern: 'solid' },
      { id: 'm10', name: 'Smoky Olive Matt', hex: '#556B2F', gloss: 0.13, roughness: 0.73, code: 'MT-210', pattern: 'solid' }
    ],
    textured: [
      { id: 't1', name: 'Natural Crown Teakwood', hex: '#8B5A2B', gloss: 0.35, roughness: 0.55, code: 'TX-301', pattern: 'teak' },
      { id: 't2', name: 'Saw-Cut Golden Pine', hex: '#C19A6B', gloss: 0.28, roughness: 0.6, code: 'TX-302', pattern: 'pine' },
      { id: 't3', name: 'Smoked Vintage Oak', hex: '#5C4033', gloss: 0.3, roughness: 0.58, code: 'TX-303', pattern: 'oak' },
      { id: 't4', name: 'Woven Jute Fabric Texture', hex: '#C2B280', gloss: 0.18, roughness: 0.85, code: 'TX-304', pattern: 'fabric' },
      { id: 't5', name: 'Industrial Concrete Stucco', hex: '#808080', gloss: 0.15, roughness: 0.9, code: 'TX-305', pattern: 'concrete' },
      { id: 't6', name: 'Brushed Bronze Metal Texture', hex: '#6E4D25', gloss: 0.45, roughness: 0.42, code: 'TX-306', pattern: 'metal' },
      { id: 't7', name: 'Silver Ashwood Relief', hex: '#A9A9A9', gloss: 0.32, roughness: 0.57, code: 'TX-307', pattern: 'wood' },
      { id: 't8', name: 'Weathered Barnwood Rustic', hex: '#655345', gloss: 0.2, roughness: 0.8, code: 'TX-308', pattern: 'rustic' },
      { id: 't9', name: 'Raw Travertine Stone', hex: '#E3DAC9', gloss: 0.25, roughness: 0.65, code: 'TX-309', pattern: 'stone' },
      { id: 't10', name: 'Graphite Leatherette', hex: '#363636', gloss: 0.22, roughness: 0.7, code: 'TX-310', pattern: 'leather' }
    ],
    '3d': [
      { id: 'd1', name: 'Fluted Vertical Slat 3D', hex: '#7A5230', gloss: 0.4, roughness: 0.5, code: '3D-401', pattern: 'fluted' },
      { id: 'd2', name: 'Geometric Diamond Prism 3D', hex: '#2C3E50', gloss: 0.5, roughness: 0.4, code: '3D-402', pattern: 'diamond' },
      { id: 'd3', name: 'Acoustic Hexagon Hive 3D', hex: '#E67E22', gloss: 0.35, roughness: 0.55, code: '3D-403', pattern: 'hexagon' },
      { id: 'd4', name: 'Sinuous Ripple Wavefront 3D', hex: '#16A085', gloss: 0.45, roughness: 0.45, code: '3D-404', pattern: 'wave' },
      { id: 'd5', name: 'Origami Pyramid Relief 3D', hex: '#ECF0F1', gloss: 0.6, roughness: 0.35, code: '3D-405', pattern: 'pyramid' },
      { id: 'd6', name: 'Chevron Slat Block 3D', hex: '#6E2C00', gloss: 0.38, roughness: 0.52, code: '3D-406', pattern: 'chevron' },
      { id: 'd7', name: 'Ribbed Pillar Texture 3D', hex: '#95A5A6', gloss: 0.32, roughness: 0.6, code: '3D-407', pattern: 'ribbed' },
      { id: 'd8', name: 'Dune Sand Curves 3D', hex: '#D4AC0D', gloss: 0.36, roughness: 0.58, code: '3D-408', pattern: 'dune' },
      { id: 'd9', name: 'Faceted Crystal Geo 3D', hex: '#273746', gloss: 0.55, roughness: 0.38, code: '3D-409', pattern: 'crystal' },
      { id: 'd10', name: 'Cyber Matrix Grid 3D', hex: '#17202A', gloss: 0.48, roughness: 0.42, code: '3D-410', pattern: 'grid' }
    ]
  };

  // ----------------------------------------------------
  // 2. Simulator State
  // ----------------------------------------------------
  const state = {
    studioMode: 'standard', // 'standard' | 'room'
    productType: 'wardrobe', // 'wardrobe' | 'bed' | 'kitchen' | 'table' | 'sofa' | 'dressing'
    wardrobeDoors: 4, // 2, 4, 6
    productStyle: 1, // 1 to 5
    bedSize: 'Queen (5x6.5 ft)',
    kitchenLayout: 'L-Shape',
    tableShape: 'Rectangular (6-Seater)',
    sofaConfig: 'L-Shape Sectional',
    dressingModel: 'Vanity with Hollywood Lights',

    // Room Mode State
    roomType: 'Bedroom', // 'Bedroom' | 'Living Room' | 'Kitchen' | 'Office'
    roomDim: { width: 14, length: 16, height: 10 },
    roomItems: {
      item1: true, // Wardrobe / Wall Unit
      item2: true, // Bed / Sofa
      item3: true  // Vanity / Desk
    },

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
  // 3. Mathematical Bill of Materials (BOM) Calculator
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

    if (state.studioMode === 'standard') {
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
    } else {
      // Room Mode calculation based on Room Sq.ft and items included
      const sqft = state.roomDim.width * state.roomDim.length;
      let itemsCount = 0;
      if (state.roomItems.item1) itemsCount++;
      if (state.roomItems.item2) itemsCount++;
      if (state.roomItems.item3) itemsCount++;
      const itemFactor = itemsCount / 3;

      const mult = Math.max(0.8, (sqft / 180) * itemFactor);
      ply18mmSheets = Math.max(4, Math.round(18 * mult));
      ply12mmSheets = Math.max(2, Math.round(10 * mult));
      laminateFaceSheets = Math.max(3, Math.round(14 * mult));
      laminateBackerSheets = Math.max(2, Math.round(11 * mult));
      hingesPairs = Math.max(4, Math.round(28 * mult));
      drawerChannels = Math.max(2, Math.round(12 * mult));
      edgeBandMeters = Math.max(25, Math.round(120 * mult));
      fevicolKg = Math.max(8, Math.round(32 * mult));
      carpenterDays = Math.max(4, Math.round(18 * mult));
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
  // 4. Mathematical Room Clearance & Fit Engine
  // ----------------------------------------------------
  function calculateRoomClearance() {
    const totalSqFt = state.roomDim.width * state.roomDim.length;
    let furnitureSqFt = 0;

    // Approximate realistic floor footprint in sq. ft
    if (state.roomItems.item1) {
      furnitureSqFt += (state.roomDim.width > 12 ? 8 : 5) * 2; // Wardrobe (approx 10-16 sq.ft)
    }
    if (state.roomItems.item2) {
      furnitureSqFt += 6.5 * 5.5; // Bed / Divan (approx 35.75 sq.ft)
    }
    if (state.roomItems.item3) {
      furnitureSqFt += 4.0 * 2.0; // Desk / Vanity (approx 8.0 sq.ft)
    }

    const freeSqFt = Math.max(0, totalSqFt - furnitureSqFt);
    const clearancePct = Math.round((freeSqFt / totalSqFt) * 100);

    return {
      totalSqFt,
      furnitureSqFt: Math.round(furnitureSqFt),
      freeSqFt: Math.round(freeSqFt),
      clearancePct,
      isSpacious: clearancePct >= 40
    };
  }

  // ----------------------------------------------------
  // 5. Three.js Scene Setup & Fixed Origin (0,0,0) Orbit
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
      console.warn('Three.js is still loading...');
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
  // 6. Dynamic 3D Model Generator
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

    // Selected Laminate Material Properties
    const laminateColor = new THREE.Color(state.selectedFinish.hex);
    const laminateMat = new THREE.MeshStandardMaterial({
      color: laminateColor,
      roughness: state.selectedFinish.roughness,
      metalness: state.selectedFinish.pattern === 'metallic' ? 0.65 : 0.05
    });

    const carcassMat = new THREE.MeshStandardMaterial({
      color: 0x242424,
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

    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85
    });

    // --------------------------------------------------
    // MODE 1: STANDARD PRODUCTS
    // --------------------------------------------------
    if (state.studioMode === 'standard') {
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
    } else {
      // --------------------------------------------------
      // MODE 2: CUSTOM ROOM DECOR STUDIO
      // Realistic Cutaway Empty Room & Dynamically Sized Furniture
      // --------------------------------------------------
      const scale = 0.22; // Scale feet to Three.js units
      const w = state.roomDim.width * scale;
      const l = state.roomDim.length * scale;
      const h = state.roomDim.height * scale;

      // Realistic Room Flooring
      const rFloorGeo = new THREE.BoxGeometry(w, 0.08, l);
      const rFloorMat = new THREE.MeshStandardMaterial({
        color: 0x3d2c1d, // Natural oak / timber tone
        roughness: 0.45,
        metalness: 0.1
      });
      const rFloor = new THREE.Mesh(rFloorGeo, rFloorMat);
      rFloor.position.set(0, -1.5, 0);
      rFloor.receiveShadow = true;
      group.add(rFloor);

      // Cutaway Back Wall
      const bWallGeo = new THREE.BoxGeometry(w, h, 0.08);
      const bWallMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.9 });
      const bWall = new THREE.Mesh(bWallGeo, bWallMat);
      bWall.position.set(0, -1.5 + h / 2, -l / 2);
      bWall.receiveShadow = true;
      group.add(bWall);

      // Cutaway Left Wall
      const lWallGeo = new THREE.BoxGeometry(0.08, h, l);
      const lWallMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
      const lWall = new THREE.Mesh(lWallGeo, lWallMat);
      lWall.position.set(-w / 2, -1.5 + h / 2, 0);
      lWall.receiveShadow = true;
      group.add(lWall);

      // Floor Baseboard Molding
      const baseboardGeo = new THREE.BoxGeometry(w, 0.1, 0.04);
      const baseboard = new THREE.Mesh(baseboardGeo, goldTrimMat);
      baseboard.position.set(0, -1.5 + 0.05, -l / 2 + 0.03);
      group.add(baseboard);

      // Furniture Item 1: Wardrobe / Large Wall Storage (placed against Left Wall)
      if (state.roomItems.item1) {
        const item1W = Math.min(1.4, w * 0.35);
        const item1H = Math.min(2.4, h * 0.85);
        const item1D = 0.65;
        const item1Geo = new THREE.BoxGeometry(item1W, item1H, item1D);
        const item1 = new THREE.Mesh(item1Geo, laminateMat);
        item1.position.set(-w / 2 + item1D / 2 + 0.05, -1.5 + item1H / 2, -l / 2 + item1W / 2 + 0.3);
        item1.rotation.y = Math.PI / 2;
        item1.castShadow = true;
        group.add(item1);
      }

      // Furniture Item 2: Master Bed / Main Furniture (placed against Back Wall)
      if (state.roomItems.item2) {
        const bedWidth = Math.min(2.0, w * 0.5);
        const bedLength = Math.min(2.4, l * 0.55);
        const item2Geo = new THREE.BoxGeometry(bedWidth, 0.45, bedLength);
        const item2 = new THREE.Mesh(item2Geo, laminateMat);
        item2.position.set(0.15, -1.5 + 0.22, -l / 2 + bedLength / 2 + 0.2);
        item2.castShadow = true;
        group.add(item2);

        // Mattress & Pillows
        const bedMatMesh = new THREE.Mesh(
          new THREE.BoxGeometry(bedWidth - 0.08, 0.25, bedLength - 0.08),
          new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 })
        );
        bedMatMesh.position.set(0.15, -1.5 + 0.45 + 0.12, -l / 2 + bedLength / 2 + 0.2);
        group.add(bedMatMesh);

        // Headboard on back wall
        const headH = Math.min(1.6, h * 0.6);
        const headboard = new THREE.Mesh(
          new THREE.BoxGeometry(bedWidth + 0.15, headH, 0.1),
          goldTrimMat
        );
        headboard.position.set(0.15, -1.5 + headH / 2, -l / 2 + 0.1);
        group.add(headboard);
      }

      // Furniture Item 3: Vanity / Study Desk / Side Console (placed along Right Perimeter)
      if (state.roomItems.item3) {
        const item3W = Math.min(1.3, w * 0.35);
        const item3H = 0.85;
        const item3D = 0.5;
        const item3Geo = new THREE.BoxGeometry(item3W, item3H, item3D);
        const item3 = new THREE.Mesh(item3Geo, laminateMat);
        item3.position.set(w / 2 - item3W / 2 - 0.2, -1.5 + item3H / 2, -l / 2 + item3D / 2 + 0.25);
        item3.castShadow = true;
        group.add(item3);

        // Desk Mirror / Monitor
        const scrGeo = new THREE.BoxGeometry(0.7, 0.6, 0.04);
        const scrMesh = new THREE.Mesh(scrGeo, mirrorMat);
        scrMesh.position.set(w / 2 - item3W / 2 - 0.2, -1.5 + item3H + 0.35, -l / 2 + 0.1);
        group.add(scrMesh);
      }
    }

    scene.add(group);
  }

  // ----------------------------------------------------
  // 7. UI Rendering & DOM Updates
  // ----------------------------------------------------
  function renderSimulator() {
    const bom = calculateBOM();
    const clearance = calculateRoomClearance();

    // 1. Update Mode Switcher Active Classes
    const btnModeStandard = document.getElementById('sim-btn-mode-standard');
    const btnModeRoom = document.getElementById('sim-btn-mode-room');
    if (btnModeStandard) btnModeStandard.className = `sim-mode-btn ${state.studioMode === 'standard' ? 'active' : ''}`;
    if (btnModeRoom) btnModeRoom.className = `sim-mode-btn ${state.studioMode === 'room' ? 'active' : ''}`;

    // 2. Update Top Left Viewport Badge
    const badgeTitleEl = document.getElementById('sim-badge-title');
    if (badgeTitleEl) {
      if (state.studioMode === 'standard') {
        const prodName = state.productType.toUpperCase();
        const extra = state.productType === 'wardrobe' ? ` (${state.wardrobeDoors}-DOOR)` : '';
        badgeTitleEl.textContent = `${prodName}${extra}`;
      } else {
        badgeTitleEl.textContent = `${state.roomType.toUpperCase()} STUDIO (${state.roomDim.width}×${state.roomDim.length} FT)`;
      }
    }

    // 3. Update Bottom Left Viewport Badge
    const finishBoxEl = document.getElementById('sim-mini-swatch-box');
    const finishNameEl = document.getElementById('sim-mini-finish-name');
    const finishCodeEl = document.getElementById('sim-mini-finish-code');
    if (finishBoxEl) finishBoxEl.style.backgroundColor = state.selectedFinish.hex;
    if (finishNameEl) finishNameEl.textContent = state.selectedFinish.name;
    if (finishCodeEl) finishCodeEl.textContent = `${state.finishCategory.toUpperCase()} • ${state.selectedFinish.code}`;

    // 4. Update Below-Canvas Options (Standard vs Room Container)
    const stdControlsEl = document.getElementById('sim-standard-controls');
    const roomControlsEl = document.getElementById('sim-room-controls');
    if (stdControlsEl) stdControlsEl.style.display = state.studioMode === 'standard' ? 'block' : 'none';
    if (roomControlsEl) roomControlsEl.style.display = state.studioMode === 'room' ? 'block' : 'none';

    // In Standard Controls: Update Product Type Buttons & Active Sub-options
    if (state.studioMode === 'standard') {
      const prodButtons = document.querySelectorAll('.sim-prod-btn');
      prodButtons.forEach(function (btn) {
        const pType = btn.getAttribute('data-prod');
        if (pType === state.productType) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Show relevant sub-options section
      ['wardrobe', 'bed', 'kitchen', 'table', 'sofa', 'dressing'].forEach(function (pt) {
        const subSec = document.getElementById(`sim-subopt-${pt}`);
        if (subSec) subSec.style.display = (pt === state.productType) ? 'grid' : 'none';
      });

      // Wardrobe Doors Active Buttons
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
    } else {
      // In Room Controls: Update Room Type Buttons
      const roomTypeBtns = document.querySelectorAll('.sim-room-type-btn');
      roomTypeBtns.forEach(function (btn) {
        const rt = btn.getAttribute('data-room-type');
        if (rt === state.roomType) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Sliders Display
      const valW = document.getElementById('sim-room-val-w');
      const valL = document.getElementById('sim-room-val-l');
      const valH = document.getElementById('sim-room-val-h');
      if (valW) valW.textContent = `${state.roomDim.width} ft`;
      if (valL) valL.textContent = `${state.roomDim.length} ft`;
      if (valH) valH.textContent = `${state.roomDim.height} ft`;

      const sliderW = document.getElementById('sim-slider-room-w');
      const sliderL = document.getElementById('sim-slider-room-l');
      const sliderH = document.getElementById('sim-slider-room-h');
      if (sliderW) sliderW.value = state.roomDim.width;
      if (sliderL) sliderL.value = state.roomDim.length;
      if (sliderH) sliderH.value = state.roomDim.height;

      // Update Checkboxes
      const chk1 = document.getElementById('sim-chk-room-item1');
      const chk2 = document.getElementById('sim-chk-room-item2');
      const chk3 = document.getElementById('sim-chk-room-item3');
      if (chk1) chk1.checked = state.roomItems.item1;
      if (chk2) chk2.checked = state.roomItems.item2;
      if (chk3) chk3.checked = state.roomItems.item3;

      // Update Mathematical Fit & Clearance Badge
      const clearanceCard = document.getElementById('sim-clearance-card');
      if (clearanceCard) {
        if (clearance.isSpacious) {
          clearanceCard.className = 'sim-clearance-card sim-clearance-good';
          clearanceCard.innerHTML = `
            <span>✅ <strong>Ergonomic &amp; Realistic Fit:</strong> ${clearance.clearancePct}% Free Walkway Space (${clearance.freeSqFt} sq.ft free aisle)</span>
            <span style="font-size: 10px; font-weight: 700;">Optimal Door Clearance</span>
          `;
        } else {
          clearanceCard.className = 'sim-clearance-card sim-clearance-warn';
          clearanceCard.innerHTML = `
            <span>⚠️ <strong>High Furniture Density (${clearance.clearancePct}% Free):</strong> Recommend increasing room size or removing an item for easy door clearance.</span>
            <span style="font-size: 10px; font-weight: 700;">Tight Fit</span>
          `;
        }
      }
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

    // Render 10 Swatches Grid
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
      html += `
        <button class="sim-swatch-item-btn ${isSelected ? 'selected' : ''}" onclick="window.simSelectFinish('${item.id}')" title="${item.name} (${item.code})">
          <div class="sim-swatch-preview-square" style="background-color: ${item.hex};">
            ${isSelected ? `<span class="sim-swatch-check" style="color: ${checkColor};">✓</span>` : ''}
          </div>
          <span class="sim-swatch-code-label">${item.code}</span>
        </button>
      `;
    });

    swatchesContainer.innerHTML = html;
  }

  // ----------------------------------------------------
  // 8. Public Interaction Methods (Attached to window)
  // ----------------------------------------------------
  window.simSetStudioMode = function (mode) {
    state.studioMode = mode;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetProductType = function (pType) {
    state.productType = pType;
    state.productStyle = 1; // reset style to default
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

  window.simSetRoomType = function (rt) {
    state.roomType = rt;
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetRoomDim = function (dimension, val) {
    state.roomDim[dimension] = parseInt(val, 10);
    renderSimulator();
    rebuild3DModel();
  };

  window.simSetRoomPreset = function (w, l, h) {
    state.roomDim.width = w;
    state.roomDim.length = l;
    state.roomDim.height = h;
    renderSimulator();
    rebuild3DModel();
  };

  window.simToggleRoomItem = function (itemKey, checked) {
    state.roomItems[itemKey] = !!checked;
    renderSimulator();
    rebuild3DModel();
  };

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
    const productName = state.studioMode === 'standard'
      ? state.productType.toUpperCase() + (state.productType === 'wardrobe' ? ` (${state.wardrobeDoors}-Door)` : '')
      : `${state.roomType} Room Decor (${state.roomDim.width}×${state.roomDim.length} ft)`;

    const text = encodeURIComponent(
      `*Baba Dugdheswar Enterprise — 3D Studio Estimate*\n` +
      `(Plywood, Hardware & Complete Interior Solutions)\n` +
      `Product / Room: ${productName}\n` +
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
      summaryTitle.textContent = state.studioMode === 'standard'
        ? `${state.productType.toUpperCase()} (${state.selectedFinish.name})`
        : `${state.roomType} Decor (${state.selectedFinish.name})`;
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
    const breakdown = `3D Studio Estimate: ${state.studioMode === 'standard' ? state.productType.toUpperCase() : state.roomType + ' Room'} | Finish: ${state.selectedFinish.name} (${state.selectedFinish.code}) | Ply: ${bom.totalPlySheets} sheets | Laminates: ${bom.totalLaminateSheets} sheets | Service: ${reason}`;

    // Post to API quotes/inquiry
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
