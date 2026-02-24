.PHONY: validate validate-backend validate-frontend lint-backend lint-frontend test-backend test-frontend typecheck-frontend

validate: validate-backend validate-frontend

validate-backend: lint-backend test-backend

validate-frontend: lint-frontend typecheck-frontend test-frontend

lint-backend:
	cd backend && venv/bin/ruff check .

test-backend:
	cd backend && venv/bin/pytest

lint-frontend:
	cd frontend && npm run lint

typecheck-frontend:
	cd frontend && npm run typecheck

test-frontend:
	cd frontend && npm test
