import { Container, Navbar } from 'react-bootstrap';
import { NavLink, Link } from "react-router-dom";
import { LogoutButton } from './AuthComponents';
import logo from '../assets/logo_compt.png';

function NavHeader(props) {

  return (
    <Navbar style={{ backgroundColor: "#38b2ac" }} variant="dark" className="mb-4" fixed="top">
      <Container fluid className="w-100">
        <Navbar.Brand as={Link} to="/" className="fs-4 fw-bold mt-2 d-flex align-items-center ms-2">
          <img
            src={logo}
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-text-top me-3"
            style={{ marginTop: "-7px" }}
          />
          COMPT
        </Navbar.Brand>
        { !props.loggedIn && <span className="navbar-text mt-3">
           Classroom Oriented Manager for Projects & Tasks
        </span>}
          <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mt-2 mb-lg-0 ms-4">
              { props.loggedIn && <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                to={
                  props.role === "teacher"
                    ? "teacher/assignments"
                    : "student/assignments"
                }
              >
                Assignments
              </NavLink>
              }
              {props.role==="teacher" && <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/teacher/class-status">Class</NavLink>}
          </ul>
          {props.loggedIn ? <LogoutButton handleLogout={props.handleLogout} /> : <Link to='/login' className='btn btn-outline-light'>Login</Link>}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;