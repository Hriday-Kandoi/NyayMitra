# NyayMitra — Project Context File
> Read this entire file before writing any code for this project.

## What is NyayMitra
An AI-powered legal intelligence platform for Indian citizens. It helps users:
- Track their court cases in real-time via eCourts NJDG API
- Chat with an AI legal advisor (Gemini API) grounded in their actual case data
- Get relevant court precedents from IndianKanoon
- Upload legal documents (FIR, summons, notices) and get plain-language summaries
- Receive hearing date reminders via WhatsApp/SMS

## Important Legal Disclaimer
Every AI response in the app must end with:
"This is legal information, not legal advice. Please consult a licensed advocate for your specific situation."

---

## Tech Stack

### Frontend
- Next.js 14 (App Router, NOT Pages Router)
- TypeScript (strict mode)
- Tailwind CSS (no other CSS frameworks)
- lucide-react for icons
- firebase (client SDK) for auth
- axios for API calls to backend

### Backend
- FastAPI (Python 3.11)
- Uvicorn (server)
- Google Generative AI SDK (google-generativeai) — Gemini API
- firebase-admin for Firestore and Auth verification
- httpx for async HTTP calls to eCourts API
- python-dotenv for env variables
- pydantic v2 for request/response models

### AI
- Model: gemini-2.0-flash (primary, fast and free)
- Model: gemini-2.0-pro (fallback for complex legal reasoning)
- RAG: FAISS + sentence-transformers for precedent retrieval
- IndianKanoon API for legal corpus

### Database
- Firebase Firestore (user profiles, case cache, alerts)
- Firebase Auth (Google OAuth + Phone OTP)
- Firebase Storage (uploaded legal documents)

### External APIs
- eCourts NJDG API (case status, hearing dates)
- IndianKanoon REST API (court judgments and precedents)

---

## Brand Colors
- Navy: #1A2744 (primary background, navbar, footer)
- Saffron: #E07B39 (accent, buttons, highlights)
- White: #FFFFFF (cards, content areas)
- Light Navy: #EEF1F8 (secondary backgrounds)
- Muted: #6B7A9A (secondary text)

---

## Folder Structure
```
NyayMitra/
├── frontend/
│   └── src/
│       ├── app/                     ← Next.js pages (App Router)
│       │   ├── (auth)/              ← login, register pages
│       │   ├── dashboard/           ← user dashboard
│       │   ├── case/                ← case tracking page
│       │   ├── chat/                ← AI advisor chat
│       │   ├── documents/           ← document upload
│       │   └── api/                 ← Next.js route handlers
│       ├── components/
│       │   ├── ui/                  ← Button, Input, Card, Modal, Badge
│       │   ├── layout/              ← Navbar, Footer, Sidebar
│       │   ├── case/                ← CaseCard, CaseTimeline, HearingBadge
│       │   ├── ai/                  ← ChatWindow, MessageBubble, StreamingText
│       │   ├── documents/           ← DocumentUploader, DocumentSummary
│       │   ├── alerts/              ← AlertSettings, HearingReminderCard
│       │   └── lawyers/             ← LawyerCard, BookingModal
│       └── lib/
│           ├── api/                 ← functions that call backend
│           ├── hooks/               ← useCase, useChat, useAuth
│           ├── utils/               ← formatDate, truncate, cn
│           └── types/               ← TypeScript interfaces
│
├── backend/
│   ├── main.py                      ← FastAPI app entry point
│   ├── routers/
│   │   ├── case.py                  ← /case endpoints
│   │   ├── ai.py                    ← /ai endpoints
│   │   ├── documents.py             ← /documents endpoints
│   │   └── alerts.py                ← /alerts endpoints
│   ├── services/
│   │   ├── ai/
│   │   │   └── gemini.py            ← Gemini API integration
│   │   ├── case/
│   │   │   └── ecourts.py           ← eCourts API + mock data
│   │   ├── ml/                      ← outcome predictor, doc classifier
│   │   ├── documents/               ← OCR, PDF parsing
│   │   └── alerts/                  ← notification scheduling
│   ├── models/
│   │   ├── case.py                  ← CaseResponse, HearingDate pydantic models
│   │   ├── ai.py                    ← ChatRequest, ChatResponse models
│   │   └── user.py                  ← UserProfile model
│   └── core/
│       ├── config.py                ← loads all env variables
│       └── firebase.py              ← Firebase Admin SDK init
```

---

## Environment Variables
```
GEMINI_API_KEY=
FIREBASE_PROJECT_ID=nyaymitra-29825
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nyaymitra-29825
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ECOURTS_API_KEY=
INDIANKANOON_API_TOKEN=
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

---

## Coding Conventions

### Frontend
- All components use "use client" only when they need state or browser APIs
- Server components by default — add "use client" only when necessary
- Import alias: @/* maps to src/*
- Component files: PascalCase (CaseCard.tsx)
- Hook files: camelCase starting with use (useCase.ts)
- Utility files: camelCase (formatDate.ts)
- All API calls go through lib/api/ — never call backend directly from components
- Use TypeScript interfaces from lib/types/ — never use `any`

### Backend
- All routes use async/await
- All request/response shapes defined as Pydantic models in models/
- Business logic lives in services/ — never in routers/
- Routers only import from services/ and models/
- Config loaded only from core/config.py — never use os.getenv directly in other files
- All Gemini API calls live in services/ai/gemini.py only

### Git
- Commit message format: feat:, fix:, chore:, refactor:
- Never commit .env or .env.local
- Branch: main only for now

---

## What's Already Built

### Backend (complete)
- main.py — FastAPI app with CORS, routers registered
- core/config.py — loads all env vars (currently set up for Anthropic — needs updating to Gemini)
- models/case.py — CaseResponse, HearingDate, CaseSearchRequest, CaseSearchResponse
- services/case/ecourts.py — eCourts API integration + get_mock_case() for development
- routers/case.py — GET /case/{cnr_number}, POST /case/search
- routers/ai.py — POST /ai/chat (currently uses Anthropic SDK — needs updating to Gemini)
- services/ai/claude.py — EXISTS but needs to be REPLACED with gemini.py

### Frontend (complete)
- src/app/layout.tsx — root layout with Navbar
- src/app/page.tsx — homepage (hero, features, footer)
- src/components/layout/Navbar.tsx — responsive navbar

### Needs to be built (in order)
1. backend/core/config.py — add GEMINI_API_KEY
2. backend/services/ai/gemini.py — replace claude.py with Gemini
3. backend/routers/ai.py — update to use gemini.py
4. frontend/src/lib/types/index.ts — all TypeScript types
5. frontend/src/lib/api/case.ts — frontend API calls for case
6. frontend/src/lib/api/chat.ts — frontend API calls for AI chat
7. frontend/src/app/case/page.tsx — case tracking page
8. frontend/src/app/chat/page.tsx — AI advisor chat page
9. frontend/src/components/case/CaseCard.tsx
10. frontend/src/components/ai/ChatWindow.tsx