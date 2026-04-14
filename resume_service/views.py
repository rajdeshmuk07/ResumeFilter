
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Candidate
from .tasks import process_resume

def home(request):
    return render(request, 'index.html')

@api_view(['POST'])
def upload_resume(request):
    name = request.data.get('name')
    resume = request.FILES.get('resume')
    job_desc = request.data.get('job_description', '')
    target_skills = request.data.get('target_skills', '')
    
    c = Candidate.objects.create(
        name=name, 
        resume=resume,
        job_description=job_desc,
        target_skills=target_skills
    )
    process_resume.delay(c.id)
    return Response({"message": "Processing started", "id": c.id})

@api_view(['GET'])
def leaderboard(request):
    data = Candidate.objects.all().order_by('-score')
    return Response([
        {
            "id": x.id,
            "name": x.name, 
            "score": x.score,
            "summary": x.summary,
            "target_skills": x.target_skills
        } for x in data
    ])
