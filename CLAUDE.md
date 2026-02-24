# Idea Recorder

Full-stack application for capturing and organizing ideas.

## Tech Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy (async), Alembic, PostgreSQL
- **Frontend:** React 19, TypeScript, Vite, TanStack Query, React Router, Tailwind CSS 4
- **Infrastructure:** Docker Compose (PostgreSQL 16)

## Project Structure

```
backend/           Python FastAPI backend
  app/             Application package
    api/           API route endpoints
    core/          Config and database setup
    models.py      SQLAlchemy models
  alembic/         Database migrations
  tests/           pytest test suite
frontend/          React TypeScript frontend
  src/
    api/           Axios API client
    components/    Reusable React components
    pages/         Page-level components
    test/          Test setup
user-stories/      Feature requirements
```

## Development Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Backend (from backend/)
venv/bin/uvicorn app.main:app --reload    # runs on :8000

# Frontend (from frontend/)
npm run dev                                # runs on :5173, proxies /api to :8000
```

## Validation

```bash
make validate              # Run ALL checks (always run before committing)
make validate-backend      # ruff check + pytest
make validate-frontend     # eslint + tsc + vitest
```

Individual targets: `make lint-backend`, `make test-backend`, `make lint-frontend`, `make typecheck-frontend`, `make test-frontend`

## Conventions

- Always run `make validate` before committing. All checks must pass.
- Backend linting uses ruff with rules E, F, I (pycodestyle, pyflakes, isort).
- Frontend uses strict TypeScript (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`).
- CORS origins are configured via `CORS_ORIGINS` setting, not wildcards.
- Backend dependencies: runtime deps in `[project.dependencies]`, test/dev tools in `[project.optional-dependencies] dev`.
- Frontend test files live alongside source files as `*.test.tsx`.
- Test setup is in `frontend/src/test/setup.ts` (testing-library/jest-dom matchers).
- Accessibility: Layout uses skip-to-content link and `id="main-content"` on `<main>`. Maintain this pattern.
- Mobile-first design approach with Tailwind CSS.
- User stories are tracked in `user-stories/` as markdown files.
