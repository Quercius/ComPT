const SERVER_URL = "http://localhost:3001";

// GET /api/students 
const getStudents = async () => {
  const response = await fetch(SERVER_URL + "/api/students", { //seve SERVER_URL perché sennò metterebbe lh5173, server react
    credentials: 'include'
  }); 
  if (response.ok) {
    const studentsJson = await response.json(); // se non metto un altro await va avanti e prende un json vuoto perché la fetch non è ancora fullfilled
    return studentsJson.map(s => ({ id: s.id, name: s.name, surname: s.surname })); //potrei creare modello assignment
  } else {
    const err = await response.json();
    throw new Error(err.error || "Failed to load students list");
  }
};

// GET /api/class-status
const getClassStatus = async () => {
  const response = await fetch(SERVER_URL + `/api/class-status`, {
    credentials: 'include'
  });
  if (response.ok) {
    const studentsJson = await response.json();
    return studentsJson.map(s => ({
      id: s.id,
      name: s.name,
      surname: s.surname,
      openAssignments: s.openAssignments,
      closedAssignments: s.closedAssignments,
      averageScore: isNaN(parseFloat(s.averageScore)) ? "--" : parseFloat(s.averageScore).toFixed(2)
    }));
  } else {
    const err = await response.json();
    throw new Error(err.error || "Failed to load class status");
  }
};

// GET api/assignments
const getAssignments = async () => {
  const response = await fetch(SERVER_URL + "/api/assignments", {
    credentials: 'include'   
  });
  if (response.ok) {
    const json = await response.json();
    return json.map(a => ({
      id: a.id,
      question: a.question,
      status: a.status,
      teacher: a.teacher,
      grade: a.grade,
      groupMembers: Array.isArray(a.groupMembers) ? a.groupMembers : [],
      hasAnswer: a.hasAnswer === true || a.hasAnswer === 1
    }));
  } else {
    const err = await response.json();
    throw new Error(err.error || "Failed to load assignments");
  }
};


// GET /api/assignments/<id>
const getAssignmentById = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/assignments/${id}`, {
    credentials: 'include'   
  });
  if (response.ok) {
    const a = await response.json();
    return {
      id: a.id,
      question: a.question,
      status: a.status,
      teacher: a.teacher,
      grade: a.grade,
      groupMembers: a.groupMembers,
      answer: a.answer
    };
  } else {
    const err = await response.json();
    throw new Error(err.error || "Failed to fetch assignment details");
  }
};

// POST /api/assignments
const addAssignment = async ({question, groupMembers }) => {
  const response = await fetch(SERVER_URL + "/api/assignments", {
    method: "POST", //se il metodo non è una get devo specificare il metodo, in questo caso POST
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ question, groupMembers }), //devo sempre fare stringify per convertire i param in json
  });

  if (response.ok) {
    return await response.json(); // ritorna { id: newAssignmentId }
  } else {
    const err = await response.json();
    throw new Error(err.error || "Failed to create new assignment");
  }
};

// PUT /api/assignments/<id>/answer
const setAnswer = async (id, answer) => {
  const response = await fetch(`${SERVER_URL}/api/assignments/${id}/answer`, {
    method: "PUT", // devo specificare il metodo PUT perché sto aggiornando una risorsa già esistente
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // includo i cookie di sessione per autenticazione
    body: JSON.stringify({ answerText: answer }), 
  });

  if (response.ok) {
    return; // non serve parsare nulla, ok significa operazione riuscita
  } else {
    const err = await response.json();
    throw new Error(err.error || "Failed to save answer");
  }
};

// POST api/assignments/<id>/grade 
const setGrade = async (assignmentId, grade) => {
  const response = await fetch(SERVER_URL + `/api/assignments/${assignmentId}/grade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ grade }),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.error || 'Failed to evaluate the assignment');
  }
};

// LOGIN
const login = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

// info SESSIONE
const getUserInfo = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if(response.ok) {
    return user;
  }
  else {
    throw user;
  }
}

// LOGOUT
const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if(response.ok) {
    return null;
  }
}

const API = {
  getStudents,
  getClassStatus,
  getAssignments,
  getAssignmentById,
  addAssignment,
  setGrade,
  setAnswer,
  login,
  getUserInfo,
  logOut
};


export default API;
