import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo_compt.png";

function HomePage(props) {


  return (
    <Container className="d-flex flex-column justify-content-center align-items-center text-center mt-5 pt-5">
      <img
        src={logo}
        alt="COMPT Logo"
        width="120"
        height="120"
        className="mb-4"
      />
      <h1 className="fw-bold mb-2">COMPT</h1>
      <h4 className="mb-5">Classroom Oriented Manager for Projects & Tasks</h4>

      {props.loggedIn
        ? (
          <>
            <Link to="assignments" className="mb-3" onClick={() => props.setMessage('')}>
              <Button
                style={{
                  backgroundColor: "#38b2ac",
                  borderColor: "#38b2ac",
                }}
                size="lg"
              >
                Your assignments
              </Button>
            </Link>

            {props.user.role==="teacher" && <Link to="class-status">
              <Button
                style={{
                  backgroundColor: "#38b2ac",
                  borderColor: "#38b2ac",
                }}
                onClick={() => props.setMessage('')}
                size="lg"
              >
                Class status
              </Button>
            </Link>}

          </>
        )
        : (
          <>
            <p className="mb-4">
              Welcome to COMPT — the simple, powerful way to manage projects and
              teamwork in your classroom.
            </p>
            <Link to="/login">
              <Button
                style={{
                  backgroundColor: "#38b2ac",
                  borderColor: "#38b2ac",
                }}
                size="lg"
              >
                Login
              </Button>
            </Link>
          </>
        )
      }
    </Container>
  );
}

export default HomePage;
