import os

import pytest

from app.services.transcription import transcribe_audio

_cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
has_credentials = _cred_path is not None and os.path.isfile(_cred_path)


@pytest.mark.skipif(not has_credentials, reason="GOOGLE_APPLICATION_CREDENTIALS not set")
async def test_transcribe_silence():
    """Integration test: transcribing near-silence returns empty or minimal transcript."""
    # 0.5s of silence in a minimal webm-like payload won't produce meaningful results,
    # but this verifies the API call itself works without error.
    # For a real test, use an actual audio fixture file.
    result = await transcribe_audio(b"\x00" * 1000, "audio/webm")
    assert isinstance(result, str)
