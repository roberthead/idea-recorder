# Idea Recorder

Full-stack application for capturing and organizing ideas. Python FastAPI backend with TypeScript React frontend.

## Tech Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy (async), Alembic, PostgreSQL
- **Frontend:** React 19, TypeScript, Vite, TanStack Query, Tailwind CSS

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose

## Setup

```bash
# Clone and configure environment
cp .env.example .env

# Start PostgreSQL
docker-compose up -d

# Backend
cd backend
python3 -m venv venv
venv/bin/pip install -e ".[dev]"
venv/bin/alembic upgrade head

# Frontend
cd ../frontend
npm install
```

## Development

```bash
# Start backend (from backend/)
venv/bin/uvicorn app.main:app --reload

# Start frontend (from frontend/)
npm run dev
```

The backend runs at http://localhost:8000 and the frontend at http://localhost:5173 (with API requests proxied to the backend).

## Validation

```bash
# Run all checks (lint + tests + typecheck)
make validate

# Individual targets
make lint-backend
make test-backend
make lint-frontend
make typecheck-frontend
```
