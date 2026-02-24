# Recording page

AS a user
ON the homepage
I WANT to see a recording section
AND I WANT to see a list of messages, sorted by recency

AS a user
WHEN I click the record button
AND I record a message
AND I click stop
I WANT to see the the new message listed in a list of messages

## Notes

The messages must be transcribed to plain text

Use the Google Speech to Text API

Use mobile-first design

## Known prerequisites

Access to the Google Speech to Text service

## Implementation plan

### Phase 1: Backend

1. **Add `python-multipart` dependency** to `backend/pyproject.toml` (required by FastAPI for file uploads)

2. **Define Message model** in `backend/app/models.py`
   - `id`: UUID primary key
   - `transcript`: Text, not null
   - `duration_seconds`: Float, nullable
   - `created_at`: DateTime with timezone, server default now()

3. **Create Alembic migration** for messages table and apply it
   - use `alembic revision --autogenerate -m "create messages"`

4. **Add Pydantic response schema** in new `backend/app/schemas.py`
   - `MessageOut`: id, transcript, duration_seconds, created_at

5. **Add transcription service stub** in new `backend/app/services/transcription.py`
   - Returns placeholder text for now; Google Speech-to-Text wired up later

6. **Add API endpoints** in `backend/app/api/endpoints.py`
   - `POST /messages` — accepts audio file upload, calls transcription, stores message, returns 201
   - `GET /messages` — returns messages ordered by created_at desc

7. **Backend tests** in `backend/tests/test_messages.py`
   - POST with audio file, GET sorted messages, POST missing audio returns 422

### Phase 2: Frontend

8. **Add API layer** in new `frontend/src/api/messages.ts`
   - `fetchMessages()` and `createMessage(audioBlob)` functions
   - `useMessages()` and `useCreateMessage()` TanStack Query hooks

9. **Audio recorder hook** in new `frontend/src/hooks/useAudioRecorder.ts`
   - Manages MediaRecorder lifecycle (start/stop)
   - Handles microphone permission errors
   - Detects supported MIME type (webm vs mp4 for Safari)

10. **RecordButton component** in new `frontend/src/components/RecordButton.tsx`
    - Large circular button with mobile-friendly touch target
    - States: idle, recording (pulsing), submitting (spinner), error

11. **MessageCard component** in new `frontend/src/components/MessageCard.tsx`
    - Displays transcript text and relative timestamp

12. **MessageList component** in new `frontend/src/components/MessageList.tsx`
    - Loading, empty, and populated states

13. **Update Home page** (`frontend/src/pages/Home.tsx`)
    - Compose RecordButton + MessageList with mobile-first layout

14. **Frontend tests**
    - RecordButton, MessageList, and Home smoke tests
