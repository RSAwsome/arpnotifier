import os
from PIL import Image, ImageDraw

def render_vandebharat_icon(size):
    # High resolution supersampling for crisp edges
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Dark futuristic curved glass background rounded rectangle
    margin = 8 * scale
    r = 90 * scale
    
    # Shadow layer
    shadow_margin = margin - (4 * scale)
    draw.rounded_rectangle(
        [margin + 4*scale, margin + 8*scale, canvas_size - margin + 4*scale, canvas_size - margin + 8*scale],
        radius=r,
        fill=(10, 10, 25, 120)
    )

    # Gradient base (Deep navy #0A0C1B to Indigo #171A38)
    draw.rounded_rectangle(
        [margin, margin, canvas_size - margin, canvas_size - margin],
        radius=r,
        fill=(12, 14, 28, 255),
        outline=(108, 99, 255, 160),
        width=4 * scale
    )

    # Glass reflection highlight (top 40%)
    draw.pieslice(
        [-canvas_size * 0.2, -canvas_size * 0.5, canvas_size * 1.2, canvas_size * 0.6],
        0, 180,
        fill=(255, 255, 255, 22)
    )

    # 2. Vande Bharat Train Aerodynamic Bullet Nose (Front 3/4 perspective silhouette)
    cx = canvas_size / 2
    cy = canvas_size / 2

    # High-speed motion trails behind the train
    for i, alpha in enumerate([40, 75, 120]):
        y_offset = (cy - 30*scale) + i * 35*scale
        draw.line([cx - 160*scale, y_offset, cx - 80*scale, y_offset], fill=(99, 102, 241, alpha), width=6*scale)
        draw.line([cx + 80*scale, y_offset, cx + 160*scale, y_offset], fill=(99, 102, 241, alpha), width=6*scale)

    # Vande Bharat White Body Wedge (Aerodynamic shape)
    body_points = [
        (cx - 95 * scale, cy + 110 * scale),  # bottom left
        (cx + 95 * scale, cy + 110 * scale),  # bottom right
        (cx + 80 * scale, cy - 25 * scale),   # mid right
        (cx + 45 * scale, cy - 95 * scale),   # top nose taper right
        (cx, cy - 120 * scale),               # top nose point
        (cx - 45 * scale, cy - 95 * scale),   # top nose taper left
        (cx - 80 * scale, cy - 25 * scale),   # mid left
    ]
    draw.polygon(body_points, fill=(245, 248, 255, 255))

    # Iconic Vande Bharat Navy Blue Center Stripe & Roof
    roof_points = [
        (cx - 40 * scale, cy - 90 * scale),
        (cx + 40 * scale, cy - 90 * scale),
        (cx + 25 * scale, cy - 118 * scale),
        (cx - 25 * scale, cy - 118 * scale)
    ]
    draw.polygon(roof_points, fill=(15, 28, 77, 255))

    # Center Blue & Saffron aerodynamic streak
    draw.polygon([
        (cx - 12 * scale, cy - 90 * scale),
        (cx + 12 * scale, cy - 90 * scale),
        (cx + 16 * scale, cy + 60 * scale),
        (cx - 16 * scale, cy + 60 * scale)
    ], fill=(12, 35, 115, 255))

    # Saffron Speed Accent Line (Tricolor homage)
    draw.line([cx - 8 * scale, cy - 50 * scale, cx - 8 * scale, cy + 50 * scale], fill=(255, 140, 0, 255), width=4*scale)
    draw.line([cx + 8 * scale, cy - 50 * scale, cx + 8 * scale, cy + 50 * scale], fill=(34, 197, 94, 255), width=4*scale)

    # Sleek Tinted Panoramic Windshield Glass
    windshield_points = [
        (cx - 52 * scale, cy - 70 * scale),
        (cx + 52 * scale, cy - 70 * scale),
        (cx + 42 * scale, cy - 20 * scale),
        (cx - 42 * scale, cy - 20 * scale)
    ]
    draw.polygon(windshield_points, fill=(20, 26, 45, 255), outline=(99, 102, 241, 200), width=3*scale)
    # Windshield glass reflection slash
    draw.line([cx - 20*scale, cy - 60*scale, cx - 10*scale, cy - 30*scale], fill=(255, 255, 255, 160), width=4*scale)

    # Signature Dual Sharp LED Headlights
    # Left Headlamp
    draw.polygon([
        (cx - 72 * scale, cy + 30 * scale),
        (cx - 50 * scale, cy + 26 * scale),
        (cx - 48 * scale, cy + 38 * scale),
        (cx - 68 * scale, cy + 42 * scale)
    ], fill=(255, 250, 220, 255))
    # Right Headlamp
    draw.polygon([
        (cx + 72 * scale, cy + 30 * scale),
        (cx + 50 * scale, cy + 26 * scale),
        (cx + 48 * scale, cy + 38 * scale),
        (cx + 68 * scale, cy + 42 * scale)
    ], fill=(255, 250, 220, 255))

    # LED Beam Glow circles
    draw.ellipse([cx - 75*scale, cy + 20*scale, cx - 40*scale, cy + 50*scale], fill=(255, 255, 200, 70))
    draw.ellipse([cx + 40*scale, cy + 20*scale, cx + 75*scale, cy + 50*scale], fill=(255, 255, 200, 70))

    # Lower Cowcatcher (Cattle Guard) Grill
    draw.polygon([
        (cx - 85 * scale, cy + 105 * scale),
        (cx + 85 * scale, cy + 105 * scale),
        (cx + 65 * scale, cy + 130 * scale),
        (cx - 65 * scale, cy + 130 * scale)
    ], fill=(30, 35, 55, 255))
    
    # Horizontal grille lines
    draw.line([cx - 60 * scale, cy + 115 * scale, cx + 60 * scale, cy + 115 * scale], fill=(80, 90, 120, 255), width=3*scale)
    draw.line([cx - 48 * scale, cy + 122 * scale, cx + 48 * scale, cy + 122 * scale], fill=(80, 90, 120, 255), width=3*scale)

    # Golden Railway Emblem on Front
    draw.ellipse([cx - 10*scale, cy - 2*scale, cx + 10*scale, cy + 18*scale], fill=(245, 158, 11, 255))

    # Downsample with high-quality Lanczos resampling
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

sizes = [72, 96, 128, 144, 152, 192, 384, 512]
icons_dir = r"d:\WEBAPPS\arpnotifier\icons"

for s in sizes:
    icon = render_vandebharat_icon(s)
    target_path = os.path.join(icons_dir, f"icon-{s}.png")
    icon.save(target_path, "PNG", optimize=True)
    print(f"Rendered Vande Bharat icon: icon-{s}.png ({s}x{s})")

print("All Vande Bharat icons generated successfully!")
