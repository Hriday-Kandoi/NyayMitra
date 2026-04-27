from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from backend.models.case import CaseSearchRequest, CaseSearchResponse, CaseResponse, HearingDate
from backend.services.case.ecourts import fetch_case_by_cnr, get_mock_case
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
# Router for existing eCourts lookup endpoints
ecourts_router = APIRouter(prefix="/case", tags=["Case - eCourts Lookup"])

# Router for new user case management endpoints
api_router = APIRouter(prefix="/api/cases", tags=["Case - User Management"])

# ============================================================================
# PYDANTIC MODELS (User-Saved Cases)
# ============================================================================
class UserCase(BaseModel):
    """
    Represents a case saved/tracked by a user.
    Stored in Firestore at: users/{uid}/cases/{caseId}
    """
    id: Optional[str] = Field(None, description="Firestore document ID (auto-generated)")
    cnr_number: str = Field(..., description="CNR number of the case")
    case_type: str = Field(..., description="Type of case (Criminal, Civil, etc.)")
    filing_number: str = Field(..., description="Filing number")
    filing_date: str = Field(..., description="Filing date")
    court_name: str = Field(..., description="Court name")
    petitioner: str = Field(..., description="Petitioner/Plaintiff name")
    respondent: str = Field(..., description="Respondent/Defendant name")
    status: str = Field(..., description="Current case status")
    next_hearing_date: Optional[str] = Field(None, description="Next hearing date")
    notes: Optional[str] = Field(None, description="User's notes about the case")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="When case was added")
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Last updated timestamp")

class UserCaseCreate(BaseModel):
    """Request model for creating a new user case"""
    cnr_number: str = Field(..., description="CNR number")
    case_type: str = Field(..., description="Type of case")
    filing_number: str = Field(..., description="Filing number")
    filing_date: str = Field(..., description="Filing date")
    court_name: str = Field(..., description="Court name")
    petitioner: str = Field(..., description="Petitioner name")
    respondent: str = Field(..., description="Respondent name")
    status: str = Field(..., description="Case status")
    next_hearing_date: Optional[str] = Field(None, description="Next hearing date")
    notes: Optional[str] = Field(None, description="User notes")

class UserCaseUpdate(BaseModel):
    """Request model for updating a case"""
    case_type: Optional[str] = None
    status: Optional[str] = None
    next_hearing_date: Optional[str] = None
    notes: Optional[str] = None

class CaseListResponse(BaseModel):
    """Response for list of cases"""
    success: bool
    count: int
    data: List[UserCase] = []
    error: Optional[str] = None

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
    except auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token has been revoked"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token verification failed: {str(e)}"
        )

# ============================================================================
# EXISTING ENDPOINTS: eCourts Case Lookup
# ============================================================================

@ecourts_router.get("/{cnr_number}")
async def get_case(cnr_number: str):
    """
    Fetch case details by CNR number from eCourts.
    Uses mock data in development if no eCourts API key is set.
    """
    try:
        # Use mock data if no API key
        if not config.ECOURTS_API_KEY or config.is_development:
            case = get_mock_case(cnr_number)
            return CaseSearchResponse(
                success=True,
                data=case,
                cached=False
            )

        case = await fetch_case_by_cnr(cnr_number)

        if not case:
            raise HTTPException(
                status_code=404,
                detail=f"Case {cnr_number} not found"
            )

        return CaseSearchResponse(success=True, data=case)

    except HTTPException:
        raise
    except Exception as e:
        return CaseSearchResponse(
            success=False,
            error=str(e)
        )

@ecourts_router.post("/search")
async def search_case(request: CaseSearchRequest):
    """
    Search case by CNR number or party name from eCourts.
    """
    if not request.cnr_number and not request.party_name:
        raise HTTPException(
            status_code=400,
            detail="Provide either cnr_number or party_name"
        )

    if request.cnr_number:
        return await get_case(request.cnr_number)

    raise HTTPException(
        status_code=501,
        detail="Party name search coming soon"
    )

# ============================================================================
# NEW ENDPOINTS: User Case Management (CRUD)
# ============================================================================

@api_router.get("")
async def list_cases(uid: str = Depends(verify_firebase_token)) -> CaseListResponse:
    """
    Get all cases for the authenticated user.
    
    Query: GET /api/cases
    Header: Authorization: Bearer <id_token>
    
    Returns: List of cases saved by the user
    """
    try:
        if not db:
            raise HTTPException(
                status_code=503,
                detail="Firestore database not available"
            )
        
        # Query all cases in user's subcollection
        cases_ref = db.collection("users").document(uid).collection("cases")
        docs = cases_ref.stream()
        
        cases = []
        for doc in docs:
            case_data = doc.to_dict()
            case_data["id"] = doc.id  # Include document ID
            cases.append(UserCase(**case_data))
        
        return CaseListResponse(
            success=True,
            count=len(cases),
            data=cases
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve cases: {str(e)}"
        )

@api_router.get("/{case_id}")
async def get_single_case(case_id: str, uid: str = Depends(verify_firebase_token)) -> UserCase:
    """
    Get a specific case by ID for the authenticated user.
    
    Query: GET /api/cases/{caseId}
    Header: Authorization: Bearer <id_token>
    
    Returns: Single case document
    """
    try:
        if not db:
            raise HTTPException(
                status_code=503,
                detail="Firestore database not available"
            )
        
        # Get case document from user's subcollection
        case_ref = db.collection("users").document(uid).collection("cases").document(case_id)
        doc = case_ref.get()
        
        if not doc.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Case {case_id} not found"
            )
        
        case_data = doc.to_dict()
        case_data["id"] = doc.id
        
        return UserCase(**case_data)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve case: {str(e)}"
        )

@api_router.post("")
async def create_case(
    case_request: UserCaseCreate,
    uid: str = Depends(verify_firebase_token)
) -> UserCase:
    """
    Create and save a new case for the authenticated user.
    
    Query: POST /api/cases
    Header: Authorization: Bearer <id_token>
    Body: UserCaseCreate object
    
    Returns: Created case with assigned ID
    """
    try:
        if not db:
            raise HTTPException(
                status_code=503,
                detail="Firestore database not available"
            )
        
        # Create new case document in user's subcollection
        now = datetime.utcnow()
        case_data = {
            **case_request.dict(),
            "created_at": now,
            "updated_at": now
        }
        
        # Firestore will auto-generate the document ID
        cases_ref = db.collection("users").document(uid).collection("cases")
        doc_ref = cases_ref.document()  # Auto-generate ID
        doc_ref.set(case_data)
        
        # Return created case with ID
        case_data["id"] = doc_ref.id
        return UserCase(**case_data)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create case: {str(e)}"
        )

@api_router.put("/{case_id}")
async def update_case(
    case_id: str,
    case_update: UserCaseUpdate,
    uid: str = Depends(verify_firebase_token)
) -> UserCase:
    """
    Update an existing case for the authenticated user.
    
    Query: PUT /api/cases/{caseId}
    Header: Authorization: Bearer <id_token>
    Body: UserCaseUpdate object (partial update)
    
    Returns: Updated case document
    """
    try:
        if not db:
            raise HTTPException(
                status_code=503,
                detail="Firestore database not available"
            )
        
        case_ref = db.collection("users").document(uid).collection("cases").document(case_id)
        
        # Check if case exists
        if not case_ref.get().exists():
            raise HTTPException(
                status_code=404,
                detail=f"Case {case_id} not found"
            )
        
        # Prepare update data (only non-null fields)
        update_data = {
            k: v for k, v in case_update.dict().items() 
            if v is not None
        }
        
        # Always update the timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        # Update the document (merge, not overwrite)
        case_ref.update(update_data)
        
        # Return updated case
        updated_doc = case_ref.get()
        case_data = updated_doc.to_dict()
        case_data["id"] = updated_doc.id
        
        return UserCase(**case_data)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update case: {str(e)}"
        )

@api_router.delete("/{case_id}")
async def delete_case(
    case_id: str,
    uid: str = Depends(verify_firebase_token)
) -> dict:
    """
    Delete a case for the authenticated user.
    
    Query: DELETE /api/cases/{caseId}
    Header: Authorization: Bearer <id_token>
    
    Returns: Success confirmation
    """
    try:
        if not db:
            raise HTTPException(
                status_code=503,
                detail="Firestore database not available"
            )
        
        case_ref = db.collection("users").document(uid).collection("cases").document(case_id)
        
        # Check if case exists
        if not case_ref.get().exists():
            raise HTTPException(
                status_code=404,
                detail=f"Case {case_id} not found"
            )
        
        # Delete the document
        case_ref.delete()
        
        return {
            "success": True,
            "message": f"Case {case_id} deleted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete case: {str(e)}"
        )

# ============================================================================
# ROUTER EXPORT
# ============================================================================
# Create combined router for backward compatibility
router = APIRouter()
router.include_router(ecourts_router)
router.include_router(api_router)