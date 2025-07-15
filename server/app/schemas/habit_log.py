from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from ..models.habit_log import MoodType

class HabitLogBase(BaseModel):
    completion_date: datetime = datetime.utcnow()
    notes: Optional[str] = None
    mood: Optional[MoodType] = None

class HabitLogCreate(HabitLogBase):
    habit_id: int

class HabitLogUpdate(HabitLogBase):
    notes: Optional[str] = None
    mood: Optional[MoodType] = None
    completion_date: Optional[datetime] = None

class HabitLog(HabitLogBase):
    id: int
    habit_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 