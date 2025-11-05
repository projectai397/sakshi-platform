# Sakshi Platform - Deployment Guide

## Platform Options

This guide covers deployment to multiple hosting platforms. Choose based on your needs:

| Platform | Best For | Difficulty | Cost | Database |
|----------|----------|------------|------|----------|
| **Vercel** | Quick deployment, serverless | Easy | Free tier available | External required |
| **Railway** | Full-stack apps, managed DB | Easy | $5/month | Included |
| **DigitalOcean** | Production apps, control | Medium | $12/month | Managed option |
| **AWS/GCP/Azure** | Enterprise, scalability | Hard | Variable | Fully managed |
| **Self-Hosted** | Complete control | Hard | VPS cost | Self-managed |

---

## Option 1: Railway (Recommended for Start)

Railway provides the easiest full-stack deployment with managed database.

### Step 1: Prepare Repository

```bash
# Initialize git if not already
cd /home/ubuntu/sakshi
git init
git add .
git commit -m "Initial Sakshi platform"

# Push to GitHub
gh repo create sakshi-platform --private
git remote add origin https://github.com/YOUR_USERNAME/sakshi-platform.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `sakshi-platform` repository
5. Railway will auto-detect the Node.js app

### Step 3: Add MySQL Database

1. In Railway project, click "New"
2. Select "Database" → "MySQL"
3. Railway creates database and provides `DATABASE_URL`
4. Copy the connection string

### Step 4: Configure Environment Variables

In Railway dashboard, add variables:

```
DATABASE_URL=[automatically set by Railway]
NODE_ENV=production
PORT=3000
SESSION_SECRET=[generate with: openssl rand -hex 32]
APP_URL=https://your-app.railway.app

# OAuth (get from Manus)
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URI=https://your-app.railway.app/auth/callback

# S3 (configure your storage)
S3_ENDPOINT=https://your-s3-endpoint
S3_BUCKET=sakshi-uploads
S3_ACCESS_KEY=your_key
S3_SECRET_KEY=your_secret
```

### Step 5: Run Migrations

In Railway dashboard:
1. Go to your service
2. Click "Settings" → "Deploy"
3. Add build command: `pnpm db:push && pnpm build`
4. Redeploy

### Step 6: Access Your App

Visit: `https://your-app-name.railway.app`

**Cost**: ~$5-10/month (includes database)

---

## Option 2: Vercel + PlanetScale

Vercel for hosting, PlanetScale for database.

### Step 1: Prepare for Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login
```

### Step 2: Configure for Serverless

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/_core/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/_core/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}
```

### Step 3: Set Up PlanetScale Database

1. Visit [planetscale.com](https://planetscale.com)
2. Create new database: `sakshi-db`
3. Get connection string
4. Format: `mysql://user:pass@aws.connect.psdb.cloud/sakshi?sslaccept=strict`

### Step 4: Deploy to Vercel

```bash
cd /home/ubuntu/sakshi
vercel --prod
```

### Step 5: Configure Environment Variables

In Vercel dashboard (vercel.com/dashboard):

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`
3. Redeploy

**Cost**: Free tier available, ~$20/month for production

---

## Option 3: DigitalOcean App Platform

Full-featured platform with managed services.

### Step 1: Create DigitalOcean Account

1. Visit [digitalocean.com](https://digitalocean.com)
2. Create account (get $200 credit with referral)

### Step 2: Create Managed MySQL Database

1. Go to Databases → Create Database
2. Choose MySQL 8
3. Select plan ($15/month minimum)
4. Note connection details

### Step 3: Deploy App

1. Go to Apps → Create App
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `pnpm install && pnpm build`
   - **Run Command**: `pnpm start`
   - **Port**: 3000

### Step 4: Add Environment Variables

In App settings, add all variables including `DATABASE_URL` from managed database.

### Step 5: Add Spaces for S3 Storage

1. Create Spaces bucket: `sakshi-uploads`
2. Get access keys
3. Add to environment variables

**Cost**: ~$12/month (app) + $15/month (database) = $27/month

---

## Option 4: AWS (Enterprise)

For scalable, enterprise-grade deployment.

### Architecture

```
┌─────────────┐
│   Route 53  │ (DNS)
└──────┬──────┘
       │
┌──────▼──────┐
│ CloudFront  │ (CDN)
└──────┬──────┘
       │
┌──────▼──────┐
│     ALB     │ (Load Balancer)
└──────┬──────┘
       │
┌──────▼──────┐
│     ECS     │ (Container Service)
└──────┬──────┘
       │
┌──────▼──────┐
│     RDS     │ (MySQL Database)
└─────────────┘
```

### Step 1: Create RDS MySQL Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier sakshi-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourPassword123 \
  --allocated-storage 20
```

### Step 2: Create ECR Repository

```bash
aws ecr create-repository --repository-name sakshi-platform
```

### Step 3: Build and Push Docker Image

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
EOF

# Build and push
docker build -t sakshi-platform .
aws ecr get-login-password | docker login --username AWS --password-stdin [ECR_URI]
docker tag sakshi-platform:latest [ECR_URI]/sakshi-platform:latest
docker push [ECR_URI]/sakshi-platform:latest
```

### Step 4: Create ECS Service

```bash
aws ecs create-cluster --cluster-name sakshi-cluster
aws ecs create-service \
  --cluster sakshi-cluster \
  --service-name sakshi-service \
  --task-definition sakshi-task \
  --desired-count 2 \
  --launch-type FARGATE
```

### Step 5: Configure Load Balancer

Create ALB and target group, configure health checks.

**Cost**: ~$50-100/month minimum

---

## Option 5: Self-Hosted VPS

For complete control.

### Step 1: Provision Server

- Ubuntu 22.04 LTS
- Minimum: 2GB RAM, 2 vCPU, 50GB storage
- Providers: Hetzner, Linode, Vultr

### Step 2: Install Dependencies

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MySQL
apt install -y mysql-server
mysql_secure_installation

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### Step 3: Set Up Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE sakshi_db;
CREATE USER 'sakshi'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON sakshi_db.* TO 'sakshi'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Deploy Application

```bash
# Create app directory
mkdir -p /var/www/sakshi
cd /var/www/sakshi

# Clone repository
git clone https://github.com/YOUR_USERNAME/sakshi-platform.git .

# Install dependencies
pnpm install

# Create .env file
nano .env
# Add all environment variables

# Build
pnpm build

# Run migrations
pnpm db:push
```

### Step 5: Set Up PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/index.js --name sakshi

# Set up auto-start
pm2 startup
pm2 save
```

### Step 6: Configure Nginx

```bash
nano /etc/nginx/sites-available/sakshi
```

```nginx
server {
    listen 80;
    server_name sakshi.org www.sakshi.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /images/ {
        alias /var/www/sakshi/dist/public/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/sakshi /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 7: Set Up SSL

```bash
certbot --nginx -d sakshi.org -d www.sakshi.org
```

### Step 8: Set Up Backups

```bash
# Create backup script
cat > /root/backup-sakshi.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u sakshi -p sakshi_db > /backups/sakshi_db_$DATE.sql
tar -czf /backups/sakshi_files_$DATE.tar.gz /var/www/sakshi
# Upload to S3 or backup service
EOF

chmod +x /root/backup-sakshi.sh

# Add to cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup-sakshi.sh
```

**Cost**: ~$5-20/month (VPS only)

---

## Post-Deployment Checklist

### Security

- [ ] SSL certificate installed
- [ ] Firewall configured (UFW/Security Groups)
- [ ] Database not publicly accessible
- [ ] Strong passwords used
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Performance

- [ ] CDN configured for static assets
- [ ] Database indexes created
- [ ] Caching headers set
- [ ] Gzip compression enabled
- [ ] Images optimized

### Monitoring

- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (New Relic)
- [ ] Log aggregation (Papertrail)

### Backup

- [ ] Database backups automated
- [ ] File backups configured
- [ ] Backup restoration tested
- [ ] Off-site backup storage

---

## Deployment Commands Reference

```bash
# Build for production
pnpm build

# Run database migrations
pnpm db:push

# Start production server
pnpm start

# Check TypeScript errors
pnpm check

# Run tests
pnpm test

# Format code
pnpm format
```

---

## Troubleshooting

### Build Fails

**Error**: Module not found

**Solution**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Database Connection Fails

**Error**: ECONNREFUSED

**Solution**:
1. Check DATABASE_URL format
2. Verify database is running
3. Check firewall rules
4. Test connection manually

### OAuth Redirect Error

**Error**: redirect_uri_mismatch

**Solution**:
1. Update OAuth app settings with production URL
2. Ensure OAUTH_REDIRECT_URI matches exactly
3. Include https:// protocol

### 502 Bad Gateway

**Error**: Nginx can't reach app

**Solution**:
```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs sakshi

# Restart app
pm2 restart sakshi
```

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (ALB, Nginx)
- Deploy multiple app instances
- Use session store (Redis)
- Implement database read replicas

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add database indexes
- Implement caching (Redis)

### CDN Integration

- CloudFlare for global CDN
- AWS CloudFront
- Fastly

---

## Cost Comparison

| Platform | Monthly Cost | Includes | Best For |
|----------|--------------|----------|----------|
| Railway | $5-10 | App + DB | Getting started |
| Vercel + PlanetScale | $0-20 | Serverless | Side projects |
| DigitalOcean | $27 | App + DB + Storage | Small business |
| AWS | $50-100+ | Full infrastructure | Enterprise |
| Self-Hosted | $5-20 | VPS only | Technical users |

---

## Next Steps

After deployment:

1. **Test all features** on production
2. **Set up monitoring** and alerts
3. **Configure backups** and test restoration
4. **Add custom domain** and SSL
5. **Optimize performance** based on metrics
6. **Set up CI/CD** for automated deployments

---

*For environment configuration, see `ENVIRONMENT_SETUP.md`*  
*For local development, see `QUICK_START.md`*  
*For database setup, see next phase documentation*
