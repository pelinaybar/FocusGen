from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.models import FocusScore, User, StudentClass
from schemas.focus_score import FocusScoreCreate

async def create_focus_score(db: AsyncSession, focus_score: FocusScoreCreate):
    db_focus = FocusScore(
        user_id=focus_score.user_id,
        score=focus_score.score
    )
    db.add(db_focus)
    await db.commit()
    await db.refresh(db_focus)
    return db_focus

async def get_focus_scores_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(FocusScore).where(FocusScore.user_id == user_id))
    return result.scalars().all()

async def get_latest_focus_by_class(db: AsyncSession, class_id: int):
    # Sınıfa ait öğrenci id'lerini bul
    result = await db.execute(select(StudentClass).where(StudentClass.class_id == class_id))
    student_classes = result.scalars().all()
    student_ids = [sc.student_id for sc in student_classes]
    if not student_ids:
        return []
    # Öğrencileri çek
    users_result = await db.execute(select(User).where(User.id.in_(student_ids)))
    students = users_result.scalars().all()
    # Her öğrenci için son odak puanını bul
    output = []
    for student in students:
        focus_result = await db.execute(
            select(FocusScore).where(FocusScore.user_id == student.id).order_by(FocusScore.date.desc())
        )
        last_focus = focus_result.scalars().first()
        output.append({
            'id': student.id,
            'name': student.name,
            'score': last_focus.score if last_focus else 0,
            'date': last_focus.date.isoformat() if last_focus else None
        })
    return output 