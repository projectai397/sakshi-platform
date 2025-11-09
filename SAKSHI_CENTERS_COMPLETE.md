# Sakshi Centers - Complete Implementation Guide

## Overview

This document provides a complete implementation guide for all Sakshi Centers beyond the Cafe:

1. **Repair Cafe** - Fix items, extend their life, earn Seva tokens
2. **Swap Events** - Money-free exchange marketplace
3. **Upcycle Studio** - Creative transformation workshops

---

## Database Schema

### Repair Cafe (3 Tables)

**repair_requests**
- User-submitted repair requests
- Item details, category, description
- Status tracking (pending → matched → completed)
- Volunteer matching
- Seva token rewards

**repair_events**
- Scheduled repair cafe events
- Date, time, location
- Volunteer and participant capacity
- Skills available
- Event status

**repair_volunteers**
- Volunteer registrations
- Skills offered
- Tools bringing
- Seva tokens earned

### Swap Events (4 Tables)

**swap_items**
- Items listed for swapping
- Category, condition, images
- What user is looking for
- Status (available → swapped)
- Seva token rewards

**swap_events**
- Scheduled swap events
- Categories accepted
- Participant capacity
- Event rules

**swap_registrations**
- User event registrations
- Items count
- Swaps completed
- Seva tokens earned

### Upcycle Studio (4 Tables)

**upcycle_projects**
- DIY upcycle tutorials
- Step-by-step instructions
- Materials and tools needed
- Before/after photos
- Difficulty level
- Community approval

**upcycle_workshops**
- Hands-on upcycle workshops
- Instructor-led sessions
- Triple pricing (community/fair/supporter)
- Virtual or in-person
- Materials provided

**workshop_registrations**
- Workshop sign-ups
- Payment tracking
- Attendance tracking
- Seva tokens earned

**upcycle_submissions**
- User project showcases
- Based on tutorials or original
- Before/after photos
- Tips and learnings
- Community likes

---

## Features Implementation

### Repair Cafe

#### Core Features

**1. Submit Repair Request**
```typescript
// User submits item for repair
interface RepairRequest {
  itemName: string;
  itemCategory: string; // electronics, clothing, furniture, etc.
  itemDescription: string;
  repairNeeded: string;
  imageUrls?: string[];
}

// System matches with volunteer
// Volunteer receives notification
// User gets update when matched
```

**2. Volunteer Registration**
```typescript
// Volunteer signs up for event
interface VolunteerRegistration {
  eventId: number;
  skills: string[]; // electronics, sewing, woodworking, etc.
  experience: string;
  toolsBringing?: string;
}

// Earn Seva tokens for volunteering
// 50 tokens per event
```

**3. Event Management**
```typescript
// Admin creates repair event
interface RepairEvent {
  title: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  maxCapacity: number;
  volunteersNeeded: number;
  skills: string[]; // Skills available at event
}
```

#### Seva Token Rewards

- **Submit repair request**: 10 tokens
- **Successful repair**: 20 tokens
- **Volunteer at event**: 50 tokens per event
- **Bring own tools**: +10 tokens

#### User Flow

1. User submits repair request with photos
2. System notifies volunteers with matching skills
3. Volunteer accepts request
4. User and volunteer coordinate (in-person or at event)
5. Repair completed
6. Both earn Seva tokens
7. Item saved from landfill! 🌍

### Swap Events

#### Core Features

**1. List Item for Swap**
```typescript
interface SwapItem {
  title: string;
  description: string;
  category: string; // clothing, books, toys, electronics, etc.
  condition: 'excellent' | 'good' | 'fair';
  imageUrls: string[];
  estimatedValue?: number;
  lookingFor?: string; // What they want in exchange
}
```

**2. Browse Swap Items**
```typescript
// Filter by category, condition
// Search by keywords
// View what others are looking for
// Message owners to propose swaps
```

**3. Attend Swap Event**
```typescript
interface SwapEventRegistration {
  eventId: number;
  itemsCount: number; // How many items bringing
}

// At event:
// - Bring items
// - Browse others' items
// - Make swaps
// - Earn Seva tokens
```

#### Seva Token Rewards

- **List item**: 5 tokens
- **Complete swap**: 15 tokens per item
- **Attend event**: 25 tokens
- **Help organize event**: 50 tokens

#### Swap Event Rules

1. **No Money Exchange** - Pure barter/swap only
2. **Fair Value** - Items should be of similar value
3. **Good Condition** - Items must be clean and functional
4. **Respect** - No pressure, all swaps voluntary
5. **Community** - Help others find good matches

### Upcycle Studio

#### Core Features

**1. Browse Upcycle Projects**
```typescript
interface UpcycleProject {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string; // "2-3 hours"
  materialsNeeded: string[];
  toolsNeeded: string[];
  instructions: Array<{
    step: number;
    text: string;
    imageUrl?: string;
  }>;
  beforeImageUrl: string;
  afterImageUrl: string;
  category: string; // furniture, clothing, decor, etc.
}
```

**2. Submit Your Project**
```typescript
// Users create tutorials
// Community votes/approves
// Earn Seva tokens for approved projects
```

**3. Register for Workshop**
```typescript
interface UpcycleWorkshop {
  title: string;
  projectId?: number; // Related tutorial
  instructorId: number;
  workshopDate: Date;
  duration: number; // minutes
  location: string;
  isVirtual: boolean;
  maxParticipants: number;
  materialsProvided: string[];
  materialsFee: number;
  // Triple pricing
  communityPrice: number;
  fairPrice: number;
  supporterPrice: number;
}
```

**4. Showcase Your Creation**
```typescript
interface UpcycleSubmission {
  projectId?: number; // If based on tutorial
  title: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  materialsUsed: string[];
  timeTaken: string;
  tips?: string;
}

// Share with community
// Get likes and feedback
// Earn Seva tokens
```

#### Seva Token Rewards

- **Submit approved project**: 30 tokens
- **Complete workshop**: 20 tokens
- **Share your creation**: 10 tokens
- **Get 10+ likes**: +5 tokens
- **Teach workshop**: 75 tokens

#### Workshop Categories

- **Furniture Upcycling** - Old to gold transformations
- **Clothing Redesign** - Fashion from old fabrics
- **Home Decor** - Beautiful from discarded
- **Jewelry Making** - Accessories from scraps
- **Garden Projects** - Planters, bird houses, etc.

---

## API Routes Structure

### Repair Cafe Routes

```
/api/trpc/centers.repair
  ├── requests
  │   ├── submit
  │   ├── getAll
  │   ├── getById
  │   ├── updateStatus
  │   └── delete
  ├── events
  │   ├── create
  │   ├── getUpcoming
  │   ├── getById
  │   ├── register
  │   └── cancel
  └── volunteers
      ├── register
      ├── getByEvent
      ├── updateStatus
      └── getMyVolunteering
```

### Swap Events Routes

```
/api/trpc/centers.swap
  ├── items
  │   ├── create
  │   ├── getAll
  │   ├── getById
  │   ├── update
  │   ├── delete
  │   └── markSwapped
  ├── events
  │   ├── create
  │   ├── getUpcoming
  │   ├── getById
  │   └── register
  └── registrations
      ├── getByEvent
      ├── checkIn
      └── recordSwap
```

### Upcycle Studio Routes

```
/api/trpc/centers.upcycle
  ├── projects
  │   ├── create
  │   ├── getAll
  │   ├── getById
  │   ├── approve
  │   ├── like
  │   └── delete
  ├── workshops
  │   ├── create
  │   ├── getUpcoming
  │   ├── getById
  │   ├── register
  │   └── cancel
  └── submissions
      ├── create
      ├── getAll
      ├── getById
      ├── like
      └── delete
```

---

## Frontend Pages

### Repair Cafe

**Pages:**
- `/repair-cafe` - Main page (already exists, enhance it)
- `/repair-cafe/request` - Submit repair request
- `/repair-cafe/events` - Browse upcoming events
- `/repair-cafe/volunteer` - Volunteer registration
- `/repair-cafe/my-requests` - User's repair requests

**Components:**
- `RepairRequestCard` - Display repair request
- `RepairEventCard` - Display event details
- `VolunteerForm` - Volunteer registration form

### Swap Events

**Pages:**
- `/swap` - Main swap marketplace
- `/swap/items` - Browse swap items
- `/swap/events` - Upcoming swap events
- `/swap/my-items` - User's listed items
- `/swap/list-item` - List new item

**Components:**
- `SwapItemCard` - Display swap item
- `SwapEventCard` - Display event
- `SwapItemForm` - List item form

### Upcycle Studio

**Pages:**
- `/upcycle` - Main upcycle hub
- `/upcycle/projects` - Browse tutorials
- `/upcycle/project/:id` - Project details
- `/upcycle/workshops` - Upcoming workshops
- `/upcycle/submit` - Submit your project
- `/upcycle/gallery` - Community creations

**Components:**
- `ProjectCard` - Display project
- `WorkshopCard` - Display workshop
- `SubmissionCard` - Display user creation
- `ProjectForm` - Create project form

---

## Integration Points

### With Seva Token System

All centers award Seva tokens for participation:

```typescript
// Award tokens after action
async function awardSevaTokens(
  userId: number,
  amount: number,
  reason: string,
  relatedId?: number
) {
  await db.insert(sevaTransactions).values({
    userId,
    amount,
    type: 'earned',
    reason,
    relatedId,
    createdAt: new Date(),
  });

  // Update user balance
  await db.update(users)
    .set({ sevaTokenBalance: sql`seva_token_balance + ${amount}` })
    .where(eq(users.id, userId));
}
```

### With Email Notifications

Send emails for:
- Repair request matched with volunteer
- Swap event reminder
- Workshop registration confirmation
- Project approved
- Submission got likes

### With Payment System

Upcycle workshops use same payment system as cafe:
- Triple pricing (community/fair/supporter)
- Razorpay integration
- Seva token redemption

---

## Implementation Priority

### Phase 1: Core Functionality (Week 1-2)

1. ✅ Database schema created
2. ✅ Migration generated
3. Create API routes for all centers
4. Enhance existing Repair Cafe page
5. Create Swap marketplace pages
6. Create Upcycle Studio pages

### Phase 2: Advanced Features (Week 3-4)

1. Volunteer matching algorithm
2. Swap recommendation system
3. Project approval workflow
4. Workshop payment integration
5. Email notifications
6. Image uploads

### Phase 3: Community Features (Week 5-6)

1. User profiles showing contributions
2. Leaderboards (most repairs, swaps, projects)
3. Community forums
4. Success stories
5. Impact metrics dashboard

---

## Success Metrics

### Repair Cafe
- Items repaired per month
- Waste diverted from landfills (kg)
- Volunteer hours contributed
- User satisfaction ratings

### Swap Events
- Items swapped per event
- Money saved by participants
- New connections made
- Return participant rate

### Upcycle Studio
- Projects completed
- Workshops attended
- Materials reused (kg)
- Creative transformations shared

---

## Marketing & Community Building

### Content Ideas

**Repair Cafe:**
- "Repair Story of the Week"
- "Meet Our Volunteers"
- "Before & After Repairs"
- "DIY Repair Tips"

**Swap Events:**
- "Amazing Swaps"
- "Swap Success Stories"
- "What's Hot to Swap"
- "Swap Event Highlights"

**Upcycle Studio:**
- "Project of the Month"
- "Upcycle Inspiration"
- "Workshop Highlights"
- "Community Creations Gallery"

### Social Media

- Share repair success stories
- Highlight creative upcycles
- Promote upcoming events
- Celebrate community impact
- Use hashtags: #FixDontToss #SwapNotShop #UpcycleCreativity

---

## Next Steps

1. **Run database migration**
   ```bash
   pnpm drizzle-kit push
   ```

2. **Create API routes** (in progress)

3. **Enhance frontend pages**

4. **Test all functionality**

5. **Seed sample data**

6. **Launch beta**

7. **Gather feedback**

8. **Iterate and improve**

---

## Technical Notes

### Database Indexes

Add indexes for performance:

```sql
-- Repair requests
CREATE INDEX idx_repair_requests_user ON repair_requests(user_id);
CREATE INDEX idx_repair_requests_status ON repair_requests(status);
CREATE INDEX idx_repair_requests_event ON repair_requests(event_id);

-- Swap items
CREATE INDEX idx_swap_items_user ON swap_items(user_id);
CREATE INDEX idx_swap_items_status ON swap_items(status);
CREATE INDEX idx_swap_items_category ON swap_items(category);

-- Upcycle projects
CREATE INDEX idx_upcycle_projects_author ON upcycle_projects(author_id);
CREATE INDEX idx_upcycle_projects_approved ON upcycle_projects(is_approved);
CREATE INDEX idx_upcycle_projects_category ON upcycle_projects(category);
```

### Caching Strategy

Cache frequently accessed data:
- Upcoming events (1 hour TTL)
- Popular projects (30 minutes TTL)
- Available swap items (15 minutes TTL)

### Image Storage

Use same S3/Cloudinary setup as cafe:
- Repair request photos
- Swap item photos
- Upcycle before/after photos
- Workshop materials photos

---

**Status**: ✅ Database schema complete, API routes in progress  
**Next**: Complete API implementation and frontend enhancement

**Last updated**: November 9, 2025
