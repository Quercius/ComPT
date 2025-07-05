import db from '../db/db.mjs';

const studentDao = {

  // rende la lista di assignments dello studente 
  listAssignments: (studentId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          A.id,
          A.question,
          A.status,
          A.answerText,
          A.grade,
          T.name AS teacherName,
          T.surname AS teacherSurname,
          GROUP_CONCAT(S.name || ' ' || S.surname, ', ') AS groupMembers
        FROM Assignments A
        JOIN Users T ON A.teacherId = T.id
        LEFT JOIN AssignmentGroupMembers AGM ON A.id = AGM.assignmentId
        LEFT JOIN Users S ON AGM.studentId = S.id
        WHERE A.id IN (
          SELECT assignmentId FROM AssignmentGroupMembers WHERE studentId = ?
        )
        GROUP BY A.id
        ORDER BY A.id
      `;
      db.all(sql, [studentId], (err, rows) => {
        if (err) {
          console.error("Error in studentDao.getAllAssignments execution: ", err);
          reject(err);
        } else if(!rows || rows.length===0 || rows===undefined) {
          console.error("Error in studentDao.getAllAssignments execution: assignments not found");
        } else {
          const assignments = rows.map(row => ({
            id: row.id,
            question: row.question,
            status: row.status,
            teacher: `${row.teacherName} ${row.teacherSurname}`,
            groupMembers: row.groupMembers
              ? row.groupMembers.split(',').map(s => s.trim())
              : [],
            hasAnswer: row.answerText != null,
            grade: row.grade ?? null
          }));
          resolve(assignments);
        }
      });
    });
  },

    
  updateAnswer: (assignmentId, answerText) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE Assignments
      SET answerText = ?
      WHERE id = ?
    `;
    db.run(sql, [answerText, assignmentId], function(err) {
      if (err) {
        reject("Error in studentDao.setAnswer execution: ", err);
      } else {
        resolve();
      }
    });
  });
},

};

export default studentDao;
