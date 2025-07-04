-- Assignment 6: answered, closed
INSERT INTO Assignments (teacherId, question, answerText, grade, status)
VALUES
(
  11,
  'Explain the SOLID principles in object-oriented programming.',
  'The SOLID principles include Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
  30,
  'closed'
);

-- gruppo (luca + giulia + elena) 
INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (6, 1), -- Luca
  (6, 2), -- Giulia
  (6, 4); -- Elena


-- Assignment 7: answered, open
INSERT INTO Assignments (teacherId, question, answerText, grade, status)
VALUES
(
  11,
  'Describe the event loop mechanism in Node.js.',
  'The event loop handles asynchronous callbacks by offloading operations and placing callbacks in a queue when ready.',
  NULL,
  'open'
);

-- gruppo (luca + marco + sara)
INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (7, 1), -- Luca
  (7, 3), -- Marco
  (7, 6); -- Sara


-- Assignment 8: no answer, open
INSERT INTO Assignments (teacherId, question, answerText, grade, status)
VALUES
(
  11,
  'What is a transaction in a relational database, and what are ACID properties?',
  NULL,
  NULL,
  'open'
);

-- gruppo (luca + francesco + alessia)
INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (8, 1), -- Luca
  (8, 5), -- Francesco
  (8, 7); -- Alessia
