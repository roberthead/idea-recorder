import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from google.api_core.exceptions import GoogleAPICallError
from google.auth.exceptions import DefaultCredentialsError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Message
from app.schemas import MessageOut
from app.services.transcription import transcribe_audio

router = APIRouter()


@router.get("/status")
async def status():
    return {"status": "ok"}


@router.get("/messages", response_model=list[MessageOut])
async def list_messages(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Message).order_by(Message.created_at.desc()))
    return result.scalars().all()


@router.post("/messages", response_model=MessageOut, status_code=201)
async def create_message(
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    audio_bytes = await audio.read()
    try:
        transcript = await transcribe_audio(audio_bytes, audio.content_type or "audio/webm")
    except DefaultCredentialsError:
        logging.error("Google Cloud credentials not configured")
        raise HTTPException(status_code=502, detail="Transcription service is not configured.")
    except GoogleAPICallError:
        raise HTTPException(status_code=502, detail="Transcription failed. Please try again.")
    message = Message(transcript=transcript)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message
