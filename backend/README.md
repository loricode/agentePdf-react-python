
# Version 
python 3.14-64

# Crear el entorno virtaul
python -m venv venv   

# Activar el entorno virtual 
venv\Scripts\activate 

# Paquetes utilizados
pip install pymupdf python-multipart sqlalchemy aiosqlite orjson fastapi uvicorn 
sentence-transformers  

# para correr la app
uvicorn app:app --reload