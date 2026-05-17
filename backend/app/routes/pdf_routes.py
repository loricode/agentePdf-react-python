import asyncio

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Form

from fastapi.responses import StreamingResponse

from app.core.db import SessionLocal
from app.database.models import Message, PDFFile

from app.schemas.pdf_schema import AskRequest

from app.services.pdf_service import (
    search_chunks,
    save_pdf,
)

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(
    email: str = Form(...),
    file: UploadFile = File(...)
):

    db = SessionLocal()

    try:

        pdf_uuid = save_pdf(
            db,
            email,
            await file.read()
        )

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


@router.post("/ask-pdf")
async def ask_pdf(body: AskRequest):

    db = SessionLocal()

    chunks = search_chunks(
        db,
        body.pdf_uuid,
        body.question
    )

    context = "\n\n".join(chunks)

    async def stream():

        answer = context

        for word in answer.split():

            yield word + " "

            await asyncio.sleep(0.02)

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
    )


@router.get("/messages")
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


@router.get("/search-pdfs")
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