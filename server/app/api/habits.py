from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from ..database import get_db
from ..models.habit import Habit
from ..schemas.habit import HabitCreate, HabitUpdate, Habit as HabitSchema
from ..services.auth import get_current_user
from ..models.user import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=HabitSchema)
async def create_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Creating habit for user {current_user.email}")
        db_habit = Habit(
            **habit.model_dump(),
            user_id=current_user.id
        )
        db.add(db_habit)
        db.commit()
        db.refresh(db_habit)
        logger.info(f"Habit created successfully: {db_habit.name}")
        return db_habit
    except Exception as e:
        logger.error(f"Error creating habit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[HabitSchema])
async def get_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Fetching habits for user {current_user.email}")
        return db.query(Habit).filter(Habit.user_id == current_user.id).all()
    except Exception as e:
        logger.error(f"Error fetching habits: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{habit_id}", response_model=HabitSchema)
async def get_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Fetching habit {habit_id} for user {current_user.email}")
        db_habit = db.query(Habit).filter(
            Habit.id == habit_id,
            Habit.user_id == current_user.id
        ).first()
        if not db_habit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Habit not found"
            )
        return db_habit
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error fetching habit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{habit_id}", response_model=HabitSchema)
async def update_habit(
    habit_id: int,
    habit: HabitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Updating habit {habit_id} for user {current_user.email}")
        db_habit = db.query(Habit).filter(
            Habit.id == habit_id,
            Habit.user_id == current_user.id
        ).first()
        if not db_habit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Habit not found"
            )
        
        # Update only provided fields
        update_data = habit.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_habit, field, value)
        
        db.commit()
        db.refresh(db_habit)
        logger.info(f"Habit updated successfully: {db_habit.name}")
        return db_habit
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error updating habit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Deleting habit {habit_id} for user {current_user.email}")
        db_habit = db.query(Habit).filter(
            Habit.id == habit_id,
            Habit.user_id == current_user.id
        ).first()
        if not db_habit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Habit not found"
            )
        
        db.delete(db_habit)
        db.commit()
        logger.info(f"Habit deleted successfully: {db_habit.name}")
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error deleting habit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 