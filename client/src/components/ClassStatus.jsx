import { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import API from '../API/API.mjs';

function ClassStatus() {
  const [classStatus, setClassStatus] = useState([]);

  const [sortBy, setSortBy] = useState("name"); 
  const [sortOrder, setSortOrder] = useState("asc"); 

  const sortedClassStatus = [...classStatus].sort((a, b) => {
    let valA, valB;

    if (sortBy === "name") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortBy === "surname") {
      valA = a.surname.toLowerCase();
      valB = b.surname.toLowerCase();
    } else if (sortBy === "assignments") {
      valA = a.openAssignments + a.closedAssignments;
      valB = b.openAssignments + b.closedAssignments;
    } else if (sortBy === "average") {
      valA = a.averageScore ?? 0;
      valB = b.averageScore ?? 0;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const getClassStatus = async () => {
      const classStatus = await API.getClassStatus();
      setClassStatus(classStatus);
    }
    getClassStatus();
  }, [])

  return (
    <>
      <h2 className="mb-4 text-center" >Class members summary:</h2>

      <Form className="d-flex mb-3 justify-content-end">
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="me-2"
          style={{ width: '200px' }}
        >
          <option value="name">Sort by Name</option>
          <option value="surname">Sort by Surname</option>
          <option value="assignments">Sort by # Assignments</option>
          <option value="average">Sort by Average Score</option>
        </Form.Select>

        <Form.Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ width: '140px' }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Select>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Open Assignments</th>
            <th>Closed Assignments</th>
            <th>Average Grade</th>
          </tr>
        </thead>
        <tbody>
          {sortedClassStatus.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>{student.openAssignments}</td>
              <td>{student.closedAssignments}</td>
              <td>{student.averageScore}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ClassStatus;
