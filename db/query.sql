SELECT id, department_name AS department 
FROM department;

SELECT role.id, title, salary, department_name AS department
FROM role
INNER JOIN department ON role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name AS department, manager.first_name AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;
