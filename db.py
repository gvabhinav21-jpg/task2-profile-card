from config import DB_PATH
from shared.database import initialize

SCHEMA = """
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    skills TEXT,
    theme TEXT DEFAULT 'glass',
    github TEXT DEFAULT '',
    linkedin TEXT DEFAULT '',
    twitter TEXT DEFAULT '',
    portfolio TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


def init_db():
    initialize(DB_PATH, SCHEMA)
