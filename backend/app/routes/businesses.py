from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.business import Business
from app.models.opportunity import Opportunity
from app.schemas.business import BusinessCreate, BusinessResponse
from app.schemas.opportunity import OpportunityResponse
from app.services.website_analyzer import analyze_website


router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"]
)


# Create a new business
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


# Get all businesses
@router.get("/", response_model=list[BusinessResponse])
def get_businesses(
    db: Session = Depends(get_db)
):
    return db.query(Business).all()


# Analyze any website directly
@router.post("/analyze")
def analyze_business_website(url: str):
    return analyze_website(url)


# Analyze a saved business and generate opportunities
@router.post(
    "/{business_id}/analyze",
    response_model=BusinessResponse
)
def analyze_business(
    business_id: int,
    db: Session = Depends(get_db)
):
    # Find business
    business = db.query(Business).filter(
        Business.id == business_id
    ).first()

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    # Check website
    if not business.website_url:
        raise HTTPException(
            status_code=400,
            detail="Business does not have a website URL"
        )

    # Analyze website
    analysis = analyze_website(
        business.website_url
    )

    if "error" in analysis:
        raise HTTPException(
            status_code=500,
            detail=analysis["error"]
        )

    # Mark business as analyzed
    business.has_website = True
    business.analyzed_at = datetime.utcnow()

    # Calculate website score
    score = 100

    if not analysis["has_https"]:
        score -= 20

    if not analysis["meta_description"]:
        score -= 15

    if analysis["images_without_alt"] > 0:
        score -= 10

    if analysis["text_length"] < 300:
        score -= 15

    if not analysis["headings"]["h1"]:
        score -= 10

    business.website_score = max(score, 0)

    # Mark as outdated if score is below 50
    business.is_outdated = (
        business.website_score < 50
    )

    # Delete old opportunities
    db.query(Opportunity).filter(
        Opportunity.business_id == business.id
    ).delete()

    # Generate HTTPS opportunity
    if not analysis["has_https"]:
        db.add(
            Opportunity(
                business_id=business.id,
                title="Website does not use HTTPS",
                description=(
                    "The website should use HTTPS "
                    "to improve security and visitor trust."
                ),
                priority="high",
                status="new"
            )
        )

    # Generate SEO opportunity
    if not analysis["meta_description"]:
        db.add(
            Opportunity(
                business_id=business.id,
                title="Missing meta description",
                description=(
                    "Adding a meta description can improve "
                    "SEO and search engine visibility."
                ),
                priority="medium",
                status="new"
            )
        )

    # Generate image accessibility opportunity
    if analysis["images_without_alt"] > 0:
        db.add(
            Opportunity(
                business_id=business.id,
                title="Images missing alt text",
                description=(
                    f"{analysis['images_without_alt']} image(s) "
                    "are missing alt text, which can hurt "
                    "accessibility and SEO."
                ),
                priority="medium",
                status="new"
            )
        )

    # Generate content opportunity
    if analysis["text_length"] < 300:
        db.add(
            Opportunity(
                business_id=business.id,
                title="Low website content",
                description=(
                    "The website has very little text content "
                    "and may need stronger content for SEO "
                    "and customer information."
                ),
                priority="medium",
                status="new"
            )
        )

    # Generate H1 opportunity
    if not analysis["headings"]["h1"]:
        db.add(
            Opportunity(
                business_id=business.id,
                title="Missing H1 heading",
                description=(
                    "The website does not have an H1 heading, "
                    "which can affect content structure and SEO."
                ),
                priority="medium",
                status="new"
            )
        )

    # Save everything
    db.commit()
    db.refresh(business)

    return business


# Get opportunities for a business
@router.get(
    "/{business_id}/opportunities",
    response_model=list[OpportunityResponse]
)
def get_business_opportunities(
    business_id: int,
    db: Session = Depends(get_db)
):
    # Check if business exists
    business = db.query(Business).filter(
        Business.id == business_id
    ).first()

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    # Get opportunities
    opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.business_id == business_id
        )
        .all()
    )

    return opportunities
@router.patch(
    "/opportunities/{opportunity_id}/status",
    response_model=OpportunityResponse
)
def update_opportunity_status(
    opportunity_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    opportunity = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id
    ).first()

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    allowed_statuses = [
        "new",
        "contacted",
        "in_progress",
        "completed"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Use one of: {allowed_statuses}"
        )

    opportunity.status = status

    db.commit()
    db.refresh(opportunity)

    return opportunity
@router.patch(
    "/opportunities/{opportunity_id}/status",
    response_model=OpportunityResponse
)
def update_opportunity_status(
    opportunity_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    opportunity = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id
    ).first()

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    allowed_statuses = [
        "new",
        "contacted",
        "in_progress",
        "completed"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Use one of: {allowed_statuses}"
        )

    opportunity.status = status

    db.commit()
    db.refresh(opportunity)

    return opportunity
from sqlalchemy import func


@router.get("/dashboard/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    total_businesses = db.query(Business).count()

    businesses_with_websites = db.query(Business).filter(
        Business.has_website == True
    ).count()

    average_website_score = db.query(
        func.avg(Business.website_score)
    ).filter(
        Business.website_score.isnot(None)
    ).scalar()

    total_opportunities = db.query(Opportunity).count()

    new_opportunities = db.query(Opportunity).filter(
        Opportunity.status == "new"
    ).count()

    high_priority_opportunities = db.query(Opportunity).filter(
        Opportunity.priority == "high"
    ).count()

    return {
        "total_businesses": total_businesses,
        "businesses_with_websites": businesses_with_websites,
        "average_website_score": round(
            average_website_score or 0, 2
        ),
        "total_opportunities": total_opportunities,
        "new_opportunities": new_opportunities,
        "high_priority_opportunities": high_priority_opportunities
    }