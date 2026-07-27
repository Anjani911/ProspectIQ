from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import get_db


app = FastAPI(
    title="ProspectIQ",
    description="AI-powered business opportunity intelligence platform",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to ProspectIQ",
        "status": "API is running"
    }


@app.get("/health/database")
def database_health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    
    return {
        "database": "connected",
        "result": result.scalar()
    }