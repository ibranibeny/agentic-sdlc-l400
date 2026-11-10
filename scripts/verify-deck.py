"""Verify presentation integrity and basic geometry using only the standard library."""
from pathlib import Path
import hashlib
import json
import posixpath
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
    assert len(slides) >= 36, f"Expected at least 36 story-first workshop slides, got {len(slides)}"
    assert len(notes) == len(slides), "Every slide must have presenter notes"
    presentation = ET.fromstring(package.read("ppt/presentation.xml"))
    size = presentation.find("p:sldSz", ns)
    width, height = int(size.get("cx")), int(size.get("cy"))
    relationships = ET.fromstring(package.read("ppt/_rels/presentation.xml.rels"))
    targets = {entry.get("Id"): entry.get("Target") for entry in relationships}
    ordered_ids = presentation.findall("p:sldIdLst/p:sldId", ns)
    story_id = ordered_ids[1].get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
    story_path = posixpath.normpath(posixpath.join("ppt", targets[story_id]))
    story = ET.fromstring(package.read(story_path))
    assert "STORY / Levi Strauss" in " ".join(n.text or "" for n in story.findall(".//a:t", ns)), "Begin with the source story"
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
    manifest = json.loads((root / "site" / "screenshots" / "provenance.json").read_text(encoding="utf-8"))
    for capture in manifest["captures"]:
        data = (root / "site" / "screenshots" / capture["file"]).read_bytes()
        assert hashlib.sha256(data).hexdigest() == capture["sha256"], f"Changed capture: {capture['file']}"
    media_hashes = {hashlib.sha256(package.read(name)).hexdigest() for name in package.namelist() if name.startswith("ppt/media/")}
    for capture in manifest["captures"]:
        if capture.get("kind") == "screenshot":
            assert capture["sha256"] in media_hashes, f"Missing actual screenshot in deck: {capture['file']}"
    animation = manifest["animation"]
    data = (root / "site" / "screenshots" / animation["file"]).read_bytes()
    assert data.startswith(b"GIF89a") and len(animation["frames"]) == 6, "Expected the recorded six-stage GIF"
    assert hashlib.sha256(data).hexdigest() == animation["sha256"], "Animation fingerprint mismatch"
    assert animation["sha256"] in media_hashes, "Recorded GIF must be embedded unchanged"
print(f"Verified {len(slides)} slides, story-first order, all notes, bounds and unchanged authentic PNG/GIF captures.")
