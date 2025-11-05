# Sakshi Platform - Railway Deployment Guide

## Overview

This guide walks you through deploying the Sakshi platform to Railway, including database setup and configuration.

**Why Railway?**
- ✅ Easiest deployment option
- ✅ Managed MySQL database included
- ✅ Automatic HTTPS
- ✅ Environment variables management
- ✅ Affordable (~$5-10/month)
- ✅ Great for MVPs and small-to-medium projects

**Estimated Time**: 15-20 minutes

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Railway account (sign up at [railway.app](https://railway.app))
- [ ] GitHub CLI installed (optional but recommended)
- [ ] Git repository for Sakshi project

---

## Step 1: Prepare Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Navigate to project
cd /home/ubuntu/sakshi

# Initialize git (if not already)
git init

# Create .gitignore if not exists
cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
*.log
dev.db
*.sqlite
.DS_Store
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit: Sakshi platform with Adiyogi backgrounds"

# Create GitHub repository
gh repo create sakshi-platform --private --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

### Option B: Manual GitHub Setup

1. Go to [github.com/new](https://github.com/new)
2. Create new repository: `sakshi-platform`
3. Set to **Private**
4. Don't initialize with README (we have one)
5. Copy the repository URL

```bash
cd /home/ubuntu/sakshi
git init
git add .
git commit -m "Initial commit: Sakshi platform"
git remote add origin https://github.com/YOUR_USERNAME/sakshi-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Sign Up for Railway

1. Visit [railway.app](https://railway.app)
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with GitHub (recommended for easy repo access)
4. Authorize Railway to access your GitHub account

---

## Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `sakshi-platform`
4. Railway will detect it's a Node.js project

### Configure Build Settings

Railway should auto-detect, but verify:

- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Root Directory**: `/` (leave empty)

---

## Step 4: Add MySQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Railway will provision a MySQL 8 database
5. Wait for database to be ready (usually 1-2 minutes)

### Get Database Connection String

1. Click on the MySQL service
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` value
4. It should look like:
   ```
   mysql://root:password@mysql.railway.internal:3306/railway
   ```

---

## Step 5: Configure Environment Variables

1. Click on your **app service** (not the database)
2. Go to **"Variables"** tab
3. Click **"Raw Editor"**
4. Add the following variables:

```bash
# Database (automatically set by Railway, but verify)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# Application
NODE_ENV=production
PORT=3000
APP_URL=https://your-app-name.up.railway.app

# Session Secret (generate a secure random string)
SESSION_SECRET=your_secure_random_string_here_min_32_characters

# OAuth (Manus) - Get from https://auth.manus.im/console
OAUTH_CLIENT_ID=your_manus_oauth_client_id
OAUTH_CLIENT_SECRET=your_manus_oauth_client_secret
OAUTH_REDIRECT_URI=https://your-app-name.up.railway.app/auth/callback
OAUTH_ISSUER=https://auth.manus.im

# S3 Storage (Optional - configure later)
# S3_ENDPOINT=https://your-s3-endpoint
# S3_REGION=us-east-1
# S3_BUCKET=sakshi-uploads
# S3_ACCESS_KEY=your_access_key
# S3_SECRET_KEY=your_secret_key

# Email (Optional - configure later)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=Sakshi Platform <noreply@sakshi.org>

# Analytics (Optional)
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# POSTHOG_API_KEY=phc_xxxxx

# Payment (Optional - configure later)
# RAZORPAY_KEY_ID=rzp_test_xxxxx
# RAZORPAY_KEY_SECRET=your_secret
```

### Generate Session Secret

```bash
# On your local machine
openssl rand -hex 32
# Copy the output and use it as SESSION_SECRET
```

---

## Step 6: Deploy Application

1. Railway will automatically deploy after you add variables
2. If not, click **"Deploy"** button
3. Watch the deployment logs in real-time
4. Deployment takes 2-5 minutes

### Deployment Process

Railway will:
1. Clone your repository
2. Install dependencies (`pnpm install`)
3. Build the project (`pnpm build`)
4. Start the server (`pnpm start`)

---

## Step 7: Run Database Migrations

After first deployment, you need to set up the database schema.

### Option A: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run pnpm db:push
```

### Option B: Using Railway Dashboard

1. Go to your app service
2. Click **"Settings"** tab
3. Scroll to **"Deploy Triggers"**
4. Add a **"Custom Start Command"** temporarily:
   ```bash
   pnpm db:push && pnpm start
   ```
5. Redeploy
6. After successful deployment, change back to `pnpm start`

---

## Step 8: Seed Database (Optional)

To add sample data:

```bash
# Using Railway CLI
railway run pnpm tsx scripts/seed-database.ts

# Or connect to the database directly
railway connect MySQL
# Then run SQL commands
```

---

## Step 9: Get Your App URL

1. Go to your app service in Railway
2. Click **"Settings"** tab
3. Scroll to **"Domains"**
4. Railway provides a default domain: `your-app-name.up.railway.app`
5. Click **"Generate Domain"** if not already generated

### Add Custom Domain (Optional)

1. In the same **"Domains"** section
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `sakshi.org`)
4. Add the CNAME record to your DNS:
   ```
   CNAME @ your-app-name.up.railway.app
   ```
5. Wait for DNS propagation (5-30 minutes)

---

## Step 10: Configure OAuth Redirect

Now that you have your Railway URL, update OAuth settings:

1. Go to [Manus OAuth Console](https://auth.manus.im/console)
2. Update your OAuth app's redirect URI:
   ```
   https://your-app-name.up.railway.app/auth/callback
   ```
3. Update the `OAUTH_REDIRECT_URI` variable in Railway to match

---

## Step 11: Test Deployment

1. Visit your Railway URL: `https://your-app-name.up.railway.app`
2. You should see the Sakshi homepage with Adiyogi background
3. Test navigation between pages
4. Try logging in (OAuth should work)
5. Check that animations and dark mode work

### Troubleshooting

If you see errors:

**"Application Error"**
- Check deployment logs in Railway dashboard
- Verify all environment variables are set
- Ensure database migrations ran successfully

**"Cannot connect to database"**
- Verify `DATABASE_URL` is set correctly
- Check that MySQL service is running
- Try redeploying

**"OAuth redirect mismatch"**
- Ensure `OAUTH_REDIRECT_URI` matches exactly in both Railway and Manus OAuth console
- Include `https://` protocol
- No trailing slash

---

## Step 12: Monitor Your Deployment

### View Logs

1. Click on your app service
2. Go to **"Deployments"** tab
3. Click on latest deployment
4. View real-time logs

### Resource Usage

1. Go to **"Metrics"** tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

### Set Up Alerts (Optional)

1. Go to **"Settings"**
2. Scroll to **"Notifications"**
3. Add webhook or email for deployment failures

---

## Cost Estimation

### Railway Pricing

**Hobby Plan** (Free trial with $5 credit):
- App service: ~$5/month
- MySQL database: ~$5/month
- **Total**: ~$10/month

**Pro Plan** ($20/month):
- Includes $20 credit
- App + database covered
- Additional resources billed separately

### Optimization Tips

1. **Use sleep mode**: Railway can pause services when inactive
2. **Optimize bundle size**: Smaller builds = faster deployments
3. **Use CDN**: Serve static assets from CDN to reduce bandwidth

---

## Updating Your Deployment

### Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Railway will automatically deploy
```

### Manual Deployments

1. Go to Railway dashboard
2. Click **"Deployments"**
3. Click **"Deploy"** button

### Rollback

1. Go to **"Deployments"** tab
2. Find previous successful deployment
3. Click **"Redeploy"**

---

## Environment-Specific Configuration

### Staging Environment

Create a separate Railway project for staging:

1. Create new project: `sakshi-staging`
2. Deploy from `staging` branch
3. Use separate database
4. Different environment variables

### Production Environment

Keep production separate:

1. Use `main` branch for production
2. Protected branch (require PR reviews)
3. Separate OAuth credentials
4. Production database backups

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` to git
- ✅ Use Railway's variable management
- ✅ Rotate secrets regularly
- ✅ Use different credentials for staging/production

### Database Security

- ✅ Railway MySQL is private by default
- ✅ Only accessible from Railway services
- ✅ Use strong passwords
- ✅ Regular backups (Railway auto-backups)

### HTTPS

- ✅ Railway provides automatic HTTPS
- ✅ Free SSL certificates
- ✅ Auto-renewal

---

## Backup Strategy

### Database Backups

Railway provides automatic daily backups:

1. Go to MySQL service
2. Click **"Backups"** tab
3. View available backups
4. Restore if needed

### Manual Backup

```bash
# Using Railway CLI
railway run mysqldump -u root -p railway > backup.sql

# Download backup
railway run cat backup.sql > local-backup.sql
```

---

## Troubleshooting Common Issues

### Build Fails

**Error**: `pnpm: command not found`

**Solution**: Add to `package.json`:
```json
{
  "packageManager": "pnpm@10.4.1"
}
```

### Database Connection Fails

**Error**: `ECONNREFUSED`

**Solution**:
1. Verify MySQL service is running
2. Check `DATABASE_URL` format
3. Ensure app and database are in same project

### Out of Memory

**Error**: `JavaScript heap out of memory`

**Solution**:
1. Increase memory in Railway settings
2. Optimize build process
3. Use production build

---

## Next Steps After Deployment

1. ✅ **Test all features** thoroughly
2. ✅ **Set up monitoring** (Sentry, LogRocket)
3. ✅ **Configure backups** (already done by Railway)
4. ✅ **Add custom domain** (optional)
5. ✅ **Set up CI/CD** (already done via GitHub)
6. ✅ **Configure S3** for file uploads
7. ✅ **Set up email** notifications
8. ✅ **Implement payments** (Razorpay, UPI)
9. ✅ **Add analytics** (Google Analytics)
10. ✅ **Monitor performance** (Lighthouse, WebPageTest)

---

## Railway CLI Commands Reference

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# List services
railway status

# View logs
railway logs

# Run command in Railway environment
railway run <command>

# Connect to database
railway connect MySQL

# Open dashboard
railway open
```

---

## Support Resources

### Railway Documentation
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

### Sakshi Platform
- See `DEPLOYMENT_PLATFORMS.md` for other options
- See `ENVIRONMENT_SETUP.md` for configuration
- See `TROUBLESHOOTING.md` for common issues

---

## Checklist

- [ ] GitHub repository created and pushed
- [ ] Railway account created
- [ ] New project created in Railway
- [ ] MySQL database added
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Database migrations run
- [ ] Sample data seeded (optional)
- [ ] App URL obtained
- [ ] OAuth redirect configured
- [ ] Deployment tested
- [ ] Monitoring set up
- [ ] Custom domain added (optional)

---

## Congratulations! 🎉

Your Sakshi platform is now live on Railway!

**Your app is accessible at**: `https://your-app-name.up.railway.app`

Next, let's test it locally and configure additional services.

---

*For other deployment options, see `DEPLOYMENT_PLATFORMS.md`*  
*For environment configuration, see `ENVIRONMENT_SETUP.md`*  
*For testing, see `TESTING_OPTIMIZATION.md`*
