const inquirer = require('inquirer');
const connection = require('./db/connection');

const initialQuestions = {
    type: "list",
    name: "initial_choice",
    message: "What would you like to do?",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
};

async function initializeApp(){
    await startQuestions();
}

let startQuestions = async () => {
    await inquirer.prompt(initialQuestions).then((answers) => {
        choicesAnswer(answers)
    });
};

let choicesAnswer = (answers) => {
    switch(answers.initial_choice){
        case "View all departments": 
            showDepartmentDetails();
            break;
        case "View all roles":
            showAllRoles();
            break;
        case "View all employees":
            showAllEmployees();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee role":
            updateEmployeeRole();
            break;
    }
};

const showDepartmentDetails = () => {
    let departmentQuery = `SELECT id, department_name AS department 
    FROM department;`
    return connection.query(departmentQuery, (err, result) => {
        if (err) console.log(err);
        console.table(result);
        startQuestions();
    });
};

const showAllRoles = () => {
    let rolesQuery = `SELECT role.id, title, salary, department_name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id;`
    connection.query(rolesQuery, (err, result) => {
        if (err) console.log(err);
        console.table(result);
        startQuestions();
    });
};

const showAllEmployees = () => {
    let employeesQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name AS department, manager.first_name AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`
    connection.query(employeesQuery, (err, result) => {
        if (err) console.log(err);
        console.table(result);
        startQuestions();
    });
};

const addDepartmentQuestion = {
    type: "text",
    name: "department_name",
    message: "Please enter the name of the department."
};

const addDepartment = () => {
    inquirer.prompt(addDepartmentQuestion).then(answer => {
        let addDepartmentQuery = `INSERT INTO department(department_name) VALUES ('${answer.department_name}');`
        connection.query(addDepartmentQuery, (err, result) =>  {
            if (err) console.log(err);
            console.log(`Department with name ${answer.department_name} added successfully.`);
            startQuestions();
        });
    });
};

const getAllDepartments = () => {
    return connection.query("SELECT * FROM department", (err, result) => {
        if (err) console.log(err);
        console.log(result);
    })

};

const addRoleQuestion = [
    {
        type: "text",
        name: "role_name",
        message: "Please enter the role title."
    },
    {
        type: "number",
        name: "salary",
        message: "Please enter a salary."
    },
    {
        type: "list",
        name: "department",
        message: "Choose a department.",
        choices: getAllDepartments
    }
];

const addRole = () => {
    let answers = inquirer.prompt(addRoleQuestion)
};

initializeApp();