# -*- coding: utf-8 -*-
"""토로매쓰 PWA 아이콘 임시 생성 스크립트. 정식 디자인 전까지의 자리표시용."""
from PIL import Image, ImageDraw, ImageFont

BG = (15, 25, 35, 255)       # index.html --bg: #0f1923
GREEN = (46, 204, 113, 255)  # index.html --green: #2ecc71
GREEN_DARK = (26, 92, 42, 255)  # .btn-main 그라디언트 시작색

EMOJI_FONT = "C:/Windows/Fonts/seguiemj.ttf"


def draw_gradient_bg(size, rounded=None):
    img = Image.new("RGBA", (size, size), BG)
    grad = Image.new("RGBA", (size, size))
    gd = ImageDraw.Draw(grad)
    for y in range(size):
        t = y / size
        r = int(GREEN_DARK[0] * (1 - t) + BG[0] * t)
        g = int(GREEN_DARK[1] * (1 - t) + BG[1] * t)
        b = int(GREEN_DARK[2] * (1 - t) + BG[2] * t)
        gd.line([(0, y), (size, y)], fill=(r, g, b, 255))
    img = Image.alpha_composite(img, grad)
    if rounded:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=rounded, fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        return out
    return img


def draw_emoji(img, emoji, box_ratio):
    size = img.size[0]
    font_size = int(size * box_ratio)
    font = ImageFont.truetype(EMOJI_FONT, font_size)
    d = ImageDraw.Draw(img)
    try:
        bbox = d.textbbox((0, 0), emoji, font=font, embedded_color=True)
    except TypeError:
        bbox = d.textbbox((0, 0), emoji, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pos = ((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1])
    try:
        d.text(pos, emoji, font=font, embedded_color=True)
    except TypeError:
        d.text(pos, emoji, font=font, fill=GREEN)
    return img


def make_any(size, path):
    img = draw_gradient_bg(size, rounded=int(size * 0.22))
    img = draw_emoji(img, "🦕", 0.6)
    img.save(path)


def make_maskable(size, path):
    img = draw_gradient_bg(size, rounded=None)
    img = draw_emoji(img, "🦕", 0.42)  # safe zone 축소
    img.save(path)


if __name__ == "__main__":
    import os
    out_dir = "C:/Users/USER/toro_math/icons"
    os.makedirs(out_dir, exist_ok=True)
    make_any(192, f"{out_dir}/icon-192.png")
    make_any(512, f"{out_dir}/icon-512.png")
    make_maskable(512, f"{out_dir}/icon-maskable-512.png")
    print("done")
