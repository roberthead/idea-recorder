import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageOut(BaseModel):
    id: uuid.UUID
    transcript: str
    duration_seconds: float | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
