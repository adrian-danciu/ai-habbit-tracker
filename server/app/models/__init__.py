"""
Database models for the AI Habit Tracker application.
"""
from .user import User
from .habit import Habit
from .habit_log import HabitLog

# This ensures all models are imported and relationships are properly set up
__all__ = ["User", "Habit", "HabitLog"] 