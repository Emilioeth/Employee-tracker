const inquirer = require('inquirer');
const cTable = require('console.table');
const { 
  showDepartmentDetails, 
  showAllEmployees, 
  showAllRoles, 
  addDepartment, 
  addRole, 
  addEmployee, 
  updateEmployeeRole 
  } = require('./Assets/dbFunctions')


const startQuestions = () => {
    return inquirer
        .prompt(
              {
                type: 'list',
                name: 'nextAction',
                message: 'Use input to select an option',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Quit']
              }
        )
}

const newRolePrompt = () => {
  let departments = [];
    showDepartmentDetails().then(rows => {
    rows.forEach(element => {
      departments.push(element.name)
    })
  })
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please enter the role title.',
            validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter a role title');
                  return false;
                }
            }
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Please enter a salary.',
            validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter a salary');
                  return false;
                }
            }
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'What department is this role in?',
            choices: departments
          }
        ])
      
}

const updateEmployeeRolePrompt = (employees, roles) => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'What is the employee id',
            choices: employees
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'What is the new role?',
            choices: roles
          }
        ])
}

const newDepartmentPrompt = () => {
    return inquirer.prompt(
        {
            type: 'input',
            name: 'name',
            message: 'Please enter the name of the department.',
            validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter a department name');
                  return false;
                }
            }
          })
}

const employeeBool = () => {

  let boolEmploy = []

  showAllEmployees().then(rows => {
    rows.forEach(element => {
    boolEmploy.push(element.first_name)
    console.log(boolEmploy.length)
    if (boolEmploy.length > 0){
      return true
    }
    else {
      return false
    }
    })
  })
};

const newEmployeePrompt = () => {
    let employees = ['none'];
    showAllEmployees().then(rows => {
    rows.forEach(element => {
      employees.push(element.first_name + ' ' + element.last_name)
    })
  })
  let roles = [];
    showAllRoles().then(rows => {
    rows.forEach(element => {
      roles.push(element.title)
    })
  })
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
            validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter first name');
                  return false;
                }
            }
          },
          {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
            validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter last name');
                  return false;
                }
            }
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Please choose an employee role",
            choices: roles
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Please choose an employee manager",
            choices: employees
          }
        ])
}


const initializeApp = () => {
    startQuestions().then(results => {
        switch(results.nextAction) {
            case 'View All Employees':
                showAllEmployees().then(rows => {
                    console.table(rows);
                    initializeApp();
                })
                break;
            case 'View All Roles':
                showAllRoles().then(rows => {
                  console.table(rows);
                  const roles = [];
                  rows.forEach(element => {
                    roles.push(element.title)
                  });
                    initializeApp();
                })
                break;
            case 'View All Departments':
                showDepartmentDetails().then(rows => {
                    console.table(rows);
                    initializeApp();
                })
                break;
            case 'Add A Department':
                newDepartmentPrompt().then(response => {
                    const body = {
                        name: response.name
                    }
                    addDepartment({body}).then(res => {
                        showDepartmentDetails().then(res => {
                            initializeApp();
                        });
                    })
                })
                break;
            case 'Add A Role':
                newRolePrompt().then(response => {
                  showDepartmentDetails().then(rows => {
                    const newID = rows.find(x => x.name === response.department_id).id;
                    const body = {
                        title: response.title,
                        salary: response.salary,
                        department_id: newID
                    }
                    addRole({body}).then(res => {
                        showAllRoles().then(res => {
                            initializeApp();
                        });
                    })
                  })
                })
                break;
            case 'Add An Employee':
                newEmployeePrompt().then(response => {
                    showAllRoles().then(rows => {
                    const roleID = rows.find(x => x.title === response.role_id).id;
                    showAllEmployees().then(employeeRow => {
                    const manager = employeeRow.filter(employee => employee.first_name + ' ' + employee.last_name === response.manager_id);
                    let newID;
                    if(response.manager_id === 'none'){
                      newID = undefined;
                    } else{
                    newID = manager[0].id;
                    }
                    const body = {
                        first_name: response.first_name,
                        last_name: response.last_name,
                        role_id: roleID,
                        manager_id: newID
                    }
                    addEmployee({body}).then(res => {
                        showAllEmployees().then(res => {
                            initializeApp();
                        });
                    })
                  })
                })
                })
                break;
            case 'Update An Employee Role':
              let employees = [];
              showAllEmployees().then(rows => {
              rows.forEach(element => {
                employees.push({name:element.first_name + ' ' + element.last_name, value: element.id})
              })
            let roles = [];
              showAllRoles().then(res => {
              res.forEach(element => {
                roles.push({name: element.title, value: element.id})
              })
            
                updateEmployeeRolePrompt(employees, roles).then(response => {

                  const body = {
                    id: response.id,
                    role_id: response.role_id
                }
                    updateEmployeeRole({body}).then(res => {
                      initializeApp();
                    })
                })
              })
                })
                break;
            default:
                console.log('Come back soon!');
        }
    })
}

initializeApp();