from unittest.mock import AsyncMock, patch

from google.api_core.exceptions import GoogleAPICallError
from google.auth.exceptions import DefaultCredentialsError
from httpx import AsyncClient


@patch("app.services.transcription.speech_v1")
async def test_list_messages_empty(mock_speech, client: AsyncClient):
    response = await client.get("/api/v1/messages")
    assert response.status_code == 200
    assert response.json() == []


@patch("app.api.endpoints.transcribe_audio", new_callable=AsyncMock)
async def test_create_message(mock_transcribe, client: AsyncClient):
    mock_transcribe.return_value = "Hello world"
    response = await client.post(
        "/api/v1/messages",
        files={"audio": ("recording.webm", b"fake audio data", "audio/webm")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["transcript"] == "Hello world"
    assert "id" in data
    assert "created_at" in data
    mock_transcribe.assert_called_once_with(b"fake audio data", "audio/webm")


@patch("app.api.endpoints.transcribe_audio", new_callable=AsyncMock)
async def test_create_message_missing_audio(mock_transcribe, client: AsyncClient):
    response = await client.post("/api/v1/messages")
    assert response.status_code == 422


@patch("app.api.endpoints.transcribe_audio", new_callable=AsyncMock)
async def test_messages_sorted_by_recency(mock_transcribe, client: AsyncClient):
    mock_transcribe.return_value = "test"
    await client.post("/api/v1/messages", files={"audio": ("a.webm", b"first", "audio/webm")})
    await client.post("/api/v1/messages", files={"audio": ("b.webm", b"second", "audio/webm")})

    response = await client.get("/api/v1/messages")
    assert response.status_code == 200
    messages = response.json()
    assert len(messages) == 2
    assert messages[0]["created_at"] >= messages[1]["created_at"]


@patch("app.api.endpoints.transcribe_audio", new_callable=AsyncMock)
async def test_create_message_transcription_failure(mock_transcribe, client: AsyncClient):
    mock_transcribe.side_effect = GoogleAPICallError("Service unavailable")
    response = await client.post(
        "/api/v1/messages",
        files={"audio": ("recording.webm", b"fake audio data", "audio/webm")},
    )
    assert response.status_code == 502
    assert response.json()["detail"] == "Transcription failed. Please try again."


@patch("app.api.endpoints.transcribe_audio", new_callable=AsyncMock)
async def test_create_message_missing_credentials(mock_transcribe, client: AsyncClient):
    mock_transcribe.side_effect = DefaultCredentialsError("not found")
    response = await client.post(
        "/api/v1/messages",
        files={"audio": ("recording.webm", b"fake audio data", "audio/webm")},
    )
    assert response.status_code == 502
    assert response.json()["detail"] == "Transcription service is not configured."
