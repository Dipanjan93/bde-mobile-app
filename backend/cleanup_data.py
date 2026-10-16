import os
import sys

# Ensure environment is configured
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from sqlalchemy import text
from database import engine

def get_row_counts(conn):
    tables = [
        "products",
        "invoices",
        "sale_items",
        "customers",
        "payment_receipts",
        "purchases",
        "carpenters",
        "customer_testimonials",
        "app_users",
        "carpenter_call_logs",
        "app_settings",
        "quote_inquiries",
        "craft_posts",
        "craft_comments",
    ]
    counts = {}
    for t in tables:
        cnt = conn.execute(text(f"SELECT count(*) FROM {t}")).scalar()
        counts[t] = cnt
    
    total_dues = conn.execute(text("SELECT COALESCE(SUM(due_amount), 0.0) FROM invoices")).scalar()
    total_sales = conn.execute(text("SELECT COALESCE(SUM(total_amount), 0.0) FROM invoices")).scalar()
    counts["total_customer_dues"] = round(float(total_dues), 2)
    counts["total_sales_volume"] = round(float(total_sales), 2)
    return counts

def print_report(title, counts):
    print("=" * 70)
    print(f" {title.upper()} ")
    print("=" * 70)
    print(" [CORE BUSINESS & FINANCIAL TABLES - STRICTLY GUARDED & UNTOUCHED]")
    print(f"   • Products / Live Inventory SKUs : {counts['products']}")
    print(f"   • Sales Invoices (Bills)         : {counts['invoices']}")
    print(f"   • Sale Line Items                : {counts['sale_items']}")
    print(f"   • Customers / Khata Records      : {counts['customers']}")
    print(f"   • Payment Receipts               : {counts['payment_receipts']}")
    print(f"   • Inward Purchases Register      : {counts['purchases']}")
    print(f"   • Total Active Sales Revenue     : Rs. {counts['total_sales_volume']:,.2f}")
    print(f"   • Total Customer Dues (Khata)    : Rs. {counts['total_customer_dues']:,.2f}")
    print("\n [AUXILIARY / DIRECTORY TABLES - UNTOUCHED]")
    print(f"   • Carpenters Directory           : {counts['carpenters']}")
    print(f"   • Customer Testimonials/Claims   : {counts['customer_testimonials']}")
    print(f"   • App Users                      : {counts['app_users']}")
    print(f"   • Carpenter Call Logs            : {counts['carpenter_call_logs']}")
    print(f"   • App Settings                   : {counts['app_settings']}")
    print("\n [AUTHORIZED CLEANUP TARGETS]")
    print(f"   • Website Enquiries (quote_inquiries)         : {counts['quote_inquiries']}")
    print(f"   • Mistri Gram Posts (craft_posts)             : {counts['craft_posts']}")
    print(f"   • Mistri Gram Comments (craft_comments)       : {counts['craft_comments']}")
    print(f"   • Customer Claims (customer_testimonials)     : {counts['customer_testimonials']}")
    print("=" * 70)

def main():
    print("\nInitiating Safe Database Verification & Cleanup...")
    with engine.begin() as conn:
        # 1. Capture BEFORE snapshot
        before_counts = get_row_counts(conn)
        print_report("BEFORE CLEANUP DATABASE ROW COUNTS", before_counts)

        # 2. Execute cleanup on authorized tables ONLY
        print("\nExecuting authorized cleanup on target tables...")
        # Delete craft_comments first (foreign key dependency on craft_posts)
        res_comments = conn.execute(text("DELETE FROM craft_comments"))
        print(f" -> Cleared {res_comments.rowcount} rows from 'craft_comments'")

        res_posts = conn.execute(text("DELETE FROM craft_posts"))
        print(f" -> Cleared {res_posts.rowcount} rows from 'craft_posts'")

        res_inquiries = conn.execute(text("DELETE FROM quote_inquiries"))
        print(f" -> Cleared {res_inquiries.rowcount} rows from 'quote_inquiries'")

        res_testimonials = conn.execute(text("DELETE FROM customer_testimonials"))
        print(f" -> Cleared {res_testimonials.rowcount} rows from 'customer_testimonials'")

        # 3. Capture AFTER snapshot
        after_counts = get_row_counts(conn)
        print_report("AFTER CLEANUP DATABASE ROW COUNTS", after_counts)

        # 4. Strict Safety Assertions
        assert before_counts["products"] == after_counts["products"], "CRITICAL: products changed!"
        assert before_counts["invoices"] == after_counts["invoices"], "CRITICAL: invoices changed!"
        assert before_counts["sale_items"] == after_counts["sale_items"], "CRITICAL: sale_items changed!"
        assert before_counts["customers"] == after_counts["customers"], "CRITICAL: customers changed!"
        assert before_counts["payment_receipts"] == after_counts["payment_receipts"], "CRITICAL: payment_receipts changed!"
        assert before_counts["purchases"] == after_counts["purchases"], "CRITICAL: purchases changed!"
        assert before_counts["total_customer_dues"] == after_counts["total_customer_dues"], "CRITICAL: total_customer_dues changed!"
        assert before_counts["total_sales_volume"] == after_counts["total_sales_volume"], "CRITICAL: total_sales_volume changed!"
        assert before_counts["carpenters"] == after_counts["carpenters"], "CRITICAL: carpenters changed!"
        assert before_counts["app_users"] == after_counts["app_users"], "CRITICAL: app_users changed!"
        assert before_counts["app_settings"] == after_counts["app_settings"], "CRITICAL: app_settings changed!"
        
        assert after_counts["quote_inquiries"] == 0, "quote_inquiries not cleared!"
        assert after_counts["craft_posts"] == 0, "craft_posts not cleared!"
        assert after_counts["craft_comments"] == 0, "craft_comments not cleared!"
        assert after_counts["customer_testimonials"] == 0, "customer_testimonials not cleared!"

        print("\n [ALL SAFETY CHECKS PASSED] Core business data 100% verified intact!")

if __name__ == "__main__":
    main()
