from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from database import get_db
from api.user import router as user_router
from api.focus_score import router as focus_router
from api.announcement import router as announcement_router
from api.pomodoro import router as pomodoro_router
from api.class_ import router as class_router

app = FastAPI()

# CORS middleware ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için tüm originlere izin veriyoruz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(focus_router)
app.include_router(announcement_router)
app.include_router(pomodoro_router)
app.include_router(class_router)

@app.get("/")
def read_root():
    return {"message": "Backend çalışıyor!"}

@app.get("/db-test")
async def db_test(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        return {"success": True, "result": result.scalar()}
    except Exception as e:
        return {"success": False, "error": str(e)} 