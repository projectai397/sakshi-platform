# 🚀 Quick Deploy to Railway (5 Minutes)

## ✅ Prerequisites
- [x] Code pushed to GitHub ✅
- [x] All deployment files ready ✅
- [ ] Railway account (free - create now)
- [ ] AWS S3 credentials (for file uploads)
- [ ] OpenAI API key (for AI features)

---

## 📋 Step-by-Step Deployment

### **Step 1: Create Railway Account (1 minute)**

1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Sign in with your **GitHub account**
4. Authorize Railway to access your repositories

---

### **Step 2: Deploy from GitHub (2 minutes)**

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. Find and select: **`projectai397/sakshi-platform`**
4. Railway will automatically:
   - Detect Node.js project
   - Read `railway.json` configuration
   - Start building

---

### **Step 3: Add PostgreSQL Database (30 seconds)**

1. In your project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Provision PostgreSQL database
   - Set `DATABASE_URL` environment variable
   - Connect to your app

---

### **Step 4: Add Redis Cache (30 seconds)**

1. Click **"+ New"** again
2. Select **"Database"** → **"Add Redis"**
3. Railway will automatically:
   - Provision Redis instance
   - Set `REDIS_URL` environment variable
   - Connect to your app

---

### **Step 5: Set Environment Variables (1 minute)**

1. Click on your **web service** (the main app)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add these:

```bash
# Required - Generate this
SESSION_SECRET=<generate-with-command-below>

# Required - AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=sakshi-uploads

# Required - OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Required - Node Environment
NODE_ENV=production
```

**To generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as the value for `SESSION_SECRET`.

---

### **Step 6: Deploy! (2-3 minutes)**

1. Railway will automatically deploy after you add variables
2. Or click **"Deploy"** button to trigger manually
3. Watch the build logs in real-time
4. Wait for **"Deployment successful"** message

---

### **Step 7: Get Your URL**

1. Go to **"Settings"** tab
2. Under **"Domains"**, you'll see your public URL:
   - Format: `https://sakshi-platform-production.up.railway.app`
3. Click to open and test your platform!

---

## ✅ Post-Deployment Setup

### **Initialize Database**

1. In Railway, go to your web service
2. Click **"..."** menu → **"Terminal"**
3. Run:
   ```bash
   npm run db:push
   ```

### **Test Your Platform**

Visit your Railway URL and verify:
- [x] Homepage loads
- [x] Can register a new account
- [x] Can login
- [x] Can upload a product
- [x] Search works
- [x] All pages accessible

---

## 🎯 Optional: Add Custom Domain

1. In Railway, go to **"Settings"** → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `sakshi.com`)
4. Add CNAME record in your domain registrar:
   - Name: `@` or `www`
   - Value: `<your-railway-url>`
5. Wait for DNS propagation (5-30 minutes)

---

## 🔧 Train AI Models

Once deployed, train your AI models with real data:

### **1. Dynamic Pricing Model**
```bash
# In Railway terminal or via API
curl -X POST https://your-app.railway.app/api/trpc/pricing.trainModel \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### **2. Visual Search Index**
```bash
curl -X POST https://your-app.railway.app/api/trpc/visualSearch.indexProducts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📊 Monitor Your Deployment

### **In Railway Dashboard:**
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History and rollback options

### **Health Checks:**
- Homepage: `https://your-app.railway.app`
- API Health: `https://your-app.railway.app/api/health`

---

## 💰 Costs

### **Railway Pricing:**
- **Starter Plan**: $5/month (includes $5 credit)
- **PostgreSQL**: ~$5/month
- **Redis**: ~$5/month
- **Total**: ~$10-15/month

### **Other Services:**
- **AWS S3**: ~$5-10/month
- **OpenAI API**: ~$20-50/month (usage-based)

**Total Monthly Cost**: ~$35-75/month

---

## 🐛 Troubleshooting

### **Build Fails**
- Check build logs in Railway
- Verify all files are pushed to GitHub
- Ensure `package.json` scripts are correct

### **Database Connection Error**
- Verify PostgreSQL is added
- Check `DATABASE_URL` is set automatically
- Run `npm run db:push` in Railway terminal

### **App Not Loading**
- Check deployment status (should be "Active")
- View logs for errors
- Verify environment variables are set

### **AI Features Not Working**
- Ensure `OPENAI_API_KEY` is set
- Check Python dependencies installed
- View logs for Python errors

---

## 🎉 Success!

Your Sakshi AI-powered platform is now live!

**What's Next:**
1. ✅ Share the URL with users
2. ✅ Train AI models with real data
3. ✅ Monitor performance metrics
4. ✅ Collect user feedback
5. ✅ Iterate and improve

---

## 📞 Need Help?

**Railway Support:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Twitter: @Railway

**Sakshi Platform:**
- Full Guide: See `PRODUCTION_DEPLOYMENT_GUIDE.md`
- GitHub: https://github.com/projectai397/sakshi-platform

---

**Created by:** Manus AI  
**Date:** November 5, 2025  
**Estimated Time**: 5-10 minutes  
**Difficulty**: Easy ⭐
