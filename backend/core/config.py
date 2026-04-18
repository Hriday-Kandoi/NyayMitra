import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Firebase
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_CLIENT_EMAIL: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    FIREBASE_PRIVATE_KEY: str = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")

    # Legal APIs
    ECOURTS_API_KEY: str = os.getenv("ECOURTS_API_KEY", "")
    INDIANKANOON_API_TOKEN: str = os.getenv("INDIANKANOON_API_TOKEN", "")

    # App
    API_URL: str = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
    ENV: str = os.getenv("NODE_ENV", "development")

    @property
    def is_development(self) -> bool:
        return self.ENV == "development"

config = Config()