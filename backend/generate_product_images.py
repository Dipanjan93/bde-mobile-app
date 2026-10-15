import os
import re

os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"
from sqlalchemy import create_engine, text

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "static", "img", "products")
os.makedirs(OUTPUT_DIR, exist_ok=True)

raw_db_url = "postgresql+psycopg://neondb_owner:npg_ObrtiTZ9a5YW@ep-sweet-shape-b3jn07iv-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(raw_db_url)

def get_svg_for_product(sku, name, category, brand, sqft):
    cat_lower = (category or "").lower()
    name_lower = (name or "").lower()
    brand_clean = (brand or "BDE Premium").upper()
    
    # 1. Plywood Render
    if "plywood" in cat_lower or "ply" in name_lower:
        is_marine = "marine" in name_lower or "mar" in sku.lower() or "club" in brand_clean.lower()
        ply_grade = "IS:710 WATERPROOF MARINE" if is_marine else "IS:303 BWR COMMERCIAL GRADE"
        ply_color_top = "#d97706" if is_marine else "#b45309"
        ply_wood_grain = "#92400e" if is_marine else "#78350f"
        stamp_color = "#1e3a8a" if is_marine else "#b91c1c"
        
        # Extract thickness
        thick_match = re.search(r'(\d+)\s*mm', name_lower)
        thick = thick_match.group(0).upper() if thick_match else "18 MM"
        
        # Dimensions
        dim_match = re.search(r'(\d+)\s*[xX]\s*(\d+)', name_lower)
        dim = f"{dim_match.group(1)}x{dim_match.group(2)} FT" if dim_match else "8x4 FT"

        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="sheetWood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{ply_color_top}"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="{ply_wood_grain}"/>
    </linearGradient>
    <linearGradient id="corePlies" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="25%" stop-color="#78350f"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="75%" stop-color="#92400e"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  
  <!-- Subtle wood plank shadow -->
  <ellipse cx="200" cy="340" rx="140" ry="18" fill="rgba(0,0,0,0.12)" filter="blur(6px)"/>
  
  <!-- Plywood stack base 3D isometric view -->
  <g filter="url(#shadow)" transform="translate(60, 60)">
    <!-- Bottom sheets shadow plies -->
    <polygon points="20,250 260,250 275,235 35,235" fill="#78350f"/>
    <polygon points="260,250 275,235 275,245 260,260" fill="#451a03"/>
    <polygon points="20,250 260,250 260,260 20,260" fill="url(#corePlies)"/>
    
    <!-- Top Face Sheet -->
    <polygon points="10,230 250,230 270,40 30,40" fill="url(#sheetWood)"/>
    
    <!-- Realistic Wood Grains -->
    <path d="M 50,45 Q 80,130 65,225" stroke="{ply_wood_grain}" stroke-width="1.8" fill="none" opacity="0.35"/>
    <path d="M 120,42 Q 160,110 135,228" stroke="{ply_wood_grain}" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M 190,40 Q 230,120 205,226" stroke="{ply_wood_grain}" stroke-width="1.5" fill="none" opacity="0.35"/>
    
    <!-- Side edge layers showing real ply veneer thickness -->
    <polygon points="250,230 270,40 275,50 255,240" fill="#451a03"/>
    <polygon points="10,230 250,230 255,240 15,240" fill="url(#corePlies)"/>
    
    <!-- Authentic Stamped Brand Seal -->
    <g transform="translate(60, 95) rotate(-5)">
      <rect x="0" y="0" width="160" height="75" rx="6" fill="none" stroke="{stamp_color}" stroke-width="3" stroke-dasharray="8,4" opacity="0.85"/>
      <text x="80" y="26" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="{stamp_color}" text-anchor="middle" letter-spacing="1">{brand_clean}</text>
      <line x1="15" y1="32" x2="145" y2="32" stroke="{stamp_color}" stroke-width="1.5" opacity="0.8"/>
      <text x="80" y="46" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="{stamp_color}" text-anchor="middle">{ply_grade}</text>
      <text x="80" y="62" font-family="Arial, sans-serif" font-weight="800" font-size="12" fill="{stamp_color}" text-anchor="middle">{dim} • {thick}</text>
    </g>

    <!-- Hologram Sticker -->
    <circle cx="230" cy="80" r="14" fill="gold" stroke="#b45309" stroke-width="1.5"/>
    <text x="230" y="84" font-family="Arial, sans-serif" font-weight="900" font-size="8" fill="#78350f" text-anchor="middle">100% OK</text>
  </g>
  
  <!-- Top Spec Badge -->
  <rect x="16" y="16" width="90" height="26" rx="6" fill="#1e1b4b"/>
  <text x="61" y="33" font-family="Arial, sans-serif" font-weight="800" font-size="12" fill="#facc15" text-anchor="middle">{thick}</text>
</svg>'''

    # 2. Adhesive (Fevicol) Render
    elif "adhesive" in cat_lower or "fevicol" in name_lower:
        is_marine = "marine" in name_lower or "mar" in sku.lower()
        is_heatx = "heatx" in name_lower or "htx" in sku.lower()
        tub_color = "#dc2626" if is_marine else ("#ea580c" if is_heatx else "#2563eb")
        prod_title = "FEVICOL MARINE" if is_marine else ("FEVICOL HEATX" if is_heatx else "FEVICOL SH")
        tagline = "Waterproof Wood Adhesive" if is_marine else ("Heatproof Contact Adhesive" if is_heatx else "Ultimate Synthetic Resin")

        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="tubBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#f8fafc"/>
      <stop offset="80%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="lidGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="{tub_color}"/>
      <stop offset="40%" stop-color="{tub_color}"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  
  <ellipse cx="200" cy="350" rx="90" ry="16" fill="rgba(0,0,0,0.18)" filter="blur(6px)"/>
  
  <g filter="url(#shadow)" transform="translate(100, 70)">
    <!-- Tub Handle -->
    <path d="M 15,100 C 15,20 185,20 185,100" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Tub Body -->
    <path d="M 20,80 L 180,80 L 165,260 C 165,270 35,270 35,260 Z" fill="url(#tubBody)"/>
    
    <!-- Lid -->
    <ellipse cx="100" cy="80" rx="85" ry="16" fill="url(#lidGrad)"/>
    <rect x="15" y="68" width="170" height="14" rx="4" fill="url(#lidGrad)"/>
    <ellipse cx="100" cy="68" rx="85" ry="14" fill="{tub_color}"/>
    
    <!-- Label Banner -->
    <path d="M 24,120 L 176,120 L 171,220 L 29,220 Z" fill="#facc15"/>
    <rect x="30" y="130" width="140" height="40" rx="4" fill="{tub_color}"/>
    <text x="100" y="156" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">{prod_title}</text>
    <text x="100" y="185" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="#1e1b4b" text-anchor="middle">{tagline}</text>
    
    <!-- Iconic Elephants motif -->
    <g transform="translate(70, 192)">
      <circle cx="15" cy="12" r="10" fill="#1e3a8a"/>
      <circle cx="45" cy="12" r="10" fill="#1e3a8a"/>
      <rect x="23" y="10" width="14" height="4" fill="#facc15"/>
    </g>
    <text x="100" y="248" font-family="Arial, sans-serif" font-weight="800" font-size="13" fill="#334155" text-anchor="middle">Pidilite Original</text>
  </g>
</svg>'''

    # 3. Laminate / Sunmica Render
    elif "laminate" in cat_lower or "sunmica" in name_lower or "lam" in sku.lower():
        is_liner = "liner" in name_lower or "inner" in name_lower
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="lamSheet" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{'#f3f4f6' if is_liner else '#1e293b'}"/>
      <stop offset="40%" stop-color="{'#e5e7eb' if is_liner else '#334155'}"/>
      <stop offset="80%" stop-color="{'#d1d5db' if is_liner else '#0f172a'}"/>
      <stop offset="100%" stop-color="{'#9ca3af' if is_liner else '#020617'}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  
  <g filter="url(#shadow)" transform="translate(60, 50)">
    <!-- Curled Sunmica sheet in perspective -->
    <path d="M 40,280 C 120,290 220,260 270,240 L 250,30 C 190,50 110,30 30,20 Z" fill="url(#lamSheet)"/>
    
    <!-- Glossy sheen highlight -->
    <path d="M 60,30 L 100,270 C 130,270 170,250 160,35 Z" fill="rgba(255,255,255,0.18)"/>
    
    <!-- Corner peel 3D effect -->
    <path d="M 230,250 C 240,245 270,240 270,240 L 245,215 C 240,230 235,245 230,250 Z" fill="#e2e8f0"/>
    
    <!-- Brand Label Badge -->
    <rect x="70" y="110" width="150" height="80" rx="8" fill="rgba(255,255,255,0.92)" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="145" y="140" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#1e1b4b" text-anchor="middle">{brand_clean}</text>
    <text x="145" y="160" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#7c3aed" text-anchor="middle">{'0.8mm Liner Sheet' if is_liner else '1.0mm High Gloss Sunmica'}</text>
    <text x="145" y="178" font-family="Arial, sans-serif" font-weight="600" font-size="10" fill="#64748b" text-anchor="middle">8 x 4 Feet • Scratch Proof</text>
  </g>
</svg>'''

    # 4. Hardware (Hinges, Aldrop, Lock, Channel) Render
    elif "hardware" in cat_lower or "hdw" in sku.lower() or "hinge" in name_lower or "bolt" in name_lower or "lock" in name_lower:
        is_lock = "lock" in name_lower
        is_aldrop = "aldrop" in name_lower or "ald" in sku.lower()
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="steelGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#cbd5e1"/>
      <stop offset="70%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  
  <g filter="url(#shadow)" transform="translate(70, 70)">
    {'<!-- Aldrop / Lock Set -->' if is_aldrop or is_lock else '<!-- Heavy SS Hinge -->'}
    <rect x="20" y="40" width="90" height="180" rx="10" fill="url(#steelGrad)" stroke="#64748b" stroke-width="2"/>
    <rect x="150" y="40" width="90" height="180" rx="10" fill="url(#steelGrad)" stroke="#64748b" stroke-width="2"/>
    <!-- Central Pin cylinder -->
    <rect x="105" y="30" width="50" height="200" rx="8" fill="url(#steelGrad)" stroke="#475569" stroke-width="2.5"/>
    
    <!-- Screw Holes with countersink -->
    <circle cx="65" cy="70" r="10" fill="#475569"/>
    <circle cx="65" cy="70" r="6" fill="#1e293b"/>
    <circle cx="65" cy="130" r="10" fill="#475569"/>
    <circle cx="65" cy="130" r="6" fill="#1e293b"/>
    <circle cx="65" cy="190" r="10" fill="#475569"/>
    <circle cx="65" cy="190" r="6" fill="#1e293b"/>

    <circle cx="195" cy="70" r="10" fill="#475569"/>
    <circle cx="195" cy="70" r="6" fill="#1e293b"/>
    <circle cx="195" cy="130" r="10" fill="#475569"/>
    <circle cx="195" cy="130" r="6" fill="#1e293b"/>
    <circle cx="195" cy="190" r="10" fill="#475569"/>
    <circle cx="195" cy="190" r="6" fill="#1e293b"/>
    
    <!-- Quality Seal -->
    <rect x="50" y="240" width="160" height="30" rx="6" fill="#1e1b4b"/>
    <text x="130" y="260" font-family="Arial, sans-serif" font-weight="800" font-size="11" fill="#facc15" text-anchor="middle">SS-304 HEAVY DUTY</text>
  </g>
</svg>'''

    # 5. Default Generic Hardware / Material Render
    else:
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect x="50" y="50" width="300" height="300" rx="20" fill="url(#cardGrad)"/>
  <circle cx="200" cy="160" r="60" fill="rgba(255,255,255,0.15)"/>
  <text x="200" y="175" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="#facc15" text-anchor="middle">BDE</text>
  <text x="200" y="245" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#ffffff" text-anchor="middle">{name[:24]}</text>
  <text x="200" y="275" font-family="Arial, sans-serif" font-weight="600" font-size="13" fill="#cbd5e1" text-anchor="middle">{brand_clean} • {category}</text>
</svg>'''

def main():
    with engine.connect() as conn:
        prods = conn.execute(text("SELECT sku, name, category, brand, sqft_per_piece FROM products")).fetchall()
        print(f"Generating images for {len(prods)} products...")
        for p in prods:
            sku, name, cat, brand, sqft = p
            svg_content = get_svg_for_product(sku, name, cat, brand, sqft)
            
            # Save as {sku}.jpg (and {sku}.svg)
            # Browsers easily render SVG served directly under .jpg when proper headers or fallback is configured
            file_path_jpg = os.path.join(OUTPUT_DIR, f"{sku}.jpg")
            with open(file_path_jpg, "w", encoding="utf-8") as f:
                f.write(svg_content)
                
            file_path_svg = os.path.join(OUTPUT_DIR, f"{sku}.svg")
            with open(file_path_svg, "w", encoding="utf-8") as f:
                f.write(svg_content)

    print("Product images generated successfully in static/img/products!")

if __name__ == "__main__":
    main()
