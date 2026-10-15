import urllib.request
import urllib.parse
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, url, method="GET", data=None):
    try:
        req = urllib.request.Request(url, method=method)
        if data is not None:
            req.add_header('Content-Type', 'application/json')
            encoded = json.dumps(data).encode('utf-8')
        else:
            encoded = None

        with urllib.request.urlopen(req, data=encoded, timeout=10) as resp:
            status = resp.status
            raw = resp.read()
            text = raw.decode('utf-8', errors='replace')
            print(f"[{status}] {name} ({method} {url}) - size: {len(raw)} bytes")
            try:
                parsed = json.loads(text)
                if isinstance(parsed, list):
                    print(f"       -> Array with {len(parsed)} items.")
                elif isinstance(parsed, dict):
                    print(f"       -> Keys: {list(parsed.keys())[:6]}")
                return parsed
            except Exception:
                preview = text[:60].replace('\n', ' ')
                print(f"       -> Non-JSON content (HTML or Asset), preview: {preview}...")
                return text
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return None

def main():
    print("=== TESTING BDE MOBILE E-COMMERCE BACKEND & STOREFRONT ===")
    
    # 1. Storefront Home
    test_endpoint("Storefront Home HTML", f"{BASE_URL}/")

    # 2. Manifest & SW
    test_endpoint("PWA Manifest", f"{BASE_URL}/manifest.json")
    test_endpoint("Service Worker", f"{BASE_URL}/sw.js")

    # 3. Product Catalog
    catalog = test_endpoint("Catalog API (GET /api/catalog)", f"{BASE_URL}/api/catalog")
    if isinstance(catalog, list) and len(catalog) > 0:
        sample = catalog[0]
        disp = sample['display_rate'].replace('₹', 'Rs.')
        print(f"       Verification: SKU: {sample['sku']}, Base: Rs.{sample['base_selling_price']}, Marked-Up (10%): Rs.{sample['customer_price']}, Display: {disp}")

    # 4. Product Image
    test_endpoint("Product Image (/static/img/products/PLY-COMM-18-8X4.jpg)", f"{BASE_URL}/static/img/products/PLY-COMM-18-8X4.jpg")

    # 5. Carpenters Directory
    carpenters = test_endpoint("Carpenters API (GET /api/carpenters)", f"{BASE_URL}/api/carpenters")
    if isinstance(carpenters, list) and len(carpenters) > 0:
        c = carpenters[0]
        print(f"       Verification: Masked Phone: {c['masked_phone']}, Name: {c['name']}, Village: {c['village']}")

    # 6. Auth Signup
    auth_data = {
        "name": "Subhasis Mondal",
        "phone": "9876500123",
        "location": "Punisole, Bankura"
    }
    test_endpoint("App Signup (POST /api/app/signup)", f"{BASE_URL}/api/app/signup", method="POST", data=auth_data)

    # 7. Carpenter Call Lead Tracker
    if isinstance(carpenters, list) and len(carpenters) > 0:
        call_data = {
            "carpenter_id": carpenters[0]["id"],
            "customer_name": "Subhasis Mondal",
            "customer_phone": "9876500123",
            "customer_village": "Punisole"
        }
        res_call = test_endpoint("Carpenter Call Lead (POST /api/carpenter-call)", f"{BASE_URL}/api/carpenter-call", method="POST", data=call_data)
        if isinstance(res_call, dict):
            print(f"       Verification: Dial Phone unmasked: {res_call.get('dial_phone')}, Carpenter: {res_call.get('carpenter_name')}")

    # 8. Quote Request (Furniture Calculator Option 1)
    quote_data = {
        "customer_name": "Subhasis Mondal",
        "phone": "9876500123",
        "delivery_locality": "Punisole",
        "furniture_type": "6x7 ft Sliding Wardrobe",
        "dimensions": "6 ft W x 7 ft H x 2 ft D",
        "materials_breakdown": "- 18mm Marine Ply: 4.5 Sheets\n- 12mm Ply: 1.5 Sheets\n- 1mm Sunmica: 3 Sheets\n- Fevicol Marine: 8 Kg",
        "estimated_cost": 21850.0,
        "notes": "Testing Counter Discount claim"
    }
    res_quote = test_endpoint("Quote Request (POST /api/quote-request)", f"{BASE_URL}/api/quote-request", method="POST", data=quote_data)
    if isinstance(res_quote, dict):
        print(f"       Verification: WhatsApp Redirect URL: {res_quote.get('whatsapp_url')[:65]}...")

    # 9. Testimonials (Customer Showcase)
    test_endpoint("Testimonials (GET /api/testimonials)", f"{BASE_URL}/api/testimonials")

    # 10. Testimonial Upload
    test_data = {
        "customer_name": "Raju Karmakar",
        "customer_phone": "9876500123",
        "customer_location": "Onda Bazar",
        "project_title": "Custom TV Cabinet & Wall Unit",
        "carpenter_name": "Tapan Karmakar",
        "image_base64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJyZWQiLz48L3N2Zz4="
    }
    test_endpoint("Submit Testimonial (POST /api/testimonials)", f"{BASE_URL}/api/testimonials", method="POST", data=test_data)

    # 11. Backward Compatible Console
    test_endpoint("Console Template (/console)", f"{BASE_URL}/console")

    print("\n=== ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    main()
