# Sakshi Platform - Quick Start Guide

## 🚀 Getting Started

This guide will help you get the Sakshi platform running on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 22.13.0 or higher
- **pnpm**: Version 10.4.1 or higher (install via `npm install -g pnpm`)
- **MySQL/TiDB**: For the database
- **Git**: For version control (optional)

---

## Installation Steps

### 1. Extract the Project

If you received a compressed archive:

```bash
tar -xzf sakshi-built.tar.gz
cd sakshi
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required packages (~2-3 minutes).

### 3. Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:3306/sakshi"

# OAuth Configuration (Manus OAuth)
OAUTH_CLIENT_ID="your_client_id"
OAUTH_CLIENT_SECRET="your_client_secret"
OAUTH_REDIRECT_URI="http://localhost:3000/auth/callback"

# S3 Storage Configuration
S3_ENDPOINT="your_s3_endpoint"
S3_BUCKET="sakshi-uploads"
S3_ACCESS_KEY="your_access_key"
S3_SECRET_KEY="your_secret_key"

# Application Configuration
NODE_ENV="development"
PORT=3000
SESSION_SECRET="your_random_secret_key_here"
```

### 4. Set Up Database

Run database migrations to create all required tables:

```bash
pnpm db:push
```

This will create 19 tables including users, products, orders, seva wallets, and more.

### 5. Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests with Vitest |
| `pnpm db:push` | Run database migrations |

---

## Project Structure

```
sakshi/
├── client/              # Frontend React application
│   ├── public/          # Static assets
│   │   └── images/
│   │       └── backgrounds/  # Adiyogi Ghibli backgrounds
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components (16 pages)
│       ├── lib/         # Utilities and tRPC client
│       ├── index.css    # Global styles
│       └── adiyogi-backgrounds.css  # Background styles
├── server/              # Backend Express + tRPC
│   ├── _core/           # Server entry point
│   ├── routers/         # API route handlers
│   └── db/              # Database schema and queries
├── shared/              # Shared types and constants
├── dist/                # Build output (after pnpm build)
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

---

## Key Features Overview

### 1. Triple Pricing System
Every product can be purchased through:
- **Sliding Scale**: Pay ₹50-₹300 based on ability
- **Seva Tokens**: Earned through volunteering
- **Request Free**: No questions asked

### 2. Pages Available
- **Home** (`/`) - Landing page with hero section
- **Shop** (`/shop`) - Product catalog with filters
- **Cafes** (`/cafes`) - Women's cooperative cafés
- **Repair Café** (`/repair-cafe`) - Fix items, earn tokens
- **Retreats** (`/retreats`) - Spiritual retreat listings
- **Meditate** (`/meditate`) - Meditation resources
- **Profile** (`/profile`) - User dashboard
- **Seva Wallet** (`/seva-wallet`) - Token management
- And 8+ more pages...

### 3. Admin Dashboard
Access at `/admin` (requires admin role):
- Product management
- User management
- Order tracking
- Analytics and impact metrics

---

## Adiyogi Ghibli Backgrounds

All pages feature beautiful Adiyogi-inspired backgrounds in Studio Ghibli art style:

- **Home**: Adiyogi with devotee in traditional attire
- **About**: Meditation at Isha Yoga Centre
- **Shop**: Spiritual seeker at Adiyogi
- **Cafes**: Mountain landscape
- **Retreats**: Forest meditation scenes
- And more...

Backgrounds are automatically applied via CSS classes defined in `client/src/adiyogi-backgrounds.css`.

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Change port in .env
PORT=3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

Ensure MySQL/TiDB is running and credentials in `.env` are correct:

```bash
# Test database connection
mysql -u user -p -h localhost sakshi
```

### Build Errors

Clear cache and reinstall dependencies:

```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

### TypeScript Errors

Run type checking to see detailed errors:

```bash
pnpm check
```

---

## Default Accounts

After running migrations, you may need to create an admin account manually in the database or through the OAuth flow.

To set a user as admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Development Tips

### Hot Reload
The development server supports hot module replacement (HMR). Changes to React components will update instantly without full page reload.

### API Development
All API endpoints are defined in `server/routers/`. The tRPC setup provides end-to-end type safety between frontend and backend.

### Adding New Pages
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Choose an Adiyogi background class from `adiyogi-backgrounds.css`

### Styling
The project uses Tailwind CSS 4. Custom Ghibli-inspired utilities are defined in `client/src/index.css`:
- `.ghibli-card` - Elevated cards with soft shadows
- `.ghibli-button` - Animated buttons
- `.text-gradient-sage` - Gradient text effects
- `.watercolor-bg` - Watercolor backgrounds

---

## Production Deployment

### Build for Production

```bash
pnpm build
```

This generates:
- `dist/index.js` - Server bundle (80KB)
- `dist/public/` - Frontend assets and images

### Start Production Server

```bash
NODE_ENV=production pnpm start
```

### Environment Variables for Production

Ensure these are set in your production environment:
- `DATABASE_URL` - Production database connection
- `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` - OAuth credentials
- `S3_ENDPOINT`, `S3_BUCKET`, etc. - S3 storage configuration
- `SESSION_SECRET` - Strong random secret
- `PORT` - Server port (default: 3000)

### Deployment Platforms

The project can be deployed to:
- **Vercel** - Serverless deployment
- **Railway** - Container deployment
- **DigitalOcean App Platform** - Managed hosting
- **AWS/GCP/Azure** - Cloud infrastructure
- **Self-hosted** - VPS or dedicated server

See `DEPLOYMENT_GUIDE.md` for platform-specific instructions.

---

## Support

For issues or questions:
1. Check `BUILD_NOTES.md` for build details
2. Review `PROJECT_SUMMARY.md` for feature documentation
3. Consult `DEPLOYMENT_GUIDE.md` for deployment help

---

## License

MIT License - See LICENSE file for details

---

**Sakshi** - Witnessing every journey, supporting every soul 🌿✨

*Built with React, TypeScript, Tailwind CSS, and tRPC*
