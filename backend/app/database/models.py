from sqlalchemy import Column, Integer, String, Text

from app.core.db import Base

class PDFFile(Base):
    __tablename__ = "pdfs"

    id = Column(Integer, primary_key=True)

    pdf_uuid = Column(String, unique=True, index=True)

    user_email = Column(String, index=True)

    original_name = Column(String)

    file_path = Column(String)

    text_content = Column(Text)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)

    question = Column(Text)

    answer = Column(Text)


class PDFChunk(Base):
    __tablename__ = "pdf_chunks"

    id = Column(Integer, primary_key=True)

    pdf_uuid = Column(String, index=True)

    chunk_text = Column(Text)

    embedding = Column(Text)