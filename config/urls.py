
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from resume_service.views import upload_resume, leaderboard, home

urlpatterns = [
    path('', home, name='home'),
    path('upload/', upload_resume),
    path('leaderboard/', leaderboard),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
