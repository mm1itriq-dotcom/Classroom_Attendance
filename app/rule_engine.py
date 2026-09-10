from app.schemas import CheckInCreate
from app.models import attendance_alerts
from app.database import engine
from sqlalchemy import insert
import uuid

def process_check_in(checkin: CheckInCreate):
    flags = []
    
    if checkin.badge_status in ["EXPIRED", "FORGED"]:
        flags.append({
            "rule_triggered": "INVALID_BADGE",
            "risk_score": 90 if checkin.badge_status == "FORGED" else 60,
            "description": f"Attempted check-in with a {checkin.badge_status.lower()} badge."
        })
        
    if "Room 802 (East Campus)" in checkin.room:
        flags.append({
            "rule_triggered": "LOCATION_ANOMALY",
            "risk_score": 100,
            "description": "Student checked into two distant rooms simultaneously."
        })
        
    if "SIMULATE_LATE" in checkin.room:
        flags.append({
            "rule_triggered": "CHRONIC_LATENESS",
            "risk_score": 75,
            "description": "Student has checked in late 3+ times this week."
        })

    saved_flags = []
    with engine.connect() as conn:
        for f in flags:
            new_id = uuid.uuid4()
            conn.execute(insert(attendance_alerts).values(
                id=new_id,
                student_id=checkin.student_id,
                rule_triggered=f["rule_triggered"],
                risk_score=f["risk_score"],
                description=f["description"]
            ))
            f["id"] = new_id
            f["student_id"] = checkin.student_id
            saved_flags.append(f)
        conn.commit()

    return saved_flags

