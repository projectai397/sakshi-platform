# 🚀 Sakshi Platform - Post-Deployment Guide

## 🎉 Congratulations! Your Platform is Live!

This guide provides step-by-step instructions for initializing and managing your newly deployed Sakshi AI platform.

---

## ✅ Initial Setup (5-10 minutes)

### **Step 1: Run the Post-Deployment Setup Script**

This script will guide you through initializing the database, seeding sample data, and creating an admin user.

1.  **Open Railway Terminal:**
    *   In your Railway project, go to your web service.
    *   Click the **"..."** menu → **"Terminal"**.

2.  **Run the Setup Script:**
    ```bash
    ./scripts/post-deploy-setup.sh
    ```

3.  **Follow the Prompts:**
    *   **Initialize Database:** Say **yes**.
    *   **Seed Sample Data:** Say **yes** (recommended for testing).
    *   **Create Admin User:** Say **yes** and enter your desired admin credentials.

### **Step 2: Login as Admin**

1.  Visit your Railway URL.
2.  Click **"Login"**.
3.  Enter the admin email and password you just created.
4.  You should now have access to the admin dashboard.

---

## 🤖 AI Model Setup

### **Step 1: Train AI Models**

1.  **Open Railway Terminal** (if not already open).

2.  **Run the AI Training Script:**
    ```bash
    ./scripts/train-ai-models.sh
    ```

3.  **What this does:**
    *   **Dynamic Pricing:** Trains the pricing model with your current data.
    *   **Recommendations:** Confirms the recommendation engine is ready.
    *   **Other Models:** Checks the status of other auto-training models.

### **Step 2: Index Products for Visual Search**

1.  **Go to Admin Dashboard** → **"Visual Search"**.
2.  Click **"Index All Products"**.
3.  This will generate AI embeddings for all your products, enabling visual search.
4.  This process may take a few minutes depending on the number of products.

---

## 🏥 Health & Monitoring

### **Step 1: Run a Health Check**

1.  **Open Railway Terminal**.

2.  **Run the Health Check Script:**
    ```bash
    ./scripts/health-check.sh
    ```

3.  **What this checks:**
    *   Homepage and API accessibility.
    *   Database and Redis connectivity.
    *   Response times.
    *   SSL certificate validity.

### **Step 2: Monitor in Railway Dashboard**

-   **Logs:** View real-time application logs for errors.
-   **Metrics:** Monitor CPU, memory, and network usage.
-   **Deployments:** Track deployment history and rollback if needed.

### **Step 3: Set Up External Monitoring (Recommended)**

-   **UptimeRobot (Free):** https://uptimerobot.com
    *   Set up a monitor for your Railway URL.
    *   Get alerts if your site goes down.

-   **Sentry (Free Tier):** https://sentry.io
    *   Add your `SENTRY_DSN` to environment variables.
    *   Get real-time error tracking and alerts.

---

## 🔧 Ongoing Management

### **Admin Dashboard**

Your admin dashboard is the central hub for managing the platform:

-   **Users:** View and manage users.
-   **Products:** Add, edit, and remove products.
-   **Orders:** Track and manage orders.
-   **AI Features:**
    *   **Dynamic Pricing:** View analytics and retrain model.
    *   **Visual Search:** Re-index products.
    *   **Inventory:** View dead stock and velocity predictions.

### **Updating the Platform**

1.  **Push changes to GitHub:**
    ```bash
    git push origin master
    ```
2.  **Railway automatically deploys:**
    *   Railway will detect the push and start a new deployment.
    *   Zero-downtime deployments are standard.

### **Database Migrations**

If you change the database schema:

1.  **Run migrations in Railway terminal:**
    ```bash
    npm run db:push
    ```

---

## 📚 Included Scripts

-   **`scripts/post-deploy-setup.sh`**: Initial setup wizard.
-   **`scripts/create-admin.ts`**: Manually create an admin user.
-   **`scripts/train-ai-models.sh`**: Train AI models.
-   **`scripts/health-check.sh`**: Monitor platform health.
-   **`scripts/seed-database.ts`**: Populate with sample data.

---

## 💰 Cost Management

-   **Monitor usage** in the Railway dashboard.
-   **Set up billing alerts** to avoid surprises.
-   **Scale resources** up or down as needed.
-   **Review monthly bills** from Railway, AWS, and OpenAI.

---

## 📞 Support

-   **Railway:** https://docs.railway.app, https://discord.gg/railway
-   **Sakshi Platform:** See `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

## 🎉 You're All Set!

Your Sakshi AI platform is now fully operational. Enjoy your new AI-powered thrift marketplace!

---

**Created by:** Manus AI  
**Date:** November 5, 2025
