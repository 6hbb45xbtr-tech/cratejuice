# CrateJuice 🎵

CrateJuice is a music streaming platform with a React frontend and Flask backend.

## Features

- Modern React-based frontend
- Flask REST API backend
- Health check endpoints
- Track management (coming soon)

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Local Development

### Quick Start (Run Both Frontend and Backend)

```bash
./run-dev.sh
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

### Run Backend Only

```bash
./run-backend.sh
```

Or manually:

```bash
cd backend
pip install -r requirements.txt
python3 app.py
```

The backend will be available at http://localhost:5000

### Run Frontend Only

```bash
./run-frontend.sh
```

Or manually:

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/tracks` - List tracks

## Building for Production

### Backend

The backend uses Gunicorn in production:

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend

Build the frontend for production:

```bash
cd frontend
npm run build
```

The build artifacts will be in the `frontend/build` directory.

## Configuration

### Frontend Environment Variables

For production deployment, set the backend API URL:

```bash
# .env file in frontend directory (for local development)
REACT_APP_API_URL=http://localhost:5000
```

For production (Netlify):
```bash
REACT_APP_API_URL=https://your-backend.onrender.com
```

The frontend will automatically use the proxy in development mode (via `package.json`) and the environment variable in production.

## Deployment

This application is configured for deployment on:

- **Backend**: Render (see `render.yaml`)
- **Frontend**: Netlify (see `netlify.toml`)

See `DEPLOYMENT-GUIDE.md` for detailed deployment instructions.

## Project Structure

```
cratejuice/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── ripper.py          # Music extraction utilities
│   └── worker.py          # Background job processor
├── frontend/
│   ├── public/            # Static files
│   ├── src/               # React source code
│   └── package.json       # Node dependencies
├── run-backend.sh         # Backend runner script
├── run-frontend.sh        # Frontend runner script
├── run-dev.sh            # Full stack runner script
├── render.yaml           # Render deployment config
└── netlify.toml          # Netlify deployment config
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT