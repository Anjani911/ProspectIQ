from datetime import datetime
import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.business import Business
from app.models.opportunity import Opportunity

from app.schemas.business import (
    BusinessCreate,
    BusinessResponse,
    BusinessDiscoverRequest,
)

from app.schemas.opportunity import OpportunityResponse

from app.services.website_analyzer import analyze_website
from app.services.web_scoring import calculate_website_score

from scraper.business_discovery import discover_businesses
router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"]
)


# ---------------------------------------------------------
# CREATE BUSINESS
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# GET ALL BUSINESSES
# ---------------------------------------------------------

@router.get("/", response_model=list[BusinessResponse])
def get_businesses(
    db: Session = Depends(get_db)
):
    return db.query(Business).all()


# ---------------------------------------------------------
# GET SINGLE BUSINESS
# ---------------------------------------------------------

@router.get("/{business_id}", response_model=BusinessResponse)
def get_business(
    business_id: int,
    db: Session = Depends(get_db)
):
    business = db.get(Business, business_id)

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    return business


# ---------------------------------------------------------
# ANALYZE ANY WEBSITE DIRECTLY
# ---------------------------------------------------------

@router.post("/analyze")
def analyze_business_website(url: str):
    return analyze_website(url)


# ---------------------------------------------------------
# ANALYZE SAVED BUSINESS
# ---------------------------------------------------------

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

    # Update analysis information
    business.has_website = True
    business.analyzed_at = datetime.utcnow()

    # Calculate website score
    business.website_score = calculate_website_score(
        analysis
    )

    # Mark website as outdated when score is low
    business.is_outdated = (
        business.website_score < 50
    )

    # -----------------------------------------------------
    # REMOVE OLD OPPORTUNITIES
    # -----------------------------------------------------

    db.query(Opportunity).filter(
        Opportunity.business_id == business.id
    ).delete()

    # -----------------------------------------------------
    # GENERATE OPPORTUNITIES
    # -----------------------------------------------------

    # HTTPS
    if not analysis.get("has_https", False):
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

    # Meta description
    if not analysis.get("meta_description"):
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

    # Image alt text
    missing_alt = analysis.get(
        "images_without_alt",
        0
    )

    if missing_alt > 0:
        db.add(
            Opportunity(
                business_id=business.id,
                title="Images missing alt text",
                description=(
                    f"{missing_alt} image(s) are missing "
                    "alt text, which can hurt accessibility "
                    "and SEO."
                ),
                priority="medium",
                status="new"
            )
        )

    # Content
    if analysis.get("text_length", 0) < 300:
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

    # H1
    h1_headings = analysis.get(
        "headings",
        {}
    ).get("h1", [])

    if not h1_headings:
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

    # Save business + opportunities
    db.commit()
    db.refresh(business)

    return business

@router.get(
    "/opportunities/all",
    response_model=list[OpportunityResponse]
)
def get_all_opportunities(
    db: Session = Depends(get_db)
):
    return db.query(Opportunity).all()
# ---------------------------------------------------------
# GET BUSINESS OPPORTUNITIES
# ---------------------------------------------------------

@router.get(
    "/{business_id}/opportunities",
    response_model=list[OpportunityResponse]
)
def get_business_opportunities(
    business_id: int,
    db: Session = Depends(get_db)
):
    # Check business exists
    business = db.query(Business).filter(
        Business.id == business_id
    ).first()

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    opportunities = (
        db.query(Opportunity)
        .filter(
            Opportunity.business_id == business_id
        )
        .all()
    )

    return opportunities


# ---------------------------------------------------------
# UPDATE OPPORTUNITY STATUS
# ---------------------------------------------------------

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
            detail=(
                "Invalid status. "
                f"Use one of: {allowed_statuses}"
            )
        )

    opportunity.status = status

    db.commit()
    db.refresh(opportunity)

    return opportunity


# ---------------------------------------------------------
# DASHBOARD SUMMARY
# ---------------------------------------------------------

@router.get("/dashboard/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    total_businesses = db.query(
        Business
    ).count()

    businesses_with_websites = db.query(
        Business
    ).filter(
        Business.has_website == True
    ).count()

    average_website_score = db.query(
        func.avg(Business.website_score)
    ).filter(
        Business.website_score.isnot(None)
    ).scalar()

    total_opportunities = db.query(
        Opportunity
    ).count()

    new_opportunities = db.query(
        Opportunity
    ).filter(
        Opportunity.status == "new"
    ).count()

    high_priority_opportunities = db.query(
        Opportunity
    ).filter(
        Opportunity.priority == "high"
    ).count()

    return {
        "total_businesses": total_businesses,
        "businesses_with_websites": businesses_with_websites,
        "average_website_score": round(
            average_website_score or 0,
            2
        ),
        "total_opportunities": total_opportunities,
        "new_opportunities": new_opportunities,
        "high_priority_opportunities": (
            high_priority_opportunities
        )
    }
@router.post(
    "/discover",
    response_model=list[BusinessResponse]
)
def discover_and_save_businesses(
    request: BusinessDiscoverRequest,
    db: Session = Depends(get_db)
):
    try:
        discovered = discover_businesses(
            category=request.category,
            location=request.location,
            radius_meters=request.radius_meters,
            max_results=request.max_results,
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
        status_code=500,
        detail=str(e)
    )

    saved_businesses = []

    for item in discovered:
        external_id = item.get("external_id")

        # Skip businesses already discovered from the same source
        existing = None

        if external_id:
            existing = (
                db.query(Business)
                .filter(
                    Business.source == item.get("source"),
                    Business.external_id == external_id
                )
                .first()
            )

        if existing:
            saved_businesses.append(existing)
            continue

        business = Business(
            name=item["name"],
            website_url=item.get("website_url"),
            category=item.get("category"),
            location=item.get("location"),
            has_website=bool(item.get("website_url")),
            email=item.get("email"),
            phone=item.get("phone"),
            source=item.get("source"),
            external_id=external_id,
            status="new",
        )

        try:
            db.add(business)
            db.flush()
            saved_businesses.append(business)

        except Exception as e:
                print(e)
                db.rollback()

    db.commit()

    for business in saved_businesses:
        db.refresh(business)

    return saved_businesses
# ---------------------------------------------------------
# ANALYZE ALL BUSINESSES
# ---------------------------------------------------------

@router.post("/analyze-all")
def analyze_all_businesses(
    db: Session = Depends(get_db)
):
    businesses = (
        db.query(Business)
        .filter(Business.website_url.isnot(None))
        .all()
    )

    analyzed = 0
    failed = 0

    for business in businesses:

        try:
            analysis = analyze_website(
                business.website_url
            )

            if "error" in analysis:
                failed += 1
                continue

            business.has_website = True
            business.analyzed_at = datetime.utcnow()

            business.website_score = calculate_website_score(
                analysis
            )

            business.is_outdated = (
                business.website_score < 50
            )

            db.query(Opportunity).filter(
                Opportunity.business_id == business.id
            ).delete()

            # HTTPS
            if not analysis.get("has_https", False):
                db.add(
                    Opportunity(
                        business_id=business.id,
                        title="Website does not use HTTPS",
                        description="Website should use HTTPS.",
                        priority="high",
                        status="new"
                    )
                )

            # Meta Description
            if not analysis.get("meta_description"):
                db.add(
                    Opportunity(
                        business_id=business.id,
                        title="Missing meta description",
                        description="Meta description is missing.",
                        priority="medium",
                        status="new"
                    )
                )

            # Alt Text
            if analysis.get("images_without_alt", 0) > 0:
                db.add(
                    Opportunity(
                        business_id=business.id,
                        title="Images missing alt text",
                        description="Some images are missing ALT text.",
                        priority="medium",
                        status="new"
                    )
                )

            # Content
            if analysis.get("text_length", 0) < 300:
                db.add(
                    Opportunity(
                        business_id=business.id,
                        title="Low website content",
                        description="Website contains very little content.",
                        priority="medium",
                        status="new"
                    )
                )

            # H1
            if not analysis.get("headings", {}).get("h1"):
                db.add(
                    Opportunity(
                        business_id=business.id,
                        title="Missing H1 heading",
                        description="Website has no H1 heading.",
                        priority="medium",
                        status="new"
                    )
                )

            analyzed += 1

        except Exception:
            failed += 1

    db.commit()

    return {
        "total_businesses": len(businesses),
        "analyzed": analyzed,
        "failed": failed
    }