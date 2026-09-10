from fastapi import APIRouter, status
from pydantic import BaseModel, UUID4
from app.database import engine
from app.models import students
from app.schemas import StudentCreate, StudentResponse
from sqlalchemy import select, insert
import uuid

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/")
def get_all_students():
    with engine.connect() as conn:
        result = conn.execute(select(students)).fetchall()
        return [dict(row._mapping) for row in result]

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=StudentResponse)
def create_student(student: StudentCreate):
    new_id = uuid.uuid4()
    with engine.connect() as conn:
        conn.execute(
            insert(students).values(
                id=new_id,
                first_name=student.first_name,
                last_name=student.last_name,
                student_number=student.student_number
            )
        )
        conn.commit()
        return {**student.model_dump(), "id": new_id}
