import re
from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    field_validator,
)


RequiredText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=100),
]

Service = Literal[
    "Window cleaning",
    "Solar panel cleaning",
    "Screen cleaning",
]


class QuoteRequestCreate(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    first_name: RequiredText
    last_name: RequiredText
    email: Annotated[EmailStr, Field(max_length=100)]
    phone: Annotated[str, Field(min_length=7, max_length=100)]
    address: Annotated[str, Field(min_length=1, max_length=200)]
    city: RequiredText
    property_type: Literal["Residential", "Commercial"]
    services: Annotated[list[Service], Field(min_length=1, max_length=3)]
    details: Annotated[str, Field(max_length=2000)] | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not re.fullmatch(r"\+?[0-9().\s-]+", value):
            raise ValueError("Enter a valid phone number.")

        digits = re.sub(r"[^0-9]", "", value)
        if not 7 <= len(digits) <= 15:
            raise ValueError("Phone number must contain 7 to 15 digits.")

        return value

    @field_validator("services")
    @classmethod
    def validate_services(cls, value: list[Service]) -> list[Service]:
        if len(value) != len(set(value)):
            raise ValueError("Select each service only once.")
        return value

    @field_validator("details")
    @classmethod
    def normalize_details(cls, value: str | None) -> str | None:
        return value or None