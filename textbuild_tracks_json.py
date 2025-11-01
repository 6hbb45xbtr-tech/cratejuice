#!/usr/bin/env python3 ""
import os, sys, subprocess, shlex, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "output" / "Vol1"
URLS = ROOT / "vol1_urls.txt"

def ensure_ffmpeg():
    # try system ffmpeg first
    try:
        subprocess.run(["ffmpeg", "-version"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return "ffmpeg"
    except Exception:
        # fallback: yt-dlp can use bundled ffmpeg if present, but easiest is to continue;
        # on mac you can: brew install ffmpeg  (shown in the .command script)
        return "ffmpeg"

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    if not URLS.exists():
        print("No vol1_urls.txt found.")
        sys.exit(1)

    ff = ensure_ffmpeg()

    ytdlp = [
        sys.executable, "-m", "yt_dlp",
        "--no-color",
        "-o", str(OUT / "%(title).200B [%(id)s].%(ext)s"),
        "-x", "--audio-format", "mp3", "--audio-quality", "192K",
        "--embed-metadata", "--embed-thumbnail",
        "--add-metadata",
        "--no-playlist",
        "--restrict-filenames",
    ]
    # rip each line
    with URLS.open() as f:
        for line in f:
            u = line.strip()
            if not u or u.startswith("#"):
                continue
            print(f"\n=== RIPPING: {u} ===")
            cmd = ytdlp + [u]
            try:
                subprocess.run(cmd, check=True)
            except subprocess.CalledProcessError as e:
                print(f"Failed: {u} ({e})")

    print("\nDone. Files in:", OUT)

if __name__ == "__main__":
    main()
