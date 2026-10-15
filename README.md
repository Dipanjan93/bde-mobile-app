# 🪔 Baba Dugdheswar Enterprise — Mobile E-Commerce PWA & Android App

> **Showroom Location:** Onda Bazar Main Road, Bankura, West Bengal - 722144  
> **Specialization:** Plywood, Sunmica Laminates, Fiber Sheet, Adhesives & Hardware  
> **Showroom WhatsApp:** [+91 98670 98952](https://wa.me/919867098952)  
> **Backend Architecture:** FastAPI + Neon Cloud PostgreSQL + SQLAlchemy 2.0  

---

## 📱 Mobile App Highlights & UX Craft (Flipkart-Inspired)

1. **Golden-Yellow Launch Splash Screen (`#FACC15`)**:
   - Radial golden glow with pulsing royal-indigo (`#1E1B4B`) **BDE** logo badge and subtle Durga Puja trishul/plywood layering motif.
   - Dual-language typography: English + Bengali (*বাবা দুগ্ধেশ্বর এন্টারপ্রাইজ*).
   - High-precision 1.3-second scale/fade exit transition into the storefront.

2. **Festive Durga Puja Header & Navigation**:
   - Royal purple/violet festive gradient (`#3B0764` to `#7C3AED`) with shimmering festive badges.
   - Horizontal Service Pills: **🏷️ BDE Store**, **📐 Ply Calculator**, **🪚 Find Mistri**, **📸 Photo Gallery**, **🖥️ Owner ERP**.
   - User Location Strip: Delivering to **Onda Bazar, Bankura (722144)** with interactive 8-village locality switcher (Punisole, Ramsagar, Taldangra, Bishnupur, Bankura Sadar, Lodna, Santore).
   - Sticky White Search Bar: Reactive live auto-suggest dropdown with instant product thumbnails, SKU lookup, and voice input simulation.
   - Flipkart-Style Circular Category Row: For You, Plywood, Sunmica, Hardware, Fevicol, Mistris.
   - Clean White Bottom Navigation Bar: Custom SVG icons with active purple indicators for **Home**, **Estimator**, **Mistris**, **Showcase**, and **Account**.

3. **Home Storefront (2-Column Product Grid)**:
   - Horizontal snap-scrolling promotional hero banners with festive Durga Puja offers.
   - Filter chips for fast narrowing (18mm Ply, 12mm Ply, Marine 710, Fevicol SH, SS Hinges).
   - 2-Column Flipkart product cards featuring:
     - Real product images served from `/static/img/products/{sku}.jpg`.
     - Verified Brand Tags (`TYCON`, `Club`, `Fevicol`, `NTC`, `Mortice`, `NiVA`).
     - Dynamic Puja Deal badges (`Puja Deal 15% OFF`, `IS:710 Waterproof`, `Carpenter Choice`).
     - Transparent **+10% retail marked-up prices** over dealer counter cost.
     - Per-sq.ft and per-sheet price calculations (e.g. `₹52.80 / sq.ft • ₹1,690 / sheet`).
     - Real-time stock status indicator (`● In Stock at Onda Depot`).
     - One-Tap **⚡ Enquire / Order** button launching instant pre-filled WhatsApp quotes.

4. **Smart Furniture Calculator (Estimator)**:
   - Interactive furniture selector: **Wardrobes (Almirah)**, **Box Beds (Divans)**, **Modular Kitchens**, and **Dining/Tables**.
   - Dimension sliders & selections (Width, Height, Plywood Grade, Laminate finish).
   - Live Bill of Materials (BOM) Calculation:
     - 18mm & 12mm Plywood sheets required
     - 6mm Backing sheets
     - 1.0mm Decorative Outer Sunmica & 0.8mm Inner Liners
     - Fevicol adhesive (kg)
     - Hardware pack (softclose auto-hinges, telescopic drawer channels, handles, brackets)
   - Total estimated material cost using live catalogue rates (+10% marked up).
   - **Action 1: Claim Extra Counter Discount** -> Saves estimate to Neon DB (`POST /api/quote-request`) and redirects to showroom WhatsApp (`+919867098952`).
   - **Action 2: Get Expert Carpenter Help** -> Switches directly to verified mistris for that furniture category.

5. **Masked Carpenter Directory & Lead Tracker**:
   - Directory of verified Onda & Bankura master carpenters (Punisole, Onda, Ramsagar, Taldangra, Bishnupur, Bankura).
   - Privacy-protected masked phone numbers: `98005-XXXXX`.
   - **Call Now Button**: Authenticates user, logs connection lead via `POST /api/carpenter-call` to `carpenter_call_logs` table in Neon PostgreSQL, and unmasks phone number to launch native dialer (`tel:+91...`).

6. **Customer Project Photo Showcase**:
   - Community gallery of Bankura furniture projects built with BDE materials.
   - **On-Device HTML5 Canvas Compression**: High-res smartphone camera photos are resized to max 1200px and compressed to high-efficiency JPEG (~180KB) on the device before transmission to `POST /api/testimonials`.
   - Reward incentive: Submit photo and receive ₹500 discount coupon.

7. **Non-Intrusive Auth Bottom Sheet**:
   - 100% guest browsing. No upfront blocking wall!
   - Slides up smoothly only when initiating quote discounts, placing orders, calling mistris, or uploading photos.
   - Instant 1-tap mobile phone & name authentication (`POST /api/app/signup` & `POST /api/app/login`).

8. **PWA & Android Compatibility**:
   - Standalone `manifest.json` with theme color `#3B0764` and background `#FACC15`.
   - `sw.js` Service Worker for caching and offline shell.
   - Ready for packaging into APK/AAB via WebIntoApp, TWA, or Capacitor.

---

## 🔌 API Endpoints Summary

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Mobile PWA Storefront Application |
| `/manifest.json` | `GET` | PWA Web App Manifest |
| `/sw.js` | `GET` | PWA Service Worker |
| `/console` | `GET` | Backwards-Compatible Owner ERP & POS Console |
| `/api/catalog` | `GET` | Storefront product catalogue with +10% markup & festive badges |
| `/static/img/products/{sku}.jpg` | `GET` | Crisp product visual assets with dynamic fallback |
| `/api/quote-request` | `POST` | Calculator quote inquiry & WhatsApp redirect link generator |
| `/api/carpenters` | `GET` | Verified carpenters by village with masked phone numbers |
| `/api/carpenter-call` | `POST` | Lead tracker logging call connection & returning unmasked dial phone |
| `/api/testimonials` | `GET` | Approved customer project photos |
| `/api/testimonials` | `POST` | Customer photo submission with Canvas compressed base64 |
| `/api/app/signup` | `POST` | Mobile customer signup & profile creation |
| `/api/app/login` | `POST` | Mobile customer login & session creation |
| `/api/app/user/me` | `GET` | Current customer profile query |

---

## 🚀 How to Run Backend & Storefront

```powershell
# 1. Navigate to backend directory
cd C:\Users\Admin\.gemini\antigravity\scratch\bde_mobile_app\backend

# 2. Run with uvicorn
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# 3. Open in Browser or Mobile Device
# http://localhost:8000 (Storefront)
# http://localhost:8000/console (ERP / POS)
```

---

## 📦 Android APK & Google Play AAB Generation

### Option A: 1-Click Update via WebIntoApp (Fastest — 30 Seconds)
1. We have packaged the complete storefront into:  
   `C:\Users\Admin\.gemini\antigravity\scratch\bde_mobile_app\bde_store_webintoapp_bundle.zip`
2. Open your WebIntoApp dashboard at:  
   [https://webintoapp.com/author/apps/1699089/edit?cmd=app-switcher](https://webintoapp.com/author/apps/1699089/edit?cmd=app-switcher)
3. Select **HTML App** mode and upload `bde_store_webintoapp_bundle.zip`.
4. Click **Build All / Make App**. WebIntoApp compiles and signs the updated `.apk` and `.aab` immediately using your existing key in `android_release/my-release-key.jks`!

### Option B: Native Android Studio Build
1. Open Android Studio -> Open project folder:  
   `C:\Users\Admin\.gemini\antigravity\scratch\bde_mobile_app\android_project`
2. Select **Build > Generate Signed Bundle / APK**.
3. Choose **Android App Bundle** (for Google Play) or **APK** (for direct WhatsApp sharing).
4. Key store path: `../android_release/my-release-key.jks`  
   - Key store password: `BF7HczNFrbJ9`  
   - Key alias: `babadugdheshwarenterprise`  
   - Key password: `BF7HczNFrbJ9`  
5. Click **Finish**. Your release APK and AAB will be output in `app/build/outputs/`.

### Option C: Automated GitHub Actions Cloud CI/CD
1. Push this project to GitHub.
2. The workflow file at `.github/workflows/android_build.yml` runs on GitHub's cloud servers, automatically installing Android SDK 34 & JDK 17, and generates both `bde-store-release-apk` and `bde-store-release-aab` as downloadable build artifacts!

