from google.cloud import speech_v1

MIME_TO_ENCODING = {
    "audio/webm": speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
    "audio/ogg": speech_v1.RecognitionConfig.AudioEncoding.OGG_OPUS,
}


async def transcribe_audio(audio_bytes: bytes, mime_type: str) -> str:
    """Transcribe audio bytes using Google Cloud Speech-to-Text."""
    client = speech_v1.SpeechClient()

    encoding = MIME_TO_ENCODING.get(
        mime_type,
        speech_v1.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
    )

    config = speech_v1.RecognitionConfig(
        encoding=encoding,
        language_code="en-US",
        enable_automatic_punctuation=True,
    )

    audio = speech_v1.RecognitionAudio(content=audio_bytes)
    response = client.recognize(config=config, audio=audio)

    transcript = " ".join(
        result.alternatives[0].transcript
        for result in response.results
        if result.alternatives
    )
    return transcript
