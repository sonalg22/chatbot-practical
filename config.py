import os
from dotenv import load_dotenv


# Load .env file
load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    SECRET_KEY = os.getenv("SECRET_KEY", "fallbacksecret") #edit
