"""SQLAlchemy models for CrateJuice."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Postcard(Base):
    """Represents a postcard - a curated music selection or playlist."""
    __tablename__ = 'postcards'

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    creator = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)
    track_ids = Column(Text)  # JSON array of track IDs

    def __repr__(self):
        return f"<Postcard(id={self.id}, title='{self.title}')>"


class RipResult(Base):
    """Represents the result of a music rip operation."""
    __tablename__ = 'rip_results'

    id = Column(Integer, primary_key=True)
    source_url = Column(String(500), nullable=False)
    title = Column(String(200))
    artist = Column(String(200))
    duration = Column(Float)  # Duration in seconds
    file_path = Column(String(500))
    file_size = Column(Integer)  # Size in bytes
    format = Column(String(20))  # e.g., 'mp3', 'wav'
    bitrate = Column(String(20))  # e.g., '192K'
    status = Column(String(20), default='pending', nullable=False)  # pending, completed, failed
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime)

    def __repr__(self):
        return f"<RipResult(id={self.id}, title='{self.title}', status='{self.status}')>"
