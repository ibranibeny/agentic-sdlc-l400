"""Encode actual captured browser states as a GIF, without drawing substitute content."""
import hashlib
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
directory = root / "site" / "screenshots"
manifest_path = directory / "provenance.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
records = [record for record in manifest["captures"] if record.get("kind") == "animation-frame"]
assert len(records) == 6, "Run npm run capture to obtain all six actual stage frames."
frames = []
for record in records:
    file = directory / record["file"]
    assert hashlib.sha256(file.read_bytes()).hexdigest() == record["sha256"], "Capture fingerprint mismatch."
    with Image.open(file) as frame:
        frames.append(frame.convert("RGB"))
assert len({frame.size for frame in frames}) == 1, "Captured diagram bounds must be stable across stages."
output = directory / "workshop-journey.gif"
durations = [1200, 1200, 1200, 1200, 1200, 2600]
frames[0].save(output, save_all=True, append_images=frames[1:], duration=durations, loop=0, disposal=2, optimize=False)
with Image.open(output) as gif:
    assert gif.n_frames == 6, "GIF must retain all captured stages."
manifest["animation"] = {
    "file": output.name,
    "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    "frames": [record["file"] for record in records],
    "durationsMs": durations,
    "method": "GIF encoding of six actual unedited browser captures; no generated scene content.",
}
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Encoded {len(frames)} real browser frames: {output.name} ({output.stat().st_size} bytes)")
