from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessResponse
from app.services.website_analyzer import analyze_website


router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"]
)


@router.post("/", response_model=BusinessResponse)
def create_business(
    business: BusinessCreate,
    db: Session = Depends(get_db)
):
    new_business = Business(**business.model_dump())

    db.add(new_business)
    db.commit()
    db.refresh(new_business)

    return new_business


@router.get("/", response_model=list[BusinessResponse])
def get_businesses(
    db: Session = Depends(get_db)
):
    return db.query(Business).all()


@router.post("/analyze")
def analyze_business_website(url: str):
    return analyze_website(url)