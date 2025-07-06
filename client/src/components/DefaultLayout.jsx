import { Container, Alert, Row } from "react-bootstrap";
import NavHeader from "./NavHeader";
import { Outlet } from "react-router";

function DefaultLayout(props) {

    return(
        <>     
            <NavHeader handleLogout={props.handleLogout} loggedIn={props.loggedIn} role={props.role} setMessage={props.setMessage}/>

            {props.message && (
                <div
                style={{
                    position: "fixed",
                    top: "100px", 
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999, 
                    width: "70%",
                    maxWidth: "600px"
                }}
                >
                <Alert
                    variant={props.message.type}
                    onClose={() => props.setMessage('')}
                    dismissible
                >
                    {props.message.msg}
                </Alert>
                </div>
            )}

            <Container fluid className="mt-5">
                <Outlet />
            </Container>   
        </>
    );
}

export default DefaultLayout;