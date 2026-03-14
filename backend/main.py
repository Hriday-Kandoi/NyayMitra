from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import case, ai

load_dotenv()

app = FastAPI(
    title="NyayMitra API",
    description="AI-powered legal intelligence for Indian citizens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(case.router)
app.include_router(ai.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "NyayMitra API"}