from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)

    has_website: Mapped[bool] = mapped_column(Boolean, default=False)
    website_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_outdated: Mapped[bool] = mapped_column(Boolean, default=False)

    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)

    status: Mapped[str] = mapped_column(
        String(50),
        default="new",
        nullable=False
    )

    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    analyzed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    opportunities = relationship(
    "Opportunity",
    back_populates="business",
    cascade="all, delete-orphan"
)