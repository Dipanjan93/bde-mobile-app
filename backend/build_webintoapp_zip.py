import os
import zipfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
STATIC_DIR = os.path.join(BASE_DIR, "backend", "static")
OUTPUT_ZIP = os.path.join(BASE_DIR, "bde_store_webintoapp_bundle.zip")

def main():
    print(f"Creating WebIntoApp offline bundle at: {OUTPUT_ZIP}")
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        # 1. Frontend core files
        for f in ["index.html", "manifest.json", "sw.js", "offline_data.js"]:
            p = os.path.join(FRONTEND_DIR, f)
            if os.path.exists(p):
                z.write(p, arcname=f)
                print(f"Added: {f}")

        # 2. Static images & product assets
        for root, dirs, files in os.walk(STATIC_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, os.path.join(BASE_DIR, "backend"))
                z.write(full_path, arcname=rel_path.replace("\\", "/"))

    size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
    print(f"Bundle created successfully! Size: {size_mb:.2f} MB")

if __name__ == "__main__":
    main()
