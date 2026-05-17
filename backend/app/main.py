from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.pdf_routes import router as pdf_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_router)