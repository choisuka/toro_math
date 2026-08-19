# -*- coding: utf-8 -*-
import sys
import os

# Fix stdout encoding for Windows cp949
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    from PIL import Image, ImageDraw, ImageFont
    print("[OK] Pillow found")
except ImportError:
    print("[..] Installing Pillow...")
    os.system(f'"{sys.executable}" -m pip install pillow')
    from PIL import Image, ImageDraw, ImageFont

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ICONS_DIR = os.path.join(SCRIPT_DIR, "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    s = size

    # Dark background
    radius = int(s * 0.16)
    bg_color = (15, 23, 42, 255)
    draw.rounded_rectangle([(0, 0), (s-1, s-1)], radius=radius, fill=bg_color)

    # Glow
    for i in range(20, 0, -1):
        alpha = int(30 * (i / 20))
        r = int(s * 0.4 * i / 20)
        cx, cy = s // 2, int(s * 0.35)
        draw.ellipse([(cx-r, cy-r), (cx+r, cy+r)], fill=(56, 189, 248, alpha))

    # Crown
    crown_color = (245, 158, 11, 255)
    cx = s // 2
    cy = int(s * 0.42)
    cw = int(s * 0.40)
    ch = int(s * 0.22)
    base_top = cy + int(ch * 0.15)
    base_bot = cy + int(ch * 0.65)
    draw.rounded_rectangle(
        [(cx - cw, base_top), (cx + cw, base_bot)],
        radius=int(s * 0.03), fill=crown_color
    )
    pts = [
        (cx - cw, base_top),
        (cx - cw, cy - int(ch * 0.6)),
        (cx - int(cw * 0.45), cy - int(ch * 0.1)),
        (cx, cy - int(ch * 0.95)),
        (cx + int(cw * 0.45), cy - int(ch * 0.1)),
        (cx + cw, cy - int(ch * 0.6)),
        (cx + cw, base_top),
    ]
    draw.polygon(pts, fill=crown_color)

    # Jewels
    jewel_r = max(4, int(s * 0.03))
    draw.ellipse([(cx - int(cw*0.45) - jewel_r, cy - int(ch*0.1) - jewel_r),
                  (cx - int(cw*0.45) + jewel_r, cy - int(ch*0.1) + jewel_r)],
                 fill=(239, 68, 68, 255))
    cr2 = max(5, int(s * 0.038))
    draw.ellipse([(cx - cr2, cy - int(ch*0.95) - cr2),
                  (cx + cr2, cy - int(ch*0.95) + cr2)],
                 fill=(56, 189, 248, 255))
    draw.ellipse([(cx + int(cw*0.45) - jewel_r, cy - int(ch*0.1) - jewel_r),
                  (cx + int(cw*0.45) + jewel_r, cy - int(ch*0.1) + jewel_r)],
                 fill=(52, 211, 153, 255))

    # Korean text
    text_y = int(s * 0.72)
    font_size = max(10, int(s * 0.14))
    font = None
    for fp in ["C:/Windows/Fonts/malgun.ttf", "C:/Windows/Fonts/gulim.ttc"]:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except Exception:
                pass
    if font is None:
        font = ImageFont.load_default()

    lines = ["\uc218\ud559\uc5ec\ud589\ud559\uc6d0", "-\uc601\ud1b5"]  # 수학여행학원, -영통
    colors = [(56, 189, 248), (52, 211, 153), (245, 158, 11)]
    line_gap = int(font_size * 1.15)
    for li, text in enumerate(lines):
        y = text_y + li * line_gap
        try:
            bbox = draw.textbbox((0, 0), text, font=font)
            tw = bbox[2] - bbox[0]
        except Exception:
            tw = font_size * len(text)
        x_start = (s - tw) // 2
        for i, ch_char in enumerate(text):
            col = colors[i % len(colors)]
            try:
                char_bbox = draw.textbbox((0, 0), ch_char, font=font)
                cw2 = char_bbox[2] - char_bbox[0]
            except Exception:
                cw2 = font_size
            draw.text((x_start, y), ch_char, font=font, fill=col + (255,))
            x_start += cw2

    return img

print("Generating icons...")
for sz in [192, 512]:
    img = make_icon(sz)
    out = os.path.join(ICONS_DIR, f"icon-{sz}.png")
    img.save(out, "PNG")
    print(f"[OK] icons/icon-{sz}.png created ({sz}x{sz})")

print("\nDone! Upload the games_hub/ folder to Netlify.")
