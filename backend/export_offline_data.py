import os
import json

os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"
from sqlalchemy import create_engine, text

raw_db_url = "postgresql+psycopg://neondb_owner:npg_ObrtiTZ9a5YW@ep-sweet-shape-b3jn07iv-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(raw_db_url)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

def main():
    with engine.connect() as conn:
        # 1. Products
        prods = conn.execute(text("SELECT id, sku, name, category, subcategory, brand, unit, sqft_per_piece, selling_price, stock_qty FROM products ORDER BY id ASC")).fetchall()
        catalog_list = []
        for p in prods:
            pid, sku, name, cat, subcat, brand, unit, sqft, s_price, stock = p
            base_s = float(s_price or 0.0)
            markup_price = round(base_s * 1.10, 2)
            mrp = round(markup_price * 1.25, 2)
            sqft_val = float(sqft or 0.0)

            if (unit or "").lower() == "sqft" and sqft_val > 0:
                sheet_price = round(markup_price * sqft_val, 2)
                sheet_price_text = f"Rs.{sheet_price:,.0f} / sheet ({sqft_val:.0f} sq.ft)"
                display_rate = f"Rs.{markup_price:,.2f} / sq.ft"
            else:
                sheet_price = markup_price
                sheet_price_text = f"Rs.{markup_price:,.2f}"
                display_rate = f"Rs.{markup_price:,.2f} / {unit or 'Pcs'}"

            name_lower = name.lower()
            cat_lower = (cat or "").lower()
            if "marine" in name_lower or "club" in (brand or "").lower():
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
            else:
                badge = "Puja Offer"
                badge_color = "blue"

            catalog_list.append({
                "id": pid,
                "sku": sku,
                "name": name,
                "category": cat or "General",
                "subcategory": subcat or "General",
                "brand": brand or "Standard",
                "unit": unit or "Pcs",
                "sqft_per_piece": sqft_val,
                "base_selling_price": base_s,
                "customer_price": markup_price,
                "mrp": mrp,
                "sheet_price": sheet_price,
                "display_rate": display_rate,
                "sheet_price_text": sheet_price_text,
                "stock_qty": float(stock or 0.0),
                "in_stock": (stock or 0.0) > 0,
                "badge": badge,
                "badge_color": badge_color,
                "image_url": f"/static/img/products/{sku}.jpg"
            })

        # 2. Carpenters
        carpenters_raw = conn.execute(text("SELECT id, name, phone, village, experience_years, rating, reviews_count, specialties, avatar, completed_projects FROM carpenters ORDER BY rating DESC")).fetchall()
        carpenter_list = []
        for c in carpenters_raw:
            cid, cname, cphone, cvillage, cexp, crating, creviews, cspec, cavatar, ccomp = c
            ph = (cphone or "").strip()
            masked = f"{ph[:5]}-XXXXX" if len(ph) >= 10 else f"{ph[:3]}-XXXXX"
            carpenter_list.append({
                "id": cid,
                "name": cname,
                "masked_phone": masked,
                "phone": ph,
                "village": cvillage,
                "experience_years": cexp,
                "rating": crating,
                "reviews_count": creviews,
                "specialties": cspec,
                "avatar": cavatar or "👨‍🔧",
                "completed_projects": ccomp,
                "is_verified": True
            })

        js_content = f"// BDE Offline Data Fallback for Android APK & PWA\nwindow.BDE_OFFLINE_CATALOG = {json.dumps(catalog_list, indent=2)};\nwindow.BDE_OFFLINE_CARPENTERS = {json.dumps(carpenter_list, indent=2)};\n"
        output_file = os.path.join(FRONTEND_DIR, "offline_data.js")
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"Exported {len(catalog_list)} products and {len(carpenter_list)} carpenters to {output_file}!")

if __name__ == "__main__":
    main()
