
import PyPDF2

def extract_text(path):
    text = ""
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for p in reader.pages:
            text += p.extract_text()
    return text
