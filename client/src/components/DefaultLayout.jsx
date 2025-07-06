import { Container, Alert, Row } from "react-bootstrap";
import NavHeader from "./NavHeader";
import { Outlet } from "react-router";

function DefaultLayout(props) {

    return(
        <>     
            <NavHeader handleLogout={props.handleLogout} loggedIn={props.loggedIn} role={props.role}/>
            {props.message && <Row> <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert> </Row>}
            <Container fluid className="mt-5">
                <Outlet />
            </Container>   
        </>
    );
}

export default DefaultLayout;