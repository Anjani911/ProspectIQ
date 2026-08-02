from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BusinessCreate(BaseModel):
    name: str
    website_url: str | None = None
    category: str | None = None
    location: str | None = None
    has_website: bool = False
    website_score: int | None = None
    is_outdated: bool = False
    email: str | None = None
    phone: str | None = None
    status: str = "new"
    notes: str | None = None

    source: str | None = None
    external_id: str | None = None


class BusinessResponse(BusinessCreate):
    id: int
    analyzed_at: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BusinessDiscoverRequest(BaseModel):
    category: str
    location: str
    radius_meters: int = 5000
    max_results: int = 20