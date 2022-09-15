const db = require('../db/connection');

const showDepartmentDetails = () => {
    const sql = `
        SELECT * FROM department`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(rows);
        })
    })
}

const showAllRoles = () => {
    const sql = `
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(rows);
        })
    })
}

const showAllEmployees = () => {
    const sql = `
        SELECT a.id, a.first_name, a.last_name, role.title, department.name AS department, role.salary, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a
        LEFT JOIN role ON a.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee b
        ON a.manager_id = b.id `
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(rows);
        })
    })
}

const addDepartment = ({ body }) => {
    const sql = `INSERT INTO department (name)
                 VALUES (?)`;
    const params = [body.name];
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(result);
        })
    })
}

const addRole = ({ body }) => {
    const sql = `INSERT INTO role (title, salary, department_id)
                 VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department_id];
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(result);
        })
    })
}

const addEmployee = ({ body }) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES (?,?,?,?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(result);
        })
    })
}

const updateEmployeeRole = ({ body }) => {
    const sql = `UPDATE employee SET role_id = ?
                 WHERE id = ?`;
    const params = [body.role_id, body.id];
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                reject('Rejected');
            } 
            resolve(result);
        })
    })
}

module.exports = { showDepartmentDetails, showAllEmployees, showAllRoles, addDepartment, addRole, addEmployee, updateEmployeeRole };

