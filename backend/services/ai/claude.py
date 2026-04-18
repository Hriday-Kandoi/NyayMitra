import anthropic
from backend.core.config import config
from backend.models.case import CaseResponse
from typing import Optional, AsyncGenerator

client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """You are NyayMitra, a knowledgeable Indian legal information assistant. 
You help ordinary Indian citizens understand their legal situation, rights, and options.

Your rules:
- Explain legal concepts in simple, clear language — Hindi or English based on the user
- Always cite specific IPC, CPC, CrPC sections or real court judgments when relevant
- Never give legal advice — give legal information only
- Always end responses with: "This is legal information, not legal advice. Please consult a licensed advocate for your specific situation."
- Be empathetic — most users are stressed and confused about their legal situation
- Keep responses concise and actionable

You are NOT a licensed advocate. You help people understand, not represent them."""

def build_case_context(case: CaseResponse) -> str:
    return f"""
ACTIVE CASE CONTEXT:
- Case: {case.case_type} | {case.filing_number}
- Court: {case.court_name}
- Judge: {case.judge_name or 'Not assigned'}
- Petitioner: {case.petitioner}
- Respondent: {case.respondent}
- Status: {case.status}
- Next Hearing: {case.next_hearing_date or 'Not scheduled'}
- Last Order: {case.last_order or 'None'}
"""

async def chat_with_claude(
    user_message: str,
    case: Optional[CaseResponse] = None,
    conversation_history: list = []
) -> AsyncGenerator[str, None]:
    """
    Stream a response from Claude Opus with optional case context.
    """
    system = SYSTEM_PROMPT
    if case:
        system += build_case_context(case)

    messages = conversation_history + [
        {"role": "user", "content": user_message}
    ]

    with client.messages.stream(
        model="claude-opus-4-6",
        max_tokens=1024,
        system=system,
        messages=messages
    ) as stream:
        for text in stream.text_stream:
            yield text