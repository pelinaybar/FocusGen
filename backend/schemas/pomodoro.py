from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PomodoroCreate(BaseModel):
    user_id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    completed: bool = False

class PomodoroOut(BaseModel):
    id: int
    user_id: int
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    completed: bool

    class Config:
        orm_mode = True 