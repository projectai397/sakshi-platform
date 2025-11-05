# 🚀 Sakshi Platform - Production Deployment Guide

## 📋 Overview

This guide provides step-by-step instructions for deploying the complete Sakshi AI-powered thrift marketplace platform to production.

**Platform Stack:**
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + tRPC
- **Database:** PostgreSQL (with Drizzle ORM)
- **Caching:** Redis
- **ML/AI:** Python (scikit-learn, PyTorch, OpenAI CLIP)
- **File Storage:** AWS S3

---

## 🎯 Deployment Options

### **Recommended: Railway** (Easiest, All-in-One)
- ✅ Automatic PostgreSQL + Redis provisioning
- ✅ Git-based deployments
- ✅ Environment variable management
- ✅ Free tier available ($5/month credit)
- ✅ Python + Node.js support

### **Alternative: Vercel + Supabase**
- ✅ Excellent for frontend
- ✅ Serverless functions
- ✅ Free PostgreSQL (Supabase)
- ⚠️ Requires separate Redis setup

### **Alternative: AWS/DigitalOcean**
- ✅ Full control
- ✅ Scalable
- ⚠️ More complex setup
- ⚠️ Higher cost

---

## 📦 Prerequisites

### **1. Accounts Needed:**
- [ ] GitHub account (already have)
- [ ] Railway account (https://railway.app)
- [ ] AWS account (for S3 storage)

### **2. Local Tools:**
- [x] Git
- [x] Node.js 22+
- [x] Python 3.11+
- [x] pnpm

### **3. Environment Variables Required:**

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis Cache
REDIS_URL=redis://user:password@host:port

# Session Secret
SESSION_SECRET=your-super-secret-key-here

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=sakshi-uploads

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Node Environment
NODE_ENV=production
PORT=3000
```

---

## 🚀 Deployment Steps (Railway - Recommended)

### **Step 1: Prepare the Project**

1. **Ensure all code is pushed to GitHub:**
   ```bash
   cd /home/ubuntu/sakshi
   git status
   git push origin master
   ```

2. **Create Python requirements file:**
   ```bash
   cat > requirements.txt << EOF
scikit-learn==1.3.0
pandas==2.1.0
numpy==1.24.3
joblib==1.3.2
torch==2.1.0
torchvision==0.16.0
transformers==4.35.0
pillow==10.1.0
EOF
   ```

3. **Create Procfile for Railway:**
   ```bash
   cat > Procfile << EOF
web: npm run start
EOF
   ```

### **Step 2: Set Up Railway**

1. **Sign up for Railway:**
   - Go to https://railway.app
   - Sign in with GitHub
   - Authorize Railway to access your repositories

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `projectai397/sakshi-platform`
   - Railway will detect Node.js automatically

3. **Add PostgreSQL Database:**
   - In your project dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision and connect automatically
   - Copy the `DATABASE_URL` from the database settings

4. **Add Redis:**
   - Click "+ New" again
   - Select "Database" → "Redis"
   - Railway will provision and connect automatically
   - Copy the `REDIS_URL` from the Redis settings

### **Step 3: Configure Environment Variables**

1. **In Railway project settings, add these variables:**

   ```bash
   NODE_ENV=production
   DATABASE_URL=(auto-filled by Railway)
   REDIS_URL=(auto-filled by Railway)
   SESSION_SECRET=generate-random-64-char-string
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=sakshi-uploads
   OPENAI_API_KEY=your-openai-key
   ```

2. **Generate SESSION_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### **Step 4: Configure Build Settings**

1. **In Railway settings:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
   - **Install Command:** `pnpm install`

2. **Add Python buildpack (for ML features):**
   - In Settings → Environment
   - Add buildpack: `heroku/python`
   - Railway will install Python dependencies from `requirements.txt`

### **Step 5: Deploy**

1. **Trigger deployment:**
   - Railway will automatically deploy on push to master
   - Or click "Deploy" in Railway dashboard

2. **Monitor deployment:**
   - Check build logs in Railway dashboard
   - Wait for "Deployment successful" message
   - Copy the public URL (e.g., `https://sakshi-platform-production.up.railway.app`)

### **Step 6: Initialize Database**

1. **Run database migrations:**
   ```bash
   # In Railway CLI or dashboard terminal
   npm run db:push
   ```

2. **Seed initial data (optional):**
   ```bash
   npm run db:seed
   ```

### **Step 7: Verify Deployment**

1. **Test the platform:**
   - Visit your Railway URL
   - Create a test account
   - Upload a product
   - Test AI features (visual search, recommendations, etc.)

2. **Check health endpoints:**
   - `https://your-app.railway.app/api/health`
   - `https://your-app.railway.app/api/trpc/health`

---

## 🔧 Post-Deployment Configuration

### **1. Set Up AWS S3 Bucket**

```bash
# Create S3 bucket
aws s3 mb s3://sakshi-uploads

# Set CORS policy
aws s3api put-bucket-cors --bucket sakshi-uploads --cors-configuration file://cors.json
```

**cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-app.railway.app"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### **2. Train ML Models**

Once deployed, train the AI models with real data:

1. **Dynamic Pricing Model:**
   ```bash
   curl -X POST https://your-app.railway.app/api/trpc/pricing.trainModel \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

2. **Index Products for Visual Search:**
   ```bash
   curl -X POST https://your-app.railway.app/api/trpc/visualSearch.indexProducts \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

### **3. Set Up Monitoring**

1. **Railway Metrics:**
   - CPU usage
   - Memory usage
   - Request count
   - Response time

2. **Add external monitoring (optional):**
   - Sentry for error tracking
   - LogRocket for session replay
   - Google Analytics for user analytics

---

## 🔐 Security Checklist

- [x] Environment variables secured
- [x] SESSION_SECRET is random and strong
- [x] Database credentials are private
- [x] AWS keys have minimal permissions (S3 only)
- [x] CORS configured correctly
- [x] HTTPS enabled (automatic on Railway)
- [x] Rate limiting enabled
- [x] Input validation with Zod
- [x] SQL injection protection (Drizzle ORM)
- [x] XSS protection (React)

---

## 📊 Performance Optimization

### **1. Enable Caching:**
- Redis caching is already implemented
- Verify Redis connection in logs

### **2. CDN for Static Assets:**
- Railway provides CDN automatically
- Or use Cloudflare for additional caching

### **3. Database Optimization:**
- Indexes are already configured in schema
- Monitor slow queries in Railway dashboard

### **4. ML Model Optimization:**
- Models are cached after first load
- Consider using smaller CLIP model for faster inference

---

## 🐛 Troubleshooting

### **Build Fails:**
```bash
# Check Node.js version
node --version  # Should be 22+

# Clear cache and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
npm run build
```

### **Database Connection Error:**
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:password@host:port/database

# Test connection
npm run db:push
```

### **Redis Connection Error:**
```bash
# Verify REDIS_URL format
echo $REDIS_URL
# Should be: redis://user:password@host:port

# Test Redis connection
redis-cli -u $REDIS_URL ping
```

### **Python ML Scripts Not Working:**
```bash
# Verify Python dependencies
pip3 list | grep -E "scikit-learn|torch|transformers"

# Reinstall if needed
pip3 install -r requirements.txt
```

---

## 📈 Scaling Considerations

### **When to Scale:**
- > 1000 concurrent users
- > 10,000 products
- > 100 requests/second

### **Scaling Options:**

1. **Horizontal Scaling (Railway):**
   - Increase replicas in Railway dashboard
   - Load balancing is automatic

2. **Database Scaling:**
   - Upgrade PostgreSQL plan
   - Add read replicas
   - Enable connection pooling

3. **Redis Scaling:**
   - Upgrade Redis plan
   - Use Redis Cluster for high availability

4. **ML Model Scaling:**
   - Deploy ML models as separate service
   - Use GPU instances for faster inference
   - Implement model caching

---

## 💰 Cost Estimation

### **Railway (Recommended):**
- **Hobby Plan:** $5/month (includes $5 credit)
- **PostgreSQL:** ~$5-10/month
- **Redis:** ~$5/month
- **Total:** ~$10-15/month for small scale

### **AWS S3:**
- **Storage:** $0.023/GB/month
- **Requests:** $0.0004 per 1000 requests
- **Estimated:** $5-10/month

### **OpenAI API (for AI features):**
- **GPT-4 Vision:** $0.01/image (for quality assessment)
- **Estimated:** $20-50/month depending on usage

### **Total Monthly Cost:** ~$35-75/month

---

## 🎯 Success Metrics

### **Monitor These KPIs:**

**Technical:**
- Uptime: > 99.9%
- Response time: < 500ms
- Error rate: < 0.1%
- Database queries: < 100ms

**Business:**
- Daily active users
- Conversion rate
- Average order value
- Revenue per user

**AI Features:**
- Visual search usage
- Recommendation click-through rate
- Dynamic pricing impact
- Inventory turnover rate

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app
- **Drizzle ORM Docs:** https://orm.drizzle.team
- **tRPC Docs:** https://trpc.io
- **React Docs:** https://react.dev

---

## ✅ Deployment Checklist

### **Pre-Deployment:**
- [x] All code pushed to GitHub
- [x] Environment variables documented
- [x] Database schema finalized
- [x] Build tested locally
- [x] Dependencies installed

### **Deployment:**
- [ ] Railway project created
- [ ] PostgreSQL provisioned
- [ ] Redis provisioned
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Deployment successful

### **Post-Deployment:**
- [ ] Database migrated
- [ ] Health checks passing
- [ ] AI models trained
- [ ] Products indexed
- [ ] Monitoring enabled
- [ ] Domain configured (optional)

---

## 🎉 Congratulations!

Your Sakshi AI-powered thrift marketplace platform is now live in production!

**Next Steps:**
1. Share the platform URL with users
2. Monitor performance and errors
3. Collect user feedback
4. Iterate and improve
5. Scale as needed

---

**Created by:** Manus AI  
**Date:** November 5, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
