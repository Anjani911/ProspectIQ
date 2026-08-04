from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models.opportunity import Opportunity
from app.database.connection import engine, Base, get_db
from app.models.business import Business
from app.routes.businesses import router as businesses_router
from app.routes.analytics import router as analytics_router

app = FastAPI(
    title="ProspectIQ API",
    description="""
AI-powered Business Opportunity Intelligence Platform.

Features:
- Discover businesses
- Analyze websites
- Generate opportunities
- Dashboard analytics
- CRM management
""",
    version="1.0.0",
    contact={
        "name": "Anjani",
        "email": "anjaniiiii888@gmail.com"
    },
    license_info={
        "name": "MIT"
    }
)

Base.metadata.create_all(bind=engine)

app.include_router(businesses_router)
app.include_router(analytics_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ProspectIQ API"
    }


@app.get("/health/stats")
def health_stats(db: Session = Depends(get_db)):
    return {
        "businesses": db.query(Business).count(),
        "opportunities": db.query(Opportunity).count()
    }
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "api": "running",
        "database": "connected"
    }