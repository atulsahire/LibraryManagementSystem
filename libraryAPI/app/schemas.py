from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator, AfterValidator
from datetime import date, datetime
from pydantic_extra_types.phone_numbers import PhoneNumber
from sqlalchemy.sql.annotation import Annotated
from typing import Annotated, Optional

# Helper Base to enable ORM compatibility for all models
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# --- BOOKS ---
class BookBase(BaseModel):
    title: str = Field(description="Title of Book must be specified",min_length=3, max_length=250)
    author: str = Field(description="Author of Book must be specified",min_length=3, max_length=250)
    isbn: str
    published_year: int = Field(..., ge=1500, description="Year must be after 1500")
    published_month: int = Field(..., ge=1, le=12, description="Month must be between 1 and 12")
    status: str = Field("available", description="This is Book Status",min_length=3)

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = Field(description="Title of Book must be specified",min_length=3, max_length=250)
    author: Optional[str] = Field(description="Author of Book must be specified",min_length=3, max_length=250)
    isbn: Optional[str] = Field(None, description="This is ISBN of Book",min_length=3, max_length=20)
    published_year: Optional[int] = Field(..., ge=1500, description="Year must be after 1500")
    published_month: Optional[int] = Field(..., ge=1, le=12, description="Month must be between 1 and 12")
    status: Optional[str] = Field("available", description="This is Book Status",min_length=3)

class Book(BookBase, BaseSchema):
    id: int = Field(description="This is Book Id",gt=0)

# --- MEMBERS ---
class MemberBase(BaseModel):
    full_name: str = Field(description="This is Member Name",min_length=3, max_length=250)
    joining_date: date = Field(description="The Member's joining date",le=date.today())
    email: EmailStr = Field(description="The Member's primary email address", max_length=50)
    phone_number: PhoneNumber = Field(description="The Member's primary phone number", max_length=50)
    is_wa_applicable: bool = False

class MemberCreate(MemberBase):
    pass

class MemberUpdate(BaseModel):
    full_name: Optional[str] = Field(description="This is Member Name",min_length=3, max_length=250)
    email: Optional[EmailStr] = Field(description="The Member's primary email address", max_length=50)
    phone_number: Optional[PhoneNumber] = Field(description="The Member's primary phone number", max_length=50)
    is_wa_applicable: Optional[bool] = None

class Member(MemberBase, BaseSchema):
    id: int = Field(description="This is Member Id",gt=0)

# --- LENDINGS ---
class LendingBase(BaseModel):
    book_id: int = Field(description="Book Id for lending",gt=0)
    member_id: int = Field(description="Member Id for lending",gt=0)
    borrow_date: date
    due_date: date
    return_date: Optional[date] = Field(None,description="The Member's fine date",le=date.today())

class LendingCreate(LendingBase):
    pass

class LendingUpdate(BaseModel):
    due_date: Optional[date] = None
    return_date: Optional[date] = None

class Lending(LendingBase, BaseSchema):
    id: int = Field(description="Lending Id ",gt=0)

# --- FINES ---
class FineBase(BaseModel):
    lending_id: int = Field(description="Lending Id for fine",gt=0)
    fine_amount: float = Field(description="Fine Amount Required",gt=0)
    fine_date: date = Field(description="The Member's fine date",le=date.today())
    fine_status: str = Field("unpaid", description="Fook Status",min_length=3)

class FineCreate(FineBase):
    pass

class FineUpdate(BaseModel):
    fine_amount: Optional[float] = Field(description="Fine Amount",gt=0)
    fine_status: Optional[str] = Field(..., description="Fook Status",min_length=3)

class Fine(FineBase, BaseSchema):
    id: int = Field(description="Fine Id is required",gt=0)

# --- RESERVATIONS ---
class ReservationBase(BaseModel):
    member_id: int = Field(description="Member Id for Reservation",gt=0)
    book_id: int = Field(description="Book Id for Reservation",gt=0)
    reservation_date: Optional[date] = Field(description="The Reservation date", ge=date.today())
    reservation_status: str = Field("Pending",description="This is Reservation Status", min_length=3)

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    reservation_status: Optional[str] = Field("Pending",description="This is Reservation Status", min_length=3)

class Reservation(ReservationBase, BaseSchema):
    id: int = Field(description="Reservation Id for Reservation",gt=0)


def check_not_in_past(v: datetime) -> datetime:
    if v < datetime.now():
        raise ValueError('Datetime cannot be in the past')
    return v

# --- NOTIFICATIONS ---
class NotificationBase(BaseModel):
    notification_date: Annotated[datetime, AfterValidator(check_not_in_past)]
    member_id: int = Field(description="Member Id for Notification",gt=0)
    notification_type: str = Field("email",description="Notification type sms / e-mail / WhatsApp",gt=0)
    notification_message: Optional[str] = Field(description="Notification message str ",gt=0)

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    notification_message: Optional[str] = Field(description="Notification message str ",gt=0)

class Notification(NotificationBase, BaseSchema):
    id: int = Field(description="Notification Id of Notification",gt=0)
