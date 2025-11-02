"""Database session factory for CrateJuice."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from backend.models import Base

# Default to SQLite for local development, allow DATABASE_URL env var for production
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///./cratejuice.db')

# Handle Heroku/Render postgres:// to postgresql:// conversion
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=os.environ.get('SQL_ECHO', '').lower() == 'true'
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Session = scoped_session(SessionLocal)


def get_db():
    """Dependency for getting a database session."""
    db = Session()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables."""
    Base.metadata.create_all(bind=engine)
