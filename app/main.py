from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, metadata
from app.routers import students, stream

metadata.create_all(engine)

app = FastAPI(title="Classroom Attendance & Behavior Monitor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(stream.router)
