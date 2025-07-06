import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Col, Row } from "react-bootstrap";
import Select from "react-select"; 
import API from "../API/API.mjs";

function AssignmentForm(props) {
  const navigate = useNavigate();

  const initialState = {
    question: "",
    group: [],
  };

  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]); 

  useEffect(() => {
    API.getStudents()
      .then(setStudents)
      .catch(err => console.error("Failed to load students:", err));
  }, []);

  const handleSubmit = async (prevState, formData) => {
    const assignment = {
        teacherId: props.teacherId, 
        ...Object.fromEntries(formData.entries()),
        groupMembers: selectedGroup.map(s => s.value)  
    };

    if (assignment.question.trim() === "") {
        return {
        ...assignment,
        error: "Question field cannot be empty"
        };
    }

    if (assignment.groupMembers.length === 0) {
        return {
        ...assignment,
        error: "Select at least one student"
        };
    }

    if (assignment.groupMembers.length < 2 || assignment.groupMembers.length > 6) {
      return {
        ...assignment,
        error: "Group must contain between 2 and 6 members."
      };
    }

    try {
        await API.addAssignment(assignment);
        navigate("/teacher/assignments");
        return initialState; 
    } catch (err) {
        return {
        ...assignment,
        error: "Failed to create new assignment: " + err.message
        };
    }
    };
  const [state, formAction] = useActionState(handleSubmit, initialState);

  useEffect(() => {
    // Quando cambia state.group (dopo submit), aggiorniamo il selezionato
    setSelectedGroup(
      students
        .filter(s => state.group?.includes(s.id))
        .map(s => ({ value: s.id, label: `${s.name} ${s.surname}` }))
    );
  }, [state.group, students]);

  return (
    <>
      <h2 className="mb-5 text-center pt-5">New Assignment:</h2>

      {state?.error && <Alert variant="secondary">{state.error}</Alert>}
      <Row className="justify-content-center">
        <Col md={8}>
          <Form action={formAction}>
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                style={{ resize: "none" }}
                name="question"
                required
                minLength={2}
                defaultValue={state.question ?? ""}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-4">Group Members</Form.Label>
              <Select
                isMulti
                options={students.map(s => ({
                  value: s.id,
                  label: `${s.name} ${s.surname}`
                }))}
                value={selectedGroup}
                onChange={setSelectedGroup}
              />
            </Form.Group>

            <Button type="submit" className="mt-4" style={{ backgroundColor: "#38b2ac", borderColor: "#38b2ac" }}>Add</Button> 
              
            <Button type="button" className="btn btn-danger mt-4 ms-2" onClick={() => navigate(-1)}>Back</Button>

          </Form>
        </Col>
      </Row>
    </>
  );
}

export default AssignmentForm;
