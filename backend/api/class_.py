from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.class_ import ClassCreate, ClassOut, StudentClassCreate, StudentClassOut, StudentJoinClass
from crud.class_ import create_class, get_classes_by_teacher, get_all_classes, create_student_class, get_students_by_class, get_classes_by_student, delete_class, join_class_by_code
from typing import List

router = APIRouter()

@router.post("/class/", response_model=ClassOut)
async def create_class_api(class_in: ClassCreate, db: AsyncSession = Depends(get_db)):
    return await create_class(db, class_in)

@router.get("/class/teacher/{teacher_id}", response_model=List[ClassOut])
async def get_classes_by_teacher_api(teacher_id: int, db: AsyncSession = Depends(get_db)):
    return await get_classes_by_teacher(db, teacher_id)

@router.get("/class/all", response_model=List[ClassOut])
async def get_all_classes_api(db: AsyncSession = Depends(get_db)):
    return await get_all_classes(db)

@router.post("/studentclass/", response_model=StudentClassOut)
async def create_student_class_api(sc_in: StudentClassCreate, db: AsyncSession = Depends(get_db)):
    return await create_student_class(db, sc_in)

@router.get("/studentclass/class/{class_id}", response_model=List[StudentClassOut])
async def get_students_by_class_api(class_id: int, db: AsyncSession = Depends(get_db)):
    return await get_students_by_class(db, class_id)

@router.get("/studentclass/student/{student_id}", response_model=List[StudentClassOut])
async def get_classes_by_student_api(student_id: int, db: AsyncSession = Depends(get_db)):
    return await get_classes_by_student(db, student_id)

@router.post("/studentclass/join", response_model=StudentClassOut)
async def join_class_by_code_api(join_in: StudentJoinClass, db: AsyncSession = Depends(get_db)):
    result = await join_class_by_code(db, join_in)
    if result is None:
        raise HTTPException(status_code=404, detail="Sınıf kodu bulunamadı.")
    if result == 'already_joined':
        raise HTTPException(status_code=400, detail="Zaten bu sınıfa kayıtlısın.")
    return result

@router.delete("/class/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class_api(class_id: int, db: AsyncSession = Depends(get_db)):
    success = await delete_class(db, class_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı.") 