from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.focus_score import FocusScoreCreate, FocusScoreOut
from crud.focus_score import create_focus_score, get_focus_scores_by_user, get_latest_focus_by_class
from models.models import User, FocusScore
from typing import List
from sqlalchemy.future import select

router = APIRouter(prefix="/focus", tags=["focus"])

@router.post("/add", response_model=FocusScoreOut)
async def add_focus_score(focus_score: FocusScoreCreate, db: AsyncSession = Depends(get_db)):
    new_focus = await create_focus_score(db, focus_score)
    return new_focus

@router.get("/user/{user_id}", response_model=List[FocusScoreOut])
async def list_focus_scores(user_id: int, db: AsyncSession = Depends(get_db)):
    scores = await get_focus_scores_by_user(db, user_id)
    return scores

@router.get("/latest-all")
async def latest_focus_all(db: AsyncSession = Depends(get_db)):
    # Tüm öğrencileri çek
    users_result = await db.execute(select(User).where(User.role == 'student'))
    students = users_result.scalars().all()
    # Her öğrenci için son odak puanını bul
    result = []
    for student in students:
        focus_result = await db.execute(
            select(FocusScore).where(FocusScore.user_id == student.id).order_by(FocusScore.date.desc())
        )
        last_focus = focus_result.scalars().first()
        result.append({
            'id': student.id,
            'name': student.name,
            'score': last_focus.score if last_focus else 0,
            'date': last_focus.date.isoformat() if last_focus else None
        })
    return result

@router.get("/class/{class_id}")
async def latest_focus_by_class(class_id: int, db: AsyncSession = Depends(get_db)):
    return await get_latest_focus_by_class(db, class_id) 