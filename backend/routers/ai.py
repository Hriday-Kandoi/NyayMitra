from fastapi import APIRouter, HTTPException, Header, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from backend.services.ai.gemini import chat_with_gemini
from backend.services.case.ecourts import get_mock_case
from backend.core.config import config
import firebase_admin
from firebase_admin import credentials, auth, firestore

# ============================================================================
# FIREBASE INITIALIZATION
# ============================================================================
FIREBASE_ENABLED = False
if not firebase_admin._apps:
    try:
        if hasattr(config, 'FIREBASE_SERVICE_ACCOUNT_KEY_PATH') and config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH:
            cred = credentials.Certificate(config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
            firebase_admin.initialize_app(cred)
            FIREBASE_ENABLED = True
            print("✓ Firebase Admin SDK initialized successfully")
        else:
            print("⚠ Firebase service account key not configured - using mock mode for auth")
    except Exception as e:
        print(f"⚠ Firebase initialization skipped: {str(e)}")

def get_db():
    """Safe Firestore client getter"""
    if not FIREBASE_ENABLED:
        return None
    try:
        return firestore.client()
    except Exception:
        return None

db = get_db()

# ============================================================================
# ROUTERS
# ============================================================================
# Router for existing eCourts chat endpoint
router = APIRouter(prefix="/ai", tags=["AI"])

# Router for new AI endpoints with user management
api_router = APIRouter(prefix="/api", tags=["AI - User Management"])

# ============================================================================
# PYDANTIC MODELS
# ============================================================================
class Message(BaseModel):
    """Chat message with role and content"""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")

class ChatMessage(BaseModel):
    """Stored chat message in Firestore"""
    id: Optional[str] = Field(None, description="Firestore document ID")
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow, description="When message was sent")

class ChatRequest(BaseModel):
    """Request model for /ai/chat endpoint"""
    message: str = Field(..., description="User message")
    cnr_number: Optional[str] = Field(None, description="Case CNR number for context")
    conversation_history: List[Message] = Field(default_factory=list, description="Previous messages")

class ChatStreamRequest(BaseModel):
    """Request model for /api/chat/stream endpoint"""
    message: str = Field(..., description="User message")
    caseId: str = Field(..., description="Firestore case ID")
    cnr_number: Optional[str] = Field(None, description="Case CNR number for context")
    conversation_history: List[Message] = Field(default_factory=list, description="Previous messages")

class ChatHistoryResponse(BaseModel):
    """Response for chat history"""
    success: bool = Field(..., description="Whether operation was successful")
    count: int = Field(..., description="Number of messages in history")
    data: List[ChatMessage] = Field(default_factory=list, description="List of chat messages")
    error: Optional[str] = Field(None, description="Error message if applicable")

class AIAnalysisResult(BaseModel):
    """AI case analysis result"""
    caseStrength: str = Field(..., description="Assessment of case strength")
    keyLegalIssues: List[str] = Field(..., description="Key legal issues in the case")
    recommendedNextSteps: List[str] = Field(..., description="Recommended next steps")
    estimatedTimeline: str = Field(..., description="Estimated timeline for case resolution")

class AIAnalysisResponse(BaseModel):
    """Response for case analysis"""
    success: bool = Field(..., description="Whether operation was successful")
    analysis: Optional[AIAnalysisResult] = Field(None, description="Analysis result")
    generatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow, description="When analysis was generated")
    error: Optional[str] = Field(None, description="Error message if applicable")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================
async def verify_firebase_token(authorization: Optional[str] = Header(None)) -> str:
    """
    Extract and verify Firebase ID token from Authorization header.
    Returns the user UID if token is valid.
    
    Header format: Authorization: Bearer <id_token>
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required"
        )
    
    try:
        # Extract token from "Bearer <token>" format
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid Authorization header format. Use: Bearer <token>"
            )
        
        id_token = parts[1]
        
        if not FIREBASE_ENABLED:
            raise HTTPException(
                status_code=503,
                detail="Firebase is not configured"
            )
        
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get("uid")
        
        if not uid:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: no UID found"
            )
        
        return uid
    
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or malformed token"
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token verification failed: {str(e)}"
        )

# ============================================================================
# EXISTING ENDPOINTS (eCourts)
# ============================================================================
@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Stream a response from Gemini.
    Optionally grounded in a specific case context.
    """
    if not config.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured"
        )

    case = None
    if request.cnr_number:
        case = get_mock_case(request.cnr_number)

    history = [
        {"role": m.role, "content": m.content}
        for m in request.conversation_history
    ]

    async def generate():
        async for chunk in chat_with_gemini(
            user_message=request.message,
            case=case,
            conversation_history=history
        ):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

# ============================================================================
# NEW ENDPOINTS (User Management)
# ============================================================================
@api_router.get("/chat/history/{caseId}")
async def get_chat_history(
    caseId: str,
    uid: str = Depends(verify_firebase_token)
):
    """
    Fetch chat history for a specific case.
    
    Retrieves all messages from: users/{uid}/cases/{caseId}/messages
    Messages are sorted by timestamp (oldest first).
    
    Raises:
    - 401: Unauthorized if token is invalid
    - 404: Case not found
    - 503: Firestore unavailable
    """
    try:
        if not db:
            raise HTTPException(
                status_code=503,
                detail="Firestore service is unavailable"
            )
        
        # Reference the messages subcollection
        messages_ref = (
            db.collection("users")
            .document(uid)
            .collection("cases")
            .document(caseId)
            .collection("messages")
        )
        
        # Fetch all messages ordered by timestamp
        docs = messages_ref.order_by("timestamp").stream()
        
        messages = []
        for doc in docs:
            if doc.exists:
                data = doc.to_dict()
                messages.append(
                    ChatMessage(
                        id=doc.id,
                        role=data.get("role", ""),
                        content=data.get("content", ""),
                        timestamp=data.get("timestamp")
                    )
                )
        
        return ChatHistoryResponse(
            success=True,
            count=len(messages),
            data=messages
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chat history: {str(e)}"
        )

@api_router.post("/chat/stream")
async def chat_stream(
    request: ChatStreamRequest,
    uid: str = Depends(verify_firebase_token)
):
    """
    Stream a response from Gemini and save both user message and AI response to Firestore.
    
    Saves messages to: users/{uid}/cases/{caseId}/messages
    
    Raises:
    - 401: Unauthorized if token is invalid
    - 503: Firestore unavailable or Gemini API key not configured
    - 500: Internal error during streaming or saving
    """
    if not config.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured"
        )
    
    if not db:
        raise HTTPException(
            status_code=503,
            detail="Firestore service is unavailable"
        )
    
    try:
        # Reference the messages subcollection
        messages_ref = (
            db.collection("users")
            .document(uid)
            .collection("cases")
            .document(request.caseId)
            .collection("messages")
        )
        
        # Save user message to Firestore
        user_message_doc = {
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow()
        }
        messages_ref.add(user_message_doc)
        
        # Get case context if CNR provided
        case = None
        if request.cnr_number:
            case = get_mock_case(request.cnr_number)
        
        # Convert conversation history
        history = [
            {"role": m.role, "content": m.content}
            for m in request.conversation_history
        ]
        
        # Stream response from Gemini and collect full response
        full_response = ""
        
        async def generate():
            nonlocal full_response
            try:
                async for chunk in chat_with_gemini(
                    user_message=request.message,
                    case=case,
                    conversation_history=history
                ):
                    full_response += chunk
                    yield chunk
                
                # After streaming completes, save AI response to Firestore
                ai_message_doc = {
                    "role": "assistant",
                    "content": full_response,
                    "timestamp": datetime.utcnow()
                }
                messages_ref.add(ai_message_doc)
            
            except Exception as e:
                yield f"\n[Error saving to history: {str(e)}]"
        
        return StreamingResponse(
            generate(),
            media_type="text/plain"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat stream failed: {str(e)}"
        )

@api_router.get("/ai/analyze/{caseId}")
async def analyze_case(
    caseId: str,
    uid: str = Depends(verify_firebase_token)
):
    """
    Analyze a case using Gemini AI.
    
    Fetches case details from Firestore and sends to Gemini for analysis.
    Caches the analysis result in: users/{uid}/cases/{caseId}/analysis
    
    Analysis includes:
    - Case strength assessment
    - Key legal issues
    - Recommended next steps
    - Estimated timeline
    
    Raises:
    - 401: Unauthorized if token is invalid
    - 404: Case or analysis not found
    - 503: Firestore unavailable or Gemini API key not configured
    - 500: Internal error during analysis
    """
    if not config.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured"
        )
    
    if not db:
        raise HTTPException(
            status_code=503,
            detail="Firestore service is unavailable"
        )
    
    try:
        # Reference the case document
        case_ref = (
            db.collection("users")
            .document(uid)
            .collection("cases")
            .document(caseId)
        )
        
        case_doc = case_ref.get()
        
        if not case_doc.exists:
            raise HTTPException(
                status_code=404,
                detail=f"Case {caseId} not found"
            )
        
        case_data = case_doc.to_dict()
        
        # Check if analysis is already cached
        analysis_ref = case_ref.collection("analysis").document("current")
        analysis_doc = analysis_ref.get()
        
        if analysis_doc.exists:
            cached_analysis = analysis_doc.to_dict()
            return AIAnalysisResponse(
                success=True,
                analysis=AIAnalysisResult(
                    caseStrength=cached_analysis.get("caseStrength", ""),
                    keyLegalIssues=cached_analysis.get("keyLegalIssues", []),
                    recommendedNextSteps=cached_analysis.get("recommendedNextSteps", []),
                    estimatedTimeline=cached_analysis.get("estimatedTimeline", "")
                ),
                generatedAt=cached_analysis.get("generatedAt")
            )
        
        # Build case context for Gemini
        case_context = f"""
CASE TO ANALYZE:
- Type: {case_data.get('case_type', 'Unknown')}
- CNR: {case_data.get('cnr_number', 'N/A')}
- Filing Number: {case_data.get('filing_number', 'N/A')}
- Filing Date: {case_data.get('filing_date', 'N/A')}
- Court: {case_data.get('court_name', 'Unknown')}
- Petitioner: {case_data.get('petitioner', 'Unknown')}
- Respondent: {case_data.get('respondent', 'Unknown')}
- Status: {case_data.get('status', 'Unknown')}
- Next Hearing: {case_data.get('next_hearing_date', 'Not scheduled')}
- Notes: {case_data.get('notes', 'None')}

Please analyze this Indian court case and provide:
1. Case strength assessment (strong/moderate/weak with explanation)
2. Key legal issues (list of 3-5 main issues)
3. Recommended next steps (actionable steps for the petitioner/respondent)
4. Estimated timeline (rough estimate for case resolution)

Format your response as JSON with keys: caseStrength, keyLegalIssues (array), recommendedNextSteps (array), estimatedTimeline.
This is legal information only, not legal advice."""
        
        # Get analysis from Gemini
        full_response = ""
        async for chunk in chat_with_gemini(
            user_message=case_context,
            case=None,
            conversation_history=[]
        ):
            full_response += chunk
        
        # Parse the response (assumes JSON format)
        import json
        try:
            analysis_data = json.loads(full_response)
        except json.JSONDecodeError:
            # If response is not JSON, extract information manually
            analysis_data = {
                "caseStrength": "Unable to parse",
                "keyLegalIssues": ["See raw analysis"],
                "recommendedNextSteps": ["Consult with a lawyer"],
                "estimatedTimeline": "Unknown"
            }
        
        # Ensure all required fields exist
        analysis_result = AIAnalysisResult(
            caseStrength=analysis_data.get("caseStrength", "Moderate"),
            keyLegalIssues=analysis_data.get("keyLegalIssues", []),
            recommendedNextSteps=analysis_data.get("recommendedNextSteps", []),
            estimatedTimeline=analysis_data.get("estimatedTimeline", "6-12 months")
        )
        
        # Cache the analysis in Firestore
        now = datetime.utcnow()
        cache_data = {
            "caseStrength": analysis_result.caseStrength,
            "keyLegalIssues": analysis_result.keyLegalIssues,
            "recommendedNextSteps": analysis_result.recommendedNextSteps,
            "estimatedTimeline": analysis_result.estimatedTimeline,
            "generatedAt": now,
            "caseId": caseId
        }
        analysis_ref.set(cache_data)
        
        return AIAnalysisResponse(
            success=True,
            analysis=analysis_result,
            generatedAt=now
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Case analysis failed: {str(e)}"
        )