from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.models.business import Business
from app.models.opportunity import Opportunity

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
def overview(db: Session = Depends(get_db)):
    return {
        "total_businesses": db.query(Business).count(),

        "businesses_with_websites":
            db.query(Business)
            .filter(Business.has_website == True)
            .count(),

        "total_opportunities":
            db.query(Opportunity).count(),

        "average_score":
            db.query(func.avg(Business.website_score))
            .scalar() or 0
    }


@router.get("/categories")
def categories(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Business.category,
            func.count(Business.id)
        )
        .group_by(Business.category)
        .all()
    )

    return [
        {
            "category": r[0] or "Unknown",
            "count": r[1]
        }
        for r in rows
    ]


@router.get("/website-scores")
def website_scores(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Business.name,
            Business.website_score
        )
        .filter(Business.website_score != None)
        .all()
    )

    return [
        {
            "name": r[0],
            "score": r[1]
        }
        for r in rows
    ]


@router.get("/priority")
def priority(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Opportunity.priority,
            func.count(Opportunity.id)
        )
        .group_by(Opportunity.priority)
        .all()
    )

    return [
        {
            "priority": r[0],
            "count": r[1]
        }
        for r in rows
    ]


@router.get("/status")
def status(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Opportunity.status,
            func.count(Opportunity.id)
        )
        .group_by(Opportunity.status)
        .all()
    )

    return [
        {
            "status": r[0],
            "count": r[1]
        }
        for r in rows
    ]


@router.get("/types")
def opportunity_types(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Opportunity.title,
            func.count(Opportunity.id)
        )
        .group_by(Opportunity.title)
        .order_by(func.count(Opportunity.id).desc())
        .all()
    )

    return [
        {
            "title": r[0],
            "count": r[1]
        }
        for r in rows
    ]


@router.get("/recent-businesses")
def recent_businesses(db: Session = Depends(get_db)):

    rows = (
        db.query(Business)
        .order_by(Business.created_at.desc())
        .limit(5)
        .all()
    )

    return rows


# ---------------------------------------------------------
# BUSINESS GROWTH
# ---------------------------------------------------------

@router.get("/growth")
def growth(db: Session = Depends(get_db)):

    rows = (
        db.query(
            func.date(Business.created_at).label("date"),
            func.count(Business.id).label("count")
        )
        .group_by(func.date(Business.created_at))
        .order_by(func.date(Business.created_at))
        .all()
    )

    cumulative = 0
    result = []

    for row in rows:
        cumulative += row.count

        result.append({
            "date": str(row.date),
            "new_businesses": row.count,
            "total_businesses": cumulative
        })

    return result