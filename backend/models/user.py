from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# User role enumeration
class UserRole:
    CLIENT = "CLIENT"
    LAWYER = "LAWYER"


class UserProfile(BaseModel):
    """
    User profile model with authentication and role information.
    Stored in Firestore at: users/{uid}
    """
    uid: str = Field(..., description="Firebase UID")
    email: str = Field(..., description="User email address")
    display_name: Optional[str] = Field(None, description="User's display name")
    photo_url: Optional[str] = Field(None, description="User's profile photo URL")
    role: Optional[str] = Field(None, description="User role: CLIENT or LAWYER")
    created_at: Optional[datetime] = Field(None, description="Account creation timestamp")
    last_sign_in: Optional[datetime] = Field(None, description="Last sign in timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "uid": "user123",
                "email": "user@example.com",
                "display_name": "Rajesh Kumar",
                "photo_url": "https://...",
                "role": "CLIENT",
                "created_at": "2024-04-19T10:30:00Z",
                "last_sign_in": "2024-04-19T14:30:00Z",
            }
        }


class UserCreateRequest(BaseModel):
    """Request model for creating a new user"""
    email: str = Field(..., description="Email address")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")
    display_name: str = Field(..., description="User's display name")
    role: str = Field(..., description="User role: CLIENT or LAWYER")


class UserUpdateRequest(BaseModel):
    """Request model for updating user profile"""
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    role: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "display_name": "Rajesh Kumar",
                "photo_url": "https://...",
                "role": "CLIENT",
            }
        }


class UserResponse(BaseModel):
    """Standard response format for user endpoints"""
    success: bool
    data: Optional[UserProfile] = None
    error: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "uid": "user123",
                    "email": "user@example.com",
                    "display_name": "Rajesh Kumar",
                    "photo_url": "https://...",
                    "role": "CLIENT",
                    "created_at": "2024-04-19T10:30:00Z",
                    "last_sign_in": "2024-04-19T14:30:00Z",
                }
            }
        }
