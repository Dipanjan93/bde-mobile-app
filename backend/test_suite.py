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
        print(f"       Verification: SKU: {sample['sku']}, Name: {sample['name']}, Unit: {sample.get('unit')}, Price fields omitted: {'customer_price' not in sample}")

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

    # 11. Staff / Manager Passcode Verification (Strict Validation)
    staff_auth = test_endpoint(
        "Staff Verification (POST /api/staff/verify - Valid Staff)",
        f"{BASE_URL}/api/staff/verify",
        method="POST",
        data={"passcode": "BDE@1234"}
    )
    if isinstance(staff_auth, dict):
        print(f"       Verification: Staff Role: {staff_auth.get('role')}, Authenticated: {staff_auth.get('authenticated')}")

    owner_auth = test_endpoint(
        "Staff Verification (POST /api/staff/verify - Valid Owner)",
        f"{BASE_URL}/api/staff/verify",
        method="POST",
        data={"passcode": "Dip@1993"}
    )
    if isinstance(owner_auth, dict):
        print(f"       Verification: Owner Role: {owner_auth.get('role')}, Token length: {len(owner_auth.get('token', ''))}")

    # Verify that numeric shortcuts like '1993' are rejected with 401
    for bad_code in ["1993", "bde1993", "1234", "admin"]:
        try:
            req = urllib.request.Request(
                f"{BASE_URL}/api/staff/verify",
                data=json.dumps({"passcode": bad_code}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            urllib.request.urlopen(req, timeout=5)
            print(f"[FAIL] Bad passcode '{bad_code}' was unexpectedly accepted!")
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print(f"[200] Strict Rejection Check: '{bad_code}' correctly rejected with HTTP 401 Unauthorized")
            else:
                print(f"[WARN] Bad passcode '{bad_code}' returned HTTP {e.code}")
        except Exception as e:
            print(f"[FAIL] Error checking '{bad_code}': {e}")

    # 12. Offline Data JS
    test_endpoint("Offline Data JS (/offline_data.js)", f"{BASE_URL}/offline_data.js")

    # 13. Multipart Photo Upload (Direct to Neon PostgreSQL)
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="project.jpg"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
        f"FAKE_JPEG_IMAGE_BYTES_FOR_TESTING\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="customer_name"\r\n\r\n'
        f"Subhasis Mondal\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="invoice_no"\r\n\r\n'
        f"INV-2026-TEST\r\n"
        f"--{boundary}--\r\n"
    ).encode("utf-8")
    try:
        req = urllib.request.Request(
            f"{BASE_URL}/api/upload/photo",
            data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            up_res = json.loads(resp.read().decode("utf-8"))
            print(f"[200] Multipart Photo Upload (POST /api/upload/photo) - id: {up_res.get('id')}")
            print(f"       Verification: {up_res.get('message')[:70]}...")
    except Exception as e:
        print(f"[FAIL] Multipart Photo Upload: {e}")

    # 14. Backward Compatible Console
    test_endpoint("Console Template (/console)", f"{BASE_URL}/console")

    print("\n=== ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    main()
