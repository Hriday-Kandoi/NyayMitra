
# NyayMitra
### AI-Powered Legal Intelligence for Indian Citizens

NyayMitra helps ordinary Indians understand their legal cases, know their rights, and navigate the court system — without needing a lawyer for every question.

## What it does
- Track your case status live from eCourts (all High Courts + Supreme Court)
- Chat with an AI legal advisor powered by Claude Opus
- Get relevant court precedents from IndianKanoon automatically
- Upload legal documents (FIR, summons, notices) and get plain-language summaries
- Receive hearing date reminders via WhatsApp and SMS

## Tech Stack
- **Frontend** — Next.js 14, React, Tailwind CSS
- **Backend** — FastAPI (Python)
- **AI** — Claude Opus (claude-opus-4-6) by Anthropic
- **Database** — Firebase Firestore
- **Legal Data** — eCourts NJDG API + IndianKanoon

## Getting Started
```bash
# Clone the repo
git clone https://github.com/Hriday-Kandoi/NyayMitra.git
cd NyayMitra

# Copy environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# Start frontend
cd frontend && npm install && npm run dev

# Start backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```

## License
MIT — free to use, modify, and deploy including for legal aid organizations.