from pydantic import BaseModel
from datetime import datetime

class AnnouncementCreate(BaseModel):
    teacher_id: int
    class_id: int
    message: str

class AnnouncementOut(BaseModel):
    id: int
    teacher_id: int
    class_id: int
    message: str
    date: datetime

    class Config:
        orm_mode = True 