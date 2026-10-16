from typing import List, Optional
from pydantic import BaseModel, Field

class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1)
    phone: Optional[str] = ""
    address: Optional[str] = "Onda"
    category: Optional[str] = "Retailer"

class CustomerUpdate(BaseModel):
    name: str = Field(..., min_length=1)
    phone: Optional[str] = ""
    address: Optional[str] = "Onda"
    category: Optional[str] = "Retailer"

class ProductCreate(BaseModel):
    sku: str
    name: str
    category: str
    subcategory: Optional[str] = "General"
    brand: Optional[str] = "Standard"
    unit: Optional[str] = "Pcs"
    sqft_per_piece: Optional[float] = 0.0
    purchase_price: float
    selling_price: float
    min_selling_price: float
    stock_qty: Optional[float] = 0.0

class SaleItemCreate(BaseModel):
    product_id: int
    qty: float
    unit_price: float

class MultiSaleCreate(BaseModel):
    customer_id: int
    items: List[SaleItemCreate]
    paid_amount: Optional[float] = None

class DuePaymentCreate(BaseModel):
    customer_id: int
    amount: float
    note: Optional[str] = "Cash Clearance"

class PurchaseCreate(BaseModel):
    product_id: int
    qty: float
    unit_cost: float
    new_selling_price: Optional[float] = None
    new_min_selling_price: Optional[float] = None
    supplier_name: Optional[str] = "Mill Stock"

class QuoteRequestCreate(BaseModel):
    customer_name: str
    phone: str
    delivery_locality: Optional[str] = "Onda"
    quote_type: Optional[str] = "Calculator Estimate"
    furniture_type: Optional[str] = "Custom Furniture"
    dimensions: Optional[str] = ""
    materials_breakdown: Optional[str] = ""
    estimated_cost: Optional[float] = 0.0
    notes: Optional[str] = ""

class CarpenterCallCreate(BaseModel):
    carpenter_id: int
    customer_name: Optional[str] = "Valued Customer"
    customer_phone: str
    customer_village: Optional[str] = "Onda"

class TestimonialCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_location: str
    project_title: str
    carpenter_name: Optional[str] = "-"
    image_base64: str
    invoice_no: Optional[str] = None
    cashback_upi: Optional[str] = None


class AppLoginRequest(BaseModel):
    phone: str
    pin_code: Optional[str] = "1234"

class AppSignupRequest(BaseModel):
    name: str
    phone: str
    location: Optional[str] = "Onda"
    pin_code: Optional[str] = "1234"

class ConsoleLoginRequest(BaseModel):
    pin: str
    remember: Optional[bool] = True
    role: Optional[str] = "owner"

class StaffVerifyRequest(BaseModel):
    passcode: Optional[str] = None
    pin: Optional[str] = None
    remember: Optional[bool] = True

class CashbackUpdateRequest(BaseModel):
    cashback_amount: float = 0.0
    cashback_status: str = "Paid"

class AIEstimateRequest(BaseModel):
    prompt: str
    plywood_grade: Optional[str] = "marine"
    finish_type: Optional[str] = "matte"

class CraftPostCreate(BaseModel):
    author_name: str
    author_role: Optional[str] = "Mistri"
    author_phone: Optional[str] = ""
    village_location: Optional[str] = "Onda"
    project_category: Optional[str] = "Wardrobe"
    caption: Optional[str] = ""
    materials_used: Optional[str] = ""
    image_base64: str
    bill_number: Optional[str] = None
    upi_id: Optional[str] = None


class CraftCommentCreate(BaseModel):
    commenter_name: str
    comment_text: str




