
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def semantic_score(resume_text, job_desc):
    model = get_model()
    emb1 = model.encode([resume_text])
    emb2 = model.encode([job_desc])
    return cosine_similarity(emb1, emb2)[0][0]

def keyword_score(resume_text, job_skills):
    resume_words = set(resume_text.lower().split())
    job_words = set(job_skills)
    return len(resume_words & job_words) / len(job_words)
