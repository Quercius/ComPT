-- Inserimento studenti
INSERT INTO Users (name, surname, email, salt, password, role) VALUES
  ('Luca', 'Bianchi', 'luca.bianchi@example.com', 'a88655fdf3c632735b2bb3f93d818543', '916b87a769d5967833fdba60cc0539264ba8b1f54bca06281f6b4139358ed788', 'student'),
  ('Giulia', 'Rossi', 'giulia.rossi@example.com', 'b5ce97d718f9050728845e12c850b752', 'c46adecd77c5beca22141e846517276a47f6d29b9edfcc49ef859c9f186782a4', 'student'),
  ('Marco', 'Verdi', 'marco.verdi@example.com', 'c08a866d39b6f1b7d508399aa3f4bfde', 'f5d60b7d5b06d3e012359e7e4efc0d43bd6173f8ff55a65183a363216f351422', 'student'),
  ('Elena', 'Neri', 'elena.neri@example.com', 'bd524b3eafd8918c3b0e98c8a00bfff3', '99cfb969288508013d82dbc817995da3be27a83f17bfcb8bd93b6e295d4aec8a', 'student'),
  ('Francesco', 'Russo', 'francesco.russo@example.com', 'd94b1ecaeba30a1b3d07f876deba7712', '6a9d18fd69af9e786f1e7ce0d001a90d9db703d117b00cead48334f4ea1ff9e4', 'student'),
  ('Sara', 'Conti', 'sara.conti@example.com', '37151f9bfadf717ab4260a4009a4b956', '466f6c46b6f9e55d5cf1ad66bbb64aebd51ad8e199771cdc580e55b1a785cc18', 'student'),
  ('Alessia', 'Gallo', 'alessia.gallo@example.com', 'cef5de83febc1ede566f0d281be1122b', 'b1814c61950aa82b06098634273b2518d9abaff45e562dbf27a659fefcfe03b9', 'student'),
  ('Davide', 'Fontana', 'davide.fontana@example.com', 'fba5ed90dcabfca53f20c00856f376ec', '48f5d43cbd34da282e7967ac52787e01d422ebb6a7a20a1be39ff59120cf2154', 'student'),
  ('Martina', 'Romano', 'martina.romano@example.com', '428493592eb0d15a937e52378170a9cb', '93d475437c126a61b5e9d48ea308e553f46b2c64916bd36eb3417e326b3084e9', 'student'),

  ('Anna', 'Ferrari', 'anna.ferrari@example.com', 'a7da6af589e7541d24d76b97626a64fd', '7a8594706ae1cce7142f7249a11a88d2b878d040502a8dc616e9b049920e2059', 'teacher'),
  ('Paolo', 'Greco', 'paolo.greco@example.com', 'b6422c7b0d12ff9cad490089dd76c469', '1d0754e711599a682bacae0a372c9275a673a39636fed9c6d0ffcb6e71bb2892', 'teacher');
  

-- Compito 1 (open), definito da Anna Ferrari (teacherId=10)
INSERT INTO Assignments (teacherId, question, answerText, grade, status) VALUES
  (10, 'Describe the structure and purpose of RESTful APIs.', 
   'RESTful APIs follow a client-server architecture and use standard HTTP methods...', 
   NULL, 'open');

-- gruppo
INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (1, 1),
  (1, 2),
  (1, 3);

-- Compito 2 (closed), definito da Paolo Greco (teacherId=11)
INSERT INTO Assignments (teacherId, question, answerText, grade, status) VALUES
  (11, 'Explain the concept of closures in JavaScript.',
   'A closure is the combination of a function and the lexical environment within which that function was declared.',
   28, 'closed');

INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (2, 4),
  (2, 5);

-- Compito 3 (closed), definito da Anna Ferrari
INSERT INTO Assignments (teacherId, question, answerText, grade, status) VALUES
  (10, 'What are the main differences between SQL and NoSQL databases?',
   'SQL databases are relational and use structured query language. NoSQL databases are non-relational and store data differently.',
   30, 'closed');

INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (3, 3),
  (3, 6),
  (3, 2);

-- Compito 4 (open), assegnato da Paolo Greco
INSERT INTO Assignments (teacherId, question, answerText, grade, status) VALUES
  (11, 'What are the advantages of using Git in a development team?',
   'Git allows multiple people to collaborate efficiently, track changes, and manage code versions.',
   NULL, 'open');

INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (4, 7),
  (4, 8);

-- Compito 5 (open), assegnato da Anna Ferrari
INSERT INTO Assignments (teacherId, question, answerText, grade, status) VALUES
  (10, 'Briefly explain the MVC architectural pattern.',
   'MVC stands for Model-View-Controller and separates application logic from UI, improving maintainability.',
   NULL, 'open');

INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (5, 9),
  (5, 8);
