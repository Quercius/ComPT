import { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router";
import API from "../API/API.mjs";

function AssignmentsTable(props) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const getAssignments = async () => {
      const data = await API.getAssignments();
      setAssignments(data);
    };
    getAssignments();
  }, []);

  const openAssignments = assignments.filter(a => a.status === "open");
  const closedAssignments = assignments.filter(a => a.status === "closed");

  const gradedAssignments = closedAssignments.filter(
  a => a.grade !== null && a.grade !== undefined
  );

  const weightedSum = gradedAssignments.reduce((acc, a) => {
    const weight = 1 / a.groupMembers.length;
    return acc + a.grade * weight;
  }, 0);

  const weightSum = gradedAssignments.reduce((acc, a) => {
    const weight = 1 / a.groupMembers.length;
    return acc + weight;
  }, 0);

  const averageScore = gradedAssignments.length > 0
    ? (weightedSum / weightSum).toFixed(1)
    : '--';

  return (
    <>
  <h2 className="mb-4 text-center">Your Assignments:</h2>

  {props.role === "student" ? (
      <>
        <h4 className="mb-3">Open</h4>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Question</th>
                <th>Teacher</th>
                <th>Group Members</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {openAssignments.map(a => (
                <tr key={a.id}>
                  <td>{a.question}</td>
                  <td>{a.teacher}</td>
                  <td>{a.groupMembers.join(", ")}</td>
                  <td>{a.grade ?? "-"}</td>
                  <td>
                    <Link
                      className="btn"
                      style={{
                        backgroundColor: "#38b2ac",
                        borderColor: "#38b2ac",
                        color: "white",
                      }}
                      to={`${a.id}/answer`}
                    >
                      {a.hasAnswer ? "Show Answer" : "Add Answer"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <h4 className="mb-3 mt-4">Closed</h4>
        
        <Row>
          <Col md={10}>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Teacher</th>
                    <th>Group Members</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {closedAssignments.map(a => (
                    <tr key={a.id}>
                      <td>{a.question}</td>
                      <td>{a.teacher}</td>
                      <td>{a.groupMembers.join(", ")}</td>
                      <td>{a.status}</td>
                      <td>{a.grade ?? "-"}</td>
                      <td>
                        <Link
                          className="btn"
                          style={{
                            backgroundColor: "#38b2ac",
                            borderColor: "#38b2ac",
                            color: "white",
                          }}
                          to={`${a.id}/answer`}
                        >
                          Show Answer
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={2} className="d-flex flex-column align-items-center justify-content-center">
            <div className="border rounded p-4 text-center">
              <h5>Average score</h5>
              <div style={{ fontSize: "3rem", fontWeight: "bold" }}>{averageScore}</div>
            </div>
          </Col>
        </Row>

      </>
    ) : (
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Question</th>
              <th>Group Members</th>
              <th>Status</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.question}</td>
                <td>{a.groupMembers.join(", ")}</td>
                <td>{a.status}</td>
                <td>{a.grade ?? "-"}</td>
                <td>
                  <Link
                    className={`btn ${
                      props.role === "teacher" && !a.hasAnswer ? "disabled" : ""
                    }`}
                    aria-disabled={
                      props.role === "teacher" && !a.hasAnswer
                    }
                    style={{
                      backgroundColor: "#38b2ac",
                      borderColor: "#38b2ac",
                      color: "white",
                    }}
                    to={`${a.id}/answer`}
                  >
                    Show Answer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )}

    {props.role === "teacher" && (
      <Link
        className="btn mt-3"
        to="new"
        style={{
          backgroundColor: "#38b2ac",
          borderColor: "#38b2ac",
          color: "white",
        }}
      >
        Create new Assignment
      </Link>
    )}
  </>
  );
}

export default AssignmentsTable;
