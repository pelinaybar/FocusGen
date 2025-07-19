from pydantic import BaseModel
from typing import Optional

class ClassBase(BaseModel):
    name: str

class ClassCreate(ClassBase):
    teacher_id: int
    # join_code burada zorunlu değil, backend otomatik üretecek

class ClassOut(ClassBase):
    id: int
    teacher_id: int
    join_code: str
    class Config:
        orm_mode = True

class StudentClassBase(BaseModel):
    student_id: int
    class_id: int

class StudentClassCreate(StudentClassBase):
    pass

class StudentClassOut(StudentClassBase):
    id: int
    class Config:
        orm_mode = True 

class StudentJoinClass(BaseModel):
    student_id: int
    join_code: str 