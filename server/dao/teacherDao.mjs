import db from '../db/db.mjs';

const teacherDao = {

  // rende tutte gli assignments di un professore
  listAssignments: (teacherId) => {
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
        WHERE A.teacherId = ?
        GROUP BY A.id
        ORDER BY A.id
      `;

      db.all(sql, [teacherId], (err, rows) => {
        if (err) {
          console.error("Error in teacherDao.getAllAssignments execution: ", err);  
          reject(err);
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

  // rende un assignment con id specifico assignmmentId
  getAssignment: (assignmentId) => {
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
        WHERE A.id = ?
        GROUP BY A.id
      `;
      db.get(sql, [assignmentId], (err, row) => {
        if (err) {
          console.error("Error in teacherDao.getAssignmentById execution: ", err);
          reject(err);
        } else if (row===undefined) {
          reject(new Error("Error in teacherDao.getAssignmentById execution: assignment not found"));
        } else {
          resolve({
            id: row.id,
            question: row.question,
            status: row.status,
            teacher: `${row.teacherName} ${row.teacherSurname}`,
            groupMembers: row.groupMembers
              ? row.groupMembers.split(',').map(s => s.trim())
              : [],
            answer: row.answerText ?? null,
            grade: row.grade ?? null
          });
        }
      });
    });
  },

  // aggiunge un nuovo assignment 
  createAssignment: (teacherId, question, groupMembers) => {
    return new Promise((resolve, reject) => {
      // inserimento nuovo assignment nella tabella Assignments
      const insertAssignmentSql = `
        INSERT INTO Assignments (teacherId, question, status)
        VALUES (?, ?, 'open')
      `;
      db.run(insertAssignmentSql, [teacherId, question], function (err) { //non usare arrow function!!!
        if (err) {
          console.error("Error in teacherDao.addAssignment - Assignment table operations: ", err);
          reject(err);
          return;
        }
        const assignmentId = this.lastID;

        // inserimento relazione assignment-studente nella tabella AssignementGroupMembers
        const insertMemberSql = `
          INSERT INTO AssignmentGroupMembers (assignmentId, studentId) VALUES (?, ?)
        `;
        const stmt = db.prepare(insertMemberSql);
        for (const studentId of groupMembers) {
          stmt.run(assignmentId, studentId, (err) => {
            if (err) console.error("Error in teacherDao.addAssignment - AssignmentGroupMembers table operations: ", err);
          });
        }
        stmt.finalize((err) => {
          if (err) {
            console.error("Error in teacherDao.addAssignment finalization: ", err);
            reject(err);
          } else {
            resolve(assignmentId);
          }
        });
      });
    });
  },

  // individua coppie di studenti che hanno condiviso 2+ assignment per lo stesso docente
  findOverusedPairs: (teacherId, studentIds) => { 
    return new Promise((resolve, reject) => {
      const placeholders = studentIds.map(() => '?').join(',');
      const sql = `
        SELECT
          AGM1.studentId AS s1,
          AGM2.studentId AS s2,
          COUNT(*) AS sharedCount
        FROM AssignmentGroupMembers AGM1
        JOIN AssignmentGroupMembers AGM2
          ON AGM1.assignmentId = AGM2.assignmentId
        JOIN Assignments A ON A.id = AGM1.assignmentId
        WHERE AGM1.studentId < AGM2.studentId
          AND AGM1.studentId IN (${placeholders})
          AND AGM2.studentId IN (${placeholders})
          AND A.teacherId = ?
        GROUP BY AGM1.studentId, AGM2.studentId
        HAVING sharedCount >= 2
      `;
      const params = [...studentIds, ...studentIds, teacherId];
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error("Error in teacherDao.findOverusedPairs execution: ", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // aggiunge il voto ad un assignment con risposta
  updateGrade: (assignmentId, grade) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE Assignments
        SET grade = ?
        WHERE id = ?
      `;
      db.run(sql, [grade, assignmentId], function (err) {
        if (err) {
          console.error("Error in teacherDao.setGrade execution: ", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  // aggiornamento dello stato di un assignment
  updateStatus: (assignmentId, status) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE Assignments SET status = ? WHERE id = ?`;
      db.run(sql, [status, assignmentId], function (err) {
        if (err) {
          console.error("Error in teacherDao.setStatus execution: ", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  // recupero lista di tutti gli studenti
  listStudents: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, name, surname
        FROM Users
        WHERE role = 'student'
        ORDER BY surname, name
      `;
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error("Errore in teacherDao.listStudents execution: ", err);
          reject(err);
        }else { 
          resolve(rows);
        }
      });
    });
  },

  // recupero delle info della classe, relative al professore loggato
getClassStatus: (teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      WITH GroupSizes AS (
        SELECT
          assignmentId,
          COUNT(*) AS groupSize
        FROM AssignmentGroupMembers
        GROUP BY assignmentId
      )
      SELECT
        S.id,
        S.name,
        S.surname,
        COUNT(CASE WHEN A.status = 'open' THEN 1 END) AS openAssignments,
        COUNT(CASE WHEN A.status = 'closed' THEN 1 END) AS closedAssignments,
        ROUND(
          SUM(
            CASE
              WHEN A.grade IS NOT NULL THEN A.grade * (1.0 / GS.groupSize)
            END
          ) / 
          NULLIF(
            SUM(
              CASE
                WHEN A.grade IS NOT NULL THEN (1.0 / GS.groupSize)
              END
            ), 0
          )
        , 2) AS averageScore
      FROM Users S
      LEFT JOIN AssignmentGroupMembers AGM ON S.id = AGM.studentId
      LEFT JOIN Assignments A ON A.id = AGM.assignmentId AND A.teacherId = ?
      LEFT JOIN GroupSizes GS ON A.id = GS.assignmentId
      WHERE S.role = 'student'
      GROUP BY S.id
    `;

    db.all(sql, [teacherId], (err, rows) => {
      if (err) {
        console.error("Error in teacherDao.getClassStatus execution: ", err);
        reject(err);
      } else {
        const students = rows.map(row => ({
          id: row.id,
          name: row.name,
          surname: row.surname,
          openAssignments: row.openAssignments ?? 0,
          closedAssignments: row.closedAssignments ?? 0,
          averageScore: isNaN(row.averageScore) ? 0 : row.averageScore
        }));
        resolve(students);
      }
    });
  });
},

};

export default teacherDao;
