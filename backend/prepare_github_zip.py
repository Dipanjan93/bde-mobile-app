import os
import zipfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_ZIP = os.path.join(BASE_DIR, "bde_github_repo_ready.zip")

def main():
    print(f"Creating GitHub ready repository bundle at: {OUTPUT_ZIP}")
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(BASE_DIR):
            # Exclude existing zips, pycache, and logs
            if any(x in root for x in ["__pycache__", ".system_generated", "bde_store_webintoapp_bundle", "bde_github_repo_ready"]):
                continue
            for file in files:
                if file.endswith(".zip") or file.endswith(".pyc") or file == "inspect_dex.py":
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, BASE_DIR)
                z.write(full_path, arcname=rel_path.replace("\\", "/"))

    size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
    print(f"GitHub Repository Bundle created successfully! Size: {size_mb:.2f} MB")

if __name__ == "__main__":
    main()
