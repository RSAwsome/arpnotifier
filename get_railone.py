import urllib.request
import re

url = "https://play.google.com/store/apps/details?id=org.cris.aikyam&hl=en_IN"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
    
    matches = re.findall(r"https://play-lh\.googleusercontent\.com/[A-Za-z0-9_-]+", html)
    print(f"Found {len(matches)} image matches")
    
    # Save the first distinct icon
    if matches:
        target_icon_url = matches[0] + "=s512"
        print("Downloading from:", target_icon_url)
        icon_req = urllib.request.Request(target_icon_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(icon_req) as i_resp, open("d:/WEBAPPS/arpnotifier/official_railone.png", "wb") as f:
            f.write(i_resp.read())
        print("official_railone.png saved successfully!")
    else:
        print("No matches")
except Exception as e:
    print("Error:", e)
