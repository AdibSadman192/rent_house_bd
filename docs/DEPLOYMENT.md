# Deployment Guide

## Prerequisites
- Node.js v16 or higher
- MongoDB v4.4 or higher
- PM2 (for production deployment)
- Nginx (for production deployment)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rent_house_bd.git
cd rent_house_bd
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

## Development Environment

1. Start MongoDB:
```bash
mongod --dbpath /path/to/data/directory
```

2. Start backend server:
```bash
cd backend
npm run dev
```

3. Start frontend development server:
```bash
cd frontend
npm run dev
```

## Production Deployment

### Backend Deployment

1. Install PM2:
```bash
npm install -g pm2
```

2. Start the backend:
```bash
cd backend
pm2 start ecosystem.config.js
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name api.renthousebd.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Configure Nginx for frontend:
```nginx
server {
    listen 80;
    server_name renthousebd.com;
    root /path/to/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## SSL Configuration

1. Install Certbot
2. Obtain SSL certificates:
```bash
certbot --nginx -d renthousebd.com -d api.renthousebd.com
```

## Monitoring

1. Monitor backend processes:
```bash
pm2 monit
```

2. View logs:
```bash
# Backend logs
pm2 logs

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup

1. Database backup:
```bash
mongodump --db rent_house_bd --out /backup/path
```

2. Restore database:
```bash
mongorestore --db rent_house_bd /backup/path/rent_house_bd
```
