from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'student' veya 'teacher'
    focus_scores = relationship("FocusScore", back_populates="user")
    pomodoros = relationship("Pomodoro", back_populates="user")
    announcements = relationship("Announcement", back_populates="teacher")

class FocusScore(Base):
    __tablename__ = "focus_scores"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="focus_scores")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    message = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    teacher = relationship("User", back_populates="announcements")

class Pomodoro(Base):
    __tablename__ = "pomodoros"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime)
    completed = Column(Boolean, default=False)
    user = relationship("User", back_populates="pomodoros")

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    join_code = Column(String, unique=True, nullable=False)
    teacher = relationship("User", backref="classes")
    students = relationship("StudentClass", back_populates="class_")

class StudentClass(Base):
    __tablename__ = "student_classes"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    class_ = relationship("Class", back_populates="students")
    student = relationship("User", backref="student_classes") 