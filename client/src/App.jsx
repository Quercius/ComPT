  import { useEffect, useState } from 'react';
  import {Routes, Route, Navigate, useNavigate} from "react-router"

  import './App.css';
  import 'bootstrap/dist/css/bootstrap.min.css';

  import DefaultLayout from './components/DefaultLayout';
  import ClassStatus from './components/ClassStatus';
  import AssignmentsTable from './components/AssignmentsTable';
  import AssignmentDetails from './components/AssignmentDetails';
  import AssignmentForm from './components/AssignmentForm';
  import HomePage from './components/HomePage';
  import { LoginForm } from './components/AuthComponents';

  import API from './API/API.mjs';

  function App() {
    
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleLogin = async (credentials) => {
      try{
        const user = await API.login(credentials);
        setLoggedIn(true);
        setMessage({msg: 'Welcome, ' + user.name + ' ' + user.surname + '!', type: 'success'});
        setUser(user);
      }
      catch(err) {
        setMessage({msg: err.message || 'Login failed', type: 'danger'});
      }
    }

    const navigate = useNavigate();
    const handleLogout = async() => {
      await API.logOut();
      setLoggedIn(false);
      setUser({});
      setMessage('');
      navigate("/");
    }

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await API.getUserInfo();
          setLoggedIn(true);
          setUser(user);
        } catch {
          setLoggedIn(false);
          setUser({});
        }
        setLoading(false);
      }
      checkAuth();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Routes>

        <Route path="/" element={
          (!loggedIn)
            ? <HomePage homepage loggedIn={loggedIn}/>
            : <Navigate to={`/${user.role}/`} />
        } />

        <Route element={<DefaultLayout message={message} setMessage={setMessage} handleLogout={handleLogout} loggedIn={loggedIn} role={user.role}/>}>

          {/* Routes protette per teacher */}
          <Route path="teacher" element={(loggedIn && user.role==="teacher") ? <HomePage user={user} loggedIn={loggedIn} setMessage={setMessage}/> : <Navigate to="/*" />} />

          <Route path="teacher/class-status" element = {(loggedIn && user.role === "teacher") ? <ClassStatus /> : <Navigate to="/*" />} />

          <Route path="teacher/assignments" element={(loggedIn && user.role === "teacher") ? <AssignmentsTable assignments role={user.role}/> : <Navigate to="/*" />} />

          <Route path="teacher/assignments/new" element={(loggedIn && user.role === "teacher") ? <AssignmentForm teacherId={user.id} /> : <Navigate to="/*" />} />

          <Route path="teacher/assignments/:id/answer" element={(loggedIn && user.role === "teacher") ? <AssignmentDetails role={user.role}/> : <Navigate to="/*" /> } />

          {/* Routes protette per student */}
          <Route path="student" element={(loggedIn && user.role==="student") ? <HomePage user={user} loggedIn={loggedIn} setMessage={setMessage}/> : <Navigate to="/*" />} />

          <Route path="student/assignments" element={(loggedIn && user.role === "student") ? <AssignmentsTable assignments role={user.role}/> : <Navigate to="/*" />} />

          <Route path="student/assignments/:id/answer" element={(loggedIn && user.role === "student") ? <AssignmentDetails role={user.role} /> : <Navigate to="/*" /> } />

          {/* Rotte generali per login o non valide */}

          <Route path="login" element={ loggedIn ? <Navigate to={`/`} /> : <LoginForm handleLogin={handleLogin} /> } />

          <Route path="*" element={<p className="pt-5">Page not found: URL is not valid</p>} />
          
        </Route>
      </Routes>
    );
  }

  export default App;
