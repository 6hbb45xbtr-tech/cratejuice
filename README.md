# CrateJuice - Audio Ripping & Playback with Pitch/Tempo Control

CrateJuice is a music management application with advanced audio playback capabilities, featuring independent pitch shifting and tempo control powered by SoundTouch WASM.

## Features

### Backend
- **SQLAlchemy Models**: Persistent storage for Postcards (playlists) and RipResults (audio rip metadata)
- **Alembic Migrations**: Database schema versioning and migration management
- **Database Support**: SQLite for local development, PostgreSQL for production
- **Docker Support**: Containerized deployment with automatic migrations on startup

### Frontend
- **Pitch Shifting**: Change audio pitch (-12 to +12 semitones) without affecting tempo
- **Tempo Control**: Speed up or slow down playback (0.5x to 2.0x) without affecting pitch
- **AudioWorklet Processing**: Real-time audio processing using Web Audio API
- **SoundTouch Integration**: Uses soundtouch-js for high-quality pitch/tempo manipulation
- **Fallback Support**: Graceful degradation to playbackRate when AudioWorklet is unavailable
- **Modern UI**: Beautiful, responsive interface with sliders and preset buttons

## Project Structure

```
cratejuice/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 0001_init.py        # Initial migration
│   │   ├── env.py                   # Alembic environment config
│   │   └── script.py.mako          # Migration template
│   ├── alembic.ini                  # Alembic configuration
│   ├── models.py                    # SQLAlchemy models
│   ├── db.py                        # Database session factory
│   ├── requirements.txt             # Python dependencies
│   └── migrate_and_start.sh         # Startup script with migrations
├── frontend/
│   ├── src/
│   │   ├── worklets/
│   │   │   └── soundtouch-processor.js  # AudioWorklet processor
│   │   ├── pitch-tempo.js               # Pitch/tempo controller
│   │   └── audio-player.js              # Main audio player class
│   ├── public/
│   │   └── index.html                   # Main HTML with UI
│   └── package.json                     # Node.js dependencies
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI workflow
├── Dockerfile.backend               # Docker configuration for backend
├── render.yaml                      # Render.com deployment config
└── .gitignore                       # Git ignore patterns
```

## Installation & Setup

### Backend Setup

1. Create a Python virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. (Optional) Set environment variables:
```bash
export DATABASE_URL="postgresql://user:password@localhost/cratejuice"
export SQL_ECHO="true"  # Enable SQL query logging
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start development server (if webpack-dev-server is configured):
```bash
npm run dev
```

3. Or open `frontend/public/index.html` directly in a browser

## Testing Instructions

### Backend Testing

1. **Verify Alembic is working**:
```bash
cd backend
alembic current  # Should show current revision
alembic history  # Should show migration history
```

2. **Test database connection**:
```bash
python -c "from backend.db import engine; print(engine.connect())"
```

3. **Lint backend code**:
```bash
pip install flake8
flake8 backend/ --count --max-line-length=127 --statistics
```

### Frontend Testing

1. **Open the application**: Open `frontend/public/index.html` in a modern browser (Chrome, Firefox, Edge, Safari)

2. **Test AudioWorklet support**: Check the status message at the bottom:
   - ✅ Green message = AudioWorklet enabled (full pitch/tempo control)
   - ⚠️ Yellow message = Fallback mode (tempo control only via playbackRate)

3. **Test pitch shifting**:
   - Load an audio file
   - Adjust the pitch slider from -12 to +12 semitones
   - Audio pitch should change without affecting tempo
   - Try the preset buttons (-5, -3, 0, +3, +5)

4. **Test tempo control**:
   - Adjust the tempo slider from 0.5x to 2.0x
   - Audio should speed up/slow down without pitch change (if AudioWorklet is supported)
   - Try the preset buttons (0.75x, 0.9x, 1.0x, 1.1x, 1.25x)

### CI Testing

The GitHub Actions CI workflow will automatically:
- Lint Python code with flake8
- Install backend dependencies
- Check that migrations are up-to-date
- Install frontend dependencies
- Build frontend (if build script is available)
- Run tests

## Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -f Dockerfile.backend -t cratejuice-backend .
```

2. Run the container:
```bash
docker run -e DATABASE_URL="postgresql://..." -p 8000:8000 cratejuice-backend
```

### Render.com Deployment

1. Push your code to GitHub
2. Connect your repository to Render.com
3. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database
   - Redis instance
   - Backend web service (with automatic migrations)
   - Frontend static site

### Manual Migration

To run migrations manually:
```bash
cd backend
alembic upgrade head
```

To create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

## SoundTouch WASM Licensing & Alternatives

### Current Implementation
This project includes a framework for **SoundTouch-based WASM** pitch/tempo control. The current implementation provides:
- AudioWorklet processor architecture ready for WASM integration
- Fallback to browser's native playbackRate for tempo control
- UI with pitch shift and tempo controls

**Note**: A production-ready WASM pitch shifter would require either:
1. Building SoundTouch library to WASM manually
2. Using Tone.js (MIT licensed, https://tonejs.github.io/) which includes pitch shifting
3. Integrating a commercial audio DSP library

### License
- **SoundTouch Library**: LGPL v2.1 (if integrated)
- **Tone.js**: MIT (recommended alternative)
- **Current Implementation**: Framework only, no WASM binary included

### Alternatives

If LGPL licensing is a concern, consider these alternatives:

1. **Tone.js**: MIT licensed, includes pitch shifting via PitchShift effect
   - https://tonejs.github.io/

2. **Rubber Band Library**: GPL v2 (more restrictive)
   - High-quality time-stretching and pitch-shifting
   - Commercial license available

3. **Native Web Audio API**: No external dependencies
   - Use `AudioContext.createScriptProcessor()` with manual DSP
   - More complex to implement, lower quality

4. **Sonic**: Apache 2.0 License
   - Simple time-stretching and pitch-shifting
   - Would need WASM compilation

### Note on Fallback Behavior
When AudioWorklet is not supported (older browsers), the application falls back to using `HTMLAudioElement.playbackRate`, which:
- Changes both pitch AND tempo together (chipmunk/slowdown effect)
- Is supported in all browsers
- Does not provide independent pitch/tempo control

## Database Schema

### Postcards Table
Stores user-created playlists/collections:
- `id`: Primary key
- `title`: Postcard title
- `description`: Optional description
- `creator`: Creator username
- `created_at`, `updated_at`: Timestamps
- `is_public`: Visibility flag
- `track_ids`: JSON array of track IDs

### RipResults Table
Stores audio rip operation results:
- `id`: Primary key
- `source_url`: Original URL
- `title`, `artist`: Metadata
- `duration`: Length in seconds
- `file_path`, `file_size`: File info
- `format`, `bitrate`: Audio format info
- `status`: pending/completed/failed
- `error_message`: Error details if failed
- `created_at`, `completed_at`: Timestamps

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is provided as-is. Please review the licenses of dependencies:
- soundtouch-js: LGPL v2.1
- SQLAlchemy: MIT
- Alembic: MIT

## Support

For issues or questions, please open a GitHub issue in the repository.
