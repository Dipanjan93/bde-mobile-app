/**
 * Baba Dugdheswar Enterprise — Onda, Bankura
 * Engineered Doors Studio & 45-Design Custom Door Catalogue Engine
 * Solid Pinewood Core (IS:2202) • 3D CNC, 2D Groove, Laminated & Mandir Jali
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. 45-DESIGN ENGINEERED DOOR CATALOGUE
  // =========================================================================
  window.DOOR_CATALOG = [
    // -----------------------------------------------------------------------
    // CATEGORY A: 3D DEEP CNC CARVED DOORS (12 Designs: BDE-DR-301 - 312)
    // -----------------------------------------------------------------------
    {
      id: 'dr-301',
      code: 'BDE-DR-301',
      name: 'Maharaja Imperial 3D Teak',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 390,
      rateMaxSqft: 480,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Natural Burma Teak 3D CNC Relief + UV PU Coat',
      desc: 'Grand multi-panel deep relief carving with traditional sunburst crest and ornamental borders.',
      highlight: 'Royal Entrance Choice'
    },
    {
      id: 'dr-302',
      code: 'BDE-DR-302',
      name: 'Diamond Prism 3D Oak',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 380,
      rateMaxSqft: 470,
      woodTone: 'oak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Nordic White Oak 3D Faceted Diamond Relief',
      desc: 'Contemporary pyramidal diamond facets creating striking light-and-shadow architectural drama.',
      highlight: 'Modern Villa Favorite'
    },
    {
      id: 'dr-303',
      code: 'BDE-DR-303',
      name: 'Royal Kalash Arch 3D',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 410,
      rateMaxSqft: 510,
      woodTone: 'rosewood',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Sheesham Rosewood Classical Arched Relief',
      desc: 'Classical auspicious Kalash motifs with sculpted Romanesque arched crown for main doorways.',
      highlight: 'Auspicious Entrance'
    },
    {
      id: 'dr-304',
      code: 'BDE-DR-304',
      name: 'Sovereign Fluted 3D Walnut',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 395,
      rateMaxSqft: 490,
      woodTone: 'walnut',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'American Walnut 3D Fluted Wave Relief',
      desc: 'Vertical 3D acoustic fluted slats accented with central gold metallic accent medallion.',
      highlight: 'Luxury Apartment'
    },
    {
      id: 'dr-305',
      code: 'BDE-DR-305',
      name: 'Cascading Wave 3D Rosewood',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 420,
      rateMaxSqft: 520,
      woodTone: 'rosewood',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Deep Amber Rosewood Flowing Wave Relief',
      desc: 'Organic sweeping sinusoidal contours sculpted seamlessly into heavy-duty solid timber core.',
      highlight: 'Artisanal Masterpiece'
    },
    {
      id: 'dr-306',
      code: 'BDE-DR-306',
      name: 'Versailles Quad-Panel 3D',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 375,
      rateMaxSqft: 460,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'European Classic 4-Panel Deep Bevelled Teak',
      desc: 'Timeless French neoclassical quad-panel with precision-beveled shadow reveals.',
      highlight: 'Evergreen Heritage'
    },
    {
      id: 'dr-307',
      code: 'BDE-DR-307',
      name: 'Lotus Mandala 3D Sheesham',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 425,
      rateMaxSqft: 530,
      woodTone: 'rosewood',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Sculpted Sacred Lotus Medallion',
      desc: 'Centered sacred lotus blossom with radiating geometric concentric petals and micro-grooving.',
      highlight: 'Divine Aesthetic'
    },
    {
      id: 'dr-308',
      code: 'BDE-DR-308',
      name: 'Linear Chevron 3D Wenge',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 390,
      rateMaxSqft: 480,
      woodTone: 'wenge',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Dark Ebony Wenge Herringbone 3D V-Carve',
      desc: 'Architectural sharp 3D herringbone V-grooves carved across the entire vertical height.',
      highlight: 'Trending Penthouse'
    },
    {
      id: 'dr-309',
      code: 'BDE-DR-309',
      name: 'Palace Pillar Arch 3D',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 430,
      rateMaxSqft: 540,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Majestic Twin Roman Pillars in Solid Teak',
      desc: 'Twin carved fluted pillars framing an ornamental arched pediment for majestic grand entries.',
      highlight: 'Bungalow Main Gate'
    },
    {
      id: 'dr-310',
      code: 'BDE-DR-310',
      name: 'Honeycomb Hex 3D Teak',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 385,
      rateMaxSqft: 475,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Geometric Honeycomb Modular Relief',
      desc: 'Contemporary honeycomb hexagonal cells with chamfered inner facets.',
      highlight: 'Modern Geometric'
    },
    {
      id: 'dr-311',
      code: 'BDE-DR-311',
      name: 'Regal Swirl Baroque 3D',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 415,
      rateMaxSqft: 520,
      woodTone: 'mahogany',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Deep Mahogany Classical Baroque Acanthus',
      desc: 'Opulent European acanthus leaf scrollwork sculpted into high-density pine door core.',
      highlight: 'Classic Luxury'
    },
    {
      id: 'dr-312',
      code: 'BDE-DR-312',
      name: 'Horizon Sunrise 3D Maple',
      category: '3d',
      categoryLabel: '3D Deep CNC Carved',
      baseRateSqft: 380,
      rateMaxSqft: 470,
      woodTone: 'maple',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Canadian Honey Maple Radiating Sunbeam Carve',
      desc: 'Soft expanding semicircular sunrise arcs radiating upward from bottom door threshold.',
      highlight: 'Warm & Welcoming'
    },

    // -----------------------------------------------------------------------
    // CATEGORY B: 2D GROOVE & MEMBRANE DOORS (12 Designs: BDE-DR-321 - 332)
    // -----------------------------------------------------------------------
    {
      id: 'dr-321',
      code: 'BDE-DR-321',
      name: 'Nordic Dual Groove Oak',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 270,
      rateMaxSqft: 340,
      woodTone: 'oak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Scandi White Oak Foil + 8mm Charcoal Grooves',
      desc: 'Clean twin vertical and single horizontal minimalist CNC route lines for bedrooms.',
      highlight: 'Scandinavian Minimal'
    },
    {
      id: 'dr-322',
      code: 'BDE-DR-322',
      name: 'Urban Triple Stripe Slate',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 280,
      rateMaxSqft: 350,
      woodTone: 'slate',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Super-Matte Slate Grey Membrane + Brass Inlay',
      desc: 'Three vertical metallic slim route channels flush-embedded on smooth matte foil.',
      highlight: 'Urban Flat Favorite'
    },
    {
      id: 'dr-323',
      code: 'BDE-DR-323',
      name: 'Staggered Brick 2D Walnut',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 275,
      rateMaxSqft: 345,
      woodTone: 'walnut',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'American Walnut Textured Foil + Brick CNC Route',
      desc: 'Modern offset running bond geometric routed grid for contemporary bedroom wings.',
      highlight: 'Geometric Appeal'
    },
    {
      id: 'dr-324',
      code: 'BDE-DR-324',
      name: 'Curved S-Flow 2D Teak',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 290,
      rateMaxSqft: 360,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Golden Teak Grain Membrane + Smooth S-Groove',
      desc: 'Graceful flowing S-curve routings that guide the eye gracefully across the door face.',
      highlight: 'Graceful Contours'
    },
    {
      id: 'dr-325',
      code: 'BDE-DR-325',
      name: 'Matrix Grid 2D Wenge',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 285,
      rateMaxSqft: 355,
      woodTone: 'wenge',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Dark Espresso Membrane + Precision CNC Grid',
      desc: 'Crisp mathematical 6-panel grid lines with seamless zero-joint vacuum membrane wrap.',
      highlight: 'Executive Office'
    },
    {
      id: 'dr-326',
      code: 'BDE-DR-326',
      name: 'Cross-Linear Axis 2D Pearl',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 265,
      rateMaxSqft: 335,
      woodTone: 'pearl',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Pearl Off-White Seamless Anti-Dirt Membrane',
      desc: 'Off-center intersecting vertical and horizontal router grooves with modern black handle.',
      highlight: 'Ultra Clean Aesthetic'
    },
    {
      id: 'dr-327',
      code: 'BDE-DR-327',
      name: 'Vertical Duo Brass Inlay',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 310,
      rateMaxSqft: 390,
      woodTone: 'walnut',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Smoked Walnut with Real 6mm Brass Inlay Bars',
      desc: 'Twin vertical brushed brass strips flush-mounted alongside an architectural long bar handle.',
      highlight: 'Hotel Suite Luxury'
    },
    {
      id: 'dr-328',
      code: 'BDE-DR-328',
      name: 'Diagonal Ray 2D Ash',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 275,
      rateMaxSqft: 345,
      woodTone: 'ash',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Light Ashwood Foil + 45° Angle Route Lines',
      desc: 'Dynamic slanted 45-degree angle routed lines creating visual height and energy.',
      highlight: 'Youth & Guest Rooms'
    },
    {
      id: 'dr-329',
      code: 'BDE-DR-329',
      name: 'Concentric Frame 2D Greige',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 260,
      rateMaxSqft: 330,
      woodTone: 'greige',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Milanese Greige Membrane + Dual Nested Frames',
      desc: 'Nested double perimeter frames routed with smooth curved corners for relaxed bedrooms.',
      highlight: 'Cozy Master Suite'
    },
    {
      id: 'dr-330',
      code: 'BDE-DR-330',
      name: 'Bamboo Reeds 2D Olive',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 285,
      rateMaxSqft: 355,
      woodTone: 'olive',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Deep Botanical Olive Membrane + Fine Reed Grooves',
      desc: 'Delicate vertical reeded lines creating organic texture in modern earthy interiors.',
      highlight: 'Nature Inspired'
    },
    {
      id: 'dr-331',
      code: 'BDE-DR-331',
      name: 'Eclipse Curve 2D Terracotta',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 295,
      rateMaxSqft: 370,
      woodTone: 'terracotta',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Tuscan Burnt Terracotta + Bold Circular Arc Groove',
      desc: 'Dramatic sweeping crescent arc grooving intersecting with warm Mediterranean terracotta.',
      highlight: 'Statement Bedroom'
    },
    {
      id: 'dr-332',
      code: 'BDE-DR-332',
      name: 'Sleek Twin Bar Chrome',
      category: '2d',
      categoryLabel: '2D Groove & Membrane',
      baseRateSqft: 305,
      rateMaxSqft: 380,
      woodTone: 'wenge',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Black Wenge Foil + Mirror Chrome Inlay Strips',
      desc: 'High-contrast polished chrome aluminum strips running parallel along full door height.',
      highlight: 'High-Tech Modern'
    },

    // -----------------------------------------------------------------------
    // CATEGORY C: LAMINATED & VENEER FLUSH DOORS (12 Designs: BDE-DR-341 - 352)
    // -----------------------------------------------------------------------
    {
      id: 'dr-341',
      code: 'BDE-DR-341',
      name: 'Carrara Marble Gloss Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 220,
      rateMaxSqft: 280,
      woodTone: 'carrara',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: '1.0mm Carrara White High-Gloss Scratchproof Laminate',
      desc: 'Italian white marble laminate with smoke-gray veining, sealed with waterproof PVC edge tape.',
      highlight: 'Luxury Washroom & Room'
    },
    {
      id: 'dr-342',
      code: 'BDE-DR-342',
      name: 'Nero Marquina Black Gold',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 235,
      rateMaxSqft: 300,
      woodTone: 'marquina',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Obsidian Black Gold Vein High-Gloss Sheet',
      desc: 'Showstopping black marble finish with fine gold veins and mirror reflective gloss.',
      highlight: 'Lounge & Home Theater'
    },
    {
      id: 'dr-343',
      code: 'BDE-DR-343',
      name: 'Smoked American Walnut Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 240,
      rateMaxSqft: 310,
      woodTone: 'walnut',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Natural Woodgrain Textured Laminate with PU Seal',
      desc: 'Rich chocolate walnut grain with deep tactile feel and high resistance to daily abrasion.',
      highlight: 'BDE Showroom Best-Seller'
    },
    {
      id: 'dr-344',
      code: 'BDE-DR-344',
      name: 'Scandinavian White Oak Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 210,
      rateMaxSqft: 270,
      woodTone: 'oak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Matte Natural Blonde Oak 1.0mm Heavy Sheet',
      desc: 'Modern light blonde woodgrain with zero-glare suede matte surface for clean airy rooms.',
      highlight: 'Modern Flat Standard'
    },
    {
      id: 'dr-345',
      code: 'BDE-DR-345',
      name: 'Roman Travertine Stone Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 225,
      rateMaxSqft: 290,
      woodTone: 'travertine',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Linear Porous Limestone Textured Laminate',
      desc: 'Warm beige architectural limestone texture with natural earthy linear striations.',
      highlight: 'Architectural Choice'
    },
    {
      id: 'dr-346',
      code: 'BDE-DR-346',
      name: 'Royal Burma Teak Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 200,
      rateMaxSqft: 260,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Traditional Golden Burma Teak Laminate Sheet',
      desc: 'Durable everyday high-performance teak laminate with factory-calibrated smooth face.',
      highlight: 'High Durability Standard'
    },
    {
      id: 'dr-347',
      code: 'BDE-DR-347',
      name: 'Slate Charcoal Anti-Fingerprint',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 245,
      rateMaxSqft: 315,
      woodTone: 'slate',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Super-Matte Anti-Fingerprint Anti-Smudge Laminate',
      desc: 'Ultra-luxurious anti-fingerprint surface that stays spotless even with heavy daily touch.',
      highlight: 'Zero Fingerprints'
    },
    {
      id: 'dr-348',
      code: 'BDE-DR-348',
      name: 'Midnight Velvet Navy Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 230,
      rateMaxSqft: 295,
      woodTone: 'navy',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Deep Indigo Velvet Matte Solid Laminate',
      desc: 'Regal navy blue door with smooth matte texture, paired beautifully with gold handles.',
      highlight: 'Contemporary Chic'
    },
    {
      id: 'dr-349',
      code: 'BDE-DR-349',
      name: 'Venetian Terrazzo Stone Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 235,
      rateMaxSqft: 300,
      woodTone: 'terrazzo',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Pearl Terrazzo Laminate with Colored Aggregate',
      desc: 'Italian designer terrazzo stone chips on ivory base, resistant to water spills & scuffs.',
      highlight: 'Trendy & Artistic'
    },
    {
      id: 'dr-350',
      code: 'BDE-DR-350',
      name: 'Brushed Brass Metallic Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 260,
      rateMaxSqft: 330,
      woodTone: 'brass',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Champagne Metallic Brushed Foil Laminate',
      desc: 'Warm metallic shimmer providing an ultra-luxurious private entrance aesthetic.',
      highlight: 'Glamour Entrance'
    },
    {
      id: 'dr-351',
      code: 'BDE-DR-351',
      name: 'Industrial Concrete Slate Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 215,
      rateMaxSqft: 275,
      woodTone: 'concrete',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Raw Loft Cast-Concrete Textured Laminate',
      desc: 'Weathered grey cement slate surface with micro-rough texture for modern rustic interiors.',
      highlight: 'Industrial Minimal'
    },
    {
      id: 'dr-352',
      code: 'BDE-DR-352',
      name: 'Dual-Tone Teak & Ivory Flush',
      category: 'laminated',
      categoryLabel: 'Laminated & Veneer Flush',
      baseRateSqft: 230,
      rateMaxSqft: 295,
      woodTone: 'dualtone',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Split Vertical Half Teak & Half Ivory Solid',
      desc: 'Designer split composition with seamless center T-profile joint in rose gold.',
      highlight: 'Designer Custom Split'
    },

    // -----------------------------------------------------------------------
    // CATEGORY D: MANDIR & POOJA JALI DOORS (9 Designs: BDE-DR-361 - 369)
    // -----------------------------------------------------------------------
    {
      id: 'dr-361',
      code: 'BDE-DR-361',
      name: 'Sacred Om Mandir Jali',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 440,
      rateMaxSqft: 560,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Golden CNC Om Insignia with Frosted Acrylic Backing',
      desc: 'Centered holy Om carving with intricate floral jaali fretwork and back-lit warm glow.',
      highlight: 'Most Sacred Mandir'
    },
    {
      id: 'dr-362',
      code: 'BDE-DR-362',
      name: 'Shubha Labh Swastik Arch',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 430,
      rateMaxSqft: 550,
      woodTone: 'rosewood',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Traditional Swastik & Kalash Double Panel',
      desc: 'Holy Swastik and auspicious Kalash twin fretwork panels with carved bell hanging motifs.',
      highlight: 'Auspicious Blessings'
    },
    {
      id: 'dr-363',
      code: 'BDE-DR-363',
      name: 'Peacock Feather Sacred Jali',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 460,
      rateMaxSqft: 580,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Artistic Mayur Feather Laser Jali Screen',
      desc: 'Elegant dancing peacock silhouette with open fretwork ventilation for daily incense airflow.',
      highlight: 'Artistic Devotion'
    },
    {
      id: 'dr-364',
      code: 'BDE-DR-364',
      name: 'Gayatri Bells CNC Mandir',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 435,
      rateMaxSqft: 545,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Temple Ghanti Reliefs with Jali Lattice',
      desc: 'Row of hanging temple bells carved in 3D relief with lower acoustic ventilation fretwork.',
      highlight: 'Temple Bell Harmony'
    },
    {
      id: 'dr-365',
      code: 'BDE-DR-365',
      name: 'Durga Trishul Devotional',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 470,
      rateMaxSqft: 600,
      woodTone: 'rosewood',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Deep Sculpted Trishul & Holy Chakra Relief',
      desc: 'Revered Maa Durga Trishul emblem with radiating divine energy rays on Burma teak core.',
      highlight: 'Durga Puja Special'
    },
    {
      id: 'dr-366',
      code: 'BDE-DR-366',
      name: 'Radha Krishna Flute Jali',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 450,
      rateMaxSqft: 570,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Divine Flute & Peacock Feather Carved Jali',
      desc: 'Delicate Bansuri flute carving intertwined with Mor Pankh plume and golden inner inlay.',
      highlight: 'Divine Love & Peace'
    },
    {
      id: 'dr-367',
      code: 'BDE-DR-367',
      name: 'Lotus Temple Geometrical Jali',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 420,
      rateMaxSqft: 530,
      woodTone: 'oak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Clean Blonde Oak Sacred Geometric Lattice',
      desc: 'Modern interpretation of sacred geometric jaali for contemporary clean home mandirs.',
      highlight: 'Contemporary Mandir'
    },
    {
      id: 'dr-368',
      code: 'BDE-DR-368',
      name: 'Shanku Chakra Arch Mandir',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 460,
      rateMaxSqft: 585,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Holy Conch & Sudarshana Chakra Inlays',
      desc: 'Sacred Shanku and Chakra motifs framed in an authentic South Indian temple gopuram arch.',
      highlight: 'Tirupati Inspiration'
    },
    {
      id: 'dr-369',
      code: 'BDE-DR-369',
      name: 'Ganesha Blessings 3D Jali',
      category: 'mandir',
      categoryLabel: 'Mandir & Pooja Jali',
      baseRateSqft: 480,
      rateMaxSqft: 610,
      woodTone: 'teak',
      core: 'Seasoned Pinewood Solid Core (IS:2202)',
      finish: 'Vighnaharta Ganesha 3D Relief & Brass Bells',
      desc: 'Venerated Lord Ganesha central relief bestowing prosperity, framed with real brass pooja bells.',
      highlight: 'Vighnaharta Prosperity'
    }
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
    activeDoorId: 'dr-301'
  };

  // Grade rates mapping for estimator
  const GRADE_PRICING = {
    '3d': { min: 380, max: 480, name: '3D Deep CNC Carved' },
    '2d': { min: 260, max: 340, name: '2D Contemporary Groove' },
    'laminated': { min: 190, max: 250, name: 'Premium Laminated Flush' },
    'mandir': { min: 420, max: 540, name: 'Mandir & Pooja Jali' }
  };

  // =========================================================================
  // 3. PROCEDURAL SVG DOOR RENDERER
  // =========================================================================
  function getWoodColors(tone) {
    switch (tone) {
      case 'teak': return { bg: '#b47b48', grain1: '#8d5626', grain2: '#714119', frame: '#78471e' };
      case 'walnut': return { bg: '#4a2e1b', grain1: '#311c0f', grain2: '#201209', frame: '#2d180d' };
      case 'oak': return { bg: '#d6c0a2', grain1: '#bfaa8f', grain2: '#a8947a', frame: '#af9b82' };
      case 'rosewood': return { bg: '#7a2e20', grain1: '#4a180e', grain2: '#351009', frame: '#52190f' };
      case 'wenge': return { bg: '#241c18', grain1: '#120d0a', grain2: '#080605', frame: '#18120f' };
      case 'maple': return { bg: '#c89657', grain1: '#a47236', grain2: '#865b27', frame: '#98662e' };
      case 'carrara': return { bg: '#f8fafc', grain1: '#cbd5e1', grain2: '#94a3b8', frame: '#94a3b8' };
      case 'marquina': return { bg: '#0f172a', grain1: '#eab308', grain2: '#ca8a04', frame: '#ca8a04' };
      case 'travertine': return { bg: '#e7dec8', grain1: '#d5c8ab', grain2: '#b8a987', frame: '#b8a987' };
      case 'slate': return { bg: '#334155', grain1: '#1e293b', grain2: '#0f172a', frame: '#1e293b' };
      case 'pearl': return { bg: '#fdfbf7', grain1: '#e2e8f0', grain2: '#cbd5e1', frame: '#cbd5e1' };
      case 'olive': return { bg: '#3c4a3e', grain1: '#28322a', grain2: '#1b221c', frame: '#28322a' };
      case 'navy': return { bg: '#1e293b', grain1: '#0f172a', grain2: '#020617', frame: '#0f172a' };
      case 'terracotta': return { bg: '#b85d43', grain1: '#8d422d', grain2: '#6e311f', frame: '#8d422d' };
      case 'greige': return { bg: '#bdb4a6', grain1: '#9f9586', grain2: '#83796a', frame: '#9f9586' };
      case 'brass': return { bg: '#d4af37', grain1: '#fef08a', grain2: '#a16207', frame: '#a16207' };
      case 'concrete': return { bg: '#8c929a', grain1: '#64748b', grain2: '#475569', frame: '#475569' };
      case 'terrazzo': return { bg: '#ede8df', grain1: '#b85d43', grain2: '#2c5364', frame: '#9f9586' };
      default: return { bg: '#b47b48', grain1: '#8d5626', grain2: '#714119', frame: '#78471e' };
    }
  }

  window.renderDoorSvg = function (door, width = 120, height = 220) {
    const c = getWoodColors(door.woodTone);
    const cat = door.category;

    // Handle styling
    const handleY = height * 0.52;
    const handleX = width - 14;

    let innerContent = '';

    if (cat === '3d') {
      // 3D Bevelled Panels & Deep CNC Relief
      innerContent = `
        <!-- Outer Outer Frame -->
        <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="3" fill="none" stroke="${c.frame}" stroke-width="2.5" />
        
        <!-- Top Arch / Crest Relief -->
        <path d="M12,14 Q${width/2},22 ${width-12},14 L${width-12},45 Q${width/2},50 12,45 Z" fill="${c.grain1}" opacity="0.65" />
        <circle cx="${width/2}" cy="30" r="7" fill="#fbbf24" opacity="0.8" />

        <!-- 3D Bevelled Panels Grid -->
        <g filter="drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
          <!-- Top Panel -->
          <rect x="14" y="52" width="${width - 28}" height="${height * 0.22}" rx="3" fill="${c.bg}" stroke="${c.grain1}" stroke-width="2" />
          <rect x="18" y="56" width="${width - 36}" height="${height * 0.22 - 8}" rx="2" fill="${c.grain2}" opacity="0.4" />
          <line x1="22" y1="${56 + (height*0.22 - 8)/2}" x2="${width - 22}" y2="${56 + (height*0.22 - 8)/2}" stroke="#ffffff" stroke-width="0.8" opacity="0.3" />

          <!-- Center Feature (Diamond / Mandala / Fluted) -->
          <rect x="14" y="${58 + height * 0.22}" width="${width - 28}" height="${height * 0.28}" rx="3" fill="${c.bg}" stroke="${c.grain1}" stroke-width="2" />
          <polygon points="${width/2},${64 + height * 0.22} ${width - 20},${58 + height * 0.36} ${width/2},${52 + height * 0.50} 20,${58 + height * 0.36}" fill="${c.grain1}" opacity="0.55" stroke="#fef08a" stroke-width="0.8" />
          <circle cx="${width/2}" cy="${58 + height * 0.36}" r="6" fill="#fbbf24" />

          <!-- Bottom Panels -->
          <rect x="14" y="${64 + height * 0.50}" width="${(width - 32)/2}" height="${height * 0.28}" rx="3" fill="${c.bg}" stroke="${c.grain1}" stroke-width="2" />
          <rect x="${14 + (width - 32)/2 + 4}" y="${64 + height * 0.50}" width="${(width - 32)/2}" height="${height * 0.28}" rx="3" fill="${c.bg}" stroke="${c.grain1}" stroke-width="2" />
        </g>
      `;
    } else if (cat === '2d') {
      // 2D Minimalist Route Lines & Metallic Inlays
      innerContent = `
        <!-- Minimal Border -->
        <rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="2" fill="none" stroke="${c.frame}" stroke-width="1.5" opacity="0.6" />
        
        <!-- Clean Vertical Dual Inlay -->
        <line x1="${width * 0.28}" y1="12" x2="${width * 0.28}" y2="${height - 12}" stroke="#fbbf24" stroke-width="2" opacity="0.85" />
        <line x1="${width * 0.34}" y1="12" x2="${width * 0.34}" y2="${height - 12}" stroke="${c.grain2}" stroke-width="1.5" opacity="0.7" />

        <!-- Cross Horizontal Accent Grooves -->
        <line x1="${width * 0.28}" y1="${height * 0.3}" x2="${width - 14}" y2="${height * 0.3}" stroke="${c.grain2}" stroke-width="1.8" />
        <line x1="${width * 0.28}" y1="${height * 0.4}" x2="${width - 14}" y2="${height * 0.4}" stroke="${c.grain2}" stroke-width="1.8" />
        <line x1="${width * 0.28}" y1="${height * 0.65}" x2="${width - 14}" y2="${height * 0.65}" stroke="${c.grain2}" stroke-width="1.8" />
        <line x1="${width * 0.28}" y1="${height * 0.75}" x2="${width - 14}" y2="${height * 0.75}" stroke="${c.grain2}" stroke-width="1.8" />
      `;
    } else if (cat === 'laminated') {
      // Laminated Seamless Flush with Edge Band & Marble/Veneer Sheen
      innerContent = `
        <!-- High-Gloss Diagonal Sheen Sweep -->
        <polygon points="12,0 ${width},0 ${width - 20},${height} 0,${height}" fill="#ffffff" opacity="0.06" />

        <!-- Seamless Edge Banding Representation -->
        <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="2" fill="none" stroke="#ca8a04" stroke-width="1" opacity="0.4" />
        
        <!-- Subtle Center Grain Flow -->
        <path d="M${width*0.2},0 Q${width*0.5},${height*0.5} ${width*0.3},${height}" stroke="${c.grain1}" stroke-width="1.2" fill="none" opacity="0.4" />
        <path d="M${width*0.6},0 Q${width*0.8},${height*0.5} ${width*0.7},${height}" stroke="${c.grain1}" stroke-width="1.2" fill="none" opacity="0.3" />
      `;
    } else if (cat === 'mandir') {
      // Mandir & Pooja Jali Door with Sacred Lattice & Arch
      innerContent = `
        <!-- Temple Gopuram Arched Frame -->
        <path d="M10,${height*0.1} Q${width/2},0 ${width-10},${height*0.1} L${width-10},${height-10} L10,${height-10} Z" fill="none" stroke="#fbbf24" stroke-width="2.5" />
        
        <!-- Backlit Warm Jali Window -->
        <rect x="18" y="${height*0.16}" width="${width - 36}" height="${height*0.35}" rx="4" fill="#fef08a" opacity="0.25" />
        
        <!-- Intricate Floral Jali Fretwork Screen -->
        <g stroke="#ca8a04" stroke-width="1" opacity="0.75">
          <line x1="20" y1="${height*0.22}" x2="${width-20}" y2="${height*0.22}" />
          <line x1="20" y1="${height*0.28}" x2="${width-20}" y2="${height*0.28}" />
          <line x1="20" y1="${height*0.34}" x2="${width-20}" y2="${height*0.34}" />
          <line x1="20" y1="${height*0.40}" x2="${width-20}" y2="${height*0.40}" />
          <line x1="${width*0.35}" y1="${height*0.16}" x2="${width*0.35}" y2="${height*0.51}" />
          <line x1="${width*0.50}" y1="${height*0.16}" x2="${width*0.50}" y2="${height*0.51}" />
          <line x1="${width*0.65}" y1="${height*0.16}" x2="${width*0.65}" y2="${height*0.51}" />
        </g>

        <!-- Sacred Golden OM / Kalash Emblem -->
        <circle cx="${width/2}" cy="${height*0.33}" r="11" fill="#ca8a04" stroke="#fef08a" stroke-width="1.5" />
        <text x="${width/2}" y="${height*0.33 + 4}" font-size="10" font-weight="900" fill="#0d1117" text-anchor="middle">ॐ</text>

        <!-- Lower Carved Solid Wood Bells -->
        <rect x="18" y="${height*0.56}" width="${width - 36}" height="${height*0.35}" rx="3" fill="${c.bg}" stroke="#ca8a04" stroke-width="1.5" />
        <circle cx="${width*0.35}" cy="${height*0.68}" r="4" fill="#fbbf24" />
        <circle cx="${width*0.50}" cy="${height*0.68}" r="5" fill="#fbbf24" />
        <circle cx="${width*0.65}" cy="${height*0.68}" r="4" fill="#fbbf24" />
        <line x1="${width*0.35}" y1="${height*0.58}" x2="${width*0.35}" y2="${height*0.68}" stroke="#ca8a04" stroke-width="1.5" />
        <line x1="${width*0.50}" y1="${height*0.58}" x2="${width*0.50}" y2="${height*0.68}" stroke="#ca8a04" stroke-width="1.5" />
        <line x1="${width*0.65}" y1="${height*0.58}" x2="${width*0.65}" y2="${height*0.68}" stroke="#ca8a04" stroke-width="1.5" />
      `;
    }

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="door-base-${door.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c.bg}" />
            <stop offset="60%" stop-color="${c.bg}" />
            <stop offset="100%" stop-color="${c.frame}" />
          </linearGradient>
          <linearGradient id="handle-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#CA8A04" />
            <stop offset="50%" stop-color="#FDE047" />
            <stop offset="100%" stop-color="#A16207" />
          </linearGradient>
        </defs>

        <!-- Door Outer Slab Base -->
        <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="4" fill="url(#door-base-${door.id})" stroke="#0a0a0c" stroke-width="2" />

        <!-- Inner Content Specific to Design -->
        ${innerContent}

        <!-- Architectural Handle & Key Escutcheon -->
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
          <!-- Backplate -->
          <rect x="${handleX - 4}" y="${handleY - 14}" width="8" height="28" rx="2" fill="url(#handle-gold)" />
          <!-- Lever Handle -->
          <rect x="${handleX - 12}" y="${handleY - 4}" width="16" height="4" rx="2" fill="#fef08a" />
          <!-- Keyhole -->
          <circle cx="${handleX}" cy="${handleY + 7}" r="1.5" fill="#0d1117" />
        </g>
      </svg>
    `;
  };

  // =========================================================================
  // 4. PRICE ESTIMATION ENGINE
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
  // 5. CATALOGUE FILTERING, SEARCH & SORTING
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
  // 6. RENDER DOOR CARDS (45 DESIGNS)
  // =========================================================================
  window.renderDoorCards = function (doorsList) {
    const grid = document.getElementById('doors-grid');
    if (!grid) return;

    if (!doorsList || doorsList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 16px; background: rgba(22,27,34,0.6); border-radius: 14px; border: 1px dashed rgba(245,158,11,0.3);">
          <div style="font-size: 32px; margin-bottom: 8px;">🚪</div>
          <h3 style="color: #fbbf24; margin: 0 0 6px 0;">No matching door design found</h3>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Try searching for "teak", "mandir", "3d", "oak", or clear your filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = doorsList.map(door => {
      const approxStdPrice = Math.round(door.baseRateSqft * 21); // 7x3 ft = 21 sq.ft
      return `
        <div class="door-card">
          <!-- Visual Door Preview -->
          <div class="door-preview-stage" onclick="openDoorDetailModal('${door.id}')" title="Click to view full specifications">
            <span class="door-card-badge">${door.categoryLabel}</span>
            <span class="door-rate-pill">From ₹${door.baseRateSqft}/sq.ft</span>
            ${window.renderDoorSvg(door, 130, 230)}
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
  // 7. CARD INTERACTIONS & MODAL
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

    if (title) title.textContent = `${door.name} (${door.code})`;
    if (stage) stage.innerHTML = window.renderDoorSvg(door, 170, 290);
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

  // =========================================================================
  // 8. HIGH-CONVERSION WHATSAPP LEAD INTEGRATION
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
      `• Door Model: ${door.name} (${door.code})\n` +
      `• Category: ${door.categoryLabel}\n` +
      `• Estimated Frame Size: ${w.toFixed(1)} ft W × ${h.toFixed(1)} ft H (${sqft.toFixed(1)} sq.ft)\n` +
      `• Core Grade: ${s.coreThickness}mm ${door.core}\n` +
      `• Finish: ${door.finish}\n` +
      `• Approximate Range: ₹${estMin.toLocaleString('en-IN')} – ₹${estMax.toLocaleString('en-IN')}\n` +
      `• Customer Request: Free onsite frame laser measurement in ${locality}`;

    const payload = {
      customer_name: user.name,
      phone: user.phone,
      delivery_locality: locality,
      quote_type: 'Engineered Door Onsite Quote',
      furniture_type: `Door: ${door.name}`,
      dimensions: `${w.toFixed(1)} ft × ${h.toFixed(1)} ft`,
      materials_breakdown: materialsText,
      notes: `Selected engineered door design ${door.code} from 45-model catalogue`
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
      `Please schedule a free visit to measure my door frame onsite and confirm delivery timeline. Thank you!`;

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
  // 9. INITIALIZATION
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
