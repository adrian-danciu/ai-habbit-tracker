from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, habits
from .database import init_db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Habit Tracker API")

# Configure CORS
origins = [
    "http://localhost:4200",  # Angular app
    "http://localhost:8000",  # API (for development)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(habits.router, prefix="/api/habits", tags=["habits"])

@app.get("/")
def read_root():
    return {"message": "AI Habit Tracker API"}

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully!")
