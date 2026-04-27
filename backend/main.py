from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.routers import case, ai, auth, marketplace

load_dotenv()

app = FastAPI(
    title="NyayMitra API",
    description="AI-powered legal intelligence for Indian citizens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
# eCourts & Case lookup
app.include_router(case.router)
# User case management (CRUD)
app.include_router(case.api_router)
# AI chat (existing)
app.include_router(ai.router)
# AI chat history, streaming, analysis (new)
app.include_router(ai.api_router)
# Authentication
app.include_router(auth.router)
# Marketplace
app.include_router(marketplace.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "NyayMitra API"}