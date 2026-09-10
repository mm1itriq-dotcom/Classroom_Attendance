from pydantic import BaseModel, UUID4
from datetime import datetime

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    student_number: str

class StudentResponse(StudentCreate):
    id: UUID4

class CheckInCreate(BaseModel):
    student_id: UUID4
    room: str
    timestamp: datetime
    badge_status: str

class AlertResponse(BaseModel):
    id: UUID4
    student_id: UUID4
    rule_triggered: str
    risk_score: int
    description: str
    student_name: str
