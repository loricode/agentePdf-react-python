import orjson

def sse(data):
    return f"data: {orjson.dumps(data).decode()}\n\n".encode()