# Sakshi - User Guide

**Website URL:** https://3000-inpyb2ii76b8safed1ffs-96cd604c.manus-asia.computer

**Purpose:** Shop quality pre-loved items using money, seva tokens earned through volunteering, or request items completely free.

**Access:** Public browsing available. Login required for purchasing, earning seva tokens, and accessing your wallet.

---

## Powered by Manus

Sakshi runs on cutting-edge technology built entirely with Manus AI. The platform features a modern **React 19** frontend with **TypeScript** for type safety, styled with **Tailwind CSS 4** for the beautiful Studio Ghibli-inspired design. The backend uses **Express 4** with **tRPC 11** for end-to-end type-safe APIs, ensuring seamless communication between frontend and backend. User authentication is powered by **Manus OAuth**, providing secure and hassle-free login. Data is stored in a **MySQL/TiDB** database managed through **Drizzle ORM**, offering robust and scalable data management. File storage utilizes **S3-compatible object storage** for product images and user uploads. The entire stack is deployed on **auto-scaling infrastructure with global CDN**, ensuring fast load times and reliable performance worldwide.

---

## Using Your Website

**Shopping with Triple Pricing:** Visit the "Shop" page to browse products. Each item shows three payment options: sliding scale money (₹50-₹300), seva tokens, or request free. Click any product to see full details, environmental impact (water saved, CO₂ prevented), and the item's unique story. Use the interactive price slider to choose what you can afford—paying more helps subsidize free items for others.

**Earning Seva Tokens:** Click "Volunteer" in the navigation to view upcoming opportunities. Sign up for shifts at the thrift store, repair café, or community events. Each volunteer hour earns 1 seva token. Completed repairs earn 2 tokens. Track your balance, transaction history, and expiring tokens (1 year from earning) in "Seva Wallet."

**Sakshi Cafés:** Click "Sakshi Cafés" to discover women-run cooperative spaces serving organic food with triple pricing. Each café is 100% owned by 5-8 women with equal voting rights. Choose "Find a Café" to see locations with addresses, hours, and specialties. Women interested in joining a cooperative can click "Join a Cooperative" to apply—no experience required, just commitment to community and dignity.

**Donating Items:** Click "Donate" in the navigation to contribute gently used items. The form collects your contact information, item details (name, category, condition, description), optional photos (up to 5), and pickup preferences. Choose from eight categories including Clothing, Books, Toys, Home & Kitchen, Furniture, Electronics, Sports, or Other. Select condition from Like New, Gently Used, Well Loved, or Needs Repair. Provide a pickup address or leave blank to drop off at the center. After submission, the team reviews within 24-48 hours, schedules pickup, and sends an impact report showing how your donation helped the community.

**Circular Economy Programs:** Explore "Circular Economy" to join community initiatives. "Repair Café" offers free repair services—bring broken items and learn skills while earning tokens. "Swap Events" let you trade quality items without money. "Upcycle Studio" provides workshops and materials to transform old items into new creations. "Children's Free Zone" offers all kids' items completely free, always.

**AI-Powered Features:** The platform includes four intelligent features to enhance your experience. Use "Smart Search" on the Shop page with natural language like "toys for 5 year old" or "red jacket for winter"—the AI understands your intent and shows exactly what you need with an explanation. Product detail pages show "You Might Also Love" recommendations based on what you're viewing. Your shopping cart displays real-time environmental impact (water saved, CO₂ prevented, items saved from landfill). Click the green chat button in the bottom-right corner on any page to ask "Sakshi Assistant" questions—get instant, helpful answers 24/7.

**User Dashboard:** After logging in, access your personal dashboard from the navigation menu. The "Orders" tab shows your complete purchase history with order numbers, dates, payment methods, and current status. The "Seva Wallet" tab displays your available token balance, lifetime earned and spent statistics, and three ways to earn more: volunteer at events (5-10 tokens/hour), donate quality items (tokens based on value), or refer friends (10 tokens per signup). The "Profile" tab shows your account information and quick action buttons to browse products, donate items, volunteer, or visit Sakshi Cafés.

---

## Managing Your Website

**Dashboard Access:** Admin users see an "Admin" link in the navigation. Click to access the management dashboard with six tabs: Overview shows stats and recent activity, Products manages inventory with search and filters, Users handles accounts, Donations processes incoming items, Orders tracks purchases, and Analytics displays impact metrics.

**Database Management:** Open the Management UI panel (right side) and select "Database" to view all tables, add/edit/delete records, and run queries. Connection details appear in bottom-left settings—enable SSL for production use.

**Settings Configuration:** In Management UI → Settings, customize your site name and logo (VITE_APP_TITLE/VITE_APP_LOGO), modify the auto-generated domain prefix or bind custom domains under "Domains," manage notification settings for the built-in API, and view/edit/delete environment variables in "Secrets."

**Publishing Your Site:** After making changes, click "Publish" in the Management UI header (top-right). This button activates after creating a checkpoint. Earlier checkpoints show a "Rollback" button to restore previous versions.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features. The platform is ready for you to start adding real products, processing donations, and welcoming your community. Begin by uploading product photos, writing item stories, and inviting volunteers to earn their first seva tokens through community service.
