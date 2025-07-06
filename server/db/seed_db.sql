PRAGMA foreign_keys = ON;

-- RESET
DROP TABLE IF EXISTS AssignmentGroupMembers;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Users;

-- Ricreazione tabelle
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher')) NOT NULL DEFAULT 'student'
);

CREATE TABLE Assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacherId INTEGER NOT NULL,
  question TEXT NOT NULL,
  answerText TEXT,
  grade INTEGER CHECK (grade BETWEEN 0 AND 30),
  status TEXT CHECK (status IN ('open', 'closed')) NOT NULL DEFAULT 'open',
  FOREIGN KEY (teacherId) REFERENCES Users(id)
);

CREATE TABLE AssignmentGroupMembers (
  assignmentId INTEGER NOT NULL,
  studentId INTEGER NOT NULL,
  PRIMARY KEY (assignmentId, studentId),
  FOREIGN KEY (assignmentId) REFERENCES Assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Inserimento 20 studenti
INSERT INTO Users (name, surname, email, salt, password, role) VALUES
  ('Luca', 'Bianchi', 'luca.bianchi@example.com', '20862b781006cdef716aa8eb3a3ca91a', '288aad8979f79aad75c02436ed9225b1656dbbceaf8412d2de95a7549968bbc7', 'student'),
  ('Giulia', 'Rossi', 'giulia.rossi@example.com', '2925e597e71c8ba0d5d28f5e0552ea8e', '69034701c5fb4b229f4a8e3fa7d3fb4491d61a1d4e5c088461161a8d7c695c40', 'student'),
  ('Marco', 'Verdi', 'marco.verdi@example.com', '128473de29012a12e8cc230eec223f8d', 'a095149420175cea7e20263c023b25c0dcae5496ab063de4b376a846c687bdc9', 'student'),
  ('Elena', 'Neri', 'elena.neri@example.com', '0a50597d9d9e9554e33701358f7572f7', 'a8590b9142bce839e2624f7e6a1fc3bf10f7ef628b644c36163394d988ab878a', 'student'),
  ('Francesco', 'Russo', 'francesco.russo@example.com', 'bd8135fb5b218392f37fe9e50f51d973', '0d8eea1541361b736b3612c5a66ed8d120595a73c86b1d148c7d08bcd0bf8f5f', 'student'),
  ('Sara', 'Conti', 'sara.conti@example.com', '4c6d2e468cf6f2b26821ff5bdcb2bdc6', 'f6d187c3b6221fb5fee2cb6ae3f6f594e6e3839a295fa16638221399db55165a', 'student'),
  ('Alessia', 'Gallo', 'alessia.gallo@example.com', '4c2378cbfac4ec37174f7a49508e10f4', '732616d2579ee5a8b5187812db2333fd88608851b955538305210b50073e434e', 'student'),
  ('Davide', 'Fontana', 'davide.fontana@example.com', 'b1c9752c279fdc9baac8aba8c916645a', '42b8251fab0f146ad617acf6952483525684183737271bf091af88ab5bbb8594', 'student'),
  ('Martina', 'Romano', 'martina.romano@example.com', '93e8e42bb764335744a6debf559f29f4', '9a1afeb5983c66d244fe5b66eed0eeb03f8b59333518b104bd52e5350838ff8d', 'student'),
  ('Giorgio', 'Esposito', 'giorgio.esposito@example.com', 'c162932bfc1a8399f8cb968a2a7797d1', '9995722bccaa245728c6ac733f0efa7adea28a1eb1c4a8d008b5ebf49b476053', 'student'),
  ('Viola', 'Mancini', 'viola.mancini@example.com', 'ffda7dbabfc229816d37ef0c04022c28', '44977c8328149b879da702d809edf37d786c87fc652b2cd4c3e440732d320ceb', 'student'),
  ('Fabio', 'Moretti', 'fabio.moretti@example.com', '7a9fa8672e041bd54cb2cad63ba14828', '39590167de1d2394afdd630acc580f193dcb21f33f60427cd4148e3316ce4638', 'student'),
  ('Chiara', 'Gentile', 'chiara.gentile@example.com', '51f925e03c54052fd450311c51bc8b72', 'a9ad4154230fb3e83b3fb24d66c43ce189ae66c0b2b3a8167f60bde558bcd3a0', 'student'),
  ('Michele', 'Rizzo', 'michele.rizzo@example.com', '87bcb6322adcd83d396901d2619b11d2', 'f16827d4174d9b2c41061cfbbb9458faeb2f3b46a6bc1ddbc8bc43578ed80f5b', 'student'),
  ('Alberto', 'Marino', 'alberto.marino@example.com', 'c1f7b3ebc7141d35fa8373d5dfadec81', 'ef377f8a4e87d94f2017436f88a8b2b4cf72aae7c59426d91f0ec52e8c1fae65', 'student'),
  ('Laura', 'Colombo', 'laura.colombo@example.com', 'ed9b18ff1f036bf0637a0f3c31cd7417', '2ccef746d4bf6b435b894bd54e44a5e2d15af2c0023a8136e4c3778c8239f5bb', 'student'),
  ('Simone', 'Ferraro', 'simone.ferraro@example.com', '97edaaa4bd7ca53b9db227c1bdeee4eb', '33b76e1f1f4968b7259b781c0506aaa0855b16e3de92fe4cbd5856eb8554b603', 'student'),
  ('Irene', 'Barbieri', 'irene.barbieri@example.com', '4d9997d764ce4ceb684ba2808d5f247b', '63e2cdfff8e20af17427fcd167c1b9514e8bdbc7f41a8a7d34af3f57d6400c62', 'student'),
  ('Pietro', 'Martini', 'pietro.martini@example.com', 'ff1f792a83d7144cf2f6be7b02d88f16', '66ee6702d4b5ac181052e3d28812b6654fb25a3036214844aecde62717445f23', 'student'),
  ('Francesca', 'Leone', 'francesca.leone@example.com', '9851d262ab2f093600c59af071d12231', 'd60a7015c2efa800d36bd0f8ffb809a095064edc071cb163a17a6fd1a247ae86', 'student'),

-- 2 docenti
  ('Anna', 'Ferrari', 'anna.ferrari@example.com', 'a8ecd7702e7a62ebbd7dc5864aac3b72', 'ca6f4af64c055eac78e82113a6a25f7530a65789f13dedb4674fe3ee250e852e', 'teacher'),
  ('Paolo', 'Greco', 'paolo.greco@example.com', '128863a61d71bedf0f5683c889db3513', '081e8b1b440540fcb241993df851511b871883ed3fb59d8b2e431af6562d6fa5', 'teacher');

-- Compiti

INSERT INTO Assignments (teacherId, question, answerText, grade, status) VALUES
  (21, 'Describe the structure and purpose of RESTful APIs.', NULL, NULL, 'open'),
  (21, 'Explain event delegation in JavaScript.', 'Event delegation uses event bubbling to handle events at a higher level.', 27, 'closed'),
  (22, 'What is a foreign key in relational databases?', NULL, NULL, 'open'),
  (22, 'Explain the concept of closures in JavaScript.', 'A closure is the combination of a function and the lexical environment.', 28, 'closed'),
  (22, 'List the differences between SQL and NoSQL.', 'SQL is relational, NoSQL is non-relational.', 30, 'closed');

-- Gruppi compiti (esempi coerenti)

INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES
  (1,1),(1,2),(1,3),
  (2,4),(2,5),(2,6),
  (3,7),(3,8),(3,9),
  (4,10),(4,11),
  (5,12),(5,13),(5,14);

