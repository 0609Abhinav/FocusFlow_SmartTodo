Smart Todo List with AI

Full-stack assignment implementation: Django REST (PostgreSQL) + Next.js (Tailwind) + AI (LM Studio or OpenAI-compatible).

📌 Overview

AI-assisted task manager with:

Priority scoring

Deadline suggestions

Context-aware task enhancements
Built using Django REST, Next.js, TailwindCSS, and PostgreSQL with optional LM Studio or OpenAI AI integration.

🖼️ Screenshot

🚀 Quick Start (without Docker)
Backend
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py loaddata sample_data/categories.json
python manage.py loaddata sample_data/tasks.json
python manage.py loaddata sample_data/context_entries.json
python manage.py runserver 0.0.0.0:8000

Frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev

AI

LM Studio: Run local server (e.g., http://localhost:1234/v1) and set AI_PROVIDER=lmstudio in backend .env.

OpenAI: Set AI_PROVIDER=openai, OPENAI_API_KEY, and AI_MODEL in backend .env.

🐳 Docker Setup
docker compose up -d db
docker compose run --rm backend python manage.py migrate
docker compose run --rm backend python manage.py loaddata sample_data/categories.json
docker compose run --rm backend python manage.py loaddata sample_data/tasks.json
docker compose run --rm backend python manage.py loaddata sample_data/context_entries.json
docker compose up -d backend frontend

🔌 API Endpoints

GET /api/tasks/

POST /api/tasks/

GET /api/categories/

GET /api/contexts/

POST /api/contexts/

POST /api/ai/suggest/

⚙️ Environment Variables
Backend (backend/.env)
DEBUG=true
SECRET_KEY=change-me
DATABASE_URL=postgres://user:pass@db:5432/app
AI_PROVIDER=lmstudio        # or openai
AI_MODEL=                    # required for openai
OPENAI_API_KEY=              # required for openai

Frontend (frontend/.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:8000

🗂️ Project Structure
smart-todo-ai/
├── backend/
│   ├── manage.py
│   ├── app/...
│   └── sample_data/
├── frontend/
│   ├── app/
│   ├── public/
│   │   └── preview.png
│   └── styles/
├── docker-compose.yml
└── README.md

👨‍💻 Developer


Abhinav Tripathi
LinkedIn | GitHub | Email