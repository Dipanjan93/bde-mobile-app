import os

# Crucial for Windows environments with application control policies
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Automatically uses the permanent Neon Cloud PostgreSQL Database
raw_db_url = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://neondb_owner:npg_ObrtiTZ9a5YW@ep-sweet-shape-b3jn07iv-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
).strip()

if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql+psycopg://", 1)
elif raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+psycopg://"):
    raw_db_url = raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)

raw_db_url = raw_db_url.replace("&channel_binding=require", "").replace("channel_binding=require&", "").replace("channel_binding=require", "")

DATABASE_URL = raw_db_url
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=10, max_overflow=20)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
