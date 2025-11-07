# DigitalOcean Deployment Guide for Sakshi AI Platform

**Author:** Manus AI  
**Last Updated:** November 2025  
**Platform Version:** 1.0.0

This comprehensive guide provides step-by-step instructions for deploying the Sakshi AI Platform to DigitalOcean servers.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Selection & Setup](#server-selection--setup)
3. [Initial Server Configuration](#initial-server-configuration)
4. [Database Setup (MySQL)](#database-setup-mysql)
5. [Redis Cache Setup](#redis-cache-setup)
6. [Application Deployment](#application-deployment)
7. [Environment Configuration](#environment-configuration)
8. [SSL Certificate Setup](#ssl-certificate-setup)
9. [Post-Deployment Configuration](#post-deployment-configuration)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

**Required Accounts:**
- DigitalOcean account with billing enabled
- GitHub access to sakshi-platform repository
- Domain name (recommended)
- AWS account for S3 storage
- OpenAI API key

**Estimated Monthly Costs:**

| Resource | Specification | Cost |
|:---------|:-------------|-----:|
| Droplet | 4 GB RAM, 2 vCPUs | $24 |
| MySQL Database | 1 GB RAM | $15 |
| Redis | 1 GB RAM | $15 |
| **Total** | | **$54** |

---

## Server Selection & Setup

### Step 1: Create a Droplet

1. Log in to DigitalOcean
2. Click "Create Droplet"
3. Configure:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic, 4 GB RAM / 2 vCPUs ($24/month)
   - **Region:** Choose closest to users
   - **Authentication:** SSH keys (recommended)
   - **Hostname:** sakshi-production

4. Note the IP address after creation

---

## Initial Server Configuration

### Step 2: Connect and Update

```bash
# Connect via SSH
ssh root@YOUR_DROPLET_IP

# Update system
apt update && apt upgrade -y
```

### Step 3: Create Application User

```bash
# Create user
adduser sakshi
usermod -aG sudo sakshi

# Copy SSH keys
rsync --archive --chown=sakshi:sakshi ~/.ssh /home/sakshi
```

### Step 4: Configure Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Step 5: Install Software

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt install -y nodejs

# pnpm
npm install -g pnpm

# Other tools
apt install -y git build-essential python3 python3-pip nginx
```

---

## Database Setup (MySQL)

### Step 6: Create Managed MySQL

1. Navigate to Databases in DigitalOcean
2. Create MySQL 8 database
3. Size: 1 GB RAM ($15/month)
4. Add Droplet IP to trusted sources
5. Note connection details

### Step 7: Create Sakshi Database

```bash
mysql -h YOUR_DB_HOST -P 25060 -u doadmin -p

CREATE DATABASE sakshi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## Redis Cache Setup

### Step 8: Create Managed Redis

1. Create Redis 7 database
2. Size: 1 GB RAM ($15/month)
3. Add Droplet IP to trusted sources
4. Note connection details

---

## Application Deployment

### Step 9: Clone Repository

```bash
su - sakshi
mkdir -p /home/sakshi/apps
cd /home/sakshi/apps

git clone https://github.com/projectai397/sakshi-platform.git
cd sakshi-platform
```

### Step 10: Install Dependencies

```bash
pnpm install
pip3 install -r requirements.txt
```

### Step 11: Build Application

```bash
pnpm run build
```

---

## Environment Configuration

### Step 12: Create .env File

```bash
nano .env
```

Add configuration:

```env
DATABASE_URL="mysql://doadmin:PASSWORD@HOST:25060/sakshi?ssl-mode=REQUIRED"
REDIS_URL="redis://:PASSWORD@HOST:25061"
NODE_ENV=production
PORT=3000
SESSION_SECRET="GENERATE_WITH_CRYPTO"
DOMAIN=yourdomain.com
APP_URL=https://yourdomain.com
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=sakshi-uploads
OPENAI_API_KEY=your_key
```

Generate SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 13: Initialize Database

```bash
pnpm run db:push
```

---

## SSL Certificate Setup

### Step 14: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/sakshi
```

Add:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/sakshi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 15: Install SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Post-Deployment Configuration

### Step 16: Set Up PM2

```bash
sudo npm install -g pm2
pm2 start npm --name "sakshi" -- start
pm2 save
pm2 startup systemd
```

### Step 17: Run Setup Script

```bash
chmod +x scripts/post-deploy-setup.sh
./scripts/post-deploy-setup.sh
```

### Step 18: Train AI Models

```bash
chmod +x scripts/train-ai-models.sh
./scripts/train-ai-models.sh
```

---

## Monitoring & Maintenance

### View Logs

```bash
pm2 logs sakshi
sudo tail -f /var/log/nginx/access.log
```

### Update Application

```bash
cd /home/sakshi/apps/sakshi-platform
git pull origin master
pnpm install
pnpm run db:push
pnpm run build
pm2 restart sakshi
```

---

## Troubleshooting

### Check PM2 Status

```bash
pm2 status
pm2 logs sakshi --lines 100
```

### Test Database Connection

```bash
mysql -h YOUR_DB_HOST -P 25060 -u doadmin -p
```

### Restart Services

```bash
pm2 restart sakshi
sudo systemctl restart nginx
```

---

## Conclusion

✅ Platform deployed successfully!
✅ HTTPS enabled
✅ Database and Redis configured
✅ All 62 features operational

**Next Steps:**
1. Point domain DNS to Droplet IP
2. Test all features
3. Launch to users!

---

**Contact:** foundation@sakshicenter.org  
**Repository:** https://github.com/projectai397/sakshi-platform

