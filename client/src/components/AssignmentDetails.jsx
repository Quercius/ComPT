import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../API/API.mjs';
import { Card, Alert, Form, Button } from 'react-bootstrap';

function AssignmentDetails(props) {
  const [assignment, setAssignment] = useState(null);
  const [vote, setVote] = useState('');
  const [editableAnswer, setEditableAnswer] = useState('');  // stato locale per l'answer

  const { id } = useParams();

  const navigate = useNavigate();

   useEffect(() => {
    const getAssignment = async () => {
      const assignment = await API.getAssignmentById(id);
      setAssignment(assignment);
      setEditableAnswer(assignment.answer || '');  // inizializza l'answer editabile
    }
    getAssignment();
  }, [id]);

  if (!assignment) return <Alert variant="warning">Assignment not found</Alert>;

  return (
    <>
      <h2 className="mb-4 text-center">Assignment #{assignment.id}</h2>

      <Card className="mb-4">
        <Card.Body>
          <Card.Text><strong>Question:</strong> {assignment.question}</Card.Text>
          <Card.Text><strong>Status:</strong> {assignment.status}</Card.Text>
          <Card.Text><strong>Group:</strong> {assignment.groupMembers.join(', ')}</Card.Text>
        </Card.Body>
      </Card>

      <div className="d-flex gap-3">

        <Card className="flex-grow-1">
          <Card.Body>
            <Card.Title>Answer</Card.Title>
            {props.role==="teacher" ? (<Card.Text>
              {assignment.answer ? assignment.answer : "No answer yet."}
            </Card.Text>) : (
              assignment.answer ? (
                assignment.status === "open" ? (
                <Form.Control
                  as="textarea"
                  rows={4}
                  style={{ resize: "none" }}
                  value={editableAnswer}
                  onChange={(e) => setEditableAnswer(e.target.value)}
                />
              ) : (
                <Card.Text>{assignment.answer}</Card.Text>
                )
              ) : (
                assignment.status==="open" && 
                <Form.Control
                  as="textarea"
                  rows={4}
                  style={{ resize: "none" }}
                  value={editableAnswer}
                  onChange={(e) => setEditableAnswer(e.target.value)}
                />
              )
            )}
          </Card.Body>
        </Card>

        {!(props.role==="student" && assignment.grade === null) &&
        (<Card style={{ width: '200px' }}>
          <Card.Body>
            <Card.Title className="text-center">Grade</Card.Title> 
            {props.role === "teacher" ? (
              assignment.grade == null ? (
                <Form.Group controlId="gradeSelect">
                  <Form.Select
                    value={vote === '' ? '' : vote.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setVote(value === '' ? '' : parseInt(value));
                    }}
                  >
                    <option value="">--</option>
                    {Array.from({ length: 30 }, (_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <div className="text-center fs-4">
                  {assignment.grade}
                </div>
              )
            ) : (
              <div className="text-center fs-4">
                {assignment.grade}
              </div>
            )}

          </Card.Body>
        </Card>) }
      </div>

      {assignment.grade != null ? (
        <Button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Back
        </Button>
      ) : (
        <>
          <Button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
            Back
          </Button>
          {props.role === "teacher" ? (<Button
            className="btn mt-3 ms-2" 
            style={{ backgroundColor: "#38b2ac", borderColor: "#38b2ac" }}
            disabled={vote === ''}
            onClick={() => {
              API.setGrade(id, vote);
              navigate(-1);
            }}
          >
            Evaluate
          </Button>) : (
            <Button
              className="btn btn-primary mt-3 ms-2" style={{ backgroundColor: "#38b2ac", borderColor: "#38b2ac" }}
              disabled={(editableAnswer === assignment.answer) || (editableAnswer==='' && !assignment.answer) || editableAnswer===''}
              onClick={() => {
                //console.log("Saving answer:", editableAnswer);
                API.setAnswer(id, editableAnswer);
                navigate(-1);
              }}
            >
              {assignment.answer ? "Edit" : "Add Answer"}
            </Button>
          )}
        </>
      )}
      
    </>
  );
}

export default AssignmentDetails;
