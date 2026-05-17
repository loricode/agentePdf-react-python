import fitz

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