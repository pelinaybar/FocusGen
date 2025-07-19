from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.announcement import AnnouncementCreate, AnnouncementOut
from crud.announcement import create_announcement, get_announcements
from models.models import Announcement
from typing import List
from sqlalchemy.future import select

router = APIRouter(prefix="/announcements", tags=["announcements"])

@router.post("/add", response_model=AnnouncementOut)
async def add_announcement(announcement: AnnouncementCreate, db: AsyncSession = Depends(get_db)):
    new_announcement = await create_announcement(db, announcement)
    return new_announcement

@router.get("/all", response_model=List[AnnouncementOut])
async def list_announcements(db: AsyncSession = Depends(get_db)):
    announcements = await get_announcements(db)
    return announcements

@router.get("/class/{class_id}", response_model=List[AnnouncementOut])
async def list_announcements_by_class(class_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Announcement).where(Announcement.class_id == class_id).order_by(Announcement.date.desc()))
    return result.scalars().all() 