from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey, Float, CheckConstraint
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    isbn = Column(String(13), unique=True, nullable=False, index=True)
    published_year = Column(Integer, CheckConstraint('published_year > 1000'))
    published_month = Column(Integer, CheckConstraint('published_month BETWEEN 1 AND 12'))
    status = Column(String(50), default="Available") # e.g., Available, Borrowed, Reserved

class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    joining_date = Column(Date, default=datetime.date.today)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=False)
    is_wa_applicable = Column(Boolean, default=True)

class Lending(Base):
    __tablename__ = "lendings"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    borrow_date = Column(Date, default=datetime.date.today, nullable=False)
    due_date = Column(Date, nullable=False)
    return_date = Column(Date, nullable=True)

class Fine(Base):
    __tablename__ = "fines"
    id = Column(Integer, primary_key=True, index=True)
    lending_id = Column(Integer, ForeignKey("lendings.id"), nullable=False)
    fine_amount = Column(Float, CheckConstraint('fine_amount >= 0'), nullable=False)
    fine_date = Column(Date, default=datetime.date.today)
    fine_status = Column(String(20), default="Unpaid") # e.g., Unpaid, Paid

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    reservation_date = Column(Date, default=datetime.date.today)
    reservation_status = Column(String(20), default="Pending")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    notification_date = Column(DateTime, default=datetime.datetime.utcnow)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    notification_type = Column(String(50)) # e.g., Email, SMS, WhatsApp
    notification_message = Column(String(1000), nullable=False)
