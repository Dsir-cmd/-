from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

SOURCE_SETS = {
    "commercial": Path("F:/作品材料/商业拍摄"),
    "design": Path("F:/作品材料/设计物料（Anker展会）"),
}

CONTACT_DIR = Path("docs/codex/contact-sheets")
CONTACT_DIR.mkdir(parents=True, exist_ok=True)
WORK_ASSET_DIR = Path("public/portfolio/works")

WORK_ASSETS = [
    (
        "commercial/theatre-portrait.jpg",
        Path("F:/作品材料/商业拍摄/慕风戏剧定妆照/_DSC0921.jpg"),
        (1400, 1800),
    ),
    (
        "commercial/stage-dance.jpg",
        Path("F:/作品材料/商业拍摄/舞团表演现场实拍/_DSC1485.jpg"),
        (1800, 1200),
    ),
    (
        "commercial/aquarium.jpg",
        Path("F:/作品材料/商业拍摄/鱼缸造景实拍/_DSC0128-已增强-降噪.jpg"),
        (1800, 1200),
    ),
    (
        "design/booth-front.jpg",
        Path("F:/作品材料/设计物料（Anker展会）/正视图.jpg"),
        (1800, 1200),
    ),
    (
        "design/brochure-front.jpg",
        Path("F:/作品材料/设计物料（Anker展会）/产品宣传册（正）.jpg"),
        (1800, 1200),
    ),
    (
        "design/booth-detail.jpg",
        Path("F:/作品材料/设计物料（Anker展会）/咨询台细节.jpg"),
        (1800, 1200),
    ),
]


def image_files(root: Path) -> list[Path]:
    return [p for p in root.rglob("*") if p.suffix.lower() in [".jpg", ".jpeg", ".png"]]


def make_contact_sheet(name: str, files: list[Path]) -> None:
    files = files[:80]
    cell_w, cell_h = 220, 180
    cols = 5
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_w, max(1, rows) * cell_h), "#0b1118")
    draw = ImageDraw.Draw(sheet)

    for index, path in enumerate(files):
        try:
            with Image.open(path) as img:
                img = ImageOps.exif_transpose(img).convert("RGB")
                img.thumbnail((cell_w - 20, cell_h - 42), Image.Resampling.LANCZOS)
                x = (index % cols) * cell_w + (cell_w - img.width) // 2
                y = (index // cols) * cell_h + 10
                sheet.paste(img, (x, y))
                label = f"{index + 1:02d} {path.parent.name}/{path.name}"
                draw.text(
                    ((index % cols) * cell_w + 8, (index // cols) * cell_h + cell_h - 28),
                    label[:34],
                    fill="#d7e7f5",
                )
        except Exception as exc:
            draw.text(
                ((index % cols) * cell_w + 8, (index // cols) * cell_h + 20),
                f"ERR {path.name}",
                fill="#ff9966",
            )
            print(f"ERR {path}: {exc}")

    output = CONTACT_DIR / f"{name}-available.jpg"
    sheet.save(output, quality=86)
    print(output)


def export_work_assets() -> None:
    for relative_output, source, max_size in WORK_ASSETS:
        output = WORK_ASSET_DIR / relative_output
        output.parent.mkdir(parents=True, exist_ok=True)

        with Image.open(source) as img:
            img = ImageOps.exif_transpose(img).convert("RGB")
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            img.save(output, quality=84, optimize=True)
            print(output)


def main() -> None:
    for name, root in SOURCE_SETS.items():
        files = image_files(root)
        print(f"{name}: {len(files)} files")
        make_contact_sheet(name, files)

    export_work_assets()


if __name__ == "__main__":
    main()
