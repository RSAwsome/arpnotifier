import os
from PIL import Image

src_path = r"d:\WEBAPPS\arpnotifier\official_railone.png"
icons_dir = r"d:\WEBAPPS\arpnotifier\icons"

orig = Image.open(src_path).convert("RGBA")
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for s in sizes:
    resized = orig.resize((s, s), Image.Resampling.LANCZOS)
    target = os.path.join(icons_dir, f"icon-{s}.png")
    resized.save(target, "PNG", optimize=True)
    print(f"Saved authentic RailOne icon-{s}.png ({s}x{s})")

print("All icons successfully updated to authentic RailOne branding!")
