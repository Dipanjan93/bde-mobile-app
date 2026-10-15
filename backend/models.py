import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from datetime import datetime, timezone, timedelta
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

try:
    from zoneinfo import ZoneInfo
    IST = ZoneInfo("Asia/Kolkata")
except Exception:
    IST = timezone(timedelta(hours=5, minutes=30))

def get_now_ist():
    return datetime.now(IST)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False, unique=True, index=True)
    address = Column(String(255), default="Onda")
    category = Column(String(50), default="Retailer")
    created_at = Column(DateTime, default=datetime.utcnow)

    invoices = relationship("Invoice", back_populates="customer")
    payments = relationship("PaymentReceipt", back_populates="customer")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(80), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100), default="General")
    brand = Column(String(100), default="Standard")
    unit = Column(String(20), default="Pcs")
    sqft_per_piece = Column(Float, default=0.0)
    purchase_price = Column(Float, default=0.0)      # P Code
    selling_price = Column(Float, default=0.0)       # S Code (Store Counter Base)
    min_selling_price = Column(Float, default=0.0)   # MS Code
    stock_qty = Column(Float, default=0.0)

    sale_items = relationship("SaleItem", back_populates="product")
    purchases = relationship("Purchase", back_populates="product")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    total_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    due_amount = Column(Float, default=0.0)
    total_cogs = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    customer = relationship("Customer", back_populates="invoices")
    items = relationship("SaleItem", back_populates="invoice", cascade="all, delete-orphan")

class SaleItem(Base):
    __tablename__ = "sale_items"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    qty = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)

    invoice = relationship("Invoice", back_populates="items")
    product = relationship("Product", back_populates="sale_items")

class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    qty = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)
    supplier_name = Column(String(150), default="Mill Stock")
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="purchases")

class PaymentReceipt(Base):
    __tablename__ = "payment_receipts"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    note = Column(String(255), default="Cash Clearance")
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="payments")

class QuoteInquiry(Base):
    __tablename__ = "quote_inquiries"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False)
    quote_type = Column(String(60), default="Retail")
    delivery_locality = Column(String(150), default="Onda")
    requested_items = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(30), default="Pending")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class CustomerTestimonial(Base):
    __tablename__ = "customer_testimonials"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_location = Column(String(100), nullable=False)
    project_title = Column(String(150), nullable=False)
    carpenter_name = Column(String(100), nullable=True)
    image_base64 = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False)
    invoice_no = Column(String(60), nullable=True)
    cashback_upi = Column(String(100), nullable=True)
    cashback_amount = Column(Float, default=0.0)
    cashback_status = Column(String(40), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class AppUser(Base):
    __tablename__ = "app_users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    pin_code = Column(String(20), nullable=True, default="1234")
    location = Column(String(100), nullable=True, default="Onda")
    role = Column(String(50), default="Customer")
    created_at = Column(DateTime, default=datetime.utcnow)

class Carpenter(Base):
    __tablename__ = "carpenters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False)
    village = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=5)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=24)
    specialties = Column(String(255), default="Wardrobe, Modular Kitchen, Beds")
    avatar = Column(String(255), nullable=True)
    completed_projects = Column(Integer, default=40)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CarpenterCallLog(Base):
    __tablename__ = "carpenter_call_logs"
    id = Column(Integer, primary_key=True, index=True)
    carpenter_id = Column(Integer, ForeignKey("carpenters.id"), nullable=False)
    carpenter_name = Column(String(120), nullable=True)
    customer_name = Column(String(120), nullable=True)
    customer_phone = Column(String(20), nullable=False)
    customer_village = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AppSetting(Base):
    __tablename__ = "app_settings"
    key = Column(String(80), primary_key=True, index=True)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)

