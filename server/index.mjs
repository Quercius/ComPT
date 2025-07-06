import express from 'express';
import morgan from 'morgan';
import cors from 'cors'; 
import teacherDao from './dao/teacherDao.mjs';
import studentDao from './dao/studentDao.mjs';
import userDao from './dao/userDao.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
}

app.use(cors(corsOptions)); 


passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password);
  if(!user) {
    return cb(null, false, 'Wrong credentials.');
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
})

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
})

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => { 
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

const isTeacherLoggedIn = (req, res, next) => {
  if(req.isAuthenticated() && req.user.role === 'teacher') {
    return next();
  }
  return res.status(403).json({error: 'Forbidden - teacher only'});
};

const isStudentLoggedIn = (req, res, next) => {
  if(req.isAuthenticated() && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({error: 'Forbidden - student only'});
};


// GET elenco studenti per compilazione form nuovo assignment (solo teacher)
app.get('/api/students', isTeacherLoggedIn, async (req, res) => {
  try {
    const students = await teacherDao.listStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET stato generale della classe (compiti aperti, chiusi, media voti)
app.get('/api/class-status', isTeacherLoggedIn, async (req, res) => {
  try {
    const classStatus = await teacherDao.getClassStatus(req.user.id);
    res.json(classStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET elenco dei compiti di un professore
app.get('/api/assignments', isTeacherLoggedIn, async (req, res) => {
  try {
    const assignments = await teacherDao.listAssignments(req.user.id);
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting the assignments' });
  }
});

// GET elenco dei compiti di uno studente
app.get('/api/my-assignments', isStudentLoggedIn, async (req, res) => {
  try {
    const assignments = await studentDao.listAssignments(req.user.id);
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting the assignments' });
  }
});

// GET di un compito specifico
app.get('/api/assignments/:id', isLoggedIn, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const assignment = await teacherDao.getAssignment(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting the assignment' });
  }
});

// POST di un nuovo assignment
app.post('/api/assignments', isTeacherLoggedIn, async (req, res) => {
  const { question, groupMembers } = req.body;

  const teacherId = req.user.id;  

  if (!question || !Array.isArray(groupMembers) || groupMembers.length === 0) {
    return res.status(400).json({ error: 'Missing fields in form.' });
  }

  if (groupMembers.length < 2 || groupMembers.length > 6) {
    return res.status(400).json({ error: 'Groups must be 2-6 members big.' });
  }

  try {
    const conflicts = await teacherDao.findOverusedPairs(teacherId, groupMembers);
    if (conflicts.length > 0) {
      return res.status(400).json({
        error: `some students have already worked together 2 or more times.`
      });
    }

    const assignmentId = await teacherDao.createAssignment(teacherId, question, groupMembers);
    res.status(201).json({ id: assignmentId });
  } catch (err) {
    console.error("Error in creating assignment:", err);
    res.status(500).json({ error: 'Error in assignment creation.' });
  }
});


// PUT risposta di uno studente ad un assignment
app.put('/api/assignments/:id/answer', isStudentLoggedIn, async (req, res) => {
  const assignmentId = parseInt(req.params.id);
  const { answerText } = req.body;

  if (!answerText || answerText.trim() === "") {
    return res.status(400).json({ error: "Missing answer text" });
  }

  try {
    const assignment = await teacherDao.getAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    if (assignment.status === 'closed') {
      return res.status(409).json({ error: "Assignment already closed, cannot submit answer." });
    }

    await studentDao.updateAnswer(assignmentId, answerText);

    res.status(200).json({ message: "Answer submitted correctly" });
  } catch (err) {
    console.error("Error submitting answer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// POST del voto ad un assingment
app.post('/api/assignments/:id/grade', isTeacherLoggedIn, async (req, res) => {

  const assignmentId = parseInt(req.params.id);
  const { grade } = req.body;

  if (isNaN(assignmentId) || isNaN(grade) || grade < 0 || grade > 30) {
    return res.status(400).json({ error: 'Grade not valid' });
  }

  try {
    const assignment = await teacherDao.getAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    if (assignment.status === 'closed') {
      return res.status(409).json({ error: 'Assignment already closed, cannot overwrite grade' });
    }

    await teacherDao.updateGrade(assignmentId, grade);
    await teacherDao.updateStatus(assignmentId, 'closed');

    res.status(200).json({ message: 'Correctly evaluated' });
  } catch (err) {
    console.error("Error evaluating the answer", err);
    res.status(500).json({ error: 'Error while saving the grade' });
  }
});

// POST /api/sessions
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  return res.status(201).json(req.user);
})

// GET /api/sessions
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);
  }
  else {
    res.status(401).json({error: 'not authenticated'})
  }
})

// DELETE /api/sessions/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

