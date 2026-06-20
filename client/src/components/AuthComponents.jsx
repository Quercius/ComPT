import { useActionState } from "react";
import { Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router'
    
function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(LoginFunction, {
        username: '', 
        password: ''
    });

    async function LoginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            return { success: true };
        }
        catch(error) {
            return { error: 'Login failed: wrong credentials.' }
        }
    }

    return (
    <>
      {isPending && (
        <div className="text-center mt-3">
            <Spinner animation="border" variant="primary" />
        </div>
      )}
    
      <h2 className="mb-4 pt-5 text-center">Log In</h2>

      {/* Usiamo justify-content-center per centrare orizzontalmente */}
      <Row className="justify-content-center mt-4 m-0">
        
        {/* INVECE DELLE COLONNE: un div con larghezza massima fissa e mx-auto (margine automatico) per centrarlo */}
        <div style={{ maxWidth: '450px', width: '100%' }} className="mx-auto px-3">
          <Form action={formAction}>
            <div className="mb-3">
              <Form.Label htmlFor="username">Email</Form.Label>
              <Form.Control
                type="email"
                name="username"
                id="username"
                required
                aria-describedby="emailHelp"
              />
            </div>

            <div className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="password"
                required
                minLength={6}
              />
            </div>

            {state.error && (
              <Alert variant="danger" className="mt-2">
                {state.error}
              </Alert>
            )}

            {/* HO AGGIUNTO justify-content-center: ora i bottoni saranno perfettamente al centro sotto le caselle */}
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4 mb-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  style={{ backgroundColor: "#38b2ac", borderColor: "#38b2ac" }}
                >
                  Login
                </Button>
                
                <Link
                  className={`btn btn-danger ${isPending ? 'disabled' : ''}`}
                  to="/"
                  style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                >
                  Cancel
                </Link>
            </div>
          </Form>
        </div>
      </Row>
    </>
  );
}

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.handleLogout}>Logout</Button>
    );
}

export {
    LoginForm,
    LogoutButton
};