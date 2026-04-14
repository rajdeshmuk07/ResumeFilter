
from celery import shared_task
from .models import Candidate
from .utils import extract_text
from .scoring import semantic_score, keyword_score

JOB_DESC = "Looking for Python Django AWS developer"

@shared_task
def process_resume(cid):
    c = Candidate.objects.get(id=cid)
    text = extract_text(c.resume.path)

    # Use dynamic values from the candidate instance
    job_desc = c.job_description if c.job_description else "Professional Role"
    target_skills_list = [s.strip().lower() for s in c.target_skills.split(',') if s.strip()]
    if not target_skills_list:
        target_skills_list = ["skill"] # Fallback

    sem = semantic_score(text, job_desc)
    key = keyword_score(text, target_skills_list)

    final_score = (0.6 * sem) + (0.4 * key)

    # Generate a brief summary
    snippet = text[:200].replace('\n', ' ').strip()
    c.summary = f"Matching based on {len(target_skills_list)} target skills. Abstract: {snippet}..."
    c.skills = ", ".join(target_skills_list)
    c.score = round(final_score * 100, 2)
    c.save()
