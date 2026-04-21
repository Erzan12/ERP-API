CREATE VIEW "RegularizationEligibility" AS
SELECT 
    e.id AS "employeeId",
    e.hire_date,
    p.id AS "personId",
    pos.id AS "positionId",
    d.id AS "departmentId",
-- Capturing the latest active employment history record
    (SELECT eh.id 
     FROM "EmploymentHistory" eh 
     WHERE eh.employee_id = e.id AND eh.is_active = true 
     ORDER BY eh.effective_date DESC 
     LIMIT 1) AS "latestHistoryId"
FROM "Employee" e
JOIN "EmploymentStatus" es ON e.employment_status_id = es.id
LEFT JOIN "Person" p ON e.person_id = p.id
LEFT JOIN "Position" pos ON e.position_id = pos.id
LEFT JOIN "Department" d ON e.department_id = d.id
WHERE es.code = 'PROBATIONARY'
  AND e.hire_date <= CURRENT_DATE
  AND e.hire_date >= (CURRENT_DATE - INTERVAL '6 months');