from app.core.db import engine
from app.database.models import *

from app.core.db import Base

Base.metadata.create_all(bind=engine)