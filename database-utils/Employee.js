const mongoCollections = require('./mongoCollections');
const employee = mongoCollections.employee;
const managerCollect = mongoCollections.manager;
const ObjectId = require('mongodb').ObjectId
const manager = require("./Manager");
const transaction = mongoCollections.transaction;



const exportedMethods = {

    async getEmployeeById(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof id != 'string') throw 'Please provide proper id'
        const employeeCollection = await employee();
        const empdata = await employeeCollection.findOne({ _id: ObjectId(id) });
        if (empdata == null) throw "No Employee found of following id";
        return empdata;
    },

    async getEmployeesByManager(managerName) {
        if ((!managerName) || (typeof(managerName) != "string")) throw "Please provide proper manger name"
        const employeeCollection = await employee();

        return await employeeCollection.find({ "manager_ID": { $eq: managerName } }).toArray();


    },

    async getEmployeeByUser(username) {
        if (!username) throw "You must provide an id to search for";
        if (username.length == 0) throw "Please provide proper length of the id";
        if (typeof username != 'string') throw "Please provide proper type of id"

        const employeeCollection = await employee();
        const empdata = await employeeCollection.findOne({ username: username });
        if (empdata === null) throw " NO employee found of following id";

        return empdata;
    },

    async getEmployeeByPay(manager_ID) {
        var arr = []
        var c = 0;
        if (!manager_ID) throw "You must provide an id to search for";
        if (manager_ID.length == 0) throw "Please provide proper length of the id";
        if (typeof manager_ID != 'string') throw "Please provide proper type of id"

        const employeeCollection = await employee();
        const empdata = await employeeCollection.find({}).toArray();
        for (let i = 0; i < empdata.length; i++) {
            if (empdata[i]["manager_ID"] == manager_ID && empdata[i]["paidFlag"] == "Not Paid") {
                let x = "Pending Payment to " + empdata[i]["username"] + " of amount " + empdata[i]["total_salary"] + " before " + empdata[i]["payDate"]
                arr.push(x)
                    //  console.log('f')
                    // var c = 1;
            }

        }
        // if (c != 1) { throw 'Id does not match ' }
        if (arr.length == 0) {
            arr.push("No Pending Tasks")
        }
        return arr
    },

    async addEmployee(firstName, lastName, username, email, total_hours, basic_salary, manager_ID, payDate, job_title) {
        var mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ((!firstName) || (!lastName) || (!username) || (!email) || (!total_hours) || (!basic_salary) || (!manager_ID) || (!payDate) || (!job_title)) throw 'Please provide all the feilds'
        if (typeof firstName !== 'string') throw 'No firstname provided';
        if (typeof lastName !== 'string') throw 'No lastname provided';
        if (typeof username !== 'string') throw 'No Username providede';
        if (mailformat.test(email) == false) throw 'Please provide proper  mailid';
        if (typeof email !== 'string') throw 'Please provide mail id';
        if (isNaN(total_hours) || (total_hours < 0)) throw 'Please provide proper totaol_hours';
        if (isNaN(basic_salary || (basic_salary < 0))) throw 'Please provide proper basic_salary';
        if (typeof manager_ID !== 'string') throw 'Please provide manager id';
        if (typeof payDate !== "string") throw 'Please provide paydate';
        if (typeof job_title !== 'string') throw 'Please provide job titile';
        const employeeCollection = await employee();

        // const userThatPosted = await users.getUserById(posterId);

        const newEmployee = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            total_hours: total_hours,
            basic_salary: basic_salary,
            total_salary: total_hours * basic_salary,
            paidFlag: "Not Paid",
            manager_ID: manager_ID,
            payDate: payDate,
            job_title: job_title
        };

        const newInsertInformation = await employeeCollection.insertOne(newEmployee);
        const newId = newInsertInformation.insertedId;
        if (newInsertInformation.insertedCount === 0) throw "Could not add Employee";

        console.log("reached here1")
        await manager.addEmptoManager(manager_ID, newId, username, newEmployee.total_salary, newEmployee.paidFlag);
        console.log("reached here2")
        const newEmployeeDetails = await this.getEmployeeById(newId.toString());
        return newEmployeeDetails;
        //return await this.getPostById(newId);
    },

    async removeEmployee(id) {
        if (!id) throw "You must provide an id to search for";
        //if (id.length == 0) throw "Please provide proper legth of the id";
        if (typeof id !== 'string') throw "Please provide proper id";
        const removecontent = await this.getEmployeeById(id.toString());
        const employeeCollection = await employee();

        const deletionInfo = await employeeCollection.deleteOne({ _id: ObjectId(id) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete employee with id of ${id}`;
        }

        return removecontent

    },

    async updateEmployee(user_login_id, firstName, lastName, email, total_hours, basic_salary, total_salary, job_title) {
        var mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ((!user_login_id) && (!firstName) && (!lastName) && (!email) && (!total_hours) && (!basic_salary) && (!total_salary) && (!job_title)) throw 'Please provide the fields'
        if (firstName) { if (typeof firstName !== 'string') throw 'No firstName provided'; }
        if (lastName) { if (typeof lastName !== 'string') throw 'No lastName provided'; }
        if (email) { if (mailformat.test(email) == false) throw 'Please provide proper  mailid'; }
        if (total_hours) { if (isNaN(total_hours) || (total_hours < 0)) throw 'Please provide proper hours'; }
        if (basic_salary) { if (isNaN(basic_salary || (basic_salary < 0))) throw 'Please provide proper basic salary'; }
        if (total_salary) { if (isNaN(total_salary || (total_salary < 0))) throw 'Please provide proper total salary'; }
        if (job_title) { if (typeof job_title !== 'string') throw 'Please provide proper job title'; }
        if (typeof user_login_id !== 'string') throw 'Please provide proper login_id';

        const renamecontent = await this.getEmployeeByUser(user_login_id);
        const employeeCollection = await employee();
        const updatedData = {
            firstName: firstName,
            lastName: lastName,
            username: user_login_id,
            email: email,
            total_hours: total_hours,
            basic_salary: basic_salary,
            total_salary: total_salary,
            paidFlag: renamecontent.paidFlag,
            manager_ID: renamecontent.manager_ID,
            payDate: renamecontent.payDate,
            job_title: job_title

        };
        const updatedInfo = await employeeCollection.replaceOne({ username: (user_login_id) }, updatedData);
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update Employee successfully";
        }
        const upID = updatedInfo.updatedID;
        const updatedDat = await this.getEmployeeByUser(user_login_id);
        return updatedDat;

    },

    async updateHours(username, total_hour_new, start_date, end_date) {

        if ((!username) || (!total_hour_new) || (!start_date) || (!end_date)) throw "You must provide all fields to search for";
        // if (!id.match("/^[0-9a-fA-f]{24}$")) throw "Please provide proper 12 bytes length of the id";
        if (username.length === 0) throw "Please provide proper legth of the id";
        if (typeof username != 'string') throw "Please provide proper id"
        if (isNaN(total_hour_new) || (total_hour_new < 0)) throw 'Please enter the  hours'
        if (typeof start_date != 'string') throw 'Please enter correct date '
        if (typeof end_date != 'string') throw 'Please enter correct date '
        const updated = await this.getEmployeeByUser(username);
        if (updated === null) {
            return
        }
        const employeeCollection = await employee();
        total_hours = parseInt(updated.total_hours) + parseInt(total_hour_new)
        console.log(total_hours)
        total_hours = total_hours.toString()
        total_salary = parseInt((updated.basic_salary) * (parseInt(updated.total_hours) + parseInt(total_hour_new)))
        total_salary = total_salary.toString()
        const updatedHours = {
            firstName: updated.firstName,
            lastName: updated.lastName,
            username: updated.username,
            email: updated.email,
            total_hours: total_hours,
            basic_salary: updated.basic_salary,
            total_salary: total_salary,
            paidFlag: updated.paidFlag,
            manager_ID: updated.manager_ID,
            payDate: updated.payDate,
            job_title: updated.job_title,

        };
        const updatedInfo = await employeeCollection.replaceOne({ username: username }, updatedHours);
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update Employee successfully";
        }


        //adding transaction
        const transactionCollection = await transaction();

        var today = new Date();
        var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const newTransaction = {
            by: updated.username,
            byPosition: "Employee",
            to: updated.manager_ID,
            toPosition: "Manager",
            typeOfTransaction: "Adding Hours",
            start_date: start_date,
            end_date: end_date,
            amount: "not required",
            hours: total_hours,

            timestamp: dateTime
        };

        const newTransactionInformation = await transactionCollection.insertOne(newTransaction);


        if (newTransactionInformation.insertedCount === 0) {
            throw "could not insert Employee successfully";
        }
        //adding transaction


        const managerCollection = await managerCollect();
        const search = await managerCollection.findOne({ user_login_id: updated.manager_ID });
        if (search === null) throw 'Not in Employee'
        console.log(search)
        let i = 0;
        newSal = (updated.basic_salary * (updated.total_hours + total_hour_new))
        for (i; i < search.employees.length; i++) {
            if (search.employees[i].id.toString() == updated._id.toString()) {
                search.employees[i].Name = updated.firstName;
                search.employees[i].total_salary = total_salary
                search.employees[i].paidFlag = "Not Paid"
            }
        }
        const something = await managerCollection.updateOne({ user_login_id: updated.manager_ID }, { $set: { employees: search.employees } })
        if (something.modifiedCount === 0) {
            throw "could not update Employee successfully";
        }
        return this.getEmployeeById(updated._id.toString());;

    },

};

module.exports = exportedMethods;