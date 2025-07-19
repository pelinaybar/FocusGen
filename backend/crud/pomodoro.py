from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.models import Pomodoro
from schemas.pomodoro import PomodoroCreate

async def create_pomodoro(db: AsyncSession, pomodoro: PomodoroCreate):
    db_pomodoro = Pomodoro(
        user_id=pomodoro.user_id,
        start_time=pomodoro.start_time,
        end_time=pomodoro.end_time,
        completed=pomodoro.completed
    )
    db.add(db_pomodoro)
    await db.commit()
    await db.refresh(db_pomodoro)
    return db_pomodoro

async def get_pomodoros_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(Pomodoro).where(Pomodoro.user_id == user_id))
    return result.scalars().all() 