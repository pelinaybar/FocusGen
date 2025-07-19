from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.models import Class, StudentClass
from schemas.class_ import ClassCreate, StudentClassCreate, StudentJoinClass
import random
import string

def generate_join_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

async def create_class(db: AsyncSession, class_in: ClassCreate):
    # Benzersiz join_code üret
    while True:
        join_code = generate_join_code()
        result = await db.execute(select(Class).where(Class.join_code == join_code))
        if not result.scalars().first():
            break
    new_class = Class(name=class_in.name, teacher_id=class_in.teacher_id, join_code=join_code)
    db.add(new_class)
    await db.commit()
    await db.refresh(new_class)
    return new_class

async def get_classes_by_teacher(db: AsyncSession, teacher_id: int):
    result = await db.execute(select(Class).where(Class.teacher_id == teacher_id))
    return result.scalars().all()

async def get_all_classes(db: AsyncSession):
    result = await db.execute(select(Class))
    return result.scalars().all()

async def create_student_class(db: AsyncSession, student_class_in: StudentClassCreate):
    new_sc = StudentClass(student_id=student_class_in.student_id, class_id=student_class_in.class_id)
    db.add(new_sc)
    await db.commit()
    await db.refresh(new_sc)
    return new_sc

async def get_students_by_class(db: AsyncSession, class_id: int):
    result = await db.execute(select(StudentClass).where(StudentClass.class_id == class_id))
    return result.scalars().all()

async def get_classes_by_student(db: AsyncSession, student_id: int):
    result = await db.execute(select(StudentClass).where(StudentClass.student_id == student_id))
    return result.scalars().all()

async def delete_class(db: AsyncSession, class_id: int):
    # Önce ilişkili StudentClass kayıtlarını sil
    await db.execute(
        StudentClass.__table__.delete().where(StudentClass.class_id == class_id)
    )
    # Sonra sınıfı sil
    result = await db.execute(select(Class).where(Class.id == class_id))
    class_obj = result.scalars().first()
    if class_obj:
        await db.delete(class_obj)
        await db.commit()
        return True
    return False

async def join_class_by_code(db: AsyncSession, join_in: StudentJoinClass):
    # join_code ile sınıfı bul
    result = await db.execute(select(Class).where(Class.join_code == join_in.join_code))
    class_obj = result.scalars().first()
    if not class_obj:
        return None
    # Zaten kayıtlı mı kontrol et
    exists = await db.execute(select(StudentClass).where((StudentClass.student_id == join_in.student_id) & (StudentClass.class_id == class_obj.id)))
    if exists.scalars().first():
        return 'already_joined'
    # İlişkiyi oluştur
    new_sc = StudentClass(student_id=join_in.student_id, class_id=class_obj.id)
    db.add(new_sc)
    await db.commit()
    await db.refresh(new_sc)
    return new_sc 