from pathlib import Path
import math
import re

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"D:\mini project\version 4\BuildFlow_AI_Project_Report\rendered_pages")
OUT = ROOT.parent / "qa_contact_sheets"
OUT.mkdir(exist_ok=True)


def page_num(path: Path) -> int:
    match = re.search(r"page-(\d+)\.png$", path.name)
    return int(match.group(1)) if match else 0


pages = sorted(ROOT.glob("page-*.png"), key=page_num)
font = ImageFont.load_default()
chunk_size = 6

for idx in range(0, len(pages), chunk_size):
    chunk = pages[idx:idx + chunk_size]
    thumbs = []
    for path in chunk:
        img = Image.open(path).convert("RGB")
        img.thumbnail((300, 420))
        canvas = Image.new("RGB", (320, 470), "white")
        x = (320 - img.width) // 2
        y = 10
        canvas.paste(img, (x, y))
        draw = ImageDraw.Draw(canvas)
        draw.text((12, 438), path.stem, fill="black", font=font)
        thumbs.append(canvas)

    cols = 2
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * 320 + 20, rows * 470 + 20), "#dcdcdc")
    for n, thumb in enumerate(thumbs):
        r = n // cols
        c = n % cols
        sheet.paste(thumb, (10 + c * 320, 10 + r * 470))

    sheet.save(OUT / f"contact-sheet-{idx // chunk_size + 1}.png")
