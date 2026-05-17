import uvicorn

from app.core.db import engine, Base
from app.database import models

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database initialized")


def start():
    print("Starting application...")

    init_db()

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )


if __name__ == "__main__":
    start()