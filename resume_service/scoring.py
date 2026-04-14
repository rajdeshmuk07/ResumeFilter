
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

def semantic_score(resume_text, job_desc):
    """Lightweight TF-IDF based semantic similarity"""
    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_desc])
        return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except Exception:
        # Fallback to simple word overlap if TF-IDF fails
        resume_words = set(resume_text.lower().split())
        job_words = set(job_desc.lower().split())
        if not job_words:
            return 0.0
        return len(resume_words & job_words) / len(job_words)

def keyword_score(resume_text, job_skills):
    resume_words = set(resume_text.lower().split())
    job_words = set(job_skills)
    if not job_words:
        return 0.0
    return len(resume_words & job_words) / len(job_words)
