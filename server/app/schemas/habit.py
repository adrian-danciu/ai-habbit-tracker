from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from ..models.habit import FrequencyType

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: FrequencyType = FrequencyType.DAILY
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    name: Optional[str] = None
    frequency: Optional[FrequencyType] = None
    is_active: Optional[bool] = None

class Habit(HabitBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 