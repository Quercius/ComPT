-- Inserimento nuovi studenti
INSERT INTO Students (name, surname) VALUES
  ('Alessia', 'Gallo'),
  ('Davide', 'Fontana'),
  ('Martina', 'Romano');

-- Inserimento utenti associati ai nuovi studenti
INSERT INTO Users (username, password, role, referenceId) VALUES
  ('alessia.gallo', 'password7', 'student', 7),
  ('davide.fontana', 'password8', 'student', 8),
  ('martina.romano', 'password9', 'student', 9);

-- Compito 4 (open) assegnato da Paolo Greco
INSERT INTO Assignments (teacherId, question, status) VALUES
  (2, 'What are the advantages of using Git in a development team?', 'open');

-- Gruppo per Compito 4: Alessia, Davide
INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (4, 7),
  (4, 8);

-- Risposta fornita da Davide
INSERT INTO Answers (assignmentId, answerText, submittedBy) VALUES
  (4, 'Git allows multiple people to collaborate efficiently, track changes, and manage code versions.', 8);

-- Compito 5 (open) assegnato da Anna Ferrari
INSERT INTO Assignments (teacherId, question, status) VALUES
  (1, 'Briefly explain the MVC architectural pattern.', 'open');

-- Gruppo per Compito 5: Martina, Alessia
INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (5, 9),
  (5, 7);

-- Risposta fornita da Alessia
INSERT INTO Answers (assignmentId, answerText, submittedBy) VALUES
  (5, 'MVC stands for Model-View-Controller and separates application logic from UI, improving maintainability.', 7);
