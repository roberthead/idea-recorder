# Google Speech-to-Text integration

AS a user
WHEN I record and submit a voice message
I WANT the message to be transcribed to plain text using Google Speech-to-Text
SO THAT I can read my recorded ideas as text

## Acceptance criteria

- Recorded audio is sent to the Google Speech-to-Text API and the transcript is stored
- The transcription service replaces the current placeholder stub in `backend/app/services/transcription.py`
- WebM/Opus audio (Chrome/Firefox) and MP4/AAC audio (Safari) are both supported
- Transcription errors are handled gracefully and surfaced to the user
- Google Cloud credentials are configured via environment variables, not hardcoded

## Notes

- Use the Google Cloud Speech-to-Text v1 API (`google-cloud-speech` Python client)
- Authenticate via `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to a service account JSON key
- Use synchronous `recognize` for short recordings (under 1 minute)
- Enable automatic punctuation
- Default language: `en-US`

## Known prerequisites

- A Google Cloud project with the Speech-to-Text API enabled
- A service account with Speech-to-Text permissions and a downloaded JSON key file
