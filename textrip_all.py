
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip -q install --upgrade pip yt-dlp

# 3) Rip everything in vol1_urls.txt
python rip.py

# 4) Build tracks.json for your frontend (and copy MP3s to a web folder name)
mkdir -p frontend_public/vol1
cp -f output/Vol1/*.mp3 frontend_public/vol1/ 2>/dev/null || true
python build_tracks_json.py

echo
echo "✅ All done."
echo "MP3s:        $(pwd)/output/Vol1"
echo "Web assets:  $(pwd)/frontend_public/vol1"
echo "tracks.json: $(pwd)/tracks.json"
read -p "Press Return to close…"
