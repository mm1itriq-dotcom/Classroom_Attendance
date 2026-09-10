import asyncio
import websockets
import json
import time
import random
from sqlalchemy import create_engine, select
from datetime import datetime, timezone

from app.models import students

async def simulate():
    DATABASE_URL = "postgresql://postgres:123456@localhost:5432/attendance_db"
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        all_students = conn.execute(select(students)).fetchall()
        
    if not all_students:
        print("\n⚠️ ERROR: You must create at least one Student via the Admin page first!\n")
        return

    student = random.choice(all_students)
    student_id = str(student.id)
    
    uri = "ws://localhost:8000/ws/stream"
    async with websockets.connect(uri) as websocket:
        print(f"✅ Connected! Simulating check-ins for: {student.first_name} {student.last_name}")
        
        # 1. Normal Check-in
        print("1️⃣ Sending a normal check-in... (Room 101, Status: OK)")
        await websocket.send(json.dumps({
            "student_id": student_id,
            "room": "Room 101",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "badge_status": "OK"
        }))
        print("Server Response:", await websocket.recv())
        
        time.sleep(3)
        
        # 2. Rule Violation: Anomalous Location
        print("\n2️⃣ Sending a RULE VIOLATION check-in... (Simulating Double Room Check-in)")
        await websocket.send(json.dumps({
            "student_id": student_id,
            "room": "Room 802 (East Campus)",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "badge_status": "OK"
        }))
        print("Server Response:", await websocket.recv())
        
        time.sleep(3)
        
        # 3. Rule Violation: Invalid Badge
        print("\n3️⃣ Sending a RULE VIOLATION check-in... (Forged Badge)")
        await websocket.send(json.dumps({
            "student_id": student_id,
            "room": "Room 305",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "badge_status": "FORGED"
        }))
        print("Server Response:", await websocket.recv())

if __name__ == "__main__":
    asyncio.run(simulate())

