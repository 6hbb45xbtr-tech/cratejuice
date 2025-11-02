# CrateJuice - Quick Start Guide

Get CrateJuice running in 5 minutes!

## Prerequisites

Make sure you have installed:
- **Python 3.8+** (`python3 --version`)
- **Node.js 14+** (`node --version`)
- **npm** (`npm --version`)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/6hbb45xbtr-tech/cratejuice.git
cd cratejuice
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Option 1: Run Everything Together (Recommended)

```bash
./run-dev.sh
```

This starts both backend (port 5000) and frontend (port 3000).

### Option 2: Run Backend Only

```bash
./run-backend.sh
```

Backend will be available at: http://localhost:5000

### Option 3: Run Frontend Only

```bash
./run-frontend.sh
```

Frontend will be available at: http://localhost:3000

## Testing the Application

### Backend Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "healthy"}
```

### Backend API Endpoints

```bash
# Get API info
curl http://localhost:5000/

# Get tracks
curl http://localhost:5000/api/tracks
```

### Frontend

Open your browser and navigate to:
- http://localhost:3000

You should see the CrateJuice interface with API status and track information.

## Building for Production

### Backend

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend

```bash
cd frontend
npm run build
```

Build output will be in `frontend/build/`

## Deployment

See the following guides:
- **DEPLOYMENT-GUIDE.md** - Step-by-step deployment instructions
- **PRODUCTION.md** - Production configuration and best practices

## Troubleshooting

### Backend won't start
- Check Python version: `python3 --version`
- Reinstall dependencies: `cd backend && pip install -r requirements.txt`
- Check for port conflicts: `lsof -i :5000`

### Frontend won't start
- Check Node version: `node --version`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `cd frontend && rm -rf node_modules package-lock.json && npm install`
- Check for port conflicts: `lsof -i :3000`

### CORS errors
- Make sure backend is running on port 5000
- Check frontend `package.json` has proxy configured: `"proxy": "http://localhost:5000"`

## Next Steps

1. ✅ Get the app running locally
2. 📖 Read the full README.md
3. 🚀 Deploy to production (see DEPLOYMENT-GUIDE.md)
4. 🎵 Start adding music tracks!

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for deployment help
- See [PRODUCTION.md](PRODUCTION.md) for production best practices

---

Happy streaming! 🎵
