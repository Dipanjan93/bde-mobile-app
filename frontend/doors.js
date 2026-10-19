/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * Engineered Doors Studio & 45-Design Custom Door Catalogue Engine
 * Real 45 High-Resolution Catalog Cards (Full Door Slab + Room Installation Scene)
 * Solid Pinewood Core (IS:2202) • 3D Deep CNC, Mandir Relief, 2D Groove & Laminated Flush
 */

(function () {
  'use strict';

  // Helper to resolve door image URL across web browser and Android WebView (file://)
  function getDoorImgUrl(num) {
    const padded = String(num).padStart(2, '0');
    const filename = 'door_' + padded + '.jpg';
    if (window.location.protocol === 'file:') {
      return 'static/img/doors/' + filename;
    }
    return '/static/img/doors/' + filename;
  }

  // =========================================================================
  // 1. 45-DESIGN REAL CATALOGUE DOORS DATASET
  // =========================================================================
  window.DOOR_CATALOG = [
    {
      id: 'dr-01',
      code: 'BDE-DR-01',
      num: 1,
      name: "Heritage Teak Medallion Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 390,
      rateMaxSqft: 480,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Natural Burma Teak 3D CNC Relief + UV PU Coat",
      desc: "Deep ornamental floral medallion carving with classical symmetry and multi-step border moulding.",
      highlight: "Royal Main Entrance",
      imageUrl: getDoorImgUrl(1)
    },
    {
      id: 'dr-02',
      code: 'BDE-DR-02',
      num: 2,
      name: "Artisan Floral Teak Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 395,
      rateMaxSqft: 485,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Golden Teak Deep Botanical Relief Carving",
      desc: "Sculpted blooming vine filigree flowing across twin recessed vertical panels.",
      highlight: "Showroom Favorite",
      imageUrl: getDoorImgUrl(2)
    },
    {
      id: 'dr-03',
      code: 'BDE-DR-03',
      num: 3,
      name: "Grand Heritage Teak Ornate Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 420,
      rateMaxSqft: 520,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Classical Indian Heritage Arch & Floral Relief",
      desc: "Majestic triple-panel sculpted door with traditional floral rosettes and beaded frames.",
      highlight: "Grand Villa Choice",
      imageUrl: getDoorImgUrl(3)
    },
    {
      id: 'dr-04',
      code: 'BDE-DR-04',
      num: 4,
      name: "Heritage Teak Floral CNC Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 385,
      rateMaxSqft: 475,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Burma Teak Precision CNC Leaf & Vine Relief",
      desc: "Harmonious botanical leaf carvings paired with stepped bevelled frame architecture.",
      highlight: "Luxury Entrance",
      imageUrl: getDoorImgUrl(4)
    },
    {
      id: 'dr-05',
      code: 'BDE-DR-05',
      num: 5,
      name: "Eclipse Walnut Artisan Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 410,
      rateMaxSqft: 510,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Dark American Walnut Orbital CNC Wave Relief",
      desc: "Striking concentric arc carvings that capture light and shadow dynamically across the door slab.",
      highlight: "Modern Contemporary",
      imageUrl: getDoorImgUrl(5)
    },
    {
      id: 'dr-06',
      code: 'BDE-DR-06',
      num: 6,
      name: "Heritage Teak Floral Relief Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 390,
      rateMaxSqft: 480,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Warm Amber Teak Hand-Polished 3D Flora",
      desc: "Central flowering motif flanked by deep relief fluting and classical moulding beads.",
      highlight: "Timeless Elegance",
      imageUrl: getDoorImgUrl(6)
    },
    {
      id: 'dr-07',
      code: 'BDE-DR-07',
      num: 7,
      name: "Mahogany Celestial Wave Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 405,
      rateMaxSqft: 495,
      woodTone: 'mahogany',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Deep Red Mahogany Fluid Sinusoidal Wave Relief",
      desc: "Continuous undulating 3D soundwave contouring carved seamlessly across dense pine core.",
      highlight: "Acoustic & Artistic",
      imageUrl: getDoorImgUrl(7)
    },
    {
      id: 'dr-08',
      code: 'BDE-DR-08',
      num: 8,
      name: "Amber Teak Ornate CNC Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 395,
      rateMaxSqft: 490,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Amber Teak Baroque Filigree & Sunburst Arch",
      desc: "Intricate crown arch carving over dual beveled field panels for regal residential entries.",
      highlight: "Auspicious Heritage",
      imageUrl: getDoorImgUrl(8)
    },
    {
      id: 'dr-09',
      code: 'BDE-DR-09',
      num: 9,
      name: "Celestial Bronze Grid Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 415,
      rateMaxSqft: 515,
      woodTone: 'bronze',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Antiqued Bronze & Walnut 3D Geometric Relief",
      desc: "Sleek geometric pyramid block carving accented with subtle metallic bronze glaze.",
      highlight: "Designer Boutique",
      imageUrl: getDoorImgUrl(9)
    },
    {
      id: 'dr-10',
      code: 'BDE-DR-10',
      num: 10,
      name: "Honey Oak Woven Relief Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 380,
      rateMaxSqft: 470,
      woodTone: 'oak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Honey White Oak 3D Basketweave Relief",
      desc: "Textured interlocking basketweave timber carving creating warm tactile luxury.",
      highlight: "Nordic Scandinavian",
      imageUrl: getDoorImgUrl(10)
    },
    {
      id: 'dr-11',
      code: 'BDE-DR-11',
      num: 11,
      name: "Regal Walnut Floral Embossed Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 400,
      rateMaxSqft: 500,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Rich Espresso Walnut Botanical Crest Relief",
      desc: "Graceful French Baroque acanthus crest carved in deep 3D relief over rich walnut timber.",
      highlight: "Neoclassical Masterpiece",
      imageUrl: getDoorImgUrl(11)
    },
    {
      id: 'dr-12',
      code: 'BDE-DR-12',
      num: 12,
      name: "Heritage Mahogany Peacock Relief Door",
      category: 'mandir',
      categoryLabel: "Mandir & Heritage Relief",
      baseRateSqft: 440,
      rateMaxSqft: 560,
      woodTone: 'mahogany',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Sacred Mayur Feather 3D Sculpted Relief",
      desc: "Revered Mayur peacock motif with plumage detailing carved in sacred relief for entrance or pooja vestibule.",
      highlight: "Sacred Mayur Blessings",
      imageUrl: getDoorImgUrl(12)
    },
    {
      id: 'dr-13',
      code: 'BDE-DR-13',
      num: 13,
      name: "Artisan Teak Floral Relief Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 390,
      rateMaxSqft: 480,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Golden Burma Teak Quad-Floral Panel Relief",
      desc: "Four symmetrically balanced floral medallions framed within precision-routed shadow gaps.",
      highlight: "Classic Showroom Best",
      imageUrl: getDoorImgUrl(13)
    },
    {
      id: 'dr-14',
      code: 'BDE-DR-14',
      num: 14,
      name: "Regal Walnut 3D Relief Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 410,
      rateMaxSqft: 510,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Dark Walnut Architectural Step-Bevel Relief",
      desc: "Bold architectural shadow box recesses creating depth and formidable structural presence.",
      highlight: "Executive Suite",
      imageUrl: getDoorImgUrl(14)
    },
    {
      id: 'dr-15',
      code: 'BDE-DR-15',
      num: 15,
      name: "Regency Walnut Ornate Medallion Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 415,
      rateMaxSqft: 520,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Imperial Walnut Sunburst Medallion Carving",
      desc: "A radiating sunburst medallion anchors this stately door, bordered by sculpted palmettes.",
      highlight: "Royal Durbar Look",
      imageUrl: getDoorImgUrl(15)
    },
    {
      id: 'dr-16',
      code: 'BDE-DR-16',
      num: 16,
      name: "Heritage Floral Medallion Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 395,
      rateMaxSqft: 490,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Natural Teak Floral Diamond Medallion",
      desc: "Central diamond floral crest encased in double-stepped architectural architrave reveals.",
      highlight: "Traditional Bengal Home",
      imageUrl: getDoorImgUrl(16)
    },
    {
      id: 'dr-17',
      code: 'BDE-DR-17',
      num: 17,
      name: "Artisan Teak Mandala Carved Door",
      category: 'mandir',
      categoryLabel: "Mandir & Heritage Relief",
      baseRateSqft: 450,
      rateMaxSqft: 570,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Sacred Geometric Mandala 3D Relief",
      desc: "Spiritual sacred geometry mandala carved in deep relief; brings peace, prosperity and positive vastu energy.",
      highlight: "Divine Vastu Harmony",
      imageUrl: getDoorImgUrl(17)
    },
    {
      id: 'dr-18',
      code: 'BDE-DR-18',
      num: 18,
      name: "Mahogany Celestial Relief Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 405,
      rateMaxSqft: 505,
      woodTone: 'mahogany',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Royal Crimson Mahogany Wave & Arch Relief",
      desc: "Flowing curves intertwined with regal archways sculpted into seasoned water-resistant core.",
      highlight: "Luxury Villa Choice",
      imageUrl: getDoorImgUrl(18)
    },
    {
      id: 'dr-19',
      code: 'BDE-DR-19',
      num: 19,
      name: "Royal Teak Ornate CNC Heritage Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 425,
      rateMaxSqft: 530,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Burma Teak Palace Arch & Intricate Jali Relief",
      desc: "Palatial Indian palace entry inspired architecture with multi-tiered relief columns.",
      highlight: "Palace Heritage",
      imageUrl: getDoorImgUrl(19)
    },
    {
      id: 'dr-20',
      code: 'BDE-DR-20',
      num: 20,
      name: "Heritage Baroque Mahogany Arch Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 430,
      rateMaxSqft: 540,
      woodTone: 'mahogany',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Baroque Crowned Arch & Acanthus Leaves",
      desc: "Dramatic crowned top archway with hand-finished acanthus leaf scrolls and fluted side jambs.",
      highlight: "Vintage Colonial",
      imageUrl: getDoorImgUrl(20)
    },
    {
      id: 'dr-21',
      code: 'BDE-DR-21',
      num: 21,
      name: "Celestial Carved Walnut Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 410,
      rateMaxSqft: 510,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Deep Espresso Walnut Geometric Ripple Carving",
      desc: "Sculpted liquid ripples radiating from center handle escutcheon across dense solid pine timber.",
      highlight: "Contemporary Modern",
      imageUrl: getDoorImgUrl(21)
    },
    {
      id: 'dr-22',
      code: 'BDE-DR-22',
      num: 22,
      name: "Imperial Heritage Teak Relief Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 420,
      rateMaxSqft: 525,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Burmese Teak Royal Crest & Fluted Plinth",
      desc: "Opulent heraldic crest relief framed by classic classical columns and bevelled base panel.",
      highlight: "Executive Residence",
      imageUrl: getDoorImgUrl(22)
    },
    {
      id: 'dr-23',
      code: 'BDE-DR-23',
      num: 23,
      name: "Teak Artisanal Geometric Fusion Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 395,
      rateMaxSqft: 490,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Teak Asymmetric Modern 3D Prisms",
      desc: "Fusion of organic natural teak wood grain with avant-garde faceted 3D polygonal prisms.",
      highlight: "Architectural Avant-Garde",
      imageUrl: getDoorImgUrl(23)
    },
    {
      id: 'dr-24',
      code: 'BDE-DR-24',
      num: 24,
      name: "Imperial Teak Ornate Carved Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 425,
      rateMaxSqft: 535,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Heavy Solid Teak Floral Archway Sculpting",
      desc: "Deepest 3D CNC carving depth (16mm) with intricate floral swags and classical pilasters.",
      highlight: "Supreme Luxury",
      imageUrl: getDoorImgUrl(24)
    },
    {
      id: 'dr-25',
      code: 'BDE-DR-25',
      num: 25,
      name: "Imperial Walnut Floral Filigree Door",
      category: '3d',
      categoryLabel: "3D Deep CNC Carved",
      baseRateSqft: 415,
      rateMaxSqft: 515,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Walnut Lacy Floral Filigree Relief Panels",
      desc: "Intricate lace-like floral scrollwork engraved into premium dark walnut veneer facing.",
      highlight: "Artisanal Filigree",
      imageUrl: getDoorImgUrl(25)
    },
    {
      id: 'dr-26',
      code: 'BDE-DR-26',
      num: 26,
      name: "Golden Flora Geometric Composite",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 310,
      rateMaxSqft: 390,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Golden Teak Precision V-Groove & Gold Inlay",
      desc: "Clean vertical router grooves accented with 2mm brass-gold metal inlay strips for modern chic.",
      highlight: "Modern Gold Accent",
      imageUrl: getDoorImgUrl(26)
    },
    {
      id: 'dr-27',
      code: 'BDE-DR-27',
      num: 27,
      name: "Vedic Heritage Ganesha Relief Door",
      category: 'mandir',
      categoryLabel: "Mandir & Heritage Relief",
      baseRateSqft: 460,
      rateMaxSqft: 590,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Vighnaharta Ganesha 3D Relief & Temple Bells",
      desc: "Revered Lord Ganesha central relief bestowing prosperity, framed by auspicious temple bell motifs.",
      highlight: "Auspicious Main/Mandir",
      imageUrl: getDoorImgUrl(27)
    },
    {
      id: 'dr-28',
      code: 'BDE-DR-28',
      num: 28,
      name: "Lumina Bloom Dual-Tone Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 295,
      rateMaxSqft: 375,
      woodTone: 'dualtone',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Charcoal & Bleached Oak Groove Contrast",
      desc: "Two-tone timber veneer facing with laser-aligned horizontal grooves and satin nickel inlays.",
      highlight: "Urban Apartment",
      imageUrl: getDoorImgUrl(28)
    },
    {
      id: 'dr-29',
      code: 'BDE-DR-29',
      num: 29,
      name: "Geometric Walnut Rosette Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 305,
      rateMaxSqft: 385,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Rich Walnut V-Groove Rosette Geometry",
      desc: "Precision V-cut routing forming contemporary diamond rosettes across dark walnut face.",
      highlight: "Chic Dining & Hall",
      imageUrl: getDoorImgUrl(29)
    },
    {
      id: 'dr-30',
      code: 'BDE-DR-30',
      num: 30,
      name: "Geometric Walnut Floral Inlay Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 315,
      rateMaxSqft: 395,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Walnut Face with Brushed Gold Floral Inlay",
      desc: "Delicate floral silhouette laser-inlaid with brushed brass wire into walnut wood surface.",
      highlight: "Boutique Finish",
      imageUrl: getDoorImgUrl(30)
    },
    {
      id: 'dr-31',
      code: 'BDE-DR-31',
      num: 31,
      name: "Royal Walnut Filigree Heritage Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 320,
      rateMaxSqft: 400,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Dark Walnut CNC Line Art Heritage Patterns",
      desc: "Fine line CNC engravings representing traditional filigree in an ultra-modern flush format.",
      highlight: "Heritage Modernist",
      imageUrl: getDoorImgUrl(31)
    },
    {
      id: 'dr-32',
      code: 'BDE-DR-32',
      num: 32,
      name: "Zenith Bronze Harmony Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 330,
      rateMaxSqft: 415,
      woodTone: 'bronze',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Matte Bronze Metallic Inlay on Smoked Oak",
      desc: "Sleek horizontal metallic copper-bronze profile inserts giving a high-end penthouse appeal.",
      highlight: "Penthouse Luxury",
      imageUrl: getDoorImgUrl(32)
    },
    {
      id: 'dr-33',
      code: 'BDE-DR-33',
      num: 33,
      name: "Aureate Floral Inlay Decorative Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 325,
      rateMaxSqft: 410,
      woodTone: 'teak',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Aureate Gold Laser Inlays on Golden Teak",
      desc: "Gilded floral ribbons seamlessly flush-inlaid into clear-lacquered golden pine core.",
      highlight: "Festive Glow",
      imageUrl: getDoorImgUrl(33)
    },
    {
      id: 'dr-34',
      code: 'BDE-DR-34',
      num: 34,
      name: "Ros Boutique Two-Tone Engineered Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 240,
      rateMaxSqft: 310,
      woodTone: 'dualtone',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Rosewood & Pearl Cream High-Pressure Laminate",
      desc: "0.8mm textured HPL lamination with zero-joint edge banding for zero-maintenance bedroom doors.",
      highlight: "Bed & Bath Favorite",
      imageUrl: getDoorImgUrl(34)
    },
    {
      id: 'dr-35',
      code: 'BDE-DR-35',
      num: 35,
      name: "Artisan Rosewood Digital Inlay Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 245,
      rateMaxSqft: 315,
      woodTone: 'rosewood',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Rich Rosewood Grain with Digital Marquetry",
      desc: "High-definition woodgrain laminate with moisture-resistant phenolic backing.",
      highlight: "Durable High-Traffic",
      imageUrl: getDoorImgUrl(35)
    },
    {
      id: 'dr-36',
      code: 'BDE-DR-36',
      num: 36,
      name: "Walnut Geometric Mosaic Flush Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 250,
      rateMaxSqft: 320,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Walnut Hexagonal Geometric Parquet Laminate",
      desc: "Modern geometric woodblock parquet look without timber warping or maintenance.",
      highlight: "Trendy Studio Choice",
      imageUrl: getDoorImgUrl(36)
    },
    {
      id: 'dr-37',
      code: 'BDE-DR-37',
      num: 37,
      name: "Regency Diamond Dark Walnut Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 235,
      rateMaxSqft: 305,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Dark Walnut Diamond Facet Textured Skin",
      desc: "Micro-embossed textured surface simulating natural tactile walnut grain.",
      highlight: "Affordable Luxury",
      imageUrl: getDoorImgUrl(37)
    },
    {
      id: 'dr-38',
      code: 'BDE-DR-38',
      num: 38,
      name: "Artisan Walnut Floral Inlay Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 310,
      rateMaxSqft: 390,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Walnut Symmetrical Grooves with Silver Inlay",
      desc: "Symmetrical vertical grooves flanked by subtle chrome silver metallic inlays.",
      highlight: "Sleek Minimalist",
      imageUrl: getDoorImgUrl(38)
    },
    {
      id: 'dr-39',
      code: 'BDE-DR-39',
      num: 39,
      name: "Imperial Rosewood Medallion Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 245,
      rateMaxSqft: 315,
      woodTone: 'rosewood',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Rosewood Laminated Flush with Medallion Decal",
      desc: "Rich reddish-brown rosewood grain paired with durable anti-scratch matte lamination.",
      highlight: "Low-Maintenance Classic",
      imageUrl: getDoorImgUrl(39)
    },
    {
      id: 'dr-40',
      code: 'BDE-DR-40',
      num: 40,
      name: "Grand Medallion Duo-Tone Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 250,
      rateMaxSqft: 320,
      woodTone: 'dualtone',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Two-Tone Walnut & Ivory High-Gloss Laminate",
      desc: "Contrasting center oval medallion on dark walnut backdrop, finished with high-gloss PU coat.",
      highlight: "Bright Interior Choice",
      imageUrl: getDoorImgUrl(40)
    },
    {
      id: 'dr-41',
      code: 'BDE-DR-41',
      num: 41,
      name: "Geometric Floral Dual-Tone Door",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 305,
      rateMaxSqft: 385,
      woodTone: 'dualtone',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Ebony & Honey Teak Groove Fusion",
      desc: "Dual tone contrast separated by deep 3mm router channels for a high-contrast architectural look.",
      highlight: "Contemporary Villa",
      imageUrl: getDoorImgUrl(41)
    },
    {
      id: 'dr-42',
      code: 'BDE-DR-42',
      num: 42,
      name: "Geometric Walnut Inlay Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 230,
      rateMaxSqft: 295,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Straight Walnut Grain with Minimalist Inlay Line",
      desc: "Clean vertical grain with single off-center rose gold strip; ideal for modern apartment rooms.",
      highlight: "Clean Minimalist",
      imageUrl: getDoorImgUrl(42)
    },
    {
      id: 'dr-43',
      code: 'BDE-DR-43',
      num: 43,
      name: "Geometric Mosaic Walnut Ash Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 240,
      rateMaxSqft: 310,
      woodTone: 'walnut',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Walnut & Light Ash Mosaic Veneer Laminate",
      desc: "Artistic chevron pattern uniting warm walnut and cool Scandinavian ash veneers.",
      highlight: "Nordic Chevron",
      imageUrl: getDoorImgUrl(43)
    },
    {
      id: 'dr-44',
      code: 'BDE-DR-44',
      num: 44,
      name: "S-Curve Avant-Garde Fusion",
      category: '2d',
      categoryLabel: "2D Contemporary Groove",
      baseRateSqft: 335,
      rateMaxSqft: 420,
      woodTone: 'dualtone',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Dynamic S-Curve CNC Route with Gold Ribbon",
      desc: "Flowing serpentine contour running top-to-bottom with 3mm embedded golden metallic ribbon.",
      highlight: "Designer Statement",
      imageUrl: getDoorImgUrl(44)
    },
    {
      id: 'dr-45',
      code: 'BDE-DR-45',
      num: 45,
      name: "Sienna Prism Geometric Door",
      category: 'laminated',
      categoryLabel: "Laminated & Flush Inlay",
      baseRateSqft: 235,
      rateMaxSqft: 300,
      woodTone: 'sienna',
      core: "Seasoned Pinewood Solid Core (IS:2202)",
      finish: "Warm Sienna Prism Facet Texture Skin",
      desc: "Earthy warm terracotta sienna tones with subtle angular light-catching texture.",
      highlight: "Warm Modern Living",
      imageUrl: getDoorImgUrl(45)
    },
  ];

  // =========================================================================
  // 2. ESTIMATOR STATE
  // =========================================================================
  window.DOOR_STATE = {
    width: 3.0,
    height: 7.0,
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    selectedGrade: '3d',
    coreThickness: 30, // mm (30 standard, 32 waterproof, 35 heavy)
    activeDoorId: 'dr-01'
  };

  // Grade rates mapping for size estimator
  const GRADE_PRICING = {
    '3d': { min: 385, max: 485, name: '3D Deep CNC Carved' },
    'mandir': { min: 430, max: 550, name: 'Mandir & Heritage Relief' },
    '2d': { min: 285, max: 375, name: '2D Contemporary Groove' },
    'laminated': { min: 215, max: 285, name: 'Laminated & Flush Inlay' }
  };

  // =========================================================================
  // 3. PRICE ESTIMATION ENGINE
  // =========================================================================
  window.updateDoorEstimate = function () {
    const s = window.DOOR_STATE;
    const w = parseFloat(s.width) || 3.0;
    const h = parseFloat(s.height) || 7.0;
    const sqft = Math.round(w * h * 10) / 10;

    // Base pricing according to selected grade
    const grade = GRADE_PRICING[s.selectedGrade] || GRADE_PRICING['3d'];
    let minRate = grade.min;
    let maxRate = grade.max;

    // Thickness adjustment
    if (s.coreThickness === 32) {
      minRate += 25;
      maxRate += 25;
    } else if (s.coreThickness === 35) {
      minRate += 50;
      maxRate += 50;
    }

    const estMin = Math.round(sqft * minRate);
    const estMax = Math.round(sqft * maxRate);

    // Update UI elements
    const sqftEl = document.getElementById('doors-est-sqft');
    const totalEl = document.getElementById('doors-est-total');
    const rateEl = document.getElementById('doors-est-rate');
    const widthValEl = document.getElementById('doors-slider-width-val');
    const heightValEl = document.getElementById('doors-slider-height-val');

    if (sqftEl) sqftEl.textContent = `${sqft.toFixed(1)} sq.ft`;
    if (totalEl) totalEl.textContent = `₹${estMin.toLocaleString('en-IN')} – ₹${estMax.toLocaleString('en-IN')}`;
    if (rateEl) rateEl.textContent = `₹${minRate} – ₹${maxRate} / sq.ft`;
    if (widthValEl) widthValEl.textContent = `${w.toFixed(1)} ft`;
    if (heightValEl) heightValEl.textContent = `${h.toFixed(1)} ft`;
  };

  window.setDoorSizePreset = function (w, h, btnElem) {
    window.DOOR_STATE.width = w;
    window.DOOR_STATE.height = h;

    const sliderW = document.getElementById('doors-slider-width');
    const sliderH = document.getElementById('doors-slider-height');
    if (sliderW) sliderW.value = w;
    if (sliderH) sliderH.value = h;

    document.querySelectorAll('.doors-preset-btn').forEach(b => b.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');

    window.updateDoorEstimate();
  };

  window.setDoorGrade = function (grade, cardElem) {
    window.DOOR_STATE.selectedGrade = grade;
    document.querySelectorAll('.doors-grade-card').forEach(c => c.classList.remove('active'));
    if (cardElem) cardElem.classList.add('active');
    window.updateDoorEstimate();
  };

  window.setDoorThickness = function (thick) {
    window.DOOR_STATE.coreThickness = parseInt(thick, 10);
    window.updateDoorEstimate();
  };

  // =========================================================================
  // 4. CATALOGUE FILTERING, SEARCH & SORTING
  // =========================================================================
  window.filterDoorsCategory = function (cat, pillElem) {
    window.DOOR_STATE.selectedCategory = cat;
    document.querySelectorAll('.doors-cat-pill').forEach(p => p.classList.remove('active'));
    if (pillElem) pillElem.classList.add('active');
    renderFilteredDoors();
  };

  window.searchDoors = function (query) {
    window.DOOR_STATE.searchQuery = (query || '').toLowerCase().trim();
    renderFilteredDoors();
  };

  window.sortDoors = function (criterion) {
    window.DOOR_STATE.sortBy = criterion;
    renderFilteredDoors();
  };

  function renderFilteredDoors() {
    const s = window.DOOR_STATE;
    let list = [...window.DOOR_CATALOG];

    // Filter by Category
    if (s.selectedCategory !== 'all') {
      list = list.filter(d => d.category === s.selectedCategory);
    }

    // Filter by Search Query
    if (s.searchQuery) {
      list = list.filter(d =>
        d.name.toLowerCase().includes(s.searchQuery) ||
        d.code.toLowerCase().includes(s.searchQuery) ||
        d.finish.toLowerCase().includes(s.searchQuery) ||
        d.desc.toLowerCase().includes(s.searchQuery) ||
        d.categoryLabel.toLowerCase().includes(s.searchQuery)
      );
    }

    // Sort
    if (s.sortBy === 'price_asc') {
      list.sort((a, b) => a.baseRateSqft - b.baseRateSqft);
    } else if (s.sortBy === 'price_desc') {
      list.sort((a, b) => b.baseRateSqft - a.baseRateSqft);
    } else if (s.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    window.renderDoorCards(list);
  }

  // =========================================================================
  // 5. RENDER DOOR CARDS (45 DESIGNS WITH REAL CATALOGUE IMAGES)
  // =========================================================================
  window.renderDoorCards = function (doorsList) {
    const grid = document.getElementById('doors-grid');
    if (!grid) return;

    if (!doorsList || doorsList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 16px; background: rgba(22,27,34,0.6); border-radius: 14px; border: 1px dashed rgba(245,158,11,0.3);">
          <div style="font-size: 32px; margin-bottom: 8px;">🚪</div>
          <h3 style="color: #fbbf24; margin: 0 0 6px 0;">No matching door design found</h3>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Try searching for "teak", "mandir", "3d", "walnut", or clear your filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = doorsList.map(door => {
      const approxStdPrice = Math.round(door.baseRateSqft * 21); // 7x3 ft = 21 sq.ft
      const fallbackUrl = 'static/img/doors/door_' + String(door.num).padStart(2, '0') + '.jpg';
      return `
        <div class="door-card" id="door-card-${door.id}">
          <!-- Visual Door Composite Preview (Actual 1200x863 Catalogue Image) -->
          <div class="door-preview-stage" onclick="openDoorDetailModal('${door.id}')" title="Click to view full catalogue card & room preview">
            <span class="door-card-badge">${door.categoryLabel}</span>
            <span class="door-rate-pill">From ₹${door.baseRateSqft}/sq.ft</span>
            <img src="${door.imageUrl}" alt="${door.name}" class="door-card-img" loading="lazy" onerror="this.onerror=null; this.src='${fallbackUrl}';" />
            <div class="door-preview-zoom-hint">🔍 Tap to inspect catalogue card & room view</div>
          </div>

          <!-- Card Content Info -->
          <div class="door-card-content">
            <div class="door-code-row">
              <span class="door-code">${door.code}</span>
              <span class="door-approx-std">~₹${approxStdPrice.toLocaleString('en-IN')} (7×3 ft)</span>
            </div>
            <h4 class="door-card-title">${door.name}</h4>
            <div class="door-card-desc">${door.desc}</div>

            <div class="door-actions-row">
              <button class="btn-door-calc" onclick="selectDoorForEstimate('${door.id}')">
                📐 Calculate Size
              </button>
              <button class="btn-door-wa" onclick="sendDoorWhatsAppQuote('${door.id}')">
                <span>💬</span> WhatsApp Quote
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // =========================================================================
  // 6. CARD INTERACTIONS & DETAIL MODAL
  // =========================================================================
  window.selectDoorForEstimate = function (doorId) {
    const door = window.DOOR_CATALOG.find(d => d.id === doorId);
    if (!door) return;

    window.DOOR_STATE.selectedGrade = door.category;
    document.querySelectorAll('.doors-grade-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-grade') === door.category);
    });

    window.updateDoorEstimate();

    // Scroll smoothly to estimator card
    const calcCard = document.getElementById('doors-calc-card');
    if (calcCard) {
      calcCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (window.showToast) {
      window.showToast(`Selected ${door.name} (${door.code}) for size estimation!`);
    }
  };

  window.openDoorDetailModal = function (doorId) {
    const door = window.DOOR_CATALOG.find(d => d.id === doorId);
    if (!door) return;

    const modal = document.getElementById('door-detail-modal');
    const title = document.getElementById('door-modal-title');
    const stage = document.getElementById('door-modal-stage');
    const desc = document.getElementById('door-modal-desc');
    const core = document.getElementById('door-modal-core');
    const finish = document.getElementById('door-modal-finish');
    const rate = document.getElementById('door-modal-rate');
    const stdPrice = document.getElementById('door-modal-std-price');
    const waBtn = document.getElementById('door-modal-wa-btn');

    const fallbackUrl = 'static/img/doors/door_' + String(door.num).padStart(2, '0') + '.jpg';

    if (title) title.textContent = `${door.name} (${door.code})`;
    if (stage) {
      stage.innerHTML = `
        <div class="door-modal-img-container">
          <img src="${door.imageUrl}" alt="${door.name}" class="door-modal-img" onerror="this.onerror=null; this.src='${fallbackUrl}';" />
          <div class="door-modal-img-caption">
            <span>✨ Actual Onda Showroom Catalogue Design • Studio Slab & Interior Room Scene</span>
          </div>
        </div>
      `;
    }
    if (desc) desc.textContent = door.desc;
    if (core) core.textContent = door.core;
    if (finish) finish.textContent = door.finish;
    if (rate) rate.textContent = `₹${door.baseRateSqft} – ₹${door.rateMaxSqft} / sq.ft`;
    if (stdPrice) {
      const p = Math.round(door.baseRateSqft * 21);
      stdPrice.textContent = `₹${p.toLocaleString('en-IN')} (Standard 7.0 × 3.0 ft frame)`;
    }

    if (waBtn) {
      waBtn.onclick = () => window.sendDoorWhatsAppQuote(door.id);
    }

    if (modal) modal.classList.add('open');
  };

  window.closeDoorDetailModal = function () {
    const modal = document.getElementById('door-detail-modal');
    if (modal) modal.classList.remove('open');
  };

  // Close modal when tapping backdrop
  document.addEventListener('click', function (e) {
    const modal = document.getElementById('door-detail-modal');
    if (modal && modal.classList.contains('open') && e.target === modal) {
      window.closeDoorDetailModal();
    }
  });

  // =========================================================================
  // 7. HIGH-CONVERSION WHATSAPP LEAD INTEGRATION (FREE ONSITE LASER MEASUREMENT)
  // =========================================================================
  window.sendDoorWhatsAppQuote = async function (doorId) {
    const door = window.DOOR_CATALOG.find(d => d.id === doorId) || window.DOOR_CATALOG[0];
    const s = window.DOOR_STATE;
    const w = parseFloat(s.width) || 3.0;
    const h = parseFloat(s.height) || 7.0;
    const sqft = Math.round(w * h * 10) / 10;
    const estMin = Math.round(sqft * door.baseRateSqft);
    const estMax = Math.round(sqft * door.rateMaxSqft);

    if (window.STATE && !window.STATE.user) {
      window.STATE.pendingAction = () => window.sendDoorWhatsAppQuote(doorId);
      if (window.triggerAuthSheet) {
        window.triggerAuthSheet('quote');
        return;
      }
    }

    const user = window.STATE?.user || { name: 'Valued Customer', phone: '9867098952', location: window.STATE?.currentLocality || 'Onda, Bankura' };
    const locality = user.location || window.STATE?.currentLocality || 'Onda, Bankura';

    const materialsText =
      `• Door Model: ${door.name} (${door.code})
` +
      `• Category: ${door.categoryLabel}
` +
      `• Estimated Frame Size: ${w.toFixed(1)} ft W × ${h.toFixed(1)} ft H (${sqft.toFixed(1)} sq.ft)
` +
      `• Core Grade: ${s.coreThickness}mm ${door.core}
` +
      `• Finish: ${door.finish}
` +
      `• Approximate Range: ₹${estMin.toLocaleString('en-IN')} – ₹${estMax.toLocaleString('en-IN')}
` +
      `• Customer Request: Free onsite frame laser measurement in ${locality}`;

    const payload = {
      customer_name: user.name,
      phone: user.phone,
      delivery_locality: locality,
      quote_type: 'Engineered Door Onsite Quote',
      furniture_type: `Door: ${door.name}`,
      dimensions: `${w.toFixed(1)} ft × ${h.toFixed(1)} ft`,
      materials_breakdown: materialsText,
      notes: `Selected engineered door design ${door.code} (${door.name}) from 45-model catalogue`
    };

    if (window.showToast) window.showToast('Connecting to Dipanjan Babu for free frame measurement...');

    const message = `Namaskar Dipanjan Babu! 🙏\nI selected an *Engineered Door Design* from your website catalogue at *Baba Dugdheswar Enterprise, Onda*:\n\n` +
      `🚪 *Design Details:*\n` +
      `• Model: *${door.name}* (${door.code})\n` +
      `• Type: ${door.categoryLabel}\n` +
      `• Finish: ${door.finish}\n` +
      `• Core: ${s.coreThickness}mm Solid Seasoned Pinewood (IS:2202)\n\n` +
      `📐 *Estimated Dimensions:*\n` +
      `• Approx Size: ${w.toFixed(1)} ft W × ${h.toFixed(1)} ft H (~${sqft.toFixed(1)} sq.ft)\n` +
      `• Approx Estimated Cost: ₹${estMin.toLocaleString('en-IN')} – ₹${estMax.toLocaleString('en-IN')}\n` +
      `• My Village / Location: ${locality}\n\n` +
      `Please schedule a free visit to measure my door frame onsite in Bankura and confirm delivery timeline. Thank you!`;

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
      console.error('Quote log error:', e);
      window.open(defaultWaUrl, '_blank');
    }
  };

  // =========================================================================
  // 8. INITIALIZATION
  // =========================================================================
  window.initDoorsStudio = function () {
    window.renderDoorCards(window.DOOR_CATALOG);
    window.updateDoorEstimate();
  };

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      if (document.getElementById('doors-grid')) {
        window.initDoorsStudio();
      }
    }, 250);
  });

})();
