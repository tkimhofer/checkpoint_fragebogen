from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP

class Base(DeclarativeBase):
  pass

class Submission(Base):
  __tablename__ = "submissions"

  id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
  created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False)
  payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
  source: Mapped[str] = mapped_column(nullable=False, server_default=text("'tauri'"))
