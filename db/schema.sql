PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT,
  created_at TEXT NOT NULL,
  query TEXT,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS recordings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  file_path TEXT,
  created_at TEXT,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT,
  key TEXT,
  value TEXT,
  UNIQUE(user_name, key)
);
