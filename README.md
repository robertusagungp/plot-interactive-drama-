# PLOT — Vertical Interactive Visual Drama Platform

> **Your story. Your choice.**

**PLOT** is a production-quality, mobile-first web platform for interactive visual novels and romantic dramas. It combines static character artwork, dynamic scene backgrounds, browser-based animations, Web Audio sound synthesis, branching dialogue, relationship tracking, double-currency wallet mechanics, episode unlocking, daily streak rewards, multiple replayable endings, and a comprehensive CMS admin suite.

---

## 📱 Product Highlights

- **Flagship Story Player Engine**:
  - Typed discriminated union story nodes (`DIALOGUE`, `NARRATION`, `CHOICE`, `STAT_CHANGE`, `RELATIONSHIP_CHANGE`, `SCENE_CHANGE`, `MUSIC_CHANGE`, `SFX`, `DELAY`, `JUMP`, `END_EPISODE`, `ENDING`).
  - Branch-and-merge storyline flow with safe condition evaluation (zero `eval()`).
  - Expressive vector character rendering with real-time facial expressions (`normal`, `happy`, `sad`, `angry`, `shocked`, `smirk`, `embarrassed`, `determined`).
  - Layered multi-character scene staging (`left`, `center`, `right`) with Framer Motion transitions.
  - Synthesized Web Audio BGM chords & SFX (heartbeat, gasp, camera click, door slam, coin chime, stat up) with zero external broken links.
  - Global choice aggregation telemetry (*"68% of players made the same choice"*).
  - 4 Unique Endings with celebration confetti, final stats card, and Web Share API.
- **Economic & Progression Layer**:
  - Dual Virtual Currencies: **Coins** (episode unlocks) & **Diamonds** (premium choices).
  - Server-authoritative atomic balance changes with immutable `WalletTransaction` ledgers.
  - 7-Day Daily Reward calendar with streak tracking.
  - Guest Mode: anonymous readers can start free episodes immediately, with seamless progress merging upon account registration.
- **Studio Admin Suite**:
  - Executive Dashboard with real-time conversion funnel and engagement metrics.
  - Visual Block Episode Editor with reordering, choice builder, graph connectivity validation, and live draft preview without publishing.
  - Cast & Asset Manager.
  - User permissions & ADMIN role promotion.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: Strict TypeScript 5
- **Styling**: Tailwind CSS 4 & Vanilla CSS Design Tokens
- **Database & ORM**: PostgreSQL (Production) / SQLite (Zero-config local dev) with Prisma ORM 6.4.1
- **Authentication**: Session & Credential auth + Google OAuth architecture with server-side role validation
- **Animations**: Framer Motion
- **Audio Engine**: Web Audio API Synthesizer & Sound Manager
- **Validation**: Zod 4 Runtime Schema Validation
- **Asset Storage**: Vercel Blob Integration with Local Vector Fallback

---

## 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma         # Prisma data models
│   └── seed.ts               # Complete 10-episode demo seed script
├── src/
│   ├── app/                  # Next.js App Router routes
│   │   ├── (public)/         # Public consumer routes
│   │   │   ├── page.tsx      # Homepage (Trending, Romance, Hero)
│   │   │   ├── discover/     # Filterable discovery catalog
│   │   │   ├── search/       # Debounced search
│   │   │   ├── story/[slug]/ # Story details & episode list
│   │   │   │   └── episode/[episodeNumber]/ # Flagship Story Player
│   │   │   ├── library/      # User library
│   │   │   ├── profile/      # User profile & stats
│   │   │   ├── wallet/       # Vault, packages & transactions
│   │   │   ├── achievements/ # Trophies & reward claiming
│   │   │   └── login/        # Auth & demo logins
│   │   ├── admin/            # Protected Studio CMS
│   │   │   ├── page.tsx      # Executive Dashboard
│   │   │   ├── stories/      # Story management
│   │   │   ├── episodes/[id]/editor/ # Visual Block Node Editor
│   │   │   ├── characters/   # Cast manager
│   │   │   ├── assets/       # Media asset storage
│   │   │   ├── analytics/    # Telemetry funnel
│   │   │   └── users/        # User accounts & role promotion
│   │   ├── api/              # Secure API route handlers
│   │   │   ├── auth/         # Login, register, logout, me
│   │   │   ├── story/        # Progress, choices, unlocking
│   │   │   ├── wallet/       # Daily claim, top-up
│   │   │   └── admin/        # Stories, episodes, analytics, users
│   │   ├── layout.tsx        # Root layout with responsive Navbar & MobileNav
│   │   └── globals.css       # Obsidian & crimson cinematic theme
│   ├── components/           # Modular UI components
│   │   ├── player/           # StoryPlayer, SceneView, DialogueBox, ChoiceOverlay, EndingScreen
│   │   ├── layout/           # Navbar, MobileNav
│   │   ├── story/            # StoryCard, EpisodeList, StoryHero
│   │   ├── wallet/           # DailyRewardModal, WalletModal, TopupClient
│   │   └── admin/            # EpisodeEditor, AdminSidebar, CreateStoryDialog, UserRoleToggle
│   └── lib/                  # Domain services & utilities
│       ├── db.ts             # Prisma singleton
│       ├── auth.ts           # Session & role helper (requireAdmin)
│       ├── motion.ts         # Framer Motion animation presets
│       ├── story-evaluator.ts# Safe condition evaluator (zero eval)
│       ├── art-assets.ts     # Character palettes & scene metadata
│       ├── types/story.ts    # Zod schemas & typed node graph
│       └── services/         # Story, Wallet, Rewards, Achievements, Analytics, Payments, Blob, Audio
└── src/__tests__/            # Unit test suite (Story engine, condition evaluator, wallet)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18.x or later
- npm or pnpm

### 2. Clone and Install Dependencies
```bash
git clone <repository-url>
cd plot
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default local variables:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="plot-super-secret-jwt-session-key-for-development-32chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="PLOT"
NEXT_PUBLIC_ENABLE_DEMO_PURCHASES="true"
```

### 4. Database Setup & Seeding
Push the database schema and seed the 10-episode flagship story (*"I Married My Enemy"*):
```bash
npm run db:push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Unit Tests

Run the domain validation tests (story engine condition evaluation, graph connectivity verification, daily reward schedule, currency integrity):
```bash
npm test
```

---

## 🎭 Accessing Demo & Admin Accounts

The seed script creates pre-configured accounts:

| Role | Email | Password | Initial Balance | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@plot.drama` | `admin123` | 9,999 Coins, 999 Diamonds | Full Studio CMS (`/admin`) |
| **Reader** | `reader@plot.drama` | `reader123` | 150 Coins, 30 Diamonds | Full Story & Unlocks |

*Alternatively, click **"Reader Demo"** or **"Admin Demo"** on the `/login` page for one-click instant sign-in.*

### Promoting an Account to Admin
1. Sign in with the default admin account (`admin@plot.drama`).
2. Navigate to `/admin/users`.
3. Locate the target user and click the role toggle badge to promote from `USER` to `ADMIN`.
*(Role permissions are verified server-side on every admin route and API handler).*

---

## ☁️ Vercel Production Deployment Guide

Deploying PLOT to Vercel is straightforward and production-ready:

### Step 1: Push Repository to GitHub
```bash
git add .
git commit -m "feat: complete PLOT interactive visual drama platform"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New" -> "Project"**.
2. Select your `PLOT` GitHub repository.
3. Framework Preset: **Next.js**.

### Step 3: Connect PostgreSQL Database
1. In your Vercel Project Dashboard, navigate to the **Storage** tab.
2. Click **Create Database** -> select **PostgreSQL** (Vercel Postgres, Neon, or Supabase).
3. Connect the database to your project. This automatically injects `DATABASE_URL` into your environment variables.

### Step 4: Configure Production Environment Variables
In **Project Settings -> Environment Variables**, configure:
- `DATABASE_URL`: `postgres://...` (automatically added by Vercel Postgres)
- `AUTH_SECRET`: Generate a random 32-character secret (e.g. via `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL`: `https://your-plot-app.vercel.app`
- `NEXT_PUBLIC_APP_NAME`: `PLOT`
- `BLOB_READ_WRITE_TOKEN`: *(Optional)* Connect a Vercel Blob store via the Storage tab for media uploads.
- `NEXT_PUBLIC_ENABLE_DEMO_PURCHASES`: `false`

### Step 5: Switch Prisma Provider for PostgreSQL
In `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Run `npx prisma db push` and `npx prisma db seed` on your production database.

### Step 6: Deploy
Click **Deploy**. Vercel will build and deploy your app globally!

---

## 🔐 Security & Deployment Safety

- **Never Expose Secrets**: `DATABASE_URL`, `AUTH_SECRET`, and `BLOB_READ_WRITE_TOKEN` must NEVER have the `NEXT_PUBLIC_` prefix.
- **Server Authoritative Spending**: Wallet balances, unlock deductions, and daily rewards are executed exclusively inside atomic database transactions on the server.
- **Safe Story Conditions**: All branching conditions are parsed with typed Zod schemas. No `eval()` or dynamic code execution is ever performed.
- **Admin Server Guard**: The `requireAdmin()` helper verifies JWT/session credentials against the database on all `/admin/*` routes and `/api/admin/*` endpoints.

---

## 📄 License
© 2026 PLOT Studios. All rights reserved.
