from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import engine, Base, get_db
from app.models.business import Business
from app.routes.businesses import router as businesses_router


app = FastAPI(
    title="ProspectIQ",
    description="AI-powered business opportunity intelligence platform",
    version="0.1.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(businesses_router)


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