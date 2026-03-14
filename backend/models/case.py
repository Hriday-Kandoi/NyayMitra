from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class HearingDate(BaseModel):
    date: str
    purpose: str
    next_date: Optional[str] = None

class CaseResponse(BaseModel):
    cnr_number: str
    case_type: str
    filing_number: str
    filing_date: str
    registration_number: Optional[str] = None
    registration_date: Optional[str] = None
    court_name: str
    court_number: Optional[str] = None
    judge_name: Optional[str] = None
    petitioner: str
    respondent: str
    status: str
    next_hearing_date: Optional[str] = None
    hearing_history: List[HearingDate] = []
    last_order: Optional[str] = None

class CaseSearchRequest(BaseModel):
    cnr_number: Optional[str] = None
    party_name: Optional[str] = None
    court_code: Optional[str] = None
    state_code: Optional[str] = None

class CaseSearchResponse(BaseModel):
    success: bool
    data: Optional[CaseResponse] = None
    error: Optional[str] = None
    cached: bool = False