from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.pomodoro import PomodoroCreate, PomodoroOut
from crud.pomodoro import create_pomodoro, get_pomodoros_by_user
from typing import List

router = APIRouter(prefix="/pomodoros", tags=["pomodoros"])

@router.post("/add", response_model=PomodoroOut)
async def add_pomodoro(pomodoro: PomodoroCreate, db: AsyncSession = Depends(get_db)):
    new_pomodoro = await create_pomodoro(db, pomodoro)
    return new_pomodoro

@router.get("/user/{user_id}", response_model=List[PomodoroOut])
async def list_pomodoros(user_id: int, db: AsyncSession = Depends(get_db)):
    pomodoros = await get_pomodoros_by_user(db, user_id)
    return pomodoros 