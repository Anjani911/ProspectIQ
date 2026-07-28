from datetime import datetime
from fastapi import HTTPException
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
@router.post("/{business_id}/analyze", response_model=BusinessResponse)
def analyze_business(
    business_id: int,
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(
        Business.id == business_id
    ).first()

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    if not business.website_url:
        raise HTTPException(
            status_code=400,
            detail="Business does not have a website URL"
        )

    analysis = analyze_website(business.website_url)

    if "error" in analysis:
        raise HTTPException(
            status_code=500,
            detail=analysis["error"]
        )

    business.has_website = True
    business.analyzed_at = datetime.utcnow()

    # Temporary score calculation
    score = 100

    if not analysis["has_https"]:
        score -= 20

    if not analysis["meta_description"]:
        score -= 15

    if analysis["images_without_alt"] > 0:
        score -= 10

    if analysis["text_length"] < 300:
        score -= 15

    business.website_score = max(score, 0)

    business.is_outdated = (
        business.website_score < 50
    )

    db.commit()
    db.refresh(business)

    return business