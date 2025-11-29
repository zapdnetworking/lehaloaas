# LeHalo Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Server**
   ```bash
   npm start
   ```

3. **Access Application**
   Open `http://localhost:3000` in your browser.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Platform-Specific Deployment

### Vercel

1. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Create `netlify.toml`:
```toml
[build]
  command = "npm install"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/server.js"
  status = 200
```

2. Deploy via Netlify dashboard or CLI.

### Replit

1. Import repository
2. Run: `npm install`
3. Start: `npm start`
4. Replit will automatically detect and run the server

### Railway

1. Connect GitHub repository
2. Railway will auto-detect Node.js
3. Set environment variables if needed
4. Deploy automatically

### Render

1. Create new Web Service
2. Connect repository
3. Build command: `npm install`
4. Start command: `npm start`

## Manual Deployment (VPS/Server)

1. **Install Node.js** (v18 or higher)

2. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd lehalo
   ```

3. **Install Dependencies**
   ```bash
   npm install --production
   ```

4. **Set Environment Variables**
   ```bash
   export PORT=3000
   export HOST=0.0.0.0
   ```

5. **Run with PM2** (recommended)
   ```bash
   npm install -g pm2
   pm2 start server.js --name lehalo
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy** (optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## CORS Configuration

The server includes CORS headers by default. For production, you may want to restrict origins:

```javascript
// In server.js, modify the CORS hook:
reply.header('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting for production
2. **HTTPS**: Use HTTPS in production (Let's Encrypt recommended)
3. **Environment Variables**: Never commit sensitive data
4. **Firewall**: Configure firewall rules appropriately

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process or change PORT environment variable
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied
```bash
# On Linux/Mac, you may need sudo for port 80
# Or use a reverse proxy (Nginx) on port 80
```

## Support

For deployment issues, join our Discord: https://discord.gg/DgSHpwyf

