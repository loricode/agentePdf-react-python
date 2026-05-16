
# version python 3.14-64

# crear el entorno virtaul
python -m venv venv   

 # para activar el entorno virtual 
 venv\Scripts\activate 

# paquetes
 pip install pymupdf 
 pip install python-multipart
 pip install sqlalchemy aiosqlite  
 pip install orjson 
 pip install fastapi uvicorn 
 pip install sentence-transformers  


# para correr la app
uvicorn app:app --reload