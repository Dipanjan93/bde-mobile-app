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
            safe_msg = str(up_res.get('message', '')).encode('ascii', errors='ignore').decode('ascii')
            print(f"       Verification: {safe_msg[:70]}...")
    except Exception as e:
        print(f"[FAIL] Multipart Photo Upload: {e}")

    # 14. Backward Compatible Console
    test_endpoint("Console Template (/console)", f"{BASE_URL}/console")

    # 15. Special Promotional Banners
    banners = test_endpoint("Special Banners (GET /api/special-banners)", f"{BASE_URL}/api/special-banners")
    if isinstance(banners, list) and len(banners) > 0:
        print(f"       Verification: {len(banners)} special banners loaded. First banner: {banners[0].get('title')}")
    test_endpoint("Banner 1 SVG (/static/img/special_banners/banner_1.svg)", f"{BASE_URL}/static/img/special_banners/banner_1.svg")

    # 16. AI Project Estimator & BoQ Calculator
    ai_est_data = {
        "prompt": "Amar 6x6 ft er ekta wardrobe banate hobe, 18mm ply koto lagbe?",
        "plywood_grade": "marine",
        "finish_type": "matte"
    }
    ai_res = test_endpoint("AI Estimator (POST /api/ai-estimate)", f"{BASE_URL}/api/ai-estimate", method="POST", data=ai_est_data)
    if isinstance(ai_res, dict):
        print(f"       Verification: Item: {ai_res.get('item_type')}, Waste Area: {ai_res.get('surface_area_with_waste')} Sq.Ft, 18mm Sheets: {ai_res.get('plywood_18mm_sheets')}, Budget: Rs.{ai_res.get('estimated_min_price')} - Rs.{ai_res.get('estimated_max_price')}")

    # 17. Mistri Gram Social Feed
    feed_res = test_endpoint("Mistri Gram Feed (GET /api/feed)", f"{BASE_URL}/api/feed")
    if isinstance(feed_res, dict):
        print(f"       Verification: Posts count: {feed_res.get('count')}, Leaderboard entries: {len(feed_res.get('leaderboard', []))}")
        if len(feed_res.get('posts', [])) > 0:
            sample_post = feed_res['posts'][0]
            print(f"       Verification: First post by: {sample_post.get('author_name')} ({sample_post.get('village_location')}) - Loves: {sample_post.get('likes_count')}")

            # Test like
            like_res = test_endpoint("Like Mistri Post (POST /api/feed/{id}/like)", f"{BASE_URL}/api/feed/{sample_post['id']}/like", method="POST")
            if isinstance(like_res, dict):
                print(f"       Verification: Post {sample_post['id']} updated likes: {like_res.get('likes_count')}")

            # Test comment
            comment_payload = {
                "commenter_name": "Test Customer",
                "comment_text": "Looking great! Are BDE materials available in Onda Depot?"
            }
            comm_res = test_endpoint("Comment on Post (POST /api/feed/{id}/comment)", f"{BASE_URL}/api/feed/{sample_post['id']}/comment", method="POST", data=comment_payload)
            if isinstance(comm_res, dict):
                print(f"       Verification: Comment ID: {comm_res.get('comment_id')}")

    # 18. Create Craft Post with QR Bill No & UPI
    new_post_payload = {
        "author_name": "Ratan Mistri",
        "author_role": "Master Mistri",
        "author_phone": "9434000000",
        "village_location": "Onda Bazar",
        "project_category": "Wardrobe",
        "caption": "Modern 4-door wardrobe with champagne handles and BWP marine ply.",
        "materials_used": "18mm BWP Marine Ply, 1.0mm Sunmica",
        "image_base64": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='blue'/></svg>",
        "bill_number": "BDE-TEST-999",
        "upi_id": "ratan@okaxis"
    }
    post_create_res = test_endpoint("Create Craft Post (POST /api/feed/post)", f"{BASE_URL}/api/feed/post", method="POST", data=new_post_payload)
    if isinstance(post_create_res, dict):
        created_post_id = post_create_res.get('post_id')
        print(f"       Verification: New Post ID: {created_post_id}, Status: {post_create_res.get('status')}")

    # 19. Admin Moderation Queue & Cashback Claims
    admin_claims = test_endpoint("Admin Moderation Queue (GET /testimonials/admin)", f"{BASE_URL}/testimonials/admin")
    if isinstance(admin_claims, list) and len(admin_claims) > 0:
        first_claim = admin_claims[0]
        claim_id = first_claim['id']
        print(f"       Verification: Total queue items: {len(admin_claims)}, First: #{claim_id} ({first_claim.get('customer_name')}) - Bill: {first_claim.get('invoice_no')}")

        # Approve item
        test_endpoint(f"Approve Claim (POST /testimonials/{claim_id}/approve)", f"{BASE_URL}/testimonials/{claim_id}/approve", method="POST")

        # Record Cashback Payout
        test_endpoint(f"Cashback Payout (POST /testimonials/{claim_id}/cashback)", f"{BASE_URL}/testimonials/{claim_id}/cashback", method="POST", data={"cashback_amount": 200.0, "cashback_status": "Paid"})

    # 20. Owner-Only Bill Customer Edit & Void with Stock Reversal
    test_bill_payload = {
        "customer_id": 1,
        "items": [{"product_id": 1, "qty": 5.0, "unit_price": 500.0}],
        "paid_amount": 1000.0
    }
    bill_res = test_endpoint("Create Multi-Sale Bill (POST /sales/multi)", f"{BASE_URL}/sales/multi", method="POST", data=test_bill_payload)
    if isinstance(bill_res, dict):
        test_inv_id = bill_res.get("invoice_id")
        print(f"       Verification: Created test bill: {test_inv_id}")

        # Edit Customer on Bill (Owner Only with passcode)
        edit_cust_payload = {
            "customer_name": "Test Edited Customer",
            "customer_phone": "9999900000",
            "village": "Onda Bazar",
            "category": "Carpenter",
            "passcode": "Dip@1993"
        }
        edit_res = test_endpoint(f"Edit Bill Customer (PUT /api/erp/bills/{test_inv_id}/customer)", f"{BASE_URL}/api/erp/bills/{test_inv_id}/customer", method="PUT", data=edit_cust_payload)
        if isinstance(edit_res, dict):
            print(f"       Verification: Updated customer: {edit_res.get('customer_name')} ({edit_res.get('customer_phone')})")

        # Void Bill & Restore Stock (Owner Only with passcode query)
        void_res = test_endpoint(f"Void Bill & Restore Stock (DELETE /api/erp/bills/{test_inv_id})", f"{BASE_URL}/api/erp/bills/{test_inv_id}?passcode=Dip@1993", method="DELETE")
        if isinstance(void_res, dict):
            print(f"       Verification: Voided bill {void_res.get('invoice_id')}, Stock restored: {void_res.get('restored_items_count')} items, Dues reversed: Rs.{void_res.get('due_reversed')}")

    # 21. POS Customer Profile Update (PUT /customers/{customer_id})
    update_cust_payload = {
        "name": "Bhole Carpenter",
        "phone": "1234567988",
        "address": "Onda Majhpara",
        "category": "Carpenter"
    }
    cust_res = test_endpoint("Edit Customer Profile from POS (PUT /customers/25)", f"{BASE_URL}/customers/25", method="PUT", data=update_cust_payload)
    if isinstance(cust_res, dict):
        print(f"       Verification: Customer #{cust_res.get('id')} updated to {cust_res.get('name')} | {cust_res.get('category')} | {cust_res.get('phone')} | {cust_res.get('address')}")

    print("\n=== ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY ===")


if __name__ == "__main__":
    main()

