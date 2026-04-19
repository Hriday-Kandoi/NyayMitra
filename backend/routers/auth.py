from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from backend.models.user import UserProfile
from backend.core.config import config
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Initialize Firebase Admin SDK if not already done
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Could not initialize Firebase Admin SDK: {e}")

router = APIRouter(prefix="/auth", tags=["Auth"])
db = firestore.client()


class VerifyTokenRequest(BaseModel):
    """Request body for token verification"""
    id_token: str


class VerifyTokenResponse(BaseModel):
    """Response for token verification"""
    success: bool
    user: Optional[UserProfile] = None
    error: Optional[str] = None


@router.post("/verify", response_model=VerifyTokenResponse)
async def verify_token(request: VerifyTokenRequest):
    """
    Verify Firebase ID token and return user profile with role.
    Called by frontend after user logs in to get user data.
    """
    try:
        if not request.id_token:
            raise HTTPException(
                status_code=400,
                detail="ID token is required"
            )

        # Verify the token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(request.id_token)
        uid = decoded_token.get("uid")

        if not uid:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        # Get user data from Firebase Auth
        user = auth.get_user(uid)

        # Get user role from Firestore
        user_doc = db.collection("users").document(uid).get()
        role = None

        if user_doc.exists():
            role = user_doc.get("role")

        # Create user profile response
        user_profile = UserProfile(
            uid=uid,
            email=user.email,
            display_name=user.display_name,
            photo_url=user.photo_url,
            role=role,
            created_at=user.user_metadata.creation_timestamp,
            last_sign_in=user.user_metadata.last_sign_in_timestamp,
        )

        return VerifyTokenResponse(
            success=True,
            user=user_profile
        )

    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
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
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to verify token: {str(e)}"
        )


@router.post("/user-profile")
async def get_user_profile(id_token: str = Header(None)):
    """
    Get authenticated user's full profile from Firestore.
    """
    if not id_token:
        raise HTTPException(
            status_code=400,
            detail="Authorization header is required"
        )

    try:
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get("uid")

        if not uid:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        # Get user document from Firestore
        user_doc = db.collection("users").document(uid).get()

        if not user_doc.exists():
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )

        return {
            "success": True,
            "data": user_doc.to_dict()
        }

    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/logout")
async def logout(id_token: str = Header(None)):
    """
    Logout user by revoking their token (optional).
    Firebase handles most of the logout on client side.
    """
    if not id_token:
        raise HTTPException(
            status_code=400,
            detail="Authorization header is required"
        )

    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get("uid")

        if uid:
            # Optional: Revoke the token
            auth.revoke_refresh_tokens(uid)

        return {
            "success": True,
            "message": "User logged out successfully"
        }

    except Exception as e:
        # Even if revocation fails, consider logout successful
        return {
            "success": True,
            "message": "User logged out"
        }
