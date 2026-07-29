from datetime import datetime

from sqlalchemy import ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    business_id: Mapped[int] = mapped_column(
        ForeignKey("businesses.id"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        default="medium",
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="new",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    business = relationship(
        "Business",
        back_populates="opportunities"
    )