import zipfile
import re

apk_path = r"C:\Users\Admin\Downloads\Baba Dugdheshwar Enterprise 1.0\android\app-release.apk"
with zipfile.ZipFile(apk_path, "r") as z:
    dex = z.read("classes.dex")
    urls = re.findall(rb"https?://[^\x00\s\"'<>]+", dex)
    cleaned = {u.decode('utf-8', errors='ignore') for u in urls if b'webintoapp' in u.lower() or b'dugdheshwar' in u.lower()}
    print("Found matching URLs in APK DEX:")
    for u in cleaned:
        print("  -", u)
