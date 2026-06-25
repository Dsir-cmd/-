import json
from pathlib import Path

from PIL import Image, ImageOps


SOURCE_ROOT = Path("F:/作品材料/works materials")
OUTPUT_ROOT = Path("public/portfolio/works/gallery")
MANIFEST_PATH = Path("public/portfolio/works/gallery-manifest.json")
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def image_files(folder: Path) -> list[Path]:
    files = [path for path in folder.iterdir() if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES]

    def sort_key(path: Path) -> tuple[int, str]:
        stem = path.stem
        return (int(stem), path.name) if stem.isdigit() else (10_000, path.name.casefold())

    return sorted(files, key=sort_key)


ALT_PREFIX = {
    "01": "摄影作品",
    "02": "商业拍摄作品",
    "03": "设计物料作品",
}


def export_image(source: Path, output: Path, max_size: tuple[int, int], key: str, index: int) -> dict:
    output.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        width, height = image.size
        image.save(output, quality=84, optimize=True)

    public_src = "/" + output.relative_to("public").as_posix()

    return {
        "src": public_src,
        "alt": f"{ALT_PREFIX[key]} {index:02d}",
        "sourceName": source.name,
        "width": width,
        "height": height,
        "displayMode": "contain-blur",
    }


def main() -> None:
    manifest: dict[str, list[dict]] = {}

    for key in ["01", "02", "03"]:
        source_dir = SOURCE_ROOT / key
        output_dir = OUTPUT_ROOT / key
        max_size = (2200, 2200) if key == "01" else (2400, 2400)

        items = []
        for index, source in enumerate(image_files(source_dir), start=1):
            output = output_dir / f"{index:03d}.jpg"
            items.append(export_image(source, output, max_size, key, index))

        manifest[key] = items
        print(f"{key}: {len(items)} images")

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(MANIFEST_PATH)


if __name__ == "__main__":
    main()
