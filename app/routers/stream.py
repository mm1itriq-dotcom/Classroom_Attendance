from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
from app.schemas import CheckInCreate
from app.rule_engine import process_check_in
from app.database import engine
from app.models import check_ins, students
from sqlalchemy import select, insert
import uuid

router = APIRouter(prefix="/ws", tags=["WebSocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            checkin = CheckInCreate(**payload)
            
            with engine.connect() as conn:
                new_id = uuid.uuid4()
                conn.execute(insert(check_ins).values(
                    id=new_id,
                    student_id=checkin.student_id,
                    room=checkin.room,
                    timestamp=checkin.timestamp,
                    badge_status=checkin.badge_status
                ))
                conn.commit()
                
                student = conn.execute(select(students).where(students.c.id == checkin.student_id)).first()
                student_name = f"{student.first_name} {student.last_name}" if student else "Unknown"

            flags = process_check_in(checkin)
            
            checkin_dump = checkin.model_dump(mode='json')
            checkin_dump["student_name"] = student_name
            
            flags_dump = []
            for f in flags:
                f_copy = dict(f)
                f_copy["id"] = str(f_copy["id"])
                f_copy["student_id"] = str(f_copy["student_id"])
                f_copy["student_name"] = student_name
                flags_dump.append(f_copy)
                
            await manager.broadcast({
                "type": "NEW_CHECKIN",
                "checkin": checkin_dump,
                "flags_generated": flags_dump
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
