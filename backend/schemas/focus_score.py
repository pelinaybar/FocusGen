from pydantic import BaseModel
from datetime import datetime

class FocusScoreCreate(BaseModel):
    user_id: int
    score: int

class FocusScoreOut(BaseModel):
    id: int
    user_id: int
    score: int
    date: datetime

    class Config:
        orm_mode = True 