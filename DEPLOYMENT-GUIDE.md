# CrateJuice Deployment Guide

This guide covers deploying CrateJuice to production environments.

## Overview

CrateJuice consists of two components:
- **Backend**: Flask API (deployed on Render)
- **Frontend**: React SPA (deployed on Netlify)

## Backend Deployment (Render)

### Prerequisites
- Render account
- GitHub repository connected to Render

### Configuration

The backend is configured via `render.yaml`:

```yaml
services:
  - type: web
    name: cratejuice-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn -w 4 -b 0.0.0.0:$PORT app:app"
    envVars:
      - key: PYTHON_VERSION
        value: 3.12.0
```

### Steps

1. **Connect Repository**
   - Go to Render dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**
   - Render will automatically detect `render.yaml`
   - Review the configuration
   - Click "Apply"

3. **Environment Variables** (if needed)
   - Add any required environment variables in the Render dashboard
   - Common variables:
     - `DATABASE_URL` - if using a database
     - `SECRET_KEY` - Flask secret key
     - `CORS_ORIGINS` - allowed CORS origins

4. **Deploy**
   - Render will automatically build and deploy
   - The backend will be available at: `https://cratejuice-backend.onrender.com`

### Health Check

Verify deployment:
```bash
curl https://cratejuice-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account
- GitHub repository connected to Netlify

### Configuration

The frontend is configured via `netlify.toml`:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Steps

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Base directory: `frontend`
   - Node version: 18

3. **Environment Variables**
   - Add the backend URL:
     - Key: `REACT_APP_API_URL`
     - Value: `https://cratejuice-backend.onrender.com`

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - The frontend will be available at: `https://[your-site].netlify.app`

### Custom Domain (Optional)

1. Go to "Domain settings" in Netlify
2. Add your custom domain
3. Configure DNS settings as instructed
4. Enable HTTPS (automatic with Netlify)

## Post-Deployment

### Update Frontend to Use Production Backend

If not using environment variables, update the frontend to point to the production backend:

In `frontend/package.json`, remove the proxy line when deploying:
```json
"proxy": "http://localhost:5000"  // Remove this for production
```

Instead, use the full backend URL in API calls or set it as an environment variable.

### Enable CORS

Make sure the backend allows requests from the frontend domain. Update `backend/app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://your-frontend-domain.netlify.app"])
```

### Monitoring

- **Render**: Check logs in the Render dashboard
- **Netlify**: Check deploy logs and function logs in Netlify dashboard

### Continuous Deployment

Both Render and Netlify support automatic deployments:
- Push to the main branch to trigger a new deployment
- Render and Netlify will automatically build and deploy the changes

## Troubleshooting

### Backend Issues

1. **Check Logs**: View logs in Render dashboard
2. **Health Check**: Test the `/health` endpoint
3. **Environment Variables**: Verify all required variables are set

### Frontend Issues

1. **Build Logs**: Check Netlify deploy logs
2. **API Connection**: Verify the backend URL is correct
3. **CORS Errors**: Ensure backend allows requests from frontend domain

### Common Issues

- **CORS errors**: Update backend CORS configuration
- **API not found**: Verify backend URL in frontend configuration
- **Build failures**: Check Node/Python versions match requirements
- **Cold starts**: First request may be slow on free tiers

## Scaling

### Backend (Render)
- Upgrade to a paid plan for:
  - More CPU/RAM
  - No cold starts
  - More concurrent requests

### Frontend (Netlify)
- Netlify CDN handles scaling automatically
- Consider Netlify Pro for:
  - More build minutes
  - Better analytics
  - Faster builds

## Security

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (automatic on Render and Netlify)
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Regular dependency updates
- [ ] Monitor security advisories

## Backup

- Code is in GitHub (version controlled)
- Database: Set up regular backups if using a database
- Environment variables: Keep secure backup of configuration

## Rollback

If deployment fails:
1. **Render**: Redeploy previous version from dashboard
2. **Netlify**: Rollback to previous deploy from dashboard
3. **GitHub**: Revert commit and push to trigger new deployment