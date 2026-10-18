import os
import re
import math
import urllib.parse
from datetime import datetime, timezone, timedelta, date
from typing import Optional, List
from collections import defaultdict
import hmac
import hashlib
import time
import base64
import json

os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from fastapi import FastAPI, HTTPException, Depends, status, Query, Request, UploadFile, File, Form
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc, text

from database import engine, Base, get_db
import models
import schemas
from models import IST, get_now_ist

# Ensure all tables are created in Neon PostgreSQL
Base.metadata.create_all(bind=engine)

# Safe column addition for CraftPost and Product without touching live business tables
try:
    with engine.connect() as conn:
        for col_name, col_def in [
            ("status", "VARCHAR(30) DEFAULT 'pending'"),
            ("is_approved", "BOOLEAN DEFAULT FALSE"),
            ("bill_number", "VARCHAR(60)"),
            ("upi_id", "VARCHAR(100)"),
            ("cashback_amount", "FLOAT DEFAULT 0.0"),
            ("cashback_status", "VARCHAR(30) DEFAULT 'unpaid'")
        ]:
            try:
                conn.execute(text(f"ALTER TABLE craft_posts ADD COLUMN IF NOT EXISTS {col_name} {col_def};"))
                conn.commit()
            except Exception:
                pass

        for col_name, col_def in [
            ("description", "TEXT"),
            ("size", "VARCHAR(100)"),
            ("image_url", "VARCHAR(500)"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE products ADD COLUMN IF NOT EXISTS {col_name} {col_def};"))
                conn.commit()
            except Exception:
                pass
except Exception as e:
    print(f"Safe column migration notice: {e}")

def save_product_photo(sku: str, image_data: str) -> str:
    """
    Saves base64 image data to static/img/products/{sku}.jpg and returns relative URL.
    Falls back gracefully to data URL or existing path if disk write fails.
    """
    if not image_data:
        return ""
    image_data = image_data.strip()
    if not image_data.startswith("data:image/"):
        return image_data

    try:
        clean_sku = sku.strip().upper().replace("/", "_").replace("\\", "_").replace(" ", "_")
        prod_dir = os.path.join(STATIC_DIR, "img", "products")
        os.makedirs(prod_dir, exist_ok=True)

        header, encoded = image_data.split(",", 1) if "," in image_data else ("", image_data)
        ext = "jpg"
        if "png" in header:
            ext = "png"
        elif "webp" in header:
            ext = "webp"
        
        filename = f"{clean_sku}.{ext}"
        file_path = os.path.join(prod_dir, filename)
        binary_data = base64.b64decode(encoded)
        with open(file_path, "wb") as f:
            f.write(binary_data)
        
        # Also ensure .jpg exists for endpoints looking for .jpg
        if ext != "jpg":
            jpg_path = os.path.join(prod_dir, f"{clean_sku}.jpg")
            with open(jpg_path, "wb") as f:
                f.write(binary_data)

        return f"/static/img/products/{clean_sku}.{ext}?v={int(time.time())}"
    except Exception as e:
        print(f"Notice: Failed writing product image to disk for {sku}: {e}")
        return image_data


app = FastAPI(
    title="Baba Dugdheswar Enterprise - Mobile E-Commerce & Business Engine",
    description="Flipkart-inspired Mobile Storefront & Backend for Onda, Bankura Showroom",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

if os.path.exists(FRONTEND_DIR):
    app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")


# --- Seed Initial Carpenters & Showcase if table empty ---
def seed_initial_data(db: Session):
    try:
        # 1. Carpenters
        if db.query(models.Carpenter).count() == 0:
            sample_carpenters = [
                models.Carpenter(
                    name="Tapan Karmakar",
                    phone="9800523411",
                    village="Punisole",
                    experience_years=14,
                    rating=4.9,
                    reviews_count=88,
                    specialties="Sliding Wardrobes, Modular Kitchen, Beds",
                    avatar="👨‍🔧",
                    completed_projects=96,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Swapan Sutradhar",
                    phone="9434198273",
                    village="Onda",
                    experience_years=18,
                    rating=4.9,
                    reviews_count=124,
                    specialties="Hydraulic Box Beds, Divans, Heavy Teak Work",
                    avatar="🪵",
                    completed_projects=140,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Dilip Mistri",
                    phone="9732812045",
                    village="Ramsagar",
                    experience_years=11,
                    rating=4.8,
                    reviews_count=64,
                    specialties="Modular Kitchen, Mica Edge Bending, Drawer Channels",
                    avatar="🔨",
                    completed_projects=70,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Gouranga Mistri",
                    phone="9832761902",
                    village="Taldangra",
                    experience_years=16,
                    rating=4.9,
                    reviews_count=95,
                    specialties="Full Home Interior, Mandir Work, CNC Laminates",
                    avatar="📐",
                    completed_projects=102,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Madhai Karmakar",
                    phone="9474328910",
                    village="Bishnupur",
                    experience_years=12,
                    rating=4.8,
                    reviews_count=72,
                    specialties="TV Unit, Study Tables, Dressing Units",
                    avatar="🪚",
                    completed_projects=78,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Biswanath Das",
                    phone="9609234187",
                    village="Bankura",
                    experience_years=9,
                    rating=4.7,
                    reviews_count=52,
                    specialties="Commercial Showrooms, Office Tables, Flush Doors",
                    avatar="👷",
                    completed_projects=58,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Sanatan Mistri",
                    phone="9800574129",
                    village="Onda",
                    experience_years=15,
                    rating=4.9,
                    reviews_count=110,
                    specialties="Royal Bed Divans, Plywood Paneling, Wooden Ceiling",
                    avatar="✨",
                    completed_projects=122,
                    is_verified=True
                ),
                models.Carpenter(
                    name="Prosenjit Sutradhar",
                    phone="9434871239",
                    village="Punisole",
                    experience_years=8,
                    rating=4.8,
                    reviews_count=46,
                    specialties="Acrylic Kitchens, Softclose Hardware, Profile Shutter",
                    avatar="🚪",
                    completed_projects=50,
                    is_verified=True
                ),
            ]
            db.add_all(sample_carpenters)
            db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error seeding initial data: {e}")


# Run seed on startup with session
with Session(engine) as session:
    seed_initial_data(session)


# --- Root & PWA Static Handlers ---
@app.get("/")
def serve_home():
    frontend_index = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(frontend_index):
        return FileResponse(frontend_index, media_type="text/html")
    return {"message": "Baba Dugdheswar Enterprise Storefront API is active."}

@app.get("/manifest.json")
def serve_manifest():
    manifest_path = os.path.join(FRONTEND_DIR, "manifest.json")
    if os.path.exists(manifest_path):
        return FileResponse(manifest_path, media_type="application/manifest+json")
    return {"name": "Baba Dugdheswar Enterprise"}

@app.get("/sw.js")
def serve_sw():
    sw_path = os.path.join(FRONTEND_DIR, "sw.js")
    if os.path.exists(sw_path):
        return FileResponse(sw_path, media_type="application/javascript")
    return Response(content="// sw", media_type="application/javascript")

@app.get("/offline_data.js")
def serve_offline_data():
    offline_path = os.path.join(FRONTEND_DIR, "offline_data.js")
    if os.path.exists(offline_path):
        return FileResponse(offline_path, media_type="application/javascript")
    return Response(content="// offline data", media_type="application/javascript")

# ========================================================
# SHOWROOM STAFF & MANAGEMENT CONSOLE SECURITY ENGINE
# ========================================================
ADMIN_PASSCODE = (os.getenv("ADMIN_PASSCODE") or os.getenv("ADMIN_PIN") or "Dip@1993").strip()
STAFF_PASSCODE = (os.getenv("STAFF_PASSCODE") or "BDE@1234").strip()
SECRET_KEY = os.getenv("SECRET_KEY", "bde-security-onda-bankura-2026")

def create_session_token(role: str) -> str:
    ts = str(int(time.time()))
    payload = f"{role}:{ts}"
    sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{role}:{ts}:{sig}"

def verify_session_token(token: Optional[str]) -> Optional[str]:
    if not token:
        return None
    try:
        parts = token.split(":")
        if len(parts) != 3:
            return None
        role, ts_str, sig = parts
        ts = int(ts_str)
        # 30 days validity
        if time.time() - ts > 30 * 86400:
            return None
        expected_payload = f"{role}:{ts_str}"
        expected_sig = hmac.new(SECRET_KEY.encode(), expected_payload.encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(sig, expected_sig):
            return role
    except Exception:
        return None
    return None

def get_console_role(request: Request) -> Optional[str]:
    token = None
    auth_hdr = (
        request.headers.get("Authorization")
        or request.headers.get("x-bde-auth")
        or request.headers.get("x-admin-token")
    )
    if auth_hdr:
        raw = auth_hdr.split(" ")[1].strip() if auth_hdr.startswith("Bearer ") else auth_hdr.strip()
        role = verify_session_token(raw)
        if role:
            return role
        if ADMIN_PASSCODE and raw == ADMIN_PASSCODE:
            return "owner"
        elif STAFF_PASSCODE and raw == STAFF_PASSCODE:
            return "staff"
    elif "bde_console_token" in request.cookies:
        token = request.cookies.get("bde_console_token")
    elif "bde_console_session" in request.cookies:
        token = request.cookies.get("bde_console_session")

    if token:
        role = verify_session_token(token)
        if role:
            return role

    p = (
        request.headers.get("x-passcode")
        or request.headers.get("x-admin-passcode")
        or request.headers.get("x-bde-passcode")
        or request.headers.get("x-admin-token")
        or request.query_params.get("passcode")
        or ""
    ).strip()
    if p:
        if ADMIN_PASSCODE and p == ADMIN_PASSCODE:
            return "owner"
        elif STAFF_PASSCODE and p == STAFF_PASSCODE:
            return "staff"

    return None

def authenticate_passcode(pin_clean: str):
    if not pin_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security passcode is required."
        )
    if ADMIN_PASSCODE and pin_clean == ADMIN_PASSCODE:
        return "owner", "Proprietor (Dipanjan)"
    elif STAFF_PASSCODE and pin_clean == STAFF_PASSCODE:
        return "staff", "Counter Staff"
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Security Passcode. Access restricted to BDE Onda showroom personnel."
        )

def verify_staff_or_owner(request: Request):
    role = get_console_role(request)
    if role in ("owner", "staff"):
        name = "Proprietor (Dipanjan)" if role == "owner" else "Counter Staff"
        return {"role": role, "name": name}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized: Staff or Owner access required"
    )

def verify_owner_access(request: Request, passcode: Optional[str] = None):
    # Check if direct passcode string was passed imperatively
    if passcode and passcode.strip() == ADMIN_PASSCODE:
        return True

    role = get_console_role(request)
    if role == "owner":
        return True
    if role == "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Owner access required (Passcode Dip@1993)."
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized: Owner authorization required (Passcode Dip@1993)."
    )

@app.post("/api/staff/verify")
@app.post("/api/auth/staff")
def staff_verify(req: schemas.StaffVerifyRequest, response: Response):
    pin_clean = ((req.passcode or req.pin) or "").strip()
    role, name = authenticate_passcode(pin_clean)
    token = create_session_token(role)
    max_age = 30 * 86400 if req.remember else None
    response.set_cookie(
        key="bde_console_token",
        value=token,
        max_age=max_age,
        httponly=False,
        samesite="lax",
        secure=False
    )
    return {
        "success": True,
        "authenticated": True,
        "role": role,
        "name": name,
        "token": token
    }

@app.post("/api/auth/console-login")
def console_login(req: schemas.ConsoleLoginRequest, response: Response):
    pin_clean = (req.pin or "").strip()
    role, name = authenticate_passcode(pin_clean)
    token = create_session_token(role)
    max_age = 30 * 86400 if req.remember else None
    response.set_cookie(
        key="bde_console_token",
        value=token,
        max_age=max_age,
        httponly=False,
        samesite="lax",
        secure=False
    )
    return {
        "success": True,
        "authenticated": True,
        "role": role,
        "name": name,
        "token": token
    }

@app.get("/api/auth/verify-session")
def console_verify_session(request: Request):
    role = get_console_role(request)
    if not role:
        return {"authenticated": False, "role": None, "name": None}
    name = "Proprietor (Dipanjan)" if role == "owner" else "Counter Staff"
    return {"authenticated": True, "role": role, "name": name}

@app.post("/api/auth/console-logout")
def console_logout(response: Response):
    response.delete_cookie(key="bde_console_token")
    return {"success": True, "message": "Console locked. Session ended."}

@app.get("/console")
@app.get("/erp")
def serve_console():
    console_path = os.path.join(BASE_DIR, "templates", "index.html")
    if os.path.exists(console_path):
        return FileResponse(console_path, media_type="text/html")
    return {"message": "Console template not found"}


def get_image_media_type(path: str) -> str:
    lower = path.lower()
    if lower.endswith((".jpg", ".jpeg")):
        return "image/jpeg"
    elif lower.endswith(".png"):
        return "image/png"
    elif lower.endswith(".webp"):
        return "image/webp"
    elif lower.endswith(".svg"):
        return "image/svg+xml"
    return "image/jpeg"


# --- Smart Dynamic Product Image Fallback ---
@app.get("/static/img/products/{sku_filename}")
def serve_product_image(sku_filename: str):
    file_path = os.path.join(STATIC_DIR, "img", "products", sku_filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type=get_image_media_type(file_path))
    
    # Try with .svg or .jpg swap
    clean_sku = sku_filename.replace(".jpg", "").replace(".png", "").replace(".svg", "")
    for ext in [".jpg", ".png", ".svg"]:
        alt_path = os.path.join(STATIC_DIR, "img", "products", f"{clean_sku}{ext}")
        if os.path.exists(alt_path):
            return FileResponse(alt_path, media_type=get_image_media_type(alt_path))

    # Generate a fallback branded SVG on the fly
    svg_fallback = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3b0764"/>
          <stop offset="100%" stop-color="#7c3aed"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#f8fafc"/>
      <rect x="40" y="40" width="320" height="320" rx="24" fill="url(#g)"/>
      <circle cx="200" cy="160" r="50" fill="rgba(255,255,255,0.15)"/>
      <text x="200" y="175" font-family="Arial, sans-serif" font-weight="900" font-size="38" fill="#facc15" text-anchor="middle">BDE</text>
      <text x="200" y="240" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle">Onda • Bankura</text>
      <text x="200" y="270" font-family="Arial, sans-serif" font-weight="600" font-size="12" fill="#cbd5e1" text-anchor="middle">{clean_sku}</text>
    </svg>'''
    return Response(content=svg_fallback, media_type="image/svg+xml")


# ========================================================
# MOBILE APP E-COMMERCE ENDPOINTS
# ========================================================

# 0. GET /api/special-banners
@app.get("/api/special-banners")
def get_special_banners():
    """Returns promotional banners from static/img/special_banners directory."""
    banners_cfg_path = os.path.join(STATIC_DIR, "img", "special_banners", "banners_config.json")
    if os.path.exists(banners_cfg_path):
        try:
            with open(banners_cfg_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    return [
        {
            "id": "banner-plywood-deals",
            "title": "BWP Marine 710 Plywood Deals",
            "subtitle": "100% Calibrated Gurjan Core • Onda Depot Ready Stock",
            "badge": "⚡ FESTIVE MEGA DEALS",
            "image_url": "/static/img/special_banners/banner_1.svg",
            "target_category": "Plywood",
            "action_type": "category",
            "action_label": "Browse Plywood →",
            "accent_color": "#f59e0b"
        },
        {
            "id": "banner-sunmica-louvers",
            "title": "Luxury Sunmica & Louvers 2026",
            "subtitle": "400+ Zero-Fingerprint Matt & Gloss Finishes in Stock",
            "badge": "🎨 2026 DESIGNER MICA",
            "image_url": "/static/img/special_banners/banner_2.svg",
            "target_category": "Laminate",
            "action_type": "category",
            "action_label": "Explore Laminates →",
            "accent_color": "#ec4899"
        },
        {
            "id": "banner-fevicol-contractor",
            "title": "Fevicol & Adhesives Super-Packs",
            "subtitle": "Marine, HeatX & SH Contractor Pails • Instant Loyalty Bonus",
            "badge": "🧴 PIDILITE OFFICIAL HUB",
            "image_url": "/static/img/special_banners/banner_3.svg",
            "target_category": "Adhesive",
            "action_type": "category",
            "action_label": "Order Adhesives →",
            "accent_color": "#10b981"
        },
        {
            "id": "banner-ar-visualizer",
            "title": "Live AR Wall & Wardrobe Visualizer",
            "subtitle": "Project BDE Laminates Onto Your Room Wall via Smartphone Camera",
            "badge": "✨ WEBAR CAMERA STUDIO",
            "image_url": "/static/img/special_banners/banner_4.svg",
            "target_view": "ar",
            "action_type": "ar_visualizer",
            "action_label": "Launch AR Camera ➔",
            "accent_color": "#38bdf8"
        },
        {
            "id": "banner-mistri-network",
            "title": "Verified Onda Mistri Network",
            "subtitle": "Connect Directly with 150+ Skilled Carpenters in Bankura",
            "badge": "🪚 VERIFIED CARPENTERS",
            "image_url": "/static/img/special_banners/banner_5.svg",
            "target_view": "mistris",
            "action_type": "view",
            "action_label": "Find Mistri →",
            "accent_color": "#ea580c"
        }
    ]

# 1. GET /api/catalog
@app.get("/api/catalog")
def get_catalog(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    if category and category.strip().lower() not in ["all", "for you"]:
        query = query.filter(models.Product.category.ilike(f"%{category.strip()}%"))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (models.Product.name.ilike(term)) |
            (models.Product.sku.ilike(term)) |
            (models.Product.brand.ilike(term)) |
            (models.Product.category.ilike(term))
        )

    products = query.order_by(models.Product.id.asc()).all()

    catalog_items = []
    for p in products:
        # NO PRICE DISPLAY on customer facing catalog as requested by owner
        sqft = float(p.sqft_per_piece or 0.0)

        # Determine festive Durga Puja quality badge
        name_lower = p.name.lower()
        cat_lower = (p.category or "").lower()
        if "marine" in name_lower or "club" in (p.brand or "").lower():
            badge = "IS:710 Waterproof"
            badge_color = "marine"
        elif "18" in name_lower and "ply" in cat_lower:
            badge = "Premium 18mm"
            badge_color = "festive"
        elif "fevicol" in name_lower:
            badge = "Carpenter Choice"
            badge_color = "gold"
        elif "laminate" in cat_lower or "sunmica" in name_lower:
            badge = "High Gloss 1mm"
            badge_color = "purple"
        elif p.stock_qty > 100:
            badge = "Depot Ready Stock"
            badge_color = "festive"
        else:
            badge = "Genuine Certified"
            badge_color = "blue"

        img_url = p.image_url if p.image_url else f"/static/img/products/{p.sku}.jpg"
        catalog_items.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "description": p.description or "",
            "size": p.size or "",
            "category": p.category or "General",
            "subcategory": p.subcategory or "General",
            "brand": p.brand or "Standard",
            "unit": p.unit or "Pcs",
            "sqft_per_piece": sqft,
            "stock_qty": float(p.stock_qty or 0.0),
            "in_stock": (p.stock_qty or 0.0) > 0,
            "badge": badge,
            "badge_color": badge_color,
            "image_url": img_url
        })

    # Optional sorting
    if sort == "popular":
        catalog_items.sort(key=lambda x: x["stock_qty"], reverse=True)

    return catalog_items


# 2. POST /api/quote-request
@app.post("/api/quote-request")
def create_quote_request(q: schemas.QuoteRequestCreate, db: Session = Depends(get_db)):
    notes_combined = f"Furniture: {q.furniture_type} | Dims: {q.dimensions} | {q.notes or ''}"
    
    inquiry = models.QuoteInquiry(
        customer_name=q.customer_name.strip(),
        phone=q.phone.strip(),
        quote_type=q.quote_type or "Material Estimate",
        delivery_locality=q.delivery_locality or "Onda",
        requested_items=q.materials_breakdown or f"{q.furniture_type} Estimation",
        notes=notes_combined,
        status="Pending",
        created_at=datetime.utcnow()
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # Format professional WhatsApp message for Baba Dugdheswar Enterprise (Goods/Quantity only)
    wa_message = (
        f"Namaskar Baba Dugdheswar Enterprise! 🙏\n"
        f"I would like to enquire about materials for my furniture project:\n\n"
        f"👤 Customer: {q.customer_name.strip()}\n"
        f"📞 Phone: {q.phone.strip()}\n"
        f"📍 Locality: {q.delivery_locality}\n"
        f"🪑 Furniture: {q.furniture_type} ({q.dimensions})\n\n"
        f"📋 Materials Required:\n{q.materials_breakdown}\n\n"
        f"Please check stock availability & delivery schedule from Onda Depot."
    )
    encoded_text = urllib.parse.quote(wa_message)
    whatsapp_url = f"https://wa.me/919867098952?text={encoded_text}"

    return {
        "success": True,
        "inquiry_id": inquiry.id,
        "whatsapp_url": whatsapp_url,
        "message": "Quote saved successfully! Redirecting to Baba Dugdheswar Enterprise WhatsApp..."
    }


# 2b. POST /api/ai-estimate (AI Project Estimator & BoQ Calculator)
@app.post("/api/ai-estimate")
def calculate_ai_estimate(req: schemas.AIEstimateRequest):
    raw_prompt = (req.prompt or "").strip()
    if not raw_prompt:
        raise HTTPException(status_code=400, detail="Prompt requirement cannot be empty")

    ply_grade = req.plywood_grade or "marine"
    finish_type = req.finish_type or "matte"
    p_lower = raw_prompt.lower()

    # Extract dimensions (e.g. 6x6, 10x8, 8x6, 7x3.5)
    dim_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:ft|feet|'|fut|ফুট)?\s*(?:x|\*|by|ইনটু)\s*(\d+(?:\.\d+)?)", raw_prompt, re.IGNORECASE)
    dims_w = float(dim_match.group(1)) if dim_match else None
    dims_h = float(dim_match.group(2)) if dim_match else None

    item_type = "Custom Woodwork"
    title = "Custom Project Estimation"
    w, h, d = 6.0, 6.0, 2.0
    ply18, ply12, ply6 = 4, 2, 1
    lam_outer, lam_inner = 3, 3
    fevicol_kg = 6
    hardware_list = []
    min_price, max_price = 22000, 30000
    area_sqft = 0.0

    if any(k in p_lower for k in ["wardrobe", "almirah", "almari", "আলমারি", "ওয়ারড্রোব", "cupboard"]):
        item_type = "Wardrobe (Almirah)"
        title = "Designer Modular Wardrobe Estimation"
        w = dims_w or 6.0
        h = dims_h or 6.0
        d = 2.0
        area_sqft = round((2 * (h * d) + 2 * (w * d) + (w * h) + 1.5 * (w * d)), 1)
        waste_area = round(area_sqft * 1.15, 1)

        ply18 = max(3, math.ceil(waste_area / 32))
        ply12 = max(1, math.ceil((w * h * 1.15) / 32))
        ply6 = max(1, math.ceil((w * h * 0.9) / 32))
        lam_outer = max(2, math.ceil(((w * h) + (2 * h * d)) * 1.15 / 32))
        lam_inner = lam_outer
        fevicol_kg = max(5, math.ceil(waste_area / 20))

        hardware_list = [
            {"name": "Soft-Close 3D Hydraulic Auto-Hinges (0 Crank)", "qty": f"{max(8, int(round(h * 2)))} Pcs"},
            {"name": "Telescopic Ball-Bearing Drawer Slides (20\")", "qty": "2 Sets"},
            {"name": "22mm PVC Edge Banding Tape (Matching Woodgrain)", "qty": "1 Roll (50m)"},
            {"name": "Concealed Aluminum Edge Handle Profiles", "qty": "2 Pcs (6ft)"},
            {"name": "Heavy-Duty SS Screw & Fasteners Kit", "qty": "1 Box (400 Pcs)"}
        ]
        base_unit = 2400 if ply_grade == "marine" else 1900
        min_price = (ply18 * base_unit) + (ply12 * 1600) + (ply6 * 850) + (lam_outer * 1250) + (lam_inner * 850) + (fevicol_kg * 340) + 2800
        max_price = round(min_price * 1.25)

    elif any(k in p_lower for k in ["kitchen", "রান্না", "modular kitchen", "cabinet"]):
        item_type = "Modular Kitchen"
        title = "Modular Kitchen Cabinetry Estimation"
        w = dims_w or 10.0
        h = dims_h or 8.0
        d = 2.0
        area_sqft = round((w * 2.8 * 8 + h * 2), 1)
        waste_area = round(area_sqft * 1.15, 1)

        ply18 = max(6, math.ceil(waste_area / 30))
        ply12 = max(2, math.ceil((w * 12) / 32))
        ply6 = 2
        lam_outer = max(5, math.ceil(waste_area * 0.45 / 32))
        lam_inner = lam_outer
        fevicol_kg = 10

        hardware_list = [
            {"name": "Soft-Close Clip-on Concealed Hinges", "qty": "20 Pcs (10 Pairs)"},
            {"name": "Telescopic / Tandem Soft-Close Drawer Runners", "qty": "6 Sets"},
            {"name": "SS G-Profile Handle Trim", "qty": "24 Ft"},
            {"name": "Hydraulic Gas Lifters for Overhead Shutters", "qty": "4 Pcs"},
            {"name": "Stainless Steel Fasteners & Shelf Pins", "qty": "1 Box"}
        ]
        min_price = 52000
        max_price = 72000

    elif any(k in p_lower for k in ["tv unit", "louver", "panel", "টিভি", "প্যানেল"]):
        item_type = "TV Unit & Accent Wall"
        title = "Designer TV Console & Fluted Panel Estimation"
        w = dims_w or 8.0
        h = dims_h or 6.0
        d = 1.2
        area_sqft = round((w * h + w * d * 2), 1)

        ply18 = max(2, math.ceil(area_sqft * 1.15 / 32))
        ply12 = 1
        ply6 = 1
        lam_outer = 2
        lam_inner = 1
        fevicol_kg = 4

        hardware_list = [
            {"name": "Charcoal 3D Fluted Louver Panels (8ft Length)", "qty": "10 Panels"},
            {"name": "Concealed Heavy Wall-Mount Floating Brackets", "qty": "4 Sets"},
            {"name": "Push-to-Open Latches & Magnet Catches", "qty": "2 Sets"},
            {"name": "Aluminum LED Profile Channel with Diffuser", "qty": "10 Ft"},
            {"name": "Fastener & Wire Grommet Kit", "qty": "1 Pack"}
        ]
        min_price = 17500
        max_price = 24500

    elif any(k in p_lower for k in ["bed", "khat", "খাট", "বেড"]):
        item_type = "Double Bed with Box"
        title = "King/Queen Storage Bed Estimation"
        w = dims_w or 6.0
        h = dims_h or 6.5
        d = 1.5
        area_sqft = round(((w * h * 2) + (2 * (w + h) * d) + (w * 3)), 1)

        ply18 = 5
        ply12 = 2
        ply6 = 1
        lam_outer = 3
        lam_inner = 2
        fevicol_kg = 5

        hardware_list = [
            {"name": "Heavy-Duty Hydraulic Bed Lifter Kit (150 Kg Force)", "qty": "1 Complete Set"},
            {"name": "Bed Corner Structural Angle Brackets & Bolts", "qty": "8 Sets"},
            {"name": "Center Support Beam Metal Fittings", "qty": "2 Sets"},
            {"name": "PVC Edge Banding for Headboard & Outer Frame", "qty": "1 Roll (50m)"}
        ]
        min_price = 19500
        max_price = 26500

    elif any(k in p_lower for k in ["door", "দরজা"]):
        item_type = "Solid Flush Door"
        title = "Flush Door & Designer Laminate Estimation"
        w = dims_w or 7.0
        h = dims_h or 3.5
        area_sqft = round(w * h, 1)

        ply18 = 0
        ply12 = 0
        ply6 = 0
        lam_outer = 2
        lam_inner = 0
        fevicol_kg = 2

        hardware_list = [
            {"name": "30mm Calibrated Solid Core Pinewood Flush Door (7x3.5)", "qty": "1 Pc"},
            {"name": "1.0mm Natural Teak / High-Gloss Laminate", "qty": "2 Sheets"},
            {"name": "SS 304 Heavy-Duty Ball Bearing Hinges (5 Inch)", "qty": "3 Pcs"},
            {"name": "Mortise Lock with Premium Handle & Key Set", "qty": "1 Set"},
            {"name": "Tower Bolt & Magnetic Door Stopper", "qty": "1 Set"}
        ]
        min_price = 6200
        max_price = 8800

    else:
        w = dims_w or 6.0
        h = dims_h or 4.0
        d = 2.0
        item_type = "Custom Woodwork"
        title = f"Custom Project ({w}ft × {h}ft) Estimation"
        area_sqft = round(w * h * 2.2, 1)
        waste_area = round(area_sqft * 1.15, 1)

        ply18 = max(2, math.ceil(waste_area / 32))
        ply12 = max(1, math.ceil(waste_area * 0.3 / 32))
        ply6 = 1
        lam_outer = max(2, math.ceil(waste_area * 0.45 / 32))
        lam_inner = lam_outer
        fevicol_kg = max(3, math.ceil(waste_area / 22))

        hardware_list = [
            {"name": "Soft-Close Hinges / Channel Sliders", "qty": "6 Pairs"},
            {"name": "Edge Banding Tape (22mm)", "qty": "1 Roll (50m)"},
            {"name": "Standard Screws & Assembly Brackets", "qty": "1 Pack"}
        ]
        min_price = round((ply18 * 2300) + (ply12 * 1500) + (lam_outer * 1300) + (lam_inner * 800) + (fevicol_kg * 340) + 1500)
        max_price = round(min_price * 1.25)

    total_waste_area = round(area_sqft * 1.15, 1)
    ply_label = "18mm BWP Marine 710" if ply_grade == "marine" else "18mm Commercial MR"
    finish_label = "1.5mm Mirror Acrylic" if finish_type == "acrylic" else ("0.8mm High-Gloss" if finish_type == "gloss" else "1.0mm Super-Matte")

    # Format WhatsApp Message
    hw_text = "\n".join([f"• {h_item['name']}: {h_item['qty']}" for h_item in hardware_list])
    ply_text = "• 30mm Solid Flush Door: 1 Pc" if item_type == "Solid Flush Door" else f"• {ply_label} (8x4): {ply18} Sheets\n• 12mm Plywood (8x4): {ply12} Sheets\n• 6mm Plywood (8x4): {ply6} Sheets"

    wa_msg = (
        f"*Namaskar Baba Dugdheswar Enterprise (Onda Depot)!*\n"
        f"I used the *BDE AI Project Estimator* for my project requirement:\n\n"
        f"📋 *Requirement:* {raw_prompt}\n"
        f"📐 *Item & Dimensions:* {item_type} ({w} ft × {h} ft, Depth: {d} ft)\n"
        f"📏 *Total Area (with 15% wastage margin):* {total_waste_area} Sq.Ft\n\n"
        f"*Estimated Bill of Materials (BoQ):*\n"
        f"{ply_text}\n"
        f"• Decorative Sunmica ({finish_label}): {lam_outer} Sheets\n"
        f"• Liner Sunmica (8x4): {lam_inner} Sheets\n"
        f"• Fevicol Marine / SH: {fevicol_kg} kg\n"
        f"{hw_text}\n\n"
        f"💰 *Estimated Onda Counter Budget:* ₹{min_price:,} – ₹{max_price:,}\n\n"
        f"Please verify current stock availability at Onda Depot, share final counter quote, and confirm delivery schedule."
    )
    whatsapp_url = f"https://wa.me/919867098952?text={urllib.parse.quote(wa_msg)}"

    return {
        "success": True,
        "title": title,
        "item_type": item_type,
        "dimensions": f"{w} ft × {h} ft (Depth: {d} ft)",
        "surface_area_sqft": area_sqft,
        "surface_area_with_waste": total_waste_area,
        "plywood_grade": ply_label,
        "plywood_18mm_sheets": ply18,
        "plywood_12mm_sheets": ply12,
        "plywood_6mm_sheets": ply6,
        "laminate_finish": finish_label,
        "laminate_outer_sheets": lam_outer,
        "laminate_inner_sheets": lam_inner,
        "fevicol_kg": fevicol_kg,
        "hardware": hardware_list,
        "estimated_min_price": min_price,
        "estimated_max_price": max_price,
        "whatsapp_url": whatsapp_url,
        "whatsapp_message": wa_msg
    }



# 3. GET /api/carpenters
@app.get("/api/carpenters")
def list_carpenters(village: Optional[str] = None, specialty: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Carpenter)
    if village and village.strip().lower() != "all":
        query = query.filter(models.Carpenter.village.ilike(f"%{village.strip()}%"))
    if specialty and specialty.strip().lower() != "all":
        query = query.filter(models.Carpenter.specialties.ilike(f"%{specialty.strip()}%"))

    carpenters = query.order_by(models.Carpenter.rating.desc(), models.Carpenter.completed_projects.desc()).all()

    results = []
    for c in carpenters:
        # Mask phone number as required: e.g. 98005-XXXXX
        raw_ph = c.phone.strip()
        if len(raw_ph) >= 10:
            masked = f"{raw_ph[:5]}-XXXXX"
        else:
            masked = f"{raw_ph[:3]}-XXXXX"

        results.append({
            "id": c.id,
            "name": c.name,
            "masked_phone": masked,
            "village": c.village,
            "experience_years": c.experience_years,
            "rating": c.rating,
            "reviews_count": c.reviews_count,
            "specialties": c.specialties,
            "avatar": c.avatar or "👨‍🔧",
            "completed_projects": c.completed_projects,
            "is_verified": c.is_verified
        })
    return results


# 4. POST /api/carpenter-call
@app.post("/api/carpenter-call")
def track_carpenter_call(call: schemas.CarpenterCallCreate, db: Session = Depends(get_db)):
    carpenter = db.query(models.Carpenter).filter(models.Carpenter.id == call.carpenter_id).first()
    if not carpenter:
        raise HTTPException(status_code=404, detail="Carpenter not found")

    log_entry = models.CarpenterCallLog(
        carpenter_id=carpenter.id,
        carpenter_name=carpenter.name,
        customer_name=call.customer_name or "Valued Customer",
        customer_phone=call.customer_phone.strip(),
        customer_village=call.customer_village or "Onda",
        created_at=datetime.utcnow()
    )
    db.add(log_entry)

    # Also log to QuoteInquiry so it reflects under Website Enquiries in Admin Console
    inquiry = models.QuoteInquiry(
        customer_name=call.customer_name or "Valued Customer",
        phone=call.customer_phone.strip(),
        quote_type="Carpenter Lead",
        delivery_locality=call.customer_village or "Onda",
        requested_items=f"Verified Mistri Call Request: {carpenter.name} ({carpenter.village}) • Spec: {carpenter.specialties}",
        notes=f"Customer connected directly to carpenter {carpenter.name}",
        status="Pending",
        created_at=datetime.utcnow()
    )
    db.add(inquiry)
    db.commit()

    return {
        "success": True,
        "carpenter_id": carpenter.id,
        "carpenter_name": carpenter.name,
        "dial_phone": carpenter.phone,
        "message": f"Connection established with {carpenter.name}. Opening dialer..."
    }


# 5. GET /api/testimonials & POST /api/testimonials (Unified to CraftPost)
@app.get("/api/testimonials")
def get_approved_testimonials(db: Session = Depends(get_db)):
    craft_rows = (
        db.query(models.CraftPost)
        .filter((models.CraftPost.is_approved == True) | (models.CraftPost.status == "approved"))
        .order_by(models.CraftPost.id.desc())
        .limit(50)
        .all()
    )
    legacy_rows = (
        db.query(models.CustomerTestimonial)
        .filter(models.CustomerTestimonial.is_approved == True)
        .order_by(models.CustomerTestimonial.id.desc())
        .limit(50)
        .all()
    )
    items = []
    for r in craft_rows:
        items.append({
            "id": r.id,
            "customer_name": r.author_name,
            "customer_location": r.village_location or "Onda, Bankura",
            "project_title": r.caption or f"{r.project_category} Project",
            "carpenter_name": r.author_name if (r.author_role or "").lower() == "mistri" else (r.materials_used or "Local BDE Mistri").replace("Mistri: ", ""),
            "image_base64": r.image_base64,
            "created_at": r.created_at.strftime("%d %b %Y") if r.created_at else "Recent",
            "_dt": r.created_at or datetime.min
        })
    for r in legacy_rows:
        items.append({
            "id": r.id,
            "customer_name": r.customer_name,
            "customer_location": r.customer_location,
            "project_title": r.project_title,
            "carpenter_name": r.carpenter_name or "Local BDE Mistri",
            "image_base64": r.image_base64,
            "created_at": r.created_at.strftime("%d %b %Y") if r.created_at else "Recent",
            "_dt": r.created_at or datetime.min
        })
    items.sort(key=lambda x: x["_dt"], reverse=True)
    for it in items:
        it.pop("_dt", None)
    return items[:50]

@app.post("/api/testimonials")
def submit_testimonial(item: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    record = models.CraftPost(
        author_name=item.customer_name.strip() if item.customer_name else "Valued Customer",
        author_role="Homeowner",
        author_phone=item.customer_phone.strip() if item.customer_phone else None,
        village_location=item.customer_location.strip() if item.customer_location else "Onda, Bankura",
        project_category="Customer Showcase",
        caption=item.project_title.strip() if item.project_title else "Finished Furniture Project",
        materials_used=f"Mistri: {item.carpenter_name.strip()}" if item.carpenter_name else "BDE Mistri",
        image_base64=item.image_base64,
        status="pending",
        is_approved=False,
        bill_number=item.invoice_no.strip() if item.invoice_no else None,
        upi_id=item.cashback_upi.strip() if item.cashback_upi else None,
        cashback_amount=0.0,
        cashback_status="Pending Review",
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    msg = "✅ Submitted! Your finished furniture photo has been sent to BDE Admin for verification. Once approved, it will go live on Mistri Gram and your UPI cashback will be processed!"

    return {
        "success": True,
        "id": record.id,
        "status": "pending",
        "message": msg
    }

@app.post("/api/upload/photo")
@app.post("/api/testimonials/upload")
async def upload_testimonial_photo(
    file: UploadFile = File(...),
    customer_name: Optional[str] = Form("Valued Customer"),
    customer_phone: Optional[str] = Form(""),
    customer_location: Optional[str] = Form("Onda, Bankura"),
    project_title: Optional[str] = Form("Finished Furniture Project"),
    carpenter_name: Optional[str] = Form("BDE Mistri"),
    invoice_no: Optional[str] = Form(None),
    cashback_upi: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty photo uploaded.")
    mime_type = file.content_type or "image/jpeg"
    b64_data = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{mime_type};base64,{b64_data}"

    record = models.CraftPost(
        author_name=(customer_name or "Valued Customer").strip(),
        author_role="Homeowner",
        author_phone=(customer_phone or "").strip() if customer_phone else None,
        village_location=(customer_location or "Onda, Bankura").strip(),
        project_category="Customer Showcase",
        caption=(project_title or "Finished Furniture Project").strip(),
        materials_used=f"Mistri: {(carpenter_name or 'BDE Mistri').strip()}",
        image_base64=data_url,
        status="pending",
        is_approved=False,
        bill_number=invoice_no.strip() if invoice_no else None,
        upi_id=cashback_upi.strip() if cashback_upi else None,
        cashback_amount=0.0,
        cashback_status="Pending Review",
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    msg = "✅ Submitted! Your finished furniture photo has been sent to BDE Admin for verification. Once approved, it will go live on Mistri Gram and your UPI cashback will be processed!"
    return {
        "success": True,
        "id": record.id,
        "image_base64": data_url,
        "status": "pending",
        "message": msg
    }


# =========================================================
# 5b. MISTRI GRAM COMMUNITY SOCIAL FEED ENDPOINTS
# =========================================================

# 1. GET /api/feed
@app.get("/api/feed")
def get_feed(
    category: Optional[str] = Query("All"),
    sort: Optional[str] = Query("newest"),
    db: Session = Depends(get_db)
):
    # Only return approved posts on the public social feed
    query = db.query(models.CraftPost).filter(
        (models.CraftPost.status == 'approved') | (models.CraftPost.is_approved == True)
    )
    
    # Filter by category if not All
    if category and category.strip().lower() not in ["all", "all crafts"]:
        cat_term = category.strip().lower()
        if "wardrobe" in cat_term:
            query = query.filter(models.CraftPost.project_category.ilike("%wardrobe%"))
        elif "kitchen" in cat_term:
            query = query.filter(models.CraftPost.project_category.ilike("%kitchen%"))
        elif "bed" in cat_term:
            query = query.filter(models.CraftPost.project_category.ilike("%bed%"))
        elif "tv" in cat_term:
            query = query.filter(models.CraftPost.project_category.ilike("%tv%"))
        elif "door" in cat_term:
            query = query.filter(models.CraftPost.project_category.ilike("%door%"))
        else:
            query = query.filter(models.CraftPost.project_category.ilike(f"%{category.strip()}%"))

    # Sort order
    if sort and sort.strip().lower() in ["popular", "loved", "most loved"]:
        query = query.order_by(desc(models.CraftPost.likes_count), desc(models.CraftPost.id))
    else:
        query = query.order_by(desc(models.CraftPost.id))

    posts_records = query.limit(60).all()

    # Aggregate Top Mistris Leaderboard (Only from approved posts)
    leaderboard_q = (
        db.query(
            models.CraftPost.author_name,
            models.CraftPost.village_location,
            models.CraftPost.author_role,
            func.sum(models.CraftPost.likes_count).label("total_likes"),
            func.count(models.CraftPost.id).label("post_count")
        )
        .filter((models.CraftPost.status == 'approved') | (models.CraftPost.is_approved == True))
        .group_by(models.CraftPost.author_name, models.CraftPost.village_location, models.CraftPost.author_role)
        .order_by(desc("total_likes"))
        .limit(8)
        .all()
    )

    leaderboard = []
    for rank, (name, village, role, total_likes, post_count) in enumerate(leaderboard_q, start=1):
        leaderboard.append({
            "rank": rank,
            "name": name,
            "village": village or "Onda",
            "role": role or "Mistri",
            "total_likes": int(total_likes or 0),
            "post_count": int(post_count or 0)
        })

    posts = []
    for p in posts_records:
        post_comments = []
        for c in (p.comments or [])[:20]:
            post_comments.append({
                "id": c.id,
                "commenter_name": c.commenter_name,
                "comment_text": c.comment_text,
                "created_at": c.created_at.strftime("%d %b, %I:%M %p") if c.created_at else "Just now"
            })

        posts.append({
            "id": p.id,
            "author_name": p.author_name,
            "author_role": p.author_role or "Mistri",
            "author_phone": p.author_phone or "",
            "village_location": p.village_location or "Onda",
            "project_category": p.project_category or "Wardrobe",
            "caption": p.caption or "",
            "materials_used": p.materials_used or "",
            "image_base64": p.image_base64,
            "likes_count": p.likes_count or 0,
            "comments_count": len(p.comments) if p.comments else 0,
            "comments": post_comments,
            "created_at": p.created_at.strftime("%d %b %Y, %I:%M %p") if p.created_at else "Recently"
        })

    return {
        "success": True,
        "count": len(posts),
        "leaderboard": leaderboard,
        "posts": posts
    }

# 2. POST /api/feed/post
@app.post("/api/feed/post")
def create_craft_post(req: schemas.CraftPostCreate, db: Session = Depends(get_db)):
    author_name = (req.author_name or "").strip()
    if not author_name:
        raise HTTPException(status_code=400, detail="Author name is required")
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Image is required for craft showcase")

    post = models.CraftPost(
        author_name=author_name,
        author_role=(req.author_role or "Mistri").strip(),
        author_phone=(req.author_phone or "").strip(),
        village_location=(req.village_location or "Onda, Bankura").strip(),
        project_category=(req.project_category or "Wardrobe").strip(),
        caption=(req.caption or "").strip(),
        materials_used=(req.materials_used or "").strip(),
        image_base64=req.image_base64,
        likes_count=1,
        status="pending",
        is_approved=False,
        bill_number=(req.bill_number or "").strip() or None,
        upi_id=(req.upi_id or "").strip() or None,
        cashback_amount=0.0,
        cashback_status="unpaid",
        created_at=datetime.utcnow()
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "success": True,
        "post_id": post.id,
        "id": post.id,
        "status": "pending",
        "message": "✅ Submitted! Your finished furniture photo has been sent to BDE Admin for verification. Once approved, it will go live on Mistri Gram and your UPI cashback will be processed!"
    }

# 3. POST /api/feed/{post_id}/like
@app.post("/api/feed/{post_id}/like")
def like_craft_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.CraftPost).filter(models.CraftPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.likes_count = (post.likes_count or 0) + 1
    db.commit()
    db.refresh(post)

    return {
        "success": True,
        "post_id": post.id,
        "likes_count": post.likes_count
    }

# 4. POST /api/feed/{post_id}/comment
@app.post("/api/feed/{post_id}/comment")
def add_craft_comment(post_id: int, req: schemas.CraftCommentCreate, db: Session = Depends(get_db)):
    post = db.query(models.CraftPost).filter(models.CraftPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment_text = (req.comment_text or "").strip()
    if not comment_text:
        raise HTTPException(status_code=400, detail="Comment text cannot be empty")

    commenter_name = (req.commenter_name or "Valued Customer").strip()

    comment = models.CraftComment(
        post_id=post.id,
        commenter_name=commenter_name,
        comment_text=comment_text,
        created_at=datetime.utcnow()
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return {
        "success": True,
        "comment_id": comment.id,
        "post_id": post.id,
        "comment": {
            "id": comment.id,
            "commenter_name": comment.commenter_name,
            "comment_text": comment.comment_text,
            "created_at": "Just now"
        }
    }


# 6. POST /api/app/login & POST /api/app/signup
@app.post("/api/app/login")

def app_login(req: schemas.AppLoginRequest, db: Session = Depends(get_db)):
    clean_phone = req.phone.strip()
    user = db.query(models.AppUser).filter(models.AppUser.phone == clean_phone).first()
    
    if not user:
        # Auto-create lightweight profile if logging in for first time
        user = models.AppUser(
            name="Valued Customer",
            phone=clean_phone,
            location="Onda, Bankura",
            role="Customer",
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "success": True,
        "token": f"bde_tok_{user.id}_{int(datetime.utcnow().timestamp())}",
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "location": user.location or "Onda",
            "role": user.role or "Customer"
        }
    }

@app.post("/api/app/signup")
def app_signup(req: schemas.AppSignupRequest, db: Session = Depends(get_db)):
    clean_phone = req.phone.strip()
    user = db.query(models.AppUser).filter(models.AppUser.phone == clean_phone).first()

    if user:
        user.name = req.name.strip()
        if req.location:
            user.location = req.location.strip()
        db.commit()
        db.refresh(user)
    else:
        user = models.AppUser(
            name=req.name.strip(),
            phone=clean_phone,
            location=req.location.strip() if req.location else "Onda",
            pin_code=req.pin_code or "1234",
            role="Customer",
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "success": True,
        "token": f"bde_tok_{user.id}_{int(datetime.utcnow().timestamp())}",
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "location": user.location,
            "role": user.role
        }
    }

@app.get("/api/app/user/me")
def get_user_me(phone: str, db: Session = Depends(get_db)):
    user = db.query(models.AppUser).filter(models.AppUser.phone == phone.strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "phone": user.phone,
        "location": user.location,
        "role": user.role
    }


# ========================================================
# BACKWARD COMPATIBLE BUSINESS CONSOLE / ERP APIS
# ========================================================

@app.get("/products")
def list_products(db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    prods = db.query(models.Product).order_by(models.Product.name.asc()).all()
    results = []
    
    purchased_map = dict(
        db.query(models.Purchase.product_id, func.coalesce(func.sum(models.Purchase.qty), 0.0))
        .group_by(models.Purchase.product_id).all()
    )
    sold_map = dict(
        db.query(models.SaleItem.product_id, func.coalesce(func.sum(models.SaleItem.qty), 0.0))
        .group_by(models.SaleItem.product_id).all()
    )

    for p in prods:
        total_restocked = purchased_map.get(p.id, 0.0)
        total_sold = sold_map.get(p.id, 0.0)
        current_stock = p.stock_qty
        opening_qty = max(0.0, current_stock + total_sold - total_restocked)
        inventory_valuation = round(current_stock * p.purchase_price, 2)
        capacity_base = max(opening_qty + total_restocked, current_stock, 1.0)
        reorder_level = round(capacity_base * 0.25, 1)

        if current_stock <= 0:
            stock_status = "NO STOCK"
        elif current_stock <= reorder_level:
            stock_status = "LOW STOCK"
        else:
            stock_status = "IN STOCK"

        margin = round(((p.selling_price - p.purchase_price) / p.selling_price * 100), 1) if p.selling_price > 0 else 0.0

        results.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "description": p.description or "",
            "size": p.size or "",
            "image_url": p.image_url if p.image_url else f"/static/img/products/{p.sku}.jpg",
            "category": p.category or "General",
            "subcategory": p.subcategory or "General",
            "brand": p.brand or "Standard",
            "unit": p.unit or "Pcs",
            "sqft_per_piece": p.sqft_per_piece or 0.0,
            "opening_qty": round(opening_qty, 1),
            "total_restocked": round(total_restocked, 1),
            "total_sold": round(total_sold, 1),
            "stock_qty": round(current_stock, 1),
            "reorder_level": reorder_level,
            "stock_status": stock_status,
            "inventory_valuation": inventory_valuation,
            "purchase_price": round(p.purchase_price, 2),
            "selling_price": round(p.selling_price, 2),
            "min_selling_price": round(p.min_selling_price, 2),
            "gross_margin_pct": margin
        })
    return results

@app.post("/products", status_code=status.HTTP_201_CREATED)
def create_product(item: schemas.ProductCreate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    sku_clean = item.sku.strip().upper()
    if db.query(models.Product).filter(models.Product.sku == sku_clean).first():
        raise HTTPException(status_code=400, detail=f"Product with SKU '{sku_clean}' already exists.")
    
    image_url = None
    if item.image_base64:
        image_url = save_product_photo(sku_clean, item.image_base64)
    elif item.image_url:
        image_url = item.image_url.strip()
    else:
        image_url = f"/static/img/products/{sku_clean}.jpg"

    prod = models.Product(
        sku=sku_clean,
        name=item.name.strip(),
        description=(item.description or "").strip(),
        size=(item.size or "").strip(),
        image_url=image_url,
        category=item.category.strip(),
        subcategory=item.subcategory.strip() if item.subcategory else "General",
        brand=item.brand.strip() if item.brand else "Standard",
        unit=item.unit or "Pcs",
        sqft_per_piece=item.sqft_per_piece or 0.0,
        purchase_price=item.purchase_price or 0.0,
        selling_price=item.selling_price or 0.0,
        min_selling_price=item.min_selling_price or 0.0,
        stock_qty=item.stock_qty or 0.0
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

@app.put("/products/{product_id}")
def update_product(product_id: int, item: schemas.ProductUpdate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if item.sku is not None and item.sku.strip():
        sku_clean = item.sku.strip().upper()
        existing = db.query(models.Product).filter(models.Product.sku == sku_clean, models.Product.id != product_id).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Product with SKU '{sku_clean}' already exists.")
        prod.sku = sku_clean

    if item.name is not None:
        prod.name = item.name.strip()
    if item.description is not None:
        prod.description = item.description.strip()
    if item.size is not None:
        prod.size = item.size.strip()
    if item.category is not None:
        prod.category = item.category.strip()
    if item.subcategory is not None:
        prod.subcategory = item.subcategory.strip()
    if item.brand is not None:
        prod.brand = item.brand.strip()
    if item.unit is not None:
        prod.unit = item.unit.strip()
    if item.sqft_per_piece is not None:
        prod.sqft_per_piece = item.sqft_per_piece
    if item.purchase_price is not None:
        prod.purchase_price = item.purchase_price
    if item.selling_price is not None:
        prod.selling_price = item.selling_price
    if item.min_selling_price is not None:
        prod.min_selling_price = item.min_selling_price
    if item.stock_qty is not None:
        prod.stock_qty = item.stock_qty

    if item.image_base64:
        prod.image_url = save_product_photo(prod.sku, item.image_base64)
    elif item.image_url is not None:
        prod.image_url = item.image_url.strip()

    db.commit()
    db.refresh(prod)
    return prod

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), auth: bool = Depends(verify_owner_access)):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    if db.query(models.SaleItem).filter(models.SaleItem.product_id == product_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete product because it has linked sales invoices.")
    db.delete(prod)
    db.commit()
    return {"success": True, "message": f"Product {prod.sku} deleted"}

@app.post("/api/products/upload-photo")
async def upload_product_photo_endpoint(
    sku: str = Form(...),
    product_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_staff_or_owner)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty photo uploaded.")
    
    clean_sku = sku.strip().upper().replace("/", "_").replace("\\", "_").replace(" ", "_")
    prod_dir = os.path.join(STATIC_DIR, "img", "products")
    os.makedirs(prod_dir, exist_ok=True)
    
    ext = "jpg"
    if file.filename:
        _, file_ext = os.path.splitext(file.filename)
        if file_ext.lower() in [".png", ".webp", ".jpeg", ".jpg"]:
            ext = file_ext.lower().replace(".", "")
    
    filename = f"{clean_sku}.{ext}"
    file_path = os.path.join(prod_dir, filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    if ext != "jpg":
        with open(os.path.join(prod_dir, f"{clean_sku}.jpg"), "wb") as f:
            f.write(contents)
            
    img_url = f"/static/img/products/{clean_sku}.{ext}?v={int(time.time())}"
    
    if product_id:
        prod = db.query(models.Product).filter(models.Product.id == product_id).first()
        if prod:
            prod.image_url = img_url
            db.commit()
    else:
        prod = db.query(models.Product).filter(models.Product.sku == clean_sku).first()
        if prod:
            prod.image_url = img_url
            db.commit()

    return {"success": True, "image_url": img_url, "sku": clean_sku}

@app.get("/customers")
def list_customers(db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    return db.query(models.Customer).order_by(models.Customer.name.asc()).all()

@app.post("/customers")
def create_customer(item: schemas.CustomerCreate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    phone_clean = (item.phone or "").strip()
    if not phone_clean or phone_clean in ["0", "0000000000", "NA", "-"]:
        phone_clean = f"NA-{int(datetime.utcnow().timestamp() * 1000) % 1000000:06d}"
    try:
        existing = db.query(models.Customer).filter(models.Customer.phone == phone_clean).first()
        if existing:
            existing.name = item.name.strip()
            existing.address = item.address.strip() if item.address and item.address.strip() else "Onda"
            existing.category = item.category or "Retailer"
            db.commit()
            db.refresh(existing)
            return existing
        
        cust = models.Customer(
            name=item.name.strip(),
            phone=phone_clean,
            address=item.address.strip() if item.address and item.address.strip() else "Onda",
            category=item.category or "Retailer"
        )
        db.add(cust)
        db.commit()
        db.refresh(cust)
        return cust
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/customers/{customer_id}")
@app.get("/api/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    cust = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail=f"Customer #{customer_id} not found.")
    return cust

@app.put("/customers/{customer_id}")
@app.put("/api/customers/{customer_id}")
@app.post("/customers/{customer_id}")
@app.patch("/customers/{customer_id}")
def update_customer(customer_id: int, item: schemas.CustomerUpdate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    cust = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail=f"Customer #{customer_id} not found.")

    new_name = item.name.strip() if item.name and item.name.strip() else cust.name
    new_address = item.address.strip() if item.address and item.address.strip() else (cust.address or "Onda")
    new_category = item.category.strip() if item.category and item.category.strip() else (cust.category or "Retailer")

    phone_clean = (item.phone or "").strip()
    if not phone_clean or phone_clean in ["0", "0000000000", "NA", "-"]:
        if cust.phone and cust.phone.startswith("NA-"):
            phone_clean = cust.phone
        else:
            phone_clean = f"NA-{int(datetime.utcnow().timestamp() * 1000) % 1000000:06d}"

    try:
        if phone_clean != cust.phone:
            # Check if another customer already has this phone number
            existing_other = db.query(models.Customer).filter(
                models.Customer.phone == phone_clean,
                models.Customer.id != customer_id
            ).first()

            if existing_other:
                # Merge records safely: transfer invoices and payments to existing_other
                for inv in cust.invoices:
                    inv.customer_id = existing_other.id
                for pmt in cust.payments:
                    pmt.customer_id = existing_other.id

                existing_other.name = new_name
                existing_other.address = new_address
                existing_other.category = new_category

                db.delete(cust)
                db.commit()
                db.refresh(existing_other)
                return existing_other

        cust.name = new_name
        cust.phone = phone_clean
        cust.address = new_address
        cust.category = new_category

        db.commit()
        db.refresh(cust)
        return cust
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error updating customer: {str(e)}")

@app.post("/sales/multi")
def create_multi_sale(order: schemas.MultiSaleCreate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    cust = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found.")

    total_bill = 0.0
    total_cogs = 0.0
    items_to_save = []

    try:
        for line in order.items:
            prod = db.query(models.Product).filter(models.Product.id == line.product_id).first()
            if not prod:
                raise HTTPException(status_code=404, detail=f"Product with ID {line.product_id} not found.")
            if prod.stock_qty < line.qty:
                raise HTTPException(status_code=400, detail=f"Insufficient inventory for {prod.name}. Available: {prod.stock_qty}")

            prod.stock_qty -= line.qty
            line_total = line.qty * line.unit_price
            line_cogs = line.qty * prod.purchase_price
            total_bill += line_total
            total_cogs += line_cogs

            items_to_save.append({
                "product": prod,
                "name": prod.name,
                "unit": prod.unit,
                "qty": line.qty,
                "unit_price": line.unit_price,
                "unit_cost": prod.purchase_price,
                "line_total": line_total
            })

        paid = total_bill if order.paid_amount is None else order.paid_amount
        due = max(0.0, total_bill - paid)

        inv = models.Invoice(
            customer_id=cust.id,
            total_amount=round(total_bill, 2),
            paid_amount=round(paid, 2),
            due_amount=round(due, 2),
            total_cogs=round(total_cogs, 2),
            created_at=datetime.utcnow()
        )
        db.add(inv)
        db.flush()

        for it in items_to_save:
            si = models.SaleItem(
                invoice_id=inv.id,
                product_id=it["product"].id,
                qty=it["qty"],
                unit_price=it["unit_price"],
                unit_cost=it["unit_cost"]
            )
            db.add(si)

        db.commit()
        db.refresh(inv)

        ist_time = inv.created_at.replace(tzinfo=timezone.utc).astimezone(models.IST)

        return {
            "invoice_id": f"INV-{inv.id:04d}",
            "date": ist_time.strftime("%d-%m-%Y %I:%M %p"),
            "customer_name": f"{cust.name} ({cust.category})",
            "customer_phone": cust.phone,
            "items": [{
                "name": i["name"],
                "unit": i["unit"],
                "qty": i["qty"],
                "unit_price": i["unit_price"],
                "line_total": i["line_total"]
            } for i in items_to_save],
            "grand_total": round(total_bill, 2),
            "paid_amount": round(paid, 2),
            "due_amount": round(due, 2)
        }
    except Exception as e:
        db.rollback()
        raise e

@app.post("/purchases")
def log_purchase(p: schemas.PurchaseCreate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    prod = db.query(models.Product).filter(models.Product.id == p.product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    prod.stock_qty += p.qty
    prod.purchase_price = p.unit_cost

    if p.new_selling_price is not None and p.new_selling_price > 0:
        prod.selling_price = p.new_selling_price
    elif prod.selling_price < prod.purchase_price:
        prod.selling_price = round(prod.purchase_price * 1.10, 2)

    if p.new_min_selling_price is not None and p.new_min_selling_price > 0:
        prod.min_selling_price = p.new_min_selling_price
    elif prod.min_selling_price < prod.purchase_price:
        prod.min_selling_price = prod.purchase_price

    entry = models.Purchase(
        product_id=p.product_id,
        qty=p.qty,
        unit_cost=p.unit_cost,
        supplier_name=p.supplier_name or "Mill Stock",
        created_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    return {
        "message": "Stock logged and rates updated successfully", 
        "new_stock": prod.stock_qty,
        "new_selling_price": prod.selling_price
    }

@app.get("/dues/summary")
def dues_summary(db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    customers = db.query(models.Customer).all()
    results = []
    now = datetime.utcnow()

    for c in customers:
        invs = db.query(models.Invoice).filter(models.Invoice.customer_id == c.id).all()
        if not invs:
            continue
        total_billed = sum(i.total_amount for i in invs)
        total_paid = sum(i.paid_amount for i in invs)
        pending_due = sum(i.due_amount for i in invs)

        if pending_due > 0.01:
            unpaid = [i for i in invs if i.due_amount > 0.01]
            oldest_date = min(i.created_at for i in unpaid)
            overdue_days = (now - oldest_date).days

            results.append({
                "customer_id": c.id,
                "customer_name": c.name,
                "category": c.category or "Retailer",
                "phone": c.phone,
                "location": c.address or "Onda",
                "total_billed": round(total_billed, 2),
                "total_paid": round(total_paid, 2),
                "pending_due": round(pending_due, 2),
                "oldest_due_date": oldest_date.strftime("%d-%m-%Y"),
                "overdue_days": overdue_days
            })

    results.sort(key=lambda x: x["pending_due"], reverse=True)
    return results

@app.post("/dues/pay")
def pay_due(payment: schemas.DuePaymentCreate, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    cust = db.query(models.Customer).filter(models.Customer.id == payment.customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found.")

    receipt = models.PaymentReceipt(
        customer_id=payment.customer_id,
        amount=round(payment.amount, 2),
        note=payment.note or "Cash Clearance",
        created_at=datetime.utcnow()
    )
    db.add(receipt)

    rem_payment = payment.amount
    unpaid_invoices = (
        db.query(models.Invoice)
        .filter(models.Invoice.customer_id == payment.customer_id, models.Invoice.due_amount > 0)
        .order_by(models.Invoice.id.asc())
        .all()
    )

    for inv in unpaid_invoices:
        if rem_payment <= 0:
            break
        settle = min(inv.due_amount, rem_payment)
        inv.paid_amount += settle
        inv.due_amount -= settle
        rem_payment -= settle

    db.commit()
    return {"message": f"Successfully received payment of ₹{payment.amount}"}

@app.get("/invoices/history")
def sales_history(db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    invoices = (
        db.query(models.Invoice)
        .options(
            joinedload(models.Invoice.items).joinedload(models.SaleItem.product),
            joinedload(models.Invoice.customer)
        )
        .order_by(desc(models.Invoice.id))
        .limit(200)
        .all()
    )
    results = []

    for inv in invoices:
        cust = inv.customer
        lines = []
        total_cogs = 0.0
        for item in inv.items:
            p_name = item.product.name if item.product else "Item"
            p_unit = item.product.unit if item.product else "Pcs"
            lines.append(f"{p_name} ({item.qty:.1f} {p_unit})")
            total_cogs += (item.qty * item.unit_cost)

        profit = inv.total_amount - total_cogs
        margin_pct = (profit / inv.total_amount * 100.0) if inv.total_amount > 0 else 0.0

        if inv.created_at:
            if inv.created_at.tzinfo is None:
                ist_date = inv.created_at.replace(tzinfo=timezone.utc).astimezone(models.IST)
            else:
                ist_date = inv.created_at.astimezone(models.IST)
            date_str = ist_date.strftime("%Y-%m-%d %I:%M %p")
        else:
            date_str = "-"

        results.append({
            "id": inv.id,
            "invoice_id": f"INV-{inv.id:04d}",
            "date": date_str,
            "customer_id": cust.id if cust else None,
            "customer_name": cust.name if cust else "Walk-in Buyer",
            "customer_phone": cust.phone if cust else "-",
            "customer_category": cust.category if cust else "Retailer",
            "customer_address": cust.address if cust else "Onda",
            "items_detail": ", ".join(lines),
            "total_amount": round(inv.total_amount, 2),
            "paid_amount": round(inv.paid_amount, 2),
            "due_amount": round(inv.due_amount, 2),
            "profit": round(profit, 2),
            "margin_pct": round(margin_pct, 1)
        })
    return results


# ========================================================
# OWNER-ONLY FULL BUSINESS DATABASE BACKUP EXPORT
# ========================================================

@app.get("/api/erp/backup-export")
def export_database_backup(db: Session = Depends(get_db), auth: bool = Depends(verify_owner_access)):
    """
    Owner-Only Full Database Backup:
    Performs 100% read-only queries of all core business tables in Neon PostgreSQL,
    returning structured JSON with timestamp, row counts summary, and all records.
    """
    exported_at = get_now_ist().strftime("%Y-%m-%d %H:%M:%S IST")

    # 100% READ-ONLY fetch of all core business tables
    products = db.query(models.Product).order_by(models.Product.id).all()
    customers = db.query(models.Customer).order_by(models.Customer.id).all()
    invoices = db.query(models.Invoice).order_by(models.Invoice.id).all()
    sale_items = db.query(models.SaleItem).order_by(models.SaleItem.id).all()
    payment_receipts = db.query(models.PaymentReceipt).order_by(models.PaymentReceipt.id).all()
    purchases = db.query(models.Purchase).order_by(models.Purchase.id).all()
    carpenters = db.query(models.Carpenter).order_by(models.Carpenter.id).all()

    def serialize_row(obj):
        d = {}
        for col in obj.__table__.columns:
            val = getattr(obj, col.name)
            if isinstance(val, (datetime, date)):
                d[col.name] = val.isoformat()
            else:
                d[col.name] = val
        return d

    return {
        "status": "success",
        "exported_at": exported_at,
        "database": "Neon PostgreSQL (Live Production)",
        "summary": {
            "products_count": len(products),
            "customers_count": len(customers),
            "invoices_count": len(invoices),
            "sale_items_count": len(sale_items),
            "payment_receipts_count": len(payment_receipts),
            "purchases_count": len(purchases),
            "carpenters_count": len(carpenters)
        },
        "tables": {
            "products": [serialize_row(p) for p in products],
            "customers": [serialize_row(c) for c in customers],
            "invoices": [serialize_row(i) for i in invoices],
            "sale_items": [serialize_row(s) for s in sale_items],
            "payment_receipts": [serialize_row(pr) for pr in payment_receipts],
            "purchases": [serialize_row(pu) for pu in purchases],
            "carpenters": [serialize_row(cp) for cp in carpenters]
        }
    }


# ========================================================
# OWNER-ONLY BILL CORRECTION & VOID WITH STOCK RESTORATION
# ========================================================

@app.delete("/api/erp/bills/{bill_id}")
@app.delete("/api/invoices/{bill_id}")
@app.post("/api/invoices/{bill_id}/void")
def void_delete_bill(
    bill_id: str,
    request: Request,
    passcode: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Owner-Only Safe Bill Deletion / Void:
    1. Looks up all line items and restores exact inventory counts back to products table.
    2. Reverses customer ledger due balance by deleting the invoice.
    3. Cascades and removes sale items cleanly.
    """
    verify_owner_access(request, passcode)

    clean_id_str = str(bill_id).upper().replace("INV-", "").replace("INV", "").replace("#", "").strip()
    if not clean_id_str.isdigit():
        raise HTTPException(status_code=400, detail="Invalid invoice ID format. Expected numeric or INV-xxxx.")

    inv_id = int(clean_id_str)
    inv = db.query(models.Invoice).filter(models.Invoice.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Bill #INV-{inv_id:04d} not found.")

    cust = inv.customer
    cust_name = cust.name if cust else "Customer"
    inv_no_display = f"INV-{inv.id:04d}"
    due_amount = float(inv.due_amount or 0.0)
    total_amount = float(inv.total_amount or 0.0)

    restored_items = []

    try:
        # 1. Restore exact inventory stock quantities for every line item
        for item in inv.items:
            prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if prod:
                old_stock = prod.stock_qty
                prod.stock_qty = round(prod.stock_qty + item.qty, 2)
                restored_items.append({
                    "product_id": prod.id,
                    "sku": prod.sku,
                    "name": prod.name,
                    "qty_restored": item.qty,
                    "unit": prod.unit,
                    "previous_stock": old_stock,
                    "restored_stock": prod.stock_qty
                })

        # 2. Delete invoice (cascade deletes associated sale_items)
        db.delete(inv)
        db.commit()

        return {
            "success": True,
            "message": f"Bill #{inv_no_display} for {cust_name} (₹{total_amount:.2f}) deleted successfully. {len(restored_items)} items restored to Onda Depot stock.",
            "invoice_id": inv_no_display,
            "customer_name": cust_name,
            "due_reversed": due_amount,
            "total_amount": total_amount,
            "restored_items_count": len(restored_items),
            "restored_items": restored_items
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to void/delete bill: {str(e)}")


@app.put("/api/erp/bills/{bill_id}/customer")
@app.put("/api/invoices/{bill_id}/customer")
def edit_bill_customer(
    bill_id: str,
    req: schemas.EditBillCustomerRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Owner-Only Quick Customer Correction on Existing Bill:
    Allows owner to fix misspelled names, phone numbers, or village location on a bill,
    transferring the invoice and outstanding khata dues without re-billing inventory items.
    """
    verify_owner_access(request, req.passcode)

    clean_id_str = str(bill_id).upper().replace("INV-", "").replace("INV", "").replace("#", "").strip()
    if not clean_id_str.isdigit():
        raise HTTPException(status_code=400, detail="Invalid invoice ID format. Expected numeric or INV-xxxx.")

    inv_id = int(clean_id_str)
    inv = db.query(models.Invoice).filter(models.Invoice.id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Bill #INV-{inv_id:04d} not found.")

    new_name = (req.customer_name or "").strip()
    new_phone = (req.customer_phone or "").strip()
    new_village = (req.village or req.address or "Onda").strip()
    new_category = (req.category or "Retailer").strip()

    if not new_name:
        raise HTTPException(status_code=400, detail="Customer name is required.")
    if not new_phone:
        raise HTTPException(status_code=400, detail="Customer phone is required.")

    # Format phone digits
    digits = "".join(filter(str.isdigit, new_phone))
    clean_phone = digits[-10:] if len(digits) >= 10 else new_phone

    old_cust = inv.customer
    old_cust_name = old_cust.name if old_cust else "Previous Customer"

    try:
        # Check if customer with this phone number already exists
        target_cust = db.query(models.Customer).filter(models.Customer.phone == clean_phone).first()

        if target_cust:
            # Re-link invoice to target customer & update details
            target_cust.name = new_name
            target_cust.address = new_village
            if new_category:
                target_cust.category = new_category
            inv.customer_id = target_cust.id
            active_customer = target_cust
        else:
            # Check if old customer had other transactions
            other_invs = db.query(models.Invoice).filter(
                models.Invoice.customer_id == old_cust.id,
                models.Invoice.id != inv.id
            ).count() if old_cust else 0
            other_pmts = db.query(models.PaymentReceipt).filter(
                models.PaymentReceipt.customer_id == old_cust.id
            ).count() if old_cust else 0

            if old_cust and other_invs == 0 and other_pmts == 0:
                # Update existing customer directly
                old_cust.name = new_name
                old_cust.phone = clean_phone
                old_cust.address = new_village
                old_cust.category = new_category
                active_customer = old_cust
            else:
                # Create a new customer and transfer invoice
                new_cust = models.Customer(
                    name=new_name,
                    phone=clean_phone,
                    address=new_village,
                    category=new_category,
                    created_at=datetime.utcnow()
                )
                db.add(new_cust)
                db.flush()
                inv.customer_id = new_cust.id
                active_customer = new_cust

        db.commit()
        db.refresh(inv)

        return {
            "success": True,
            "message": f"Bill #INV-{inv.id:04d} customer updated from '{old_cust_name}' to '{active_customer.name}' ({active_customer.phone}).",
            "invoice_id": f"INV-{inv.id:04d}",
            "customer_id": active_customer.id,
            "customer_name": active_customer.name,
            "customer_phone": active_customer.phone,
            "customer_village": active_customer.address,
            "customer_category": active_customer.category
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update customer: {str(e)}")

@app.get("/analytics/executive-summary")
def executive_summary(request: Request, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):

    invoices = db.query(models.Invoice).all()
    sale_items = db.query(models.SaleItem).all()
    products = db.query(models.Product).all()
    customers = db.query(models.Customer).all()

    prod_map = {p.id: p for p in products}
    cust_map = {c.id: c for c in customers}
    inv_map = {inv.id: inv for inv in invoices}

    total_revenue = sum(inv.total_amount for inv in invoices)
    total_paid = sum(inv.paid_amount for inv in invoices)
    total_due = sum(inv.due_amount for inv in invoices)
    total_cogs = sum(si.qty * si.unit_cost for si in sale_items)
    total_profit = total_revenue - total_cogs
    gross_margin_pct = (total_profit / total_revenue * 100.0) if total_revenue > 0 else 0.0
    collection_efficiency_pct = (total_paid / total_revenue * 100.0) if total_revenue > 0 else 100.0

    now_ist_dt = datetime.now(IST)
    today_date = now_ist_dt.date()

    def to_ist(dt):
        if not dt:
            return now_ist_dt
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc).astimezone(IST)
        return dt.astimezone(IST)

    today_invs = [inv for inv in invoices if to_ist(inv.created_at).date() == today_date]
    today_inv_ids = {inv.id for inv in today_invs}
    today_revenue = sum(inv.total_amount for inv in today_invs)
    today_cash = sum(inv.paid_amount for inv in today_invs)
    today_due = sum(inv.due_amount for inv in today_invs)
    today_cogs = sum(si.qty * si.unit_cost for si in sale_items if si.invoice_id in today_inv_ids)
    today_profit = today_revenue - today_cogs

    mtd_invoices = [inv for inv in invoices if to_ist(inv.created_at).year == now_ist_dt.year and to_ist(inv.created_at).month == now_ist_dt.month]
    mtd_revenue = sum(inv.total_amount for inv in mtd_invoices)
    mtd_inv_ids = {inv.id for inv in mtd_invoices}
    mtd_cogs = sum(si.qty * si.unit_cost for si in sale_items if si.invoice_id in mtd_inv_ids)
    mtd_profit = mtd_revenue - mtd_cogs

    ytd_invoices = [inv for inv in invoices if to_ist(inv.created_at).year == now_ist_dt.year]
    ytd_revenue = sum(inv.total_amount for inv in ytd_invoices)
    ytd_inv_ids = {inv.id for inv in ytd_invoices}
    ytd_cogs = sum(si.qty * si.unit_cost for si in sale_items if si.invoice_id in ytd_inv_ids)
    ytd_profit = ytd_revenue - ytd_cogs

    # 2. Customer P&L + Segment Performance (Carpenter / Retailer / Contractor)
    cust_pl = []
    seg_map = defaultdict(lambda: {"revenue": 0.0, "profit": 0.0, "due": 0.0, "orders": 0})
    for c in customers:
        c_invs = [inv for inv in invoices if inv.customer_id == c.id]
        if not c_invs:
            continue
        c_inv_ids = {inv.id for inv in c_invs}
        c_rev = sum(inv.total_amount for inv in c_invs)
        c_due = sum(inv.due_amount for inv in c_invs)
        c_cogs = sum(si.qty * si.unit_cost for si in sale_items if si.invoice_id in c_inv_ids)
        c_prof = c_rev - c_cogs
        c_margin = (c_prof / c_rev * 100.0) if c_rev > 0 else 0.0
        cat_name = c.category or "Retailer"

        seg_map[cat_name]["revenue"] += c_rev
        seg_map[cat_name]["profit"] += c_prof
        seg_map[cat_name]["due"] += c_due
        seg_map[cat_name]["orders"] += len(c_invs)

        cust_pl.append({
            "customer_name": c.name,
            "category": cat_name,
            "phone": c.phone,
            "orders_count": len(c_invs),
            "total_revenue": round(c_rev, 2),
            "total_cogs": round(c_cogs, 2),
            "net_profit": round(c_prof, 2),
            "margin_pct": round(c_margin, 1)
        })
    cust_pl.sort(key=lambda x: x["net_profit"], reverse=True)

    segment_breakdown = []
    for seg, sdata in sorted(seg_map.items(), key=lambda x: x[1]["revenue"], reverse=True):
        s_margin = (sdata["profit"] / sdata["revenue"] * 100.0) if sdata["revenue"] > 0 else 0.0
        segment_breakdown.append({
            "segment": seg,
            "orders": sdata["orders"],
            "revenue": round(sdata["revenue"], 2),
            "profit": round(sdata["profit"], 2),
            "due": round(sdata["due"], 2),
            "margin_pct": round(s_margin, 1)
        })

    # 3. Category-Wise Revenue & Profit Breakdown + Top 10 Most Profitable SKUs
    cat_metrics = defaultdict(lambda: {"revenue": 0.0, "cogs": 0.0, "qty": 0.0})
    sku_metrics = defaultdict(lambda: {"qty_sold": 0.0, "revenue": 0.0, "cogs": 0.0})

    for si in sale_items:
        p = prod_map.get(si.product_id)
        cat_label = (p.category if p and p.category else "General").strip()
        line_rev = si.qty * si.unit_price
        line_cost = si.qty * si.unit_cost

        cat_metrics[cat_label]["revenue"] += line_rev
        cat_metrics[cat_label]["cogs"] += line_cost
        cat_metrics[cat_label]["qty"] += si.qty

        if p:
            sku_metrics[p.id]["qty_sold"] += si.qty
            sku_metrics[p.id]["revenue"] += line_rev
            sku_metrics[p.id]["cogs"] += line_cost

    category_breakdown = []
    for cat_name, cvals in sorted(cat_metrics.items(), key=lambda x: (x[1]["revenue"] - x[1]["cogs"]), reverse=True):
        c_prof = cvals["revenue"] - cvals["cogs"]
        c_marg = (c_prof / cvals["revenue"] * 100.0) if cvals["revenue"] > 0 else 0.0
        category_breakdown.append({
            "category": cat_name,
            "revenue": round(cvals["revenue"], 2),
            "profit": round(c_prof, 2),
            "margin_pct": round(c_marg, 1)
        })

    top_products = []
    for pid, svals in sku_metrics.items():
        p = prod_map.get(pid)
        if not p:
            continue
        s_prof = svals["revenue"] - svals["cogs"]
        s_marg = (s_prof / svals["revenue"] * 100.0) if svals["revenue"] > 0 else 0.0
        top_products.append({
            "sku": p.sku,
            "name": p.name,
            "category": p.category or "General",
            "unit": p.unit or "Pcs",
            "qty_sold": round(svals["qty_sold"], 1),
            "revenue": round(svals["revenue"], 2),
            "profit": round(s_prof, 2),
            "margin_pct": round(s_marg, 1)
        })
    top_products.sort(key=lambda x: x["profit"], reverse=True)
    top_products = top_products[:10]

    # 4. Dead / Unsold Stock & Locked Capital Alert
    dead_stock_items = []
    dead_stock_capital = 0.0
    for p in products:
        sold_qty = sku_metrics[p.id]["qty_sold"] if p.id in sku_metrics else 0.0
        if sold_qty <= 0 and (p.stock_qty or 0) > 0:
            val = round((p.stock_qty or 0) * (p.purchase_price or 0), 2)
            dead_stock_capital += val
            dead_stock_items.append({
                "sku": p.sku,
                "name": p.name,
                "category": p.category or "General",
                "brand": p.brand or "Standard",
                "unit": p.unit or "Pcs",
                "stock_qty": round(p.stock_qty, 1),
                "purchase_price": round(p.purchase_price, 2),
                "selling_price": round(p.selling_price, 2),
                "locked_capital": val
            })
    dead_stock_items.sort(key=lambda x: x["locked_capital"], reverse=True)

    # Monthly Trends (MoM)
    months_dict = {}
    for inv in invoices:
        ist_dt = to_ist(inv.created_at)
        m_key = ist_dt.strftime("%b %Y")
        if m_key not in months_dict:
            months_dict[m_key] = {"revenue": 0.0, "cogs": 0.0, "sort": ist_dt.strftime("%Y-%m")}
        months_dict[m_key]["revenue"] += inv.total_amount

    for si in sale_items:
        inv = inv_map.get(si.invoice_id)
        if inv:
            ist_dt = to_ist(inv.created_at)
            m_key = ist_dt.strftime("%b %Y")
            if m_key in months_dict:
                months_dict[m_key]["cogs"] += (si.qty * si.unit_cost)

    sorted_months = sorted(months_dict.items(), key=lambda x: x[1]["sort"])
    monthly_trends = []
    for m_key, vals in sorted_months:
        prof = vals["revenue"] - vals["cogs"]
        margin = (prof / vals["revenue"] * 100) if vals["revenue"] > 0 else 0
        monthly_trends.append({
            "month": m_key,
            "revenue": round(vals["revenue"], 2),
            "profit": round(prof, 2),
            "margin": round(margin, 1)
        })

    # Locality Distribution
    loc_metrics = defaultdict(lambda: {"revenue": 0.0, "orders": 0})
    for inv in invoices:
        cust = cust_map.get(inv.customer_id)
        loc = (cust.address if cust and cust.address else "Onda").strip()
        loc_metrics[loc]["revenue"] += inv.total_amount
        loc_metrics[loc]["orders"] += 1

    location_breakdown = [{
        "location": loc,
        "revenue": round(data["revenue"], 2),
        "orders": data["orders"]
    } for loc, data in sorted(loc_metrics.items(), key=lambda x: x[1]["revenue"], reverse=True)]

    return {
        "total_revenue": round(total_revenue, 2),
        "total_paid": round(total_paid, 2),
        "total_due": round(total_due, 2),
        "collection_efficiency_pct": round(collection_efficiency_pct, 1),
        "total_profit": round(total_profit, 2),
        "gross_margin_pct": round(gross_margin_pct, 1),
        "today_revenue": round(today_revenue, 2),
        "today_cash": round(today_cash, 2),
        "today_due": round(today_due, 2),
        "today_profit": round(today_profit, 2),
        "today_invoices_count": len(today_invs),
        "mtd_revenue": round(mtd_revenue, 2),
        "mtd_profit": round(mtd_profit, 2),
        "ytd_revenue": round(ytd_revenue, 2),
        "ytd_profit": round(ytd_profit, 2),
        "dead_stock_capital": round(dead_stock_capital, 2),
        "dead_stock_count": len(dead_stock_items),
        "monthly_trends": monthly_trends,
        "location_breakdown": location_breakdown,
        "category_breakdown": category_breakdown,
        "segment_breakdown": segment_breakdown,
        "top_products": top_products,
        "dead_stock_items": dead_stock_items[:15],
        "customer_pl": cust_pl
    }

@app.get("/quote-inquiries")
def get_website_quote_inquiries(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_staff_or_owner)
):
    query = db.query(models.QuoteInquiry)
    if status and status.lower() != "all":
        if status.lower() == "pending":
            query = query.filter((models.QuoteInquiry.status == "Pending") | (models.QuoteInquiry.status == None))
        else:
            query = query.filter(models.QuoteInquiry.status.ilike(status))
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (models.QuoteInquiry.customer_name.ilike(term)) |
            (models.QuoteInquiry.phone.ilike(term)) |
            (models.QuoteInquiry.delivery_locality.ilike(term)) |
            (models.QuoteInquiry.requested_items.ilike(term)) |
            (models.QuoteInquiry.quote_type.ilike(term))
        )
    rows = query.order_by(models.QuoteInquiry.id.desc()).limit(200).all()
    return [
        {
            "id": r.id,
            "customer_name": r.customer_name,
            "phone": r.phone,
            "quote_type": r.quote_type or "Retail",
            "delivery_locality": r.delivery_locality or "Onda",
            "requested_items": r.requested_items,
            "notes": r.notes,
            "status": r.status or "Pending",
            "created_at": r.created_at.strftime("%d %b %Y, %I:%M %p") if r.created_at else "Recent"
        }
        for r in rows
    ]

@app.post("/quote-inquiries/{inquiry_id}/resolve")
def resolve_quote_inquiry(inquiry_id: int, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    inquiry = db.query(models.QuoteInquiry).filter(models.QuoteInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.status = "Resolved"
    db.commit()
    return {"success": True, "message": f"Inquiry #Q-{inquiry_id} marked as resolved."}

@app.post("/quote-inquiries/{inquiry_id}/reopen")
def reopen_quote_inquiry(inquiry_id: int, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    inquiry = db.query(models.QuoteInquiry).filter(models.QuoteInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.status = "Pending"
    db.commit()
    return {"success": True, "message": f"Inquiry #Q-{inquiry_id} moved back to Pending."}

@app.delete("/quote-inquiries/{inquiry_id}")
def delete_quote_inquiry(inquiry_id: int, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    inquiry = db.query(models.QuoteInquiry).filter(models.QuoteInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inquiry)
    db.commit()
    return {"success": True, "message": f"Inquiry #Q-{inquiry_id} deleted."}

def serialize_craft_post_for_admin(r: models.CraftPost):
    title = f"{r.project_category}"
    if r.caption:
        title += f" • {r.caption[:40]}"
    status = r.status or ("approved" if r.is_approved else "pending")
    return {
        "id": f"cp_{r.id}",
        "raw_id": r.id,
        "source": "craft_post",
        "customer_name": r.author_name,
        "customer_phone": r.author_phone or "-",
        "customer_location": r.village_location or "Onda, Bankura",
        "project_title": title,
        "carpenter_name": r.author_name if (r.author_role or "").lower() == "mistri" else "BDE Mistri",
        "author_role": r.author_role or "Mistri",
        "materials_used": r.materials_used or "",
        "image_base64": r.image_base64,
        "is_approved": bool(r.is_approved or status == "approved"),
        "status": status,
        "invoice_no": r.bill_number or "-",
        "cashback_upi": r.upi_id or "-",
        "cashback_amount": float(r.cashback_amount or 0.0),
        "cashback_status": r.cashback_status or "Pending Review",
        "created_at": r.created_at.strftime("%d %b %Y, %I:%M %p") if r.created_at else "Recent",
        "created_dt": r.created_at or datetime.min
    }

def serialize_testimonial_for_admin(r: models.CustomerTestimonial):
    status = "approved" if r.is_approved else ("rejected" if r.cashback_status == "Rejected" else "pending")
    return {
        "id": f"tm_{r.id}",
        "raw_id": r.id,
        "source": "testimonial",
        "customer_name": r.customer_name,
        "customer_phone": r.customer_phone or "-",
        "customer_location": r.customer_location or "Onda, Bankura",
        "project_title": r.project_title,
        "carpenter_name": r.carpenter_name or "BDE Mistri",
        "author_role": "Customer",
        "materials_used": "",
        "image_base64": r.image_base64,
        "is_approved": bool(r.is_approved),
        "status": status,
        "invoice_no": r.invoice_no or "-",
        "cashback_upi": r.cashback_upi or "-",
        "cashback_amount": float(r.cashback_amount or 0.0),
        "cashback_status": r.cashback_status or "Pending Review",
        "created_at": r.created_at.strftime("%d %b %Y") if r.created_at else "Recent",
        "created_dt": r.created_at or datetime.min
    }

def find_item_by_identifier(item_id: str, db: Session):
    s = str(item_id).strip()
    if s.startswith("cp_") or s.startswith("cp-"):
        cid = int(s.split("_")[-1].split("-")[-1])
        return ("craft_post", db.query(models.CraftPost).filter(models.CraftPost.id == cid).first())
    elif s.startswith("tm_") or s.startswith("tm-"):
        tid = int(s.split("_")[-1].split("-")[-1])
        return ("testimonial", db.query(models.CustomerTestimonial).filter(models.CustomerTestimonial.id == tid).first())
    elif s.isdigit():
        num = int(s)
        cp = db.query(models.CraftPost).filter(models.CraftPost.id == num).first()
        if cp:
            return ("craft_post", cp)
        tm = db.query(models.CustomerTestimonial).filter(models.CustomerTestimonial.id == num).first()
        if tm:
            return ("testimonial", tm)
    return (None, None)

@app.get("/testimonials/admin")
@app.get("/api/admin/cashback-claims")
def get_all_testimonials_admin(db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    craft_posts = db.query(models.CraftPost).order_by(models.CraftPost.id.desc()).all()
    testimonials = db.query(models.CustomerTestimonial).order_by(models.CustomerTestimonial.id.desc()).all()
    
    combined = [serialize_craft_post_for_admin(cp) for cp in craft_posts] + [serialize_testimonial_for_admin(tm) for tm in testimonials]
    combined.sort(key=lambda x: x["created_dt"], reverse=True)
    for item in combined:
        item.pop("created_dt", None)
    return combined

@app.post("/testimonials/{item_id}/cashback")
@app.post("/api/admin/cashback-claims/{item_id}/cashback")
def update_testimonial_cashback(item_id: str, req: schemas.CashbackUpdateRequest, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    source, row = find_item_by_identifier(item_id, db)
    if not row:
        raise HTTPException(status_code=404, detail="Photo claim not found")
    row.cashback_amount = req.cashback_amount
    row.cashback_status = req.cashback_status
    db.commit()
    return {
        "success": True,
        "message": f"Cashback updated to {req.cashback_status} (₹{req.cashback_amount})",
        "cashback_amount": row.cashback_amount,
        "cashback_status": row.cashback_status
    }

@app.post("/testimonials/{item_id}/approve")
@app.post("/api/admin/cashback-claims/{item_id}/approve")
def approve_testimonial(item_id: str, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    source, row = find_item_by_identifier(item_id, db)
    if not row:
        raise HTTPException(status_code=404, detail="Photo claim not found")
    if source == "craft_post":
        row.status = "approved"
        row.is_approved = True
    else:
        row.is_approved = True
        if row.cashback_status == "Rejected":
            row.cashback_status = "Approved"
    db.commit()
    return {
        "success": True,
        "message": "Photo approved and published live to customer showcase & Mistri Gram!",
        "is_approved": True,
        "status": "approved"
    }

@app.post("/testimonials/{item_id}/reject")
@app.post("/api/admin/cashback-claims/{item_id}/reject")
def reject_testimonial(item_id: str, db: Session = Depends(get_db), auth: dict = Depends(verify_staff_or_owner)):
    source, row = find_item_by_identifier(item_id, db)
    if not row:
        raise HTTPException(status_code=404, detail="Photo claim not found")
    if source == "craft_post":
        row.status = "rejected"
        row.is_approved = False
    else:
        row.is_approved = False
        row.cashback_status = "Rejected"
    db.commit()
    return {
        "success": True,
        "message": "Photo submission rejected.",
        "is_approved": False,
        "status": "rejected"
    }

@app.delete("/testimonials/{item_id}")
@app.delete("/api/admin/cashback-claims/{item_id}")
def delete_testimonial(item_id: str, db: Session = Depends(get_db), auth: bool = Depends(verify_owner_access)):
    source, row = find_item_by_identifier(item_id, db)
    if row:
        db.delete(row)
        db.commit()
        return {"success": True, "message": "Photo claim deleted permanently"}
    raise HTTPException(status_code=404, detail="Photo claim not found")
