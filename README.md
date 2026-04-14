
# AI Candidate Platform (Advanced Scoring)

## Features
- Resume Upload
- Async Processing (Celery + Redis)
- AI Semantic Scoring
- Keyword Matching
- Leaderboard Ranking

## Scoring Logic
Final Score =
0.6 * Semantic Similarity +
0.4 * Keyword Match

## Flow
1. Upload resume
2. Celery processes async
3. Extract text
4. Compute AI score
5. Save score
6. View leaderboard

## Run

pip install -r requirements.txt
python manage.py migrate

Run:
python manage.py runserver
redis-server
celery -A config worker -l info
