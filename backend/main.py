import os
import urllib.parse
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from collections import defaultdict

os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from fastapi import FastAPI, HTTPException, Depends, status, Query, Request
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database import engine, Base, get_db
import models
import schemas
from models import IST, get_now_ist

# Ensure all tables are created in Neon PostgreSQL
Base.metadata.create_all(bind=engine)

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

        # 2. Showcase Testimonials
        if db.query(models.CustomerTestimonial).count() <= 1:
            sample_testimonials = [
                models.CustomerTestimonial(
                    customer_name="Subhasis Mondal",
                    customer_phone="9867098952",
                    customer_location="Punisole, Bankura",
                    project_title="4-Door Master Bedroom Sliding Wardrobe",
                    carpenter_name="Tapan Karmakar",
                    image_base64="",
                    is_approved=True,
                    created_at=datetime.utcnow() - timedelta(days=2)
                ),
                models.CustomerTestimonial(
                    customer_name="Debabrata Roy",
                    customer_phone="9434001122",
                    customer_location="Onda Bazar, Bankura",
                    project_title="L-Shape Waterproof Marine Kitchen",
                    carpenter_name="Swapan Sutradhar",
                    image_base64="",
                    is_approved=True,
                    created_at=datetime.utcnow() - timedelta(days=5)
                ),
                models.CustomerTestimonial(
                    customer_name="Arup Banerjee",
                    customer_phone="9123456789",
                    customer_location="Ramsagar, Bankura",
                    project_title="Teak Finish Hydraulic Box Bed (Queen Size)",
                    carpenter_name="Dilip Mistri",
                    image_base64="",
                    is_approved=True,
                    created_at=datetime.utcnow() - timedelta(days=9)
                )
            ]
            db.add_all(sample_testimonials)
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

@app.get("/console")
@app.get("/erp")
def serve_console():
    console_path = os.path.join(BASE_DIR, "templates", "index.html")
    if os.path.exists(console_path):
        return FileResponse(console_path, media_type="text/html")
    return {"message": "Console template not found"}


# --- Smart Dynamic Product Image Fallback ---
@app.get("/static/img/products/{sku_filename}")
def serve_product_image(sku_filename: str):
    file_path = os.path.join(STATIC_DIR, "img", "products", sku_filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/svg+xml")
    
    # Try with .svg or .jpg swap
    clean_sku = sku_filename.replace(".jpg", "").replace(".png", "").replace(".svg", "")
    for ext in [".svg", ".jpg"]:
        alt_path = os.path.join(STATIC_DIR, "img", "products", f"{clean_sku}{ext}")
        if os.path.exists(alt_path):
            return FileResponse(alt_path, media_type="image/svg+xml")

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
        # Calculate 10% marked up retail price as requested
        base_s = float(p.selling_price or 0.0)
        markup_price = round(base_s * 1.10, 2)
        mrp = round(markup_price * 1.25, 2)
        sqft = float(p.sqft_per_piece or 0.0)

        # Per sheet calculation for plywood / sheet materials
        if (p.unit or "").lower() == "sqft" and sqft > 0:
            sheet_price = round(markup_price * sqft, 2)
            sheet_mrp = round(mrp * sqft, 2)
            display_rate = f"₹{markup_price:,.2f} / sq.ft"
            sheet_price_text = f"₹{sheet_price:,.0f} / sheet ({sqft:.0f} sq.ft)"
        else:
            sheet_price = markup_price
            sheet_mrp = mrp
            display_rate = f"₹{markup_price:,.2f} / {p.unit or 'Pcs'}"
            sheet_price_text = f"₹{markup_price:,.2f}"

        # Determine festive Durga Puja deal badge
        name_lower = p.name.lower()
        cat_lower = (p.category or "").lower()
        if "marine" in name_lower or "club" in (p.brand or "").lower():
            badge = "IS:710 Waterproof"
            badge_color = "marine"
        elif "18" in name_lower and "ply" in cat_lower:
            badge = "Puja Deal 15% OFF"
            badge_color = "festive"
        elif "fevicol" in name_lower:
            badge = "Carpenter Choice"
            badge_color = "gold"
        elif "laminate" in cat_lower or "sunmica" in name_lower:
            badge = "High Gloss 1mm"
            badge_color = "purple"
        elif p.stock_qty > 100:
            badge = "Mega Counter Deal"
            badge_color = "festive"
        else:
            badge = "Puja Offer"
            badge_color = "blue"

        catalog_items.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "category": p.category or "General",
            "subcategory": p.subcategory or "General",
            "brand": p.brand or "Standard",
            "unit": p.unit or "Pcs",
            "sqft_per_piece": sqft,
            "base_selling_price": base_s,
            "customer_price": markup_price,
            "mrp": mrp,
            "sheet_price": sheet_price,
            "sheet_mrp": sheet_mrp,
            "display_rate": display_rate,
            "sheet_price_text": sheet_price_text,
            "stock_qty": float(p.stock_qty or 0.0),
            "in_stock": (p.stock_qty or 0.0) > 0,
            "badge": badge,
            "badge_color": badge_color,
            "image_url": f"/static/img/products/{p.sku}.jpg"
        })

    # Optional sorting
    if sort == "price_asc":
        catalog_items.sort(key=lambda x: x["customer_price"])
    elif sort == "price_desc":
        catalog_items.sort(key=lambda x: x["customer_price"], reverse=True)
    elif sort == "popular":
        catalog_items.sort(key=lambda x: x["stock_qty"], reverse=True)

    return catalog_items


# 2. POST /api/quote-request
@app.post("/api/quote-request")
def create_quote_request(q: schemas.QuoteRequestCreate, db: Session = Depends(get_db)):
    notes_combined = f"Furniture: {q.furniture_type} | Dims: {q.dimensions} | Est. Cost: ₹{q.estimated_cost:,.2f} | {q.notes or ''}"
    
    inquiry = models.QuoteInquiry(
        customer_name=q.customer_name.strip(),
        phone=q.phone.strip(),
        quote_type=q.quote_type or "Calculator Estimate",
        delivery_locality=q.delivery_locality or "Onda",
        requested_items=q.materials_breakdown or f"{q.furniture_type} Estimation",
        notes=notes_combined,
        created_at=datetime.utcnow()
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # Format professional WhatsApp message for Baba Dugdheswar Enterprise
    wa_message = (
        f"Namaskar Baba Dugdheswar Enterprise! 🙏\n"
        f"I would like to claim my Extra Counter Discount for my furniture project:\n\n"
        f"👤 Customer: {q.customer_name.strip()}\n"
        f"📞 Phone: {q.phone.strip()}\n"
        f"📍 Locality: {q.delivery_locality}\n"
        f"🪑 Furniture: {q.furniture_type} ({q.dimensions})\n"
        f"💰 Approx Material Cost: ₹{q.estimated_cost:,.2f}\n\n"
        f"📋 Materials Estimate:\n{q.materials_breakdown}\n\n"
        f"Please share your best festive offer & delivery schedule to Onda/Bankura."
    )
    encoded_text = urllib.parse.quote(wa_message)
    whatsapp_url = f"https://wa.me/919867098952?text={encoded_text}"

    return {
        "success": True,
        "inquiry_id": inquiry.id,
        "whatsapp_url": whatsapp_url,
        "message": "Quote saved successfully! Redirecting to Baba Dugdheswar Enterprise WhatsApp..."
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
    db.commit()

    return {
        "success": True,
        "carpenter_id": carpenter.id,
        "carpenter_name": carpenter.name,
        "dial_phone": carpenter.phone,
        "message": f"Connection established with {carpenter.name}. Opening dialer..."
    }


# 5. GET /api/testimonials & POST /api/testimonials
@app.get("/api/testimonials")
def get_approved_testimonials(db: Session = Depends(get_db)):
    rows = (
        db.query(models.CustomerTestimonial)
        .filter(models.CustomerTestimonial.is_approved == True)
        .order_by(models.CustomerTestimonial.id.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": r.id,
            "customer_name": r.customer_name,
            "customer_location": r.customer_location,
            "project_title": r.project_title,
            "carpenter_name": r.carpenter_name or "Local BDE Mistri",
            "image_base64": r.image_base64,
            "created_at": r.created_at.strftime("%d %b %Y") if r.created_at else "Recent"
        }
        for r in rows
    ]

@app.post("/api/testimonials")
def submit_testimonial(item: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    record = models.CustomerTestimonial(
        customer_name=item.customer_name.strip(),
        customer_phone=item.customer_phone.strip(),
        customer_location=item.customer_location.strip(),
        project_title=item.project_title.strip(),
        carpenter_name=item.carpenter_name.strip() if item.carpenter_name else "BDE Mistri",
        image_base64=item.image_base64,
        is_approved=True,  # Approved for showcase with admin moderation
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "id": record.id,
        "message": "Photo uploaded successfully! Your entry is now showcased in Baba Dugdheswar Gallery."
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
def list_products(db: Session = Depends(get_db)):
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
def create_product(item: schemas.ProductCreate, db: Session = Depends(get_db)):
    sku_clean = item.sku.strip().upper()
    if db.query(models.Product).filter(models.Product.sku == sku_clean).first():
        raise HTTPException(status_code=400, detail=f"Product with SKU '{sku_clean}' already exists.")
    
    prod = models.Product(
        sku=sku_clean,
        name=item.name.strip(),
        category=item.category.strip(),
        subcategory=item.subcategory.strip() if item.subcategory else "General",
        brand=item.brand.strip() if item.brand else "Standard",
        unit=item.unit,
        sqft_per_piece=item.sqft_per_piece or 0.0,
        purchase_price=item.purchase_price,
        selling_price=item.selling_price,
        min_selling_price=item.min_selling_price,
        stock_qty=item.stock_qty or 0.0
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

@app.get("/customers")
def list_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).order_by(models.Customer.name.asc()).all()

@app.post("/customers")
def create_customer(item: schemas.CustomerCreate, db: Session = Depends(get_db)):
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

@app.post("/sales/multi")
def create_multi_sale(order: schemas.MultiSaleCreate, db: Session = Depends(get_db)):
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
def log_purchase(p: schemas.PurchaseCreate, db: Session = Depends(get_db)):
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
def dues_summary(db: Session = Depends(get_db)):
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
def pay_due(payment: schemas.DuePaymentCreate, db: Session = Depends(get_db)):
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
def sales_history(db: Session = Depends(get_db)):
    invoices = db.query(models.Invoice).order_by(desc(models.Invoice.id)).limit(200).all()
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
            "invoice_id": f"INV-{inv.id:04d}",
            "date": date_str,
            "customer_name": cust.name if cust else "Walk-in Buyer",
            "customer_phone": cust.phone if cust else "-",
            "customer_category": cust.category if cust else "Retailer",
            "items_detail": ", ".join(lines),
            "total_amount": round(inv.total_amount, 2),
            "paid_amount": round(inv.paid_amount, 2),
            "due_amount": round(inv.due_amount, 2),
            "profit": round(profit, 2),
            "margin_pct": round(margin_pct, 1)
        })
    return results

@app.get("/analytics/executive-summary")
def executive_summary(db: Session = Depends(get_db)):
    invoices = db.query(models.Invoice).all()
    sale_items = db.query(models.SaleItem).all()
    products = db.query(models.Product).all()
    customers = db.query(models.Customer).all()

    prod_map = {p.id: p for p in products}

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
        "ytd_profit": round(ytd_profit, 2)
    }

@app.get("/quote-inquiries")
def get_website_quote_inquiries(db: Session = Depends(get_db)):
    rows = db.query(models.QuoteInquiry).order_by(models.QuoteInquiry.id.desc()).limit(100).all()
    return [
        {
            "id": r.id,
            "customer_name": r.customer_name,
            "phone": r.phone,
            "quote_type": r.quote_type or "Retail",
            "delivery_locality": r.delivery_locality or "Onda",
            "requested_items": r.requested_items,
            "notes": r.notes,
            "created_at": r.created_at.strftime("%d %b %Y, %I:%M %p") if r.created_at else "Recent"
        }
        for r in rows
    ]

@app.get("/testimonials/admin")
def get_all_testimonials_admin(db: Session = Depends(get_db)):
    rows = db.query(models.CustomerTestimonial).order_by(models.CustomerTestimonial.id.desc()).all()
    return [
        {
            "id": r.id,
            "customer_name": r.customer_name,
            "customer_phone": r.customer_phone,
            "customer_location": r.customer_location,
            "project_title": r.project_title,
            "carpenter_name": r.carpenter_name or "-",
            "image_base64": r.image_base64,
            "is_approved": r.is_approved,
            "created_at": r.created_at.strftime("%d %b %Y") if r.created_at else "Recent"
        }
        for r in rows
    ]

@app.post("/testimonials/{item_id}/approve")
def approve_testimonial(item_id: int, db: Session = Depends(get_db)):
    row = db.query(models.CustomerTestimonial).filter(models.CustomerTestimonial.id == item_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Photo not found")
    row.is_approved = not row.is_approved
    db.commit()
    return {"message": "Updated approval status", "is_approved": row.is_approved}

@app.delete("/testimonials/{item_id}")
def delete_testimonial(item_id: int, db: Session = Depends(get_db)):
    row = db.query(models.CustomerTestimonial).filter(models.CustomerTestimonial.id == item_id).first()
    if row:
        db.delete(row)
        db.commit()
    return {"message": "Deleted photo"}
