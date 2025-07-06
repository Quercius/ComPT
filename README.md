[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/F9jR7G97)
# Exam #2: "Compiti"
## Student: s331582 Querci Tommaso 

## React Client Application Routes

- Route `/`
Home page. Displays a welcome message for unauthenticated users and allows login. If the user is already authenticated, it redirects to their role-based homepage (/teacher/ or /student/).

- Route `/login`
Login page. Allows students and teachers to log in using email and password.

- Route `/teacher`
Teacher home. Main page for teachers, showing a welcome message and quick links.

- Route `/teacher/class-status`
Class status page. Shows aggregated statistics for students, including the number of open/closed assignments and average grades.

- Route `/teacher/assignments`
Teacher assignments list. Displays the complete list of assignments created by the teacher.

- Route `/teacher/assignments/new`
New assignment form. Allows the teacher to create a new group assignment by specifying the question text and group members.

- Route `/teacher/assignments/:id/answer`
Assignment details (teacher). Shows the details of a specific assignment, including any group answers and the ability to grade it.
  - :id = numeric assignment id (e.g., /teacher/assignments/2/answer)

- Route `/student`
Student home. Main page for students, with a welcome message and quick links to their assignments.

- Route `/student/assignments`
Student assignments list. Lists all assignments in which the student is involved.

- Route `/student/assignments/:id/answer`
Assignment details (student). Allows students to view the assignment question and submit their group answer.

  - :id = numeric assignment id (e.g., /student/assignments/3/answer)

- Route `*`
Page not found. Displays an error message for invalid or unknown URLs.

## API Server

### List all students
- URL: `/api/students`
- HTTP Method: `GET`
- Authorization: only teachers

Description: Retrieve the list of all students, used for composing groups.
- Request body: __None__
- Response:
```
[
  { "id": 1, "name": "Luca", "surname": "Bianchi" },
  { "id": 2, "name": "Giulia", "surname": "Rossi" },
  { "id": 3, "name": "Marco", "surname": "Verdi" },
  { "id": 4, "name": "Elena", "surname": "Neri" },
  { "id": 5, "name": "Francesco", "surname": "Russo" },
  { "id": 6, "name": "Sara", "surname": "Conti" },
  { "id": 7, "name": "Alessia", "surname": "Gallo" },
  { "id": 8, "name": "Davide", "surname": "Fontana" },
  { "id": 9, "name": "Martina", "surname": "Romano" }
]
```
  - `200 OK` on success
  - `500 Internal Server Error` on database failure


### Get global class status
- URL: `/api/class-status`
- HTTP Method: `GET`
- Authorization: only teachers

Description: Retrieve aggregated statistics of the class (number of open/closed assignments, average grades, etc.).
- Request body: __None__
- Response:
```
[
  {
    "id": 1,
    "name": "Luca",
    "surname": "Bianchi",
    "openAssignments": 1,
    "closedAssignments": 0,
    "averageScore": 0
  },
  {
    "id": 4,
    "name": "Elena",
    "surname": "Neri",
    "openAssignments": 0,
    "closedAssignments": 1,
    "averageScore": 28
  }
]
```
  - `200 OK` on success

  - `500 Internal Server Error` on server error

### List all assignments for teacher
- URL: `/api/assignments`
- HTTP Method: `GET`
- Authorization: only teachers

Description: Retrieve the list of assignments:

if the user is a teacher, shows assignments the teacher has created

if the user is a student, shows assignments the student is involved in
- Request body: __None__
- Response:
```
body: 

[
  {
    "id": 1,
    "question": "Describe the structure and purpose of RESTful APIs.",
    "status": "open",
    "teacher": "Anna Ferrari",
    "groupMembers": ["Luca Bianchi", "Giulia Rossi", "Marco Verdi"],
    "hasAnswer": true,
    "grade": null
  },
  {
    "id": 3,
    "question": "What are the main differences between SQL and NoSQL databases?",
    "status": "closed",
    "teacher": "Anna Ferrari",
    "groupMembers": ["Marco Verdi", "Sara Conti", "Giulia Rossi"],
    "hasAnswer": true,
    "grade": 30
  }, 
  ...
]
```

  - `200 OK` on success

  - `500 Internal Server Error` on error

### List all assignments for student
- URL: `/api/my-assignments`
- HTTP Method: `GET`
- Authorization: only students

Description: Retrieve the list of assignments:

if the user is a teacher, shows assignments the teacher has created

if the user is a student, shows assignments the student is involved in
- Request body: __None__
- Response:
```
body: 
  see below
```


  - `200 OK` on success

  - `500 Internal Server Error` on error

### Get a single assignment
- URL: `/api/assignments/<id>`
- HTTP Method: `GET`
- Authorization: authenticated users

Description: Retrieve details of a single assignment identified by :id.
- Request body: __None__
- Response:
```
{
  "id": 3,
  "question": "What are the main differences between SQL and NoSQL databases?",
  "status": "closed",
  "teacher": "Anna Ferrari",
  "groupMembers": ["Marco Verdi", "Sara Conti", "Giulia Rossi"],
  "answer": "SQL databases are relational and use structured query language. NoSQL databases are non-relational and store data differently.",
  "grade": 30
}
```
  - `200 OK` on success

  - `404 Not Found` if assignment not found

  - `500 Internal Server Error` on error

### Create a new assignment
- URL: `/api/assignments`
- HTTP Method: `POST`
- Authorization: only teachers

Description: Create a new group assignment specifying the question text and the group members.

- Request body:
```
[
  {
    "question": "Describe the structure and purpose of RESTful APIs.",
    "groupMembers": [1, 2, 3]
  }
]
```
- Response:

  - `201 Created` on success, with created assignment id

  - `400 Bad Request` if request body is invalid (missing fields or wrong group size)

  - `500 Internal Server Error` on error


### Submit an answer to an assignment
- URL: `/api/assignments/<id>/answer`
- HTTP Method: `PUT`
- Authorization: only students

Description: Allows a student to submit or update their answer to an assignment.

- Request body:
```
[
  {
  "answerText": "RESTful APIs follow a client-server architecture and use standard HTTP methods..."
  }
]
```
- Response:

  - `200 OK` on success

  - `400 Bad Request` if answer text missing

  - `500 Internal Server Error` on error

(Se volessi aggiungere un controllo per verificare l’appartenenza al gruppo, potresti prevedere un 403 Forbidden)

### Grade an assignment
- URL: `/api/assignments/<id>/grade`
- HTTP Method: `POST`
- Authorization: only teachers

Description: Allows a teacher to set a grade and automatically close an assignment.

- Request body:

  - grade: numeric (0–30)
```
[
  {
  "grade": 28
  }
]
```
- Response:

  - `200 OK` on success

  - `400 Bad Request` if grade invalid

  - `500 Internal Server Error` on error


### Log in
- URL: `/api/sessions`
- HTTP Method: `POST`

Description: Authenticate a user (teacher or student) using local strategy.

- Request body:
```
{
  "username": "anna.ferrari@example.com",
  "password": "password123"
}
```

- Response:

  - `201 Created` on success with user data

  - `401 Unauthorized` if wrong credentials

### Get current session
- URL: `/api/sessions/current`
- HTTP Method: `GET`

Description: Retrieve data about the currently authenticated user.

- Request body: __None__
- Response:

  - `200 OK` on success

  - `401 Unauthorized` if no user is logged in

### Log out
- URL: `/api/sessions/current`
- HTTP Method: `DELETE`

Description: Destroy the current session and log the user out.
- Request body: __None__
- Response:

  - `200 OK` on success



## Database Tables

### Table `Users`
Contains user account data:

- id: integer, primary key

- name: first name

- surname: last name

- email: unique email address

- salt: unique string for password salting

- password: hashed password

- role: user role (student or teacher)

### Table `Assignments`
Stores the assignments created by teachers and answered by students:

- id: integer, primary key

- teacherId: foreign key referencing Users(id)

- question: assignment description

- answerText: text of the group answer (optional)

- grade: integer grade (0–30), optional

- status: open/closed status of the assignment

### Table `AssignmentGroupMembers`
Represents the group composition for each assignment:

- assignmentId: foreign key referencing Assignments(id)

- studentId: foreign key referencing Users(id)

- primary key on (assignmentId, studentId)

## Main React Components

- `AssignmentForm` (in `AssignmentForm.js`):
Allows teachers to create a new assignment by entering the question and selecting group members through a multi-select input. It performs client-side validation to check question presence and enforce group size constraints (between 2 and 6 members). On submit, it calls the API to store the assignment and redirects back to the teacher’s assignments list.

- `AssignmentsTable` (in `AssignmentsTable.js`):
Displays a table with the list of assignments, showing details such as question, group members, status, and grade. Provides a link to view or answer the assignment based on the user’s role. If the user is a teacher, it also shows a button to create a new assignment.

- `ClassStatus` (in `ClassStatus.js`):
Shows a sortable table with an overview of class members, including their name, number of open and closed assignments, and their average grade. Supports sorting by various fields (name, surname, assignments count, average score) in ascending or descending order.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

### Students
- luca.bianchi@example.com, password1
- giulia.rossi@example.com, password2
- marco.verdi@example.com, password3
- elena.neri@example.com, password4
- francesco.russo@example.com, password5
- sara.conti@example.com, password6
- alessia.gallo@example.com, password7
- davide.fontana@example.com, password8
- martina.romano@example.com, password9

### Teachers
- anna.ferrari@example.com, teachpass1
- paolo.greco@example.com, teachpass2