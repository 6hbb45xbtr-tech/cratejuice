# Production Deployment

This document contains production-specific configurations and best practices for CrateJuice.

## Production Checklist

Before deploying to production, ensure:

### Security
- [ ] All secrets are stored in environment variables (not in code)
- [ ] CORS is configured with specific origins (not `*`)
- [ ] HTTPS is enabled on all endpoints
- [ ] Security headers are configured
- [ ] Rate limiting is implemented (if needed)
- [ ] Input validation is in place
- [ ] SQL injection prevention (if using database)

### Performance
- [ ] Frontend is built with production optimizations
- [ ] Backend uses Gunicorn or similar WSGI server
- [ ] Appropriate number of workers configured
- [ ] Static assets are cached properly
- [ ] Database connection pooling (if applicable)
- [ ] CDN configured for static assets

### Monitoring
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Application logs are collected
- [ ] Health check endpoints are working
- [ ] Uptime monitoring is set up
- [ ] Performance monitoring is in place

### Backups
- [ ] Database backups scheduled (if applicable)
- [ ] Code is version controlled
- [ ] Environment variables are documented securely
- [ ] Deployment rollback plan is documented

## Environment Variables

### Backend (Render)

Required variables:
```
PORT=5000                    # Port to run the server on (set by Render)
```

Optional variables:
```
DATABASE_URL=                # Database connection string
SECRET_KEY=                  # Flask secret key for sessions
CORS_ORIGINS=               # Comma-separated list of allowed origins
LOG_LEVEL=INFO              # Logging level
MAX_WORKERS=4               # Number of Gunicorn workers
```

### Frontend (Netlify)

Optional variables:
```
REACT_APP_API_URL=          # Backend API URL (e.g., https://api.cratejuice.com)
REACT_APP_ENV=production    # Environment identifier
```

## Production Configuration

### Backend (app.py)

For production, ensure debug mode is disabled and CORS is properly configured:

```python
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Production CORS configuration
allowed_origins = os.environ.get('CORS_ORIGINS', '').split(',')
CORS(app, origins=allowed_origins)

# Disable debug in production
if __name__ == '__main__':
    app.run(debug=False)
```

### Frontend Build

Production build is optimized automatically:
```bash
cd frontend
npm run build
```

This creates an optimized build in `frontend/build/` with:
- Minified JavaScript and CSS
- Optimized images
- Code splitting
- Tree shaking

## Scaling Considerations

### Backend Scaling

**Vertical Scaling (Render)**
- Increase instance size for more CPU/RAM
- Recommended: Start with 1 GB RAM, 0.5 CPU

**Horizontal Scaling**
- Add more instances
- Use load balancer
- Ensure stateless application design

**Worker Configuration (Gunicorn)**
```bash
# Formula: (2 x $num_cores) + 1
# For 1 core: 3 workers
# For 2 cores: 5 workers
gunicorn -w 3 --threads 2 -b 0.0.0.0:$PORT app:app
```

### Frontend Scaling

- Netlify CDN handles this automatically
- Static files are distributed globally
- No additional configuration needed

## Database (Future)

When adding a database:

1. **Choose a service**: Render PostgreSQL, MongoDB Atlas, etc.
2. **Connection pooling**: Use SQLAlchemy with pooling
3. **Migrations**: Use Alembic for schema changes
4. **Backups**: Set up automated backups
5. **Read replicas**: For read-heavy workloads

## SSL/TLS

Both Render and Netlify provide automatic HTTPS:
- Certificates are auto-generated and renewed
- HTTPS is enforced by default
- No additional configuration needed

## Performance Optimization

### Backend
- Use caching (Redis, Memcached)
- Optimize database queries
- Use async endpoints for long operations
- Implement pagination for large datasets

### Frontend
- Code splitting with React lazy loading
- Image optimization
- Service workers for offline support
- Minimize bundle size

## Monitoring and Logging

### Recommended Tools

**Application Monitoring**
- New Relic
- Datadog
- AppDynamics

**Error Tracking**
- Sentry
- Rollbar
- Bugsnag

**Log Management**
- Papertrail (included with Render)
- Loggly
- ELK Stack

### Health Check Endpoint

Already implemented at `/health`:
```bash
curl https://your-backend.onrender.com/health
```

## Disaster Recovery

### Backup Strategy

1. **Code**: Version controlled in GitHub
2. **Database**: Daily automated backups
3. **Configuration**: Document all environment variables
4. **Deployment config**: render.yaml and netlify.toml in repo

### Rollback Procedure

**Render**
1. Go to deployment history
2. Select previous successful deployment
3. Click "Rollback"

**Netlify**
1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

**GitHub**
```bash
git revert HEAD
git push origin main
# Automatic deployment will trigger
```

## Cost Optimization

### Free Tier Limits

**Render**
- 750 hours/month free
- Spins down after 15 minutes of inactivity
- Cold start delay on first request

**Netlify**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

### Upgrading

Consider upgrading when:
- Need to avoid cold starts (Render: $7/month)
- Exceed free tier bandwidth (Netlify: $19/month)
- Need more build minutes
- Require better performance

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Keep dependencies updated**: Run `npm audit` and `pip-audit`
3. **Use HTTPS everywhere**: Enforced by default
4. **Implement rate limiting**: Prevent abuse
5. **Validate input**: Sanitize all user input
6. **Set security headers**: Already configured in netlify.toml
7. **Regular security audits**: Review code and dependencies

## Maintenance

### Regular Tasks

**Weekly**
- Review error logs
- Check performance metrics
- Monitor uptime

**Monthly**
- Update dependencies
- Review security advisories
- Check resource usage

**Quarterly**
- Performance audit
- Security review
- Capacity planning

## Support and Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Flask Production Best Practices](https://flask.palletsprojects.com/en/latest/deploying/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)