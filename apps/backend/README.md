# 🎙️ Vox Backend

Voice-to-website backend with AI-powered intent extraction and guest user support.

## 🚀 Features

- **🎤 Multilingual Voice Processing** - Supports 36+ languages with automatic detection
- **🌍 Smart Translation** - Auto-translates to English only when needed
- **🧠 AI Intent Extraction** - Structured website content from natural speech
- **👤 Guest User System** - Seamless guest → registered user flow
- **⚡ Production-Ready** - Type-safe, error handling, logging, graceful shutdown

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VOICE PROCESSING FLOW                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Frontend → POST /api/guest/create                       │
│     └─ Creates User (isGuest: true)                         │
│     └─ Creates empty Website                                │
│     └─ Returns: { userId, websiteId, slug }                 │
│                                                              │
│  2. User Records Voice → POST /api/voice/process            │
│     └─ Deepgram: Transcribe (auto-detect language)          │
│     └─ OpenAI: Translate (only if non-English)              │
│     └─ OpenAI: Extract Intent (JSON mode, GPT-4o-mini)      │
│     └─ Returns: { intent, detectedLanguage, steps }         │
│                                                              │
│  3. Frontend Renders Preview → POST /api/website/save       │
│     └─ Updates Website with layout & content                │
│     └─ Returns: { slug, url, ... }                          │
│                                                              │
│  4. GET /api/website/:slug → Fetch for rendering            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Prisma ORM)
- **Speech-to-Text:** Deepgram (36+ languages)
- **AI:** OpenAI GPT-4o-mini (translation + intent)
- **Deployment:** Railway (backend) + Vercel (frontend)

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Deepgram API key
- OpenAI API key

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your credentials
nano .env

# 4. Generate Prisma client
npm run prisma:generate

# 5. Push database schema
npm run prisma:push

# 6. Start development server
npm run dev
```

## 🔑 Environment Variables

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host:5432/vox_db"

# Server
PORT=3000
NODE_ENV=development

# Deepgram (Speech-to-Text)
DEEPGRAM_API_KEY="your_key_here"

# OpenAI (Translation + Intent)
OPENAI_API_KEY="your_key_here"

# Frontend URL (CORS)
FRONTEND_URL="http://localhost:5173"

# Public Base URL
PUBLIC_BASE_URL="https://your-app.vercel.app"
```

## 📡 API Endpoints

### 1. Create Guest User

```http
POST /api/guest/create
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "clx123...",
    "websiteId": "clx456...",
    "slug": "vox-a7f3b2"
  }
}
```

### 2. Process Voice

```http
POST /api/voice/process
Content-Type: multipart/form-data
```

**Body:**

- `audio`: Audio file (webm, wav, mp3, etc.)
- `userId`: User ID from guest creation
- `websiteId`: Website ID from guest creation

**Response:**

```json
{
  "success": true,
  "data": {
    "intent": {
      "businessType": "restaurant",
      "sections": ["Hero", "About", "Menu", "Contact"],
      "content": {
        "heroHeadline": "Best Pizza in Town",
        "about": "Family-owned since 1995...",
        "productsOrServices": ["Margherita", "Pepperoni"],
        "contact": {
          "phone": "+1234567890"
        }
      }
    },
    "detectedLanguage": "en",
    "processingSteps": {
      "transcription": true,
      "translation": false,
      "intentExtraction": true
    }
  }
}
```

### 3. Save Website

```http
POST /api/website/save
Content-Type: application/json
```

**Body:**

```json
{
  "userId": "clx123...",
  "websiteId": "clx456...",
  "title": "Joe's Pizza",
  "layout": [...],
  "content": {...}
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clx456...",
    "slug": "vox-a7f3b2",
    "title": "Joe's Pizza",
    "url": "https://your-app.vercel.app/vox-a7f3b2",
    "layoutJson": [...],
    "content": {...},
    "createdAt": "2024-02-07T...",
    "updatedAt": "2024-02-07T..."
  }
}
```

### 4. Get Website by Slug

```http
GET /api/website/:slug
```

**Response:** Same as save response

### 5. Get User's Websites

```http
GET /api/website/user/:userId
```

**Response:**

```json
{
  "success": true,
  "data": [...websites],
  "count": 3
}
```

## 🧪 Testing

# use curl

curl -X POST http://localhost:3000/api/guest/create

```

## 🚀 Deployment to Railway

### 1. Connect Repository

1. Go to [Railway](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select this repository

### 2. Add Environment Variables

Add all variables from `.env.example` to Railway dashboard

### 3. Add PostgreSQL Database

1. Click "New" → Database → PostgreSQL
2. Railway auto-generates `DATABASE_URL`
3. Copy it to your environment variables

### 4. Deploy

Railway auto-deploys on push. Monitor logs in dashboard.

## 📁 Project Structure

```

vox-backend/
├── src/
│ ├── controllers/ # Request handlers
│ │ ├── guest.controller.ts
│ │ ├── voice.controller.ts
│ │ └── website.controller.ts
│ ├── services/ # Business logic
│ │ ├── guest.service.ts
│ │ ├── voice.service.ts
│ │ └── website.service.ts
│ ├── routes/ # API routes
│ │ ├── guest.routes.ts
│ │ ├── voice.routes.ts
│ │ └── website.routes.ts
│ ├── lib/ # External clients
│ │ ├── deepgram.ts
│ │ └── openai.ts
│ ├── middleware/ # Express middleware
│ │ ├── upload.middleware.ts
│ │ └── error.middleware.ts
│ ├── utils/ # Utilities
│ │ └── slug.utils.ts
│ ├── types/ # TypeScript types
│ │ └── index.ts
│ ├── db/ # Database
│ │ └── prisma.ts
│ └── server.ts # Main entry point
├── prisma/
│ └── schema.prisma # Database schema
├── package.json
├── tsconfig.json
└── README.md

````

## 🔧 Development Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npm run prisma:generate   # Generate Prisma client
npm run prisma:push       # Push schema to database
npm run prisma:studio     # Open Prisma Studio GUI
````

## 🐛 Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed description"
}
```

**Common Errors:**

- `400` - Validation error (missing fields, invalid format)
- `403` - Invalid user (not a guest or doesn't exist)
- `404` - Resource not found (website, user)
- `500` - Server error
- `503` - External service error (Deepgram, OpenAI)

## 🎯 Key Design Decisions

### Why Option B for Guest Creation?

**Option B (Auto-create during voice processing)** was chosen because:

- ✅ Better UX - User doesn't wait upfront
- ✅ Fewer API calls - Frontend simpler
- ✅ Lower abandonment - No commitment until they record

### Why 2-Step Save?

**Separate `/process-voice` and `/save`** allows:

- ✅ Preview before commit
- ✅ Frontend can modify AI output
- ✅ User can re-record without DB writes

### Why `vox-{nanoid}` Slugs?

- ✅ Brand consistency
- ✅ Short and memorable
- ✅ Collision-resistant (nanoid is cryptographically strong)
- ✅ Easy upgrade to `vox-{username}` later

## 📊 Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  email     String?   @unique
  isGuest   Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  websites  Website[]
}

model Website {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  slug       String   @unique
  title      String
  layoutJson Json
  content    Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/vox-backend/issues)
- **Documentation:** See `/docs` folder
- **Email:** your@email.com

---

Built with ❤️ for seamless voice-to-website creation
