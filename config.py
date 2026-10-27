from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = str(BASE_DIR / "profiles.db")
HOST = "127.0.0.1"
PORT = 5002
DEBUG = True
