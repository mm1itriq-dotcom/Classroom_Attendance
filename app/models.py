from sqlalchemy import Table, Column, String, Integer, DateTime, MetaData
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import metadata

students = Table(
    "students",
    metadata,
    Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
    Column("first_name", String, nullable=False),
    Column("last_name", String, nullable=False),
    Column("student_number", String, nullable=False, unique=True),
)

check_ins = Table(
    "check_ins",
    metadata,
    Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
    Column("student_id", UUID(as_uuid=True), nullable=False),
    Column("room", String, nullable=False),
    Column("timestamp", DateTime, nullable=False),
    Column("badge_status", String, nullable=False)
)

attendance_alerts = Table(
    "attendance_alerts",
    metadata,
    Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
    Column("student_id", UUID(as_uuid=True), nullable=False),
    Column("rule_triggered", String, nullable=False),
    Column("risk_score", Integer, nullable=False),
    Column("description", String, nullable=False)
)
