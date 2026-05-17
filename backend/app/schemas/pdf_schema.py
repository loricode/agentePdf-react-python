from pydantic import BaseModel

class AskRequest(BaseModel):
    question: str
    pdf_uuid: str