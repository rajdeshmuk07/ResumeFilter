
from django.db import models

class Candidate(models.Model):
    name = models.CharField(max_length=100)
    resume = models.FileField(upload_to='resumes/')
    job_description = models.TextField(blank=True)
    target_skills = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    skills = models.TextField(blank=True)  # This will store extracted skills
    score = models.FloatField(default=0)
