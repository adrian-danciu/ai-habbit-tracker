from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class MoodType(str, enum.Enum):
    VERY_BAD = "very_bad"
    BAD = "bad"
    NEUTRAL = "neutral"
    GOOD = "good"
    VERY_GOOD = "very_good"

class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    completion_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    notes = Column(String)  # Optional notes for the day
    mood = Column(Enum(MoodType))  # Optional mood tracking
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    habit = relationship("Habit", back_populates="logs", lazy="joined")
    user = relationship("User", back_populates="habit_logs", lazy="joined")

    def __repr__(self):
        return f"<HabitLog {self.habit_id} - {self.completion_date}>" 