# Sakshi - Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the Sakshi platform to production. The platform is built with modern web technologies and designed for easy deployment through the Manus platform.

## Platform Architecture

The Sakshi is a full-stack web application consisting of:

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11 + Node.js 22
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth with role-based access control
- **File Storage**: S3-compatible object storage
- **Deployment**: Auto-scaling infrastructure with global CDN

## Pre-Deployment Checklist

### 1. Content Preparation

- [ ] Add real product photos and descriptions
- [ ] Update impact metrics with actual data
- [ ] Customize homepage hero text and featured items
- [ ] Review and update About page with your organization's story
- [ ] Set up volunteer shift schedules
- [ ] Configure donation pickup/dropoff locations

### 2. Configuration

- [ ] Update `VITE_APP_TITLE` with your organization name
- [ ] Upload and set `VITE_APP_LOGO` with your logo URL
- [ ] Review and customize color scheme in `client/src/index.css` if needed
- [ ] Update contact information in Footer component
- [ ] Set up email notifications (optional)

### 3. Database

- [ ] Review seeded data and add/modify as needed
- [ ] Set up admin user accounts (update role to 'admin' in database)
- [ ] Configure backup schedule through Management UI
- [ ] Enable SSL for database connections in production

### 4. Testing

- [ ] Test complete shopping flow (browse → cart → checkout → confirmation)
- [ ] Verify all three payment methods work correctly
- [ ] Test donation form submission
- [ ] Check admin dashboard functionality
- [ ] Test on mobile devices and different browsers
- [ ] Verify all links in navigation and footer work

## Deployment Steps

### Step 1: Save a Checkpoint

Before deploying, ensure all changes are saved:

1. Test all features thoroughly in the development environment
2. Talk to Manus AI: "Save a checkpoint for production deployment"
3. Wait for checkpoint confirmation with version ID

### Step 2: Publish via Management UI

1. Open the Management UI (click icon in top-right of chatbox)
2. Verify the Preview panel shows your site correctly
3. Click the **Publish** button in the header (top-right)
4. Wait for deployment to complete (usually 1-2 minutes)
5. Your site will be live at `[prefix].manus.space`

### Step 3: Custom Domain (Optional)

To use your own domain:

1. Go to Management UI → Settings → Domains
2. Click "Add Custom Domain"
3. Enter your domain name (e.g., `shop.sakshicenter.org`)
4. Follow the DNS configuration instructions provided
5. Add the required CNAME record to your domain's DNS settings
6. Wait for DNS propagation (up to 48 hours, usually faster)
7. SSL certificate will be automatically provisioned

### Step 4: Post-Deployment Verification

After deployment:

- [ ] Visit your production URL and verify homepage loads
- [ ] Test user registration and login
- [ ] Complete a test purchase with each payment method
- [ ] Submit a test donation
- [ ] Check admin dashboard access
- [ ] Verify email notifications (if configured)
- [ ] Test on multiple devices and browsers

## Environment Variables

All required environment variables are automatically managed by the Manus platform:

- `DATABASE_URL` - MySQL/TiDB connection string
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_ID` - Manus OAuth application ID
- `OAUTH_SERVER_URL` - Manus OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `OWNER_OPEN_ID`, `OWNER_NAME` - Owner information
- `VITE_APP_TITLE` - Site title (customizable)
- `VITE_APP_LOGO` - Logo URL (customizable)
- `BUILT_IN_FORGE_API_URL` - Manus APIs URL
- `BUILT_IN_FORGE_API_KEY` - Server-side API key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

To add custom environment variables:

1. Go to Management UI → Settings → Secrets
2. Click "Add Secret"
3. Enter key-value pair
4. Save and restart the application

## Scaling Considerations

The platform is designed to scale automatically:

- **Auto-scaling**: Server instances scale based on traffic
- **CDN**: Static assets served via global CDN
- **Database**: TiDB provides horizontal scalability
- **File Storage**: S3 handles unlimited file uploads

For high-traffic scenarios:

- Monitor analytics in Management UI → Dashboard
- Review database performance in Management UI → Database
- Consider adding caching layer for product catalog
- Optimize images for web (already handled by S3)

## Maintenance

### Regular Tasks

- **Weekly**: Review new donations and process them
- **Monthly**: Update impact metrics on homepage
- **Quarterly**: Review and update product inventory
- **As Needed**: Add new volunteer opportunities and events

### Monitoring

Access monitoring tools in Management UI:

- **Dashboard**: Real-time UV/PV analytics
- **Database**: Query performance and table sizes
- **Settings**: System health and uptime

### Backups

- Database backups are automatic (daily)
- Access backup settings in Management UI → Database
- Download full project files via Management UI → Code

### Updates

To update the platform:

1. Talk to Manus AI with your requirements
2. Test changes in development environment
3. Save a new checkpoint
4. Publish via Management UI
5. Previous versions remain available for rollback

## Rollback Procedure

If issues occur after deployment:

1. Open Management UI
2. View checkpoint history
3. Click "Rollback" on the desired previous version
4. Confirm rollback action
5. Site will revert to that checkpoint state

## Support

For technical support or feature requests:

- Talk to Manus AI directly in the chat interface
- Submit feedback at https://help.manus.im
- Review documentation in PROJECT_SUMMARY.md

## Security Best Practices

- Never share environment variables or API keys
- Use HTTPS for all production traffic (automatic)
- Enable SSL for database connections
- Regularly review user roles and permissions
- Monitor admin dashboard for suspicious activity
- Keep contact information up to date

## Performance Optimization

The platform is already optimized for performance:

- ✅ Code splitting and lazy loading
- ✅ Image optimization via S3
- ✅ CDN for static assets
- ✅ Efficient database queries with Drizzle ORM
- ✅ tRPC for minimal API overhead

For further optimization:

- Add product image compression before upload
- Implement search indexing for large catalogs
- Consider Redis caching for frequently accessed data

## Conclusion

Your Sakshi is now ready for production deployment! Follow this guide carefully, test thoroughly, and reach out to Manus AI for any assistance. Your platform will serve your community with purpose, heart, and cutting-edge technology.

---

**Deployment Date**: _To be filled after first deployment_  
**Version**: 44e8d45a  
**Deployed By**: _Your name_
