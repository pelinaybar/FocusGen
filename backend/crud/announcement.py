from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.models import Announcement
from schemas.announcement import AnnouncementCreate

async def create_announcement(db: AsyncSession, announcement: AnnouncementCreate):
    db_announcement = Announcement(
        teacher_id=announcement.teacher_id,
        class_id=announcement.class_id,
        message=announcement.message
    )
    db.add(db_announcement)
    await db.commit()
    await db.refresh(db_announcement)
    return db_announcement

async def get_announcements(db: AsyncSession):
    result = await db.execute(select(Announcement).order_by(Announcement.date.desc()))
    return result.scalars().all() 