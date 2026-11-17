# QuoteFlow – Quote Generator with History

> **Discover Inspiration. Save Every Thought.**  
> *Words That Inspire. Moments Worth Remembering.*

QuoteFlow is a full-stack, production-quality SaaS web application designed to fetch inspirational, motivational, philosophical, and life quotes from external APIs in real-time, render them in an interface, and automatically persist every successfully generated quote into MongoDB.

---

## 🌟 Key Features

### 1. External Quote API Integration with Cascading Fallback
- **Multi-Provider Architecture**:
  - **Primary**: Quotable API (`https://api.quotable.io/random`)
  - **Fallback 1**: DummyJSON Quotes API (`https://dummyjson.com/quotes/random`)
  - **Fallback 2**: ZenQuotes API (`https://zenquotes.io/api/random` & `/today`)
  - **Fallback 3**: Curated inspirational repository for zero-downtime offline resilience.
- **Dynamic Category Detection**: Automatic categorization and semantic tag extraction based on content when not supplied by the provider.
- **Duplicate Detection**: Configurable duplicate detection window prevents saving redundant quotes repeatedly.

### 2. Automatic MongoDB Persistence & History
- Every generated quote is automatically stored in MongoDB using Mongoose.
- Full persistent history that survives page reloads and browser sessions.
- Detailed metadata: quote text, author, category, tags, source provider, timestamps, and favourite status.

### 3. Advanced Search, Filtering, and Sorting
- **Multi-field Search**: Search simultaneously across quote content and author names.
- **Category Filter**: Filter by Motivation, Wisdom, Success, Life, Philosophy, Courage, Happiness, or All.
- **Sorting Modes**: Newest first, Oldest first, Author alphabetical (A-Z), and Quote length.
- **Starred Favourites Filter**: One-click toggle to view only favourited quotes.
- **Pagination & Limits**: Clean pagination controls with total count indicators.

### 4. Interactive Quote Studio (Generate Page)
- Primary quote card with typography (`Playfair Display`), author avatar pill, and category badges.
- Smooth card animations via **Framer Motion**.
- Celebratory confetti bursts powered by `canvas-confetti` when starring or generating quotes.
- Prevent duplicate requests with animated loading spinners and shimmer skeletons.

### 5. Favourites & Personal Collection
- Dedicated Favourites page (`/favourites`) to curate personal thoughts.
- Add or remove favourites with one click from anywhere in the app.
- Search within saved favourites.

### 6. Share & Export Capabilities
- **Social Sharing Modal**: Instant share intents for Twitter / X, WhatsApp, LinkedIn, and Native System Share (`navigator.share`).
- **Share as Image Studio**: Render any quote onto an HTML5 Canvas and download a 1200x700 PNG card with 4 customizable gradient themes (*Cosmic Indigo*, *Sunset Radiance*, *Deep Forest*, *Midnight Noir*).
- **Data Portability**: Full data export in **CSV** (for spreadsheets) or **JSON** (for developers and backups).

### 7. Dashboard Analytics
- Key Metric Cards:
  - Total Quotes Generated (All time)
  - Favourite Quotes (Curated)
  - Quotes Generated Today (Daily cadence)
  - Unique Authors Discovered
- **7-Day Trend Chart**: Responsive area chart visualizing quote generation over time using **Recharts**.
- **Category Breakdown**: Progress metrics illustrating top discovered categories.
- **Quote of the Day**: Daily inspirational quote featured banner with quick copy and share.

### 8. Premium SaaS UI & Design System
- Built with **Tailwind CSS**.
- **Color Palette**:
  - Primary: Deep Indigo (`#4338CA`)
  - Secondary: Violet (`#7C3AED`)
  - Light Background: Light Gray (`#F8FAFC`)
  - Cards: Pure White (`#FFFFFF`) / Slate 900 (`#0F172A`)
  - Accent: Soft Purple (`#EDE9FE`)
- **Light & Dark Mode**: Persistent theme toggle synced to `localStorage` and OS preference.
- **Global Keyboard Shortcuts**:
  - `Space` or `G` — Generate new random quote
  - `C` — Copy active quote to clipboard
  - `F` — Toggle favourite status
  - `D` — Toggle Dark / Light mode
  - `/` — Focus global search bar
  - `Esc` — Close open modal dialogs

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, Framer Motion, Recharts, Canvas Confetti |
| **Backend** | Node.js (v20+), Express.js, REST API architecture, Helmet, CORS, Morgan, Express Rate Limit |
| **Database** | MongoDB, Mongoose ODM, Embedded MongoDB Memory Server (auto-fallback for zero-config local dev) |
| **APIs** | Quotable, DummyJSON, ZenQuotes |

---

## 📁 Project Structure

```
quoteflow/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AnalyticsChart.jsx      # 7-day activity & category chart
│   │   │   ├── ConfirmationModal.jsx   # Deletion / clear history modal
│   │   │   ├── EmptyState.jsx          # Friendly empty state with CTA
│   │   │   ├── FilterDropdown.jsx      # Category & sort dropdowns
│   │   │   ├── Footer.jsx              # Landing & app footer
│   │   │   ├── HistoryCard.jsx         # Card for history & favourites
│   │   │   ├── LoadingSkeleton.jsx     # Shimmer skeletons
│   │   │   ├── Navbar.jsx              # Landing page navigation
│   │   │   ├── QuoteCard.jsx           # Hero quote display card
│   │   │   ├── QuoteImageModal.jsx     # HTML5 Canvas image generator
│   │   │   ├── SearchBar.jsx           # Debounced search input
│   │   │   ├── ShareModal.jsx          # Social & system sharing dialog
│   │   │   ├── Sidebar.jsx             # SaaS dashboard navigation
│   │   │   ├── StatisticsCard.jsx      # KPI dashboard metric cards
│   │   │   └── ThemeToggle.jsx         # Light / Dark theme toggle
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx        # Dark/Light mode state provider
│   │   │   └── ToastContext.jsx        # Animated floating toast notifications
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx     # Sidebar, Header & Hotkey wrapper
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx       # Overview, KPIs, chart & daily quote
│   │   │   ├── FavouritesPage.jsx      # Curated favourite quotes collection
│   │   │   ├── GeneratePage.jsx        # Primary quote generator studio
│   │   │   ├── HistoryPage.jsx         # Searchable, filterable quote history
│   │   │   ├── LandingPage.jsx         # Public marketing landing page
│   │   │   ├── NotFoundPage.jsx        # Custom 404 page
│   │   │   └── SettingsPage.jsx        # Preferences, data export & hotkeys
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with interceptors
│   │   ├── App.jsx                     # Route configurations
│   │   ├── index.css                   # Tailwind directives & custom styles
│   │   └── main.jsx                    # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js                       # Mongoose connection & embedded Mongo fallback
│   ├── controllers/
│   │   └── quoteController.js          # REST endpoint handlers
│   ├── middleware/
│   │   ├── errorHandler.js             # Centralized error & 404 handling
│   │   └── rateLimiter.js              # Express rate limiting
│   ├── models/
│   │   └── Quote.js                    # Mongoose schema, hashes & indexes
│   ├── routes/
│   │   └── quoteRoutes.js              # Express REST routes
│   ├── services/
│   │   └── quoteService.js             # External API integration with fallback
│   ├── utils/
│   │   └── exportHelper.js             # CSV & JSON formatting helper
│   ├── .env.example
│   ├── package.json
│   ├── server.js                       # Express application server
│   ├── test-api.js                     # Backend integration test suite
│   └── test-e2e.js                     # Full E2E REST API test suite
│
├── package.json                        # Root package with multi-tier scripts
└── README.md
```

---

## 🗄️ Database Schema (Mongoose)

Collection: `quotes`

| Field | Type | Attributes | Description |
|---|---|---|---|
| `content` | String | Required, Trim | Full quote text |
| `author` | String | Required, Trim, Default: 'Unknown' | Author or attribution |
| `category` | String | Indexed, Default: 'General' | Primary category tag |
| `tags` | [String] | Indexed, Default: [] | Descriptive keywords |
| `isFavourite` | Boolean | Indexed, Default: false | Starred status |
| `source` | String | Default: 'quotable' | External API provider name |
| `externalQuoteId`| String | Optional | ID from source provider |
| `contentHash` | String | Indexed | Fast deduplication hash |
| `createdAt` | Date | Indexed, Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Modification timestamp |

**Indexes created**:
- Text index: `{ content: 'text', author: 'text' }` for fast full-text searching.
- Compound indexes: `{ isFavourite: 1, createdAt: -1 }`, `{ category: 1, createdAt: -1 }`.
- Single index: `{ createdAt: -1 }` for reverse chronological history pagination.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Installation
Clone the repository and install all dependencies:

```bash
# Install both backend and frontend dependencies
npm --prefix server install
npm --prefix client install
```

### 2. Environment Configuration
Create a `.env` file inside `server/` (or copy from `.env.example`):

```bash
cp server/.env.example server/.env
```

Default `server/.env`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=
CLIENT_URL=http://localhost:5173
API_TIMEOUT_MS=6000
DUPLICATE_WINDOW_SECONDS=86400
```

> **💡 Zero-Config MongoDB**: If `MONGODB_URI` is left blank or a local MongoDB server is not running, QuoteFlow automatically boots an embedded **MongoMemoryServer** for effortless local testing. To connect to MongoDB Atlas, simply paste your connection string into `MONGODB_URI`.

### 3. Running in Development Mode

Run backend and frontend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1: Backend server on http://localhost:5001
npm run dev:server

# Terminal 2: Frontend client on http://localhost:5173
npm run dev:client
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Testing

QuoteFlow includes automated test suites:

```bash
# Run backend database & service integration test
npm run test:backend

# Run full end-to-end REST API verification suite
node server/test-e2e.js
```

Both tests verify:
- External API fetching with graceful fallback
- Database connection & indexing
- Quote generation, deduplication, and persistence
- Favourites toggling & querying
- Multi-field search
- Statistics and 7-day timeline aggregation
- CSV and JSON export formatting
- Single quote deletion & history clearing

---

## 📡 REST API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/health` | Service health status | - |
| `POST` | `/quotes/generate` | Generate quote & save to DB | Body: `{ "category": "Wisdom" }` |
| `GET` | `/quotes` | List paginated history | `search`, `author`, `category`, `sort`, `page`, `limit`, `isFavourite` |
| `GET` | `/quotes/:id` | Get single quote by ID | - |
| `PATCH`| `/quotes/:id/favourite`| Toggle or set favourite | Body (opt): `{ "isFavourite": true }` |
| `DELETE`| `/quotes/:id` | Delete quote by ID | - |
| `DELETE`| `/quotes` | Clear quote history | `keepFavourites=true` (optional) |
| `GET` | `/quotes/favourites` | List all favourite quotes | `search`, `sort` |
| `GET` | `/quotes/stats` | Dashboard metrics & timeline | - |
| `GET` | `/quotes/daily` | Fetch Quote of the Day | - |
| `GET` | `/quotes/export` | Download CSV or JSON file | `format=csv\|json`, `filter=all\|favourites` |

### Sample Response: `POST /api/quotes/generate`
```json
{
  "success": true,
  "message": "Quote generated and saved successfully",
  "data": {
    "id": "6afc68e84064b63ef774ad31",
    "content": "Your worst enemy is hiding within yourself, and that enemy is your anger and greed.",
    "author": "Rumi",
    "category": "Wisdom",
    "tags": ["wisdom"],
    "isFavourite": false,
    "source": "dummyjson",
    "externalQuoteId": "842",
    "createdAt": "2026-11-17T14:46:32.491Z",
    "updatedAt": "2026-11-17T14:46:32.491Z"
  },
  "isDuplicate": false,
  "savedNew": true
}
```

---

## ☁️ Deployment Guide

### Option A: MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Under **Database Access**, create a user with read and write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect** > **Drivers** > copy the connection string.
6. Set `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/quoteflow?retryWrites=true&w=majority` in your server environment variables.

### Option B: Backend Deployment on Render
1. Push code to your GitHub repository.
2. In [Render Dashboard](https://dashboard.render.com), create a **New Web Service**.
3. Connect your repository.
4. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGODB_URI=<Your MongoDB Atlas connection string>`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`

### Option C: Frontend Deployment on Vercel
1. In [Vercel Dashboard](https://vercel.com), import your repository.
2. Set:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. If hosting backend separately on Render, update `client/src/services/api.js` `baseURL` to `https://your-backend-api.onrender.com/api` (or configure a rewrite in `vercel.json`).

### Option D: Unified Single-Service Deployment
QuoteFlow is already pre-configured to serve the compiled frontend (`client/dist`) directly through Express in production:
```bash
npm run build
npm start
```
This runs the full-stack application on a single port for easy deployment on Render, Railway, DigitalOcean, or Docker!

---

## 📄 License
This project is licensed under the ISC License.
