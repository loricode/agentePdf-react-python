import json
import os

from uuid import uuid4

from app.database.models import PDFChunk, PDFFile
from app.services.embedding_service import (
    create_embedding,
    cosine,
    model,
)

from app.utils.pdf_utils import (
    extract_text,
    chunk_text,
)

from app.core.config import UPLOAD_DIR

os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_pdf(db, email, file):

    pdf_uuid = str(uuid4())

    path = f"{UPLOAD_DIR}/{pdf_uuid}.pdf"

    with open(path, "wb") as f:
        f.write(file)

    text = extract_text(path)

    pdf = PDFFile(
        pdf_uuid=pdf_uuid,
        user_email=email,
        original_name="uploaded.pdf",
        file_path=path,
        text_content=text[:20000]
    )

    db.add(pdf)

    chunks = chunk_text(text)

    for c in chunks:

        embedding = create_embedding(c)

        db.add(
            PDFChunk(
                pdf_uuid=pdf_uuid,
                chunk_text=c,
                embedding=json.dumps(embedding)
            )
        )

    db.commit()

    return pdf_uuid


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