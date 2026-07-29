from datetime import datetime
from pydantic import BaseModel


class OpportunityResponse(BaseModel):
    id: int
    business_id: int
    title: str
    description: str | None = None
    priority: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True