import { useActionState } from "react";
import { Button, Form, Row, Col, Alert, Spinner} from 'react-bootstrap'
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

        try{
            await props.handleLogin(credentials);
            return { success: true};
        }
        catch(error) {
            return { error: 'Login failed: wrong credentials.'}
        }
    }

    return (
    <>
      {isPending && (
        <Spinner animation="border" variant="primary" />
      )}
    
      <h2 className="mb-4 pt-5 text-center">Log In</h2>

      <Row className="justify-content-center mt-5">
        <Col md={5}>
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

            <Button
              type="submit"
              disabled={isPending}
              style={{ backgroundColor: "#38b2ac", borderColor: "#38b2ac" }}
            >
              Login
            </Button>
            <Link
              className="btn btn-danger mx-2 my-2"
              to="/"
              disabled={isPending}
            >
              Cancel
            </Link>
          </Form>
        </Col>
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