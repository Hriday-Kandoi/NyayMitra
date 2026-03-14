from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from services.ai.claude import chat_with_claude
from services.case.ecourts import get_mock_case
from core.config import config

router = APIRouter(prefix="/ai", tags=["AI"])

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    cnr_number: Optional[str] = None
    conversation_history: List[Message] = []

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Stream a response from Claude Opus.
    Optionally grounded in a specific case context.
    """
    if not config.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Anthropic API key not configured"
        )

    case = None
    if request.cnr_number:
        case = get_mock_case(request.cnr_number)

    history = [
        {"role": m.role, "content": m.content}
        for m in request.conversation_history
    ]

    async def generate():
        async for chunk in chat_with_claude(
            user_message=request.message,
            case=case,
            conversation_history=history
        ):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )