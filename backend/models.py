from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    String,
    Uuid,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    __table_args__ = (
        CheckConstraint(
            "property_type IN ('Residential', 'Commercial')",
            name="ck_quote_requests_property_type",
        ),
        CheckConstraint(
            "cardinality(services) >= 1",
            name="ck_quote_requests_services_required",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4,
    )

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    status: Mapped[str] = mapped_column(
        String(30),
        server_default=text("'new'"),
    )

    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(200))
    city: Mapped[str] = mapped_column(String(100))
    property_type: Mapped[str] = mapped_column(String(20))
    services: Mapped[list[str]] = mapped_column(ARRAY(String(100)))
    details: Mapped[str | None] = mapped_column(String(2000))