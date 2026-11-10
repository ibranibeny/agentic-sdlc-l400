"""Verify presentation integrity and basic geometry using only the standard library."""
from pathlib import Path
import re
import zipfile
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
deck = root / "presentations" / "agentic-sdlc-l400.pptx"
ns = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main"}
with zipfile.ZipFile(deck) as package:
    assert package.testzip() is None, "Corrupt ZIP entry"
    slides = sorted(n for n in package.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n))
    notes = [n for n in package.namelist() if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", n)]
    assert len(slides) >= 24, f"Expected at least 24 slides, got {len(slides)}"
    assert len(notes) == len(slides), "Every slide must have presenter notes"
    presentation = ET.fromstring(package.read("ppt/presentation.xml"))
    size = presentation.find("p:sldSz", ns)
    width, height = int(size.get("cx")), int(size.get("cy"))
    for name in slides:
        slide = ET.fromstring(package.read(name))
        text = " ".join(n.text or "" for n in slide.findall(".//a:t", ns))
        assert len(text) > 40, f"Empty slide {name}"
        for transform in slide.findall(".//a:xfrm", ns):
            off, ext = transform.find("a:off", ns), transform.find("a:ext", ns)
            if off is not None and ext is not None:
                x, y = int(off.get("x")), int(off.get("y"))
                cx, cy = int(ext.get("cx")), int(ext.get("cy"))
                assert x >= 0 and y >= 0 and x + cx <= width and y + cy <= height, f"Out of bounds: {name}"
    all_notes = " ".join(package.read(n).decode() for n in notes)
    assert "youtube.com" in all_notes and "docs.github.com" in all_notes, "Missing source notes"
print(f"Verified {len(slides)} slides, {len(notes)} note parts, ZIP integrity and slide bounds.")
