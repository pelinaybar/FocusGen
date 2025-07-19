from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.user import UserCreate, UserLogin, UserOut
from crud.user import create_user, get_user_by_email, verify_password
from models.models import User
from typing import List
from sqlalchemy.future import select

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu email ile kayıtlı kullanıcı zaten var.")
    new_user = await create_user(db, user)
    return new_user

@router.post("/login", response_model=UserOut)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Geçersiz email veya şifre.")
    return db_user

@router.get("/all", response_model=List[UserOut])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users 