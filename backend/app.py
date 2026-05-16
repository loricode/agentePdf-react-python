from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import UploadFile
from fastapi import File
from fastapi import Form

import fitz
import json
from pydantic import BaseModel
from sqlalchemy import String
from uuid import uuid4
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    Text,
)

from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

import asyncio
import orjson
import os
import shutil

# ==========================================
# DATABASE
# ==========================================

DATABASE_URL = "sqlite:///./chat.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class PDFFile(Base):
    __tablename__ = "pdfs"

    id = Column(Integer, primary_key=True)

    pdf_uuid = Column(
        String,
        unique=True,
        index=True,
    )

    user_email = Column(
        String,
        index=True,
    )

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


Base.metadata.create_all(bind=engine)

class AskRequest(BaseModel):
    question: str
    pdf_uuid: str


def extract_text(file_path: str) -> str:
    doc = fitz.open(file_path)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    return text

def chunk_text(text: str, size: int = 800):
    return [
        text[i:i + size]
        for i in range(0, len(text), size)
    ]


def cosine(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))    

def search_chunks(db, pdf_uuid: str, query: str):

    query_vec = model.encode(query)

    chunks = db.query(PDFChunk).filter(
        PDFChunk.pdf_uuid == pdf_uuid
    ).all()

    scored = []

    for c in chunks:

        vec = json.loads(c.embedding)

        score = cosine(query_vec, vec)

        scored.append((score, c.chunk_text))

    scored.sort(reverse=True, key=lambda x: x[0])

    return [s[1] for s in scored[:5]]


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sse(data):
    return f"data: {orjson.dumps(data).decode()}\n\n".encode()

@app.post("/ask-pdf")
async def ask_pdf(body: AskRequest):

    db = SessionLocal()

    chunks = search_chunks(
        db,
        body.pdf_uuid,
        body.question
    )

    context = "\n\n".join(chunks)

    async def stream():

        answer = f"""{context}"""

        for word in answer.split():
            yield word + " "
            await asyncio.sleep(0.02)

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
    )


@app.get("/messages")
def get_messages():

    db = SessionLocal()

    messages = db.query(Message).all()

    return [
        {
            "id": m.id,
            "question": m.question,
            "answer": m.answer,
        }
        for m in messages
    ]


@app.post("/upload-pdf")
async def upload_pdf(
    email: str = Form(...),
    file: UploadFile = File(...)
):

    db = SessionLocal()

    try:
        # 1. asegurar carpeta
        os.makedirs("uploads", exist_ok=True)

        # 2. generar uuid
        pdf_uuid = str(uuid4())

        # 3. guardar archivo
        path = f"uploads/{pdf_uuid}.pdf"

        with open(path, "wb") as f:
            f.write(await file.read())

        # 4. extraer texto
        text = extract_text(path)

        # 5. guardar metadata del PDF
        pdf = PDFFile(
            pdf_uuid=pdf_uuid,
            user_email=email,
            original_name=file.filename,
            file_path=path,
            text_content=text[:20000]  # opcional para no inflar SQLite
        )

        db.add(pdf)

        # 6. crear chunks
        chunks = chunk_text(text)

        for c in chunks:
            embedding = model.encode(c).tolist()

            db.add(PDFChunk(
                pdf_uuid=pdf_uuid,
                chunk_text=c,
                embedding=json.dumps(embedding)
            ))

        db.commit()

        return {
            "success": True,
            "pdf_uuid": pdf_uuid
        }

    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e)
        }

    finally:
        db.close()   

@app.get("/search-pdfs")
def search_pdfs(q: str):

    db = SessionLocal()

    results = db.query(PDFFile).filter(
        PDFFile.original_name.ilike(f"%{q}%")
    ).limit(10).all()

    return [
        {
            "pdf_uuid": p.pdf_uuid,
            "name": p.original_name
        }
        for p in results
    ]