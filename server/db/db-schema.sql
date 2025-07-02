PRAGMA foreign_keys = ON;

-- Tabella Users
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher')) NOT NULL DEFAULT 'student'
);

-- Tabella Assignments
CREATE TABLE Assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacherId INTEGER NOT NULL,
  question TEXT NOT NULL,
  answerText TEXT, -- risposta fornita dagli studenti
  grade INTEGER CHECK (grade BETWEEN 0 AND 30),
  status TEXT CHECK (status IN ('open', 'closed')) NOT NULL DEFAULT 'open',
  FOREIGN KEY (teacherId) REFERENCES Users(id)
);

-- Tabella AssignmentGroupMembers (mantienila per rappresentare i gruppi)
CREATE TABLE AssignmentGroupMembers (
  assignmentId INTEGER NOT NULL,
  studentId INTEGER NOT NULL,
  PRIMARY KEY (assignmentId, studentId),
  FOREIGN KEY (assignmentId) REFERENCES Assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES Users(id) ON DELETE CASCADE
);
