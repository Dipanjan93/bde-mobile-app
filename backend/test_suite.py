import os
import sys

# Force UTF-8 stdout and stderr encoding for Windows compatibility
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import time
import json
import subprocess
import urllib.request
import urllib.parse
import urllib.error

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from database import SessionLocal
from sqlalchemy import text

BASE_URL = "http://127.0.0.1:8000"

# Target baseline row counts in live Neon PostgreSQL
BASELINE_COUNTS = {
    "app_settings": 1,
    "app_users": 4,
    "carpenter_call_logs": 47,
    "carpenters": 8,
    "craft_comments": 0,
    "craft_posts": 0,
    "customer_testimonials": 0,
    "customers": 25,
    "invoices": 25,
    "payment_receipts": 3,
    "products": 108,
    "purchases": 0,
    "quote_inquiries": 0,
    "sale_items": 89
}

def get_live_row_counts():
    db = SessionLocal()
    counts = {}
    try:
        tables = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")).fetchall()
        for (tbl,) in tables:
            c = db.execute(text(f'SELECT COUNT(*) FROM "{tbl}"')).scalar()
            counts[tbl] = c
    finally:
        db.close()
    return counts

def ensure_server():
    """Checks if uvicorn server is up; if not, starts a background process."""
    try:
        req = urllib.request.Request(f"{BASE_URL}/manifest.json", method="GET")
        with urllib.request.urlopen(req, timeout=1) as resp:
            if resp.status == 200:
                print("[INFO] Server is already running on port 8000.", flush=True)
                return None
    except Exception:
        pass

    print("[INFO] Starting background uvicorn server on port 8000...", flush=True)
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=BASE_DIR,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    for _ in range(40):
        time.sleep(0.5)
        try:
            req = urllib.request.Request(f"{BASE_URL}/manifest.json", method="GET")
            with urllib.request.urlopen(req, timeout=1) as resp:
                if resp.status == 200:
                    print("[INFO] Server is ready!", flush=True)
                    return proc
        except Exception:
            continue
    raise RuntimeError("Failed to start uvicorn backend server")

def test_endpoint(name, url, method="GET", data=None, headers=None):
    try:
        req = urllib.request.Request(url, method=method)
        if data is not None:
            req.add_header('Content-Type', 'application/json')
            encoded = json.dumps(data).encode('utf-8')
        else:
            encoded = None

        if headers:
            for k, v in headers.items():
                req.add_header(k, v)

        with urllib.request.urlopen(req, data=encoded, timeout=10) as resp:
            status = resp.status
            raw = resp.read()
            text_resp = raw.decode('utf-8', errors='replace')
            print(f"[{status}] {name} ({method} {url}) - size: {len(raw)} bytes", flush=True)
            try:
                parsed = json.loads(text_resp)
                return parsed
            except Exception:
                return text_resp
    except urllib.error.HTTPError as e:
        print(f"[{e.code}] {name} returned HTTP {e.code}", flush=True)
        return {"error_code": e.code, "detail": e.reason}
    except Exception as e:
        print(f"[FAIL] {name}: {e}", flush=True)
        return None

def run_security_auth_audit():
    print("\n========================================================", flush=True)
    print("[AUTH-AUDIT] RUNNING CRITICAL CATEGORY D SERVER-SIDE AUTH ENFORCEMENT AUDIT", flush=True)
    print("========================================================", flush=True)

    protected_get_endpoints = [
        ("GET /products", f"{BASE_URL}/products"),
        ("GET /customers", f"{BASE_URL}/customers"),
        ("GET /invoices/history", f"{BASE_URL}/invoices/history"),
        ("GET /api/admin/cashback-claims", f"{BASE_URL}/api/admin/cashback-claims"),
        ("GET /dues/summary", f"{BASE_URL}/dues/summary"),
        ("GET /analytics/executive-summary", f"{BASE_URL}/analytics/executive-summary"),
        ("GET /quote-inquiries", f"{BASE_URL}/quote-inquiries"),
    ]

    # 1. Unauthenticated calls MUST throw 401 Unauthorized
    print("\n--- Sub-Test 1: Unauthenticated Requests (Must Return 401) ---", flush=True)
    for name, url in protected_get_endpoints:
        try:
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=12) as resp:
                print(f"[FAIL] {name} unexpectedly succeeded without credentials! (HTTP {resp.status})", flush=True)
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print(f"[PASS 401] {name}: Strictly Gated -> HTTP 401 Unauthorized", flush=True)
            else:
                print(f"[WARN] {name}: Returned unexpected HTTP {e.code}", flush=True)
        except Exception as e:
            print(f"[ERROR] {name}: {e}", flush=True)

    # 2. Staff passcode (x-passcode: BDE@1234) MUST succeed with 200
    print("\n--- Sub-Test 2: Staff Passcode (x-passcode: BDE@1234) ---", flush=True)
    for name, url in protected_get_endpoints:
        try:
            req = urllib.request.Request(url, method="GET")
            req.add_header("x-passcode", "BDE@1234")
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    print(f"[PASS 200] {name}: Staff Access Allowed -> HTTP 200 OK", flush=True)
                else:
                    print(f"[WARN] {name}: Returned HTTP {resp.status}", flush=True)
        except Exception as e:
            print(f"[FAIL] {name} failed with staff passcode: {e}", flush=True)

    # 3. Owner passcode (x-passcode: Dip@1993) MUST succeed with 200
    print("\n--- Sub-Test 3: Owner Passcode (x-passcode: Dip@1993) ---", flush=True)
    for name, url in protected_get_endpoints:
        try:
            req = urllib.request.Request(url, method="GET")
            req.add_header("x-passcode", "Dip@1993")
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    print(f"[PASS 200] {name}: Owner Access Allowed -> HTTP 200 OK", flush=True)
                else:
                    print(f"[WARN] {name}: Returned HTTP {resp.status}", flush=True)
        except Exception as e:
            print(f"[FAIL] {name} failed with owner passcode: {e}", flush=True)

    # 4. Signed Session Token Verification (Bearer Token & Cookie)
    print("\n--- Sub-Test 4: Signed Session Token Auth ---", flush=True)
    staff_auth = test_endpoint(
        "Staff Verification Token Generation",
        f"{BASE_URL}/api/staff/verify",
        method="POST",
        data={"passcode": "BDE@1234"}
    )
    staff_token = staff_auth.get("token") if isinstance(staff_auth, dict) else None
    if staff_token:
        try:
            req = urllib.request.Request(f"{BASE_URL}/products", method="GET")
            req.add_header("Authorization", f"Bearer {staff_token}")
            with urllib.request.urlopen(req, timeout=5) as resp:
                print(f"[PASS 200] Bearer Token Auth on GET /products: HTTP {resp.status}", flush=True)
        except Exception as e:
            print(f"[FAIL] Bearer Token Auth failed: {e}", flush=True)

    # 5. Owner-Only Destructive Routes Forbid Staff Access (Must Return 403)
    print("\n--- Sub-Test 5: Owner-Only Routes Forbid Staff Access (Must Return 403) ---", flush=True)
    owner_only_endpoints = [
        ("DELETE /products/99999", f"{BASE_URL}/products/99999"),
        ("DELETE /testimonials/cp_99999", f"{BASE_URL}/testimonials/cp_99999")
    ]
    for name, url in owner_only_endpoints:
        # A. Without Auth -> 401
        try:
            req = urllib.request.Request(url, method="DELETE")
            with urllib.request.urlopen(req, timeout=5) as resp:
                print(f"[FAIL] {name} succeeded without auth!", flush=True)
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print(f"[PASS 401] {name} Unauthenticated: HTTP 401 Unauthorized", flush=True)
            else:
                print(f"[WARN] {name} Unauthenticated: HTTP {e.code}", flush=True)

        # B. With Staff Auth -> 403 Forbidden
        try:
            req = urllib.request.Request(url, method="DELETE")
            req.add_header("x-passcode", "BDE@1234")
            with urllib.request.urlopen(req, timeout=5) as resp:
                print(f"[FAIL] {name} allowed staff access!", flush=True)
        except urllib.error.HTTPError as e:
            if e.code == 403:
                print(f"[PASS 403] {name} with Staff Passcode: HTTP 403 Forbidden (Owner Only!)", flush=True)
            else:
                print(f"[WARN] {name} with Staff Passcode: HTTP {e.code}", flush=True)

def run_storefront_tests():
    print("\n========================================================", flush=True)
    print("[STOREFRONT] RUNNING PUBLIC STOREFRONT & CUSTOMER APIS AUDIT", flush=True)
    print("========================================================", flush=True)

    # 1. Storefront Home
    test_endpoint("Storefront Home HTML", f"{BASE_URL}/")

    # 2. Manifest & SW
    test_endpoint("PWA Manifest", f"{BASE_URL}/manifest.json")
    test_endpoint("Service Worker", f"{BASE_URL}/sw.js")

    # 3. Product Catalog (Customer Facing)
    catalog = test_endpoint("Catalog API (GET /api/catalog)", f"{BASE_URL}/api/catalog")
    if isinstance(catalog, list) and len(catalog) > 0:
        sample = catalog[0]
        has_wholesale_leak = ("purchase_price" in sample or "min_selling_price" in sample)
        if not has_wholesale_leak:
            print(f"       [PASS] Security Verified: Wholesale purchase_price & min_selling_price omitted from public catalog!", flush=True)
        else:
            print(f"       [FAIL] SECURITY RISK: Wholesale price leaked in public catalog!", flush=True)

    # 4. Product Image
    test_endpoint("Product Image (/static/img/products/PLY-COMM-18-8X4.jpg)", f"{BASE_URL}/static/img/products/PLY-COMM-18-8X4.jpg")

    # 5. Carpenters Directory
    carpenters = test_endpoint("Carpenters API (GET /api/carpenters)", f"{BASE_URL}/api/carpenters")
    if isinstance(carpenters, list) and len(carpenters) > 0:
        c = carpenters[0]
        print(f"       Verification: Masked Phone: {c.get('masked_phone')}, Name: {c.get('name')}, Village: {c.get('village')}", flush=True)

    # 6. Special Promotional Banners
    banners = test_endpoint("Special Banners (GET /api/special-banners)", f"{BASE_URL}/api/special-banners")
    if isinstance(banners, list) and len(banners) > 0:
        print(f"       Verification: {len(banners)} special banners loaded.", flush=True)

    # 7. AI Project Estimator & BoQ Calculator
    ai_est_data = {
        "prompt": "Amar 6x6 ft er ekta wardrobe banate hobe, 18mm ply koto lagbe?",
        "plywood_grade": "marine",
        "finish_type": "matte"
    }
    ai_res = test_endpoint("AI Estimator (POST /api/ai-estimate)", f"{BASE_URL}/api/ai-estimate", method="POST", data=ai_est_data)
    if isinstance(ai_res, dict):
        print(f"       Verification: Item: {ai_res.get('item_type')}, Waste Area: {ai_res.get('surface_area_with_waste')} Sq.Ft", flush=True)

    # 8. Mistri Gram Social Feed
    feed_res = test_endpoint("Mistri Gram Feed (GET /api/feed)", f"{BASE_URL}/api/feed")
    if isinstance(feed_res, dict):
        print(f"       Verification: Posts count: {feed_res.get('count')}", flush=True)

    # 8b. Customer Testimonials (Unified to CraftPost)
    test_res = test_endpoint("Customer Testimonials (GET /api/testimonials)", f"{BASE_URL}/api/testimonials")
    if isinstance(test_res, list):
        print(f"       Verification: Approved testimonials count: {len(test_res)}", flush=True)

    # 9. Offline Data JS
    test_endpoint("Offline Data JS (/offline_data.js)", f"{BASE_URL}/offline_data.js")

    # 10. Console Template
    test_endpoint("Console Template (/console)", f"{BASE_URL}/console")

def main():
    print("=" * 60, flush=True)
    print("BABA DUGDHESWAR ENTERPRISE - AUTOMATED SECURITY TEST SUITE", flush=True)
    print("=" * 60, flush=True)

    # Step 1: Baseline Row Count Check
    print("\n[STEP 1] Checking baseline Neon PostgreSQL row counts...", flush=True)
    initial_counts = get_live_row_counts()
    for tbl, cnt in sorted(initial_counts.items()):
        expected = BASELINE_COUNTS.get(tbl, 0)
        match_str = "MATCH" if cnt == expected else f"MISMATCH (expected {expected})"
        print(f"  {tbl:25s}: {cnt:4d} rows [{match_str}]", flush=True)

    # Step 2: Ensure server is running
    proc = ensure_server()

    try:
        # Step 3: Run Security Auth Enforcement Audit
        run_security_auth_audit()

        # Step 4: Run Public Storefront & Customer APIs
        run_storefront_tests()

    finally:
        if proc:
            print("\n[INFO] Stopping background server process...", flush=True)
            proc.terminate()

    # Step 5: Post-Test Row Count Verification (Zero DB Modification Rule)
    print("\n" + "=" * 60, flush=True)
    print("[INTEGRITY-AUDIT] POST-TEST VERIFICATION: LIVE NEON DB ROW COUNT INTEGRITY", flush=True)
    print("=" * 60, flush=True)
    final_counts = get_live_row_counts()
    all_clean = True
    for tbl in sorted(BASELINE_COUNTS.keys()):
        c_before = initial_counts.get(tbl, 0)
        c_after = final_counts.get(tbl, 0)
        status = "[PASS] 100% IDENTICAL" if c_before == c_after else f"[FAIL] CHANGED! ({c_before} -> {c_after})"
        if c_before != c_after:
            all_clean = False
        print(f"  {tbl:25s}: Before={c_before:4d} | After={c_after:4d} | {status}", flush=True)

    if all_clean:
        print("\n[SUCCESS] All Neon PostgreSQL row counts are 100% UNTOUCHED and PRESERVED!", flush=True)
    else:
        print("\n[FAIL] Database row count mismatch detected!", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
