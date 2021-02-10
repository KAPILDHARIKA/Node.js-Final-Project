const express = require('express');
const router = express.Router();
const tran = require('../database-utils/transaction')
const emp = require('../database-utils/Employee')
const man = require('../database-utils/Manager')
const xss = require("xss")
const alert = require('alert-node')

const help = require('../database-utils/Help')
const tra = null;

router.get('/transaction', async(req, res) => {
    try {
        x = Object.keys(req.query).toString()
        const tra = await tran.getTransactionByUsername(x)
        console.log("transaction: ", tra)

        //res.render('templates/employee_profile_two', { searchDetail: post });
        res.status(200).json(tra);
    } catch (e) {
        res.status(500).json({ error: e });
    }


});

router.get('/', async(req, res) => {
    try {
        res.render('templates/employee_main');
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/empprof/:id', async(req, res) => {
    try {
        //console.log('this')

        if ((!req.params.id) || (typeof(req.params.id) != 'string')) {
            res.status(400).render("templates/error", { errorMsg: "Something wrong with parameters" })
        }


        const post = await emp.getEmployeeByUser(req.params.id);
        console.log(post)
        res.render('templates/employee_profile', { searchDetail: post });
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/empprof_two/:id', async(req, res) => {
    try {

        if ((!req.params.id) || (typeof(req.params.id) != 'string')) {
            res.status(400).render("templates/error", { errorMsg: "Something wrong with parameters" })
        }

        const post = await emp.getEmployeeByUser(req.params.id);
        console.log(post)
        if (post == null) {
            alert("Invalid employee name!");
            res.redirect('back');
        } else {
            res.render('templates/employee_profile_two', { searchDetail: post });
            res.status(200);
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/empprof_two', async(req, res) => {
    try {

        alert("No employee name!");
        res.redirect('back');

    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/employeedetails', async(req, res) => {
    try {
        res.render('templates/employee_details');
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.get('/employeehours/success', async(req, res) => {
    try {
        res.render('templates/employee_hourssuccess');
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.get('/employeehours/failure', async(req, res) => {
    try {
        res.render('templates/employee_hoursfailed');
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/employeehrs', async(req, res) => {
    try {
        if ((!req.body.username) || (!req.body.start) || (!req.body.end) || (!req.body.hours) || (typeof(req.body.userName) != 'string') || (typeof(req.body.start) != 'string') || (typeof(req.body.end) != 'string') || (typeof(req.body.hours) != 'string')) {
            res.status(400).render("error", { errorMsg: "Something wrong with parameters" })
        }

        var userName = xss(req.body.userName)
        var start = xss(req.body.start)
        var end = xss(req.body.end)
        var hours = xss(req.body.hours)
        const updatehours = await emp.updateHours(userName, hours, start, end)
        console.log(updatehours)
        if (typeof(updatehours) === "undefined") {
            console.log("test")
                //res.render("templates/employee_hoursupdate", {error: "Update failed please check the information"});
                //res.redirect('/employee/employeehours/failure')
                //return
                //httpsMsgs.send500(req,res,"Update Not successful")
            res.sendStatus(403)
            return
        }
        res.json({ success: true });
        //res.redirect('/employeehours/success')
        //res.render("templates/newemployee_main", {error: "Working hours updated successfuly"});
        //res.json({suc: true});
        //res.render('templates/employee_hoursupdate');
        //res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.get('/employeehours', async(req, res) => {
    try {
        res.render('templates/employee_hoursupdate');
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// router.post('/emphours', async(req, res) => {

//     try {
//         if ((!req.body.id) || (!req.body.Workinghours) || (!req.body.name) || (req.body.Workinghours < 0) || (isNaN(req.body.Workinghours) || (typeof(req.body.name) != 'string'))) {
//             res.status(400).render("templates/error", { errorMsg: "Please enter correct parameters" })
//         }
//         const data = await emp.updateHours(req.body.id, req.body.Workinghours)
//         console.log(data)
//         if (!data) {
//             res.status(400).render("templates/error", { errorMsg: "Something wrong with the paramenters" })
//         } else {
//             res.render('templates/successhrs', { searchDetail: data });
//         }

//     } catch (e) {
//         res.status(500).json({ error: e });
//     }


// });



// router.get('/employeereports', async(req, res) => {
//     try {
//         res.render('templates/employee_reports');
//         res.status(200);
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// });

router.get('/successhours', async(req, res) => {
    try {
        res.render('templates/hours_success');
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/update', async(req, res) => {
    try {
        if ((!req.body.updateMag) || (typeof(req.body.updateMag) != 'string')) {
            res.status(400).render("error", { errorMsg: "Something wroung with the parameters" })
        }

        console.log(req.body.updateMag)
        const firstName = xss(req.body.updateMag);
        console.log(firstName)
        const man = await emp.getEmployeeByUser(firstName)
        console.log(man)
        if (man.length == 0) {
            res.render('error', { errorMsg: "No data to display" });
        } else {
            res.render('templates/employee_updated', { searchDetail: man, idreq: firstName });
            res.status(200);
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/updated', async(req, res) => {
    try {
        if ((!req.body.updateMan) || (typeof(req.body.updateMan) != 'string')) {
            res.status(400).render("error", { errorMsg: "Please provide the userid" })
        }
        if (req.body.FirstNameMan) { if (typeof(req.body.FirstNameMan) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the Firstname" }) } }
        if (req.body.LastNameEmp) { if (typeof(req.body.LastNameEmp) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the Lastname" }) } }
        if (req.body.EmailEmp) { if (typeof(req.body.EmailEmp) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the email" }) } }
        if (req.body.HoursEmp) { if (typeof(req.body.HoursEmp) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the hours" }) } }
        if (req.body.TotalSalaryEmp) { if (typeof(req.body.TotalSalaryEmp) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the totalsalary" }) } }
        if (req.body.BasicSalaryEmp) { if (typeof(req.body.BasicSalaryEmp) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the basicsalary" }) } }
        if (req.body.JobEmp) { if (typeof(req.body.JobEmp) != 'string') { res.status(400).render("error", { errorMsg: "Please provide the job" }) } }

        const tra = xss(req.body.updateMan);
        const firstName = xss(req.body.FirstNameEmp);
        const lastName = xss(req.body.LastNameEmp);
        const email = xss(req.body.EmailEmp);
        const hours = xss(req.body.HoursEmp);
        const tsalary = xss(req.body.TotalSalaryEmp);
        const bsalary = xss(req.body.BasicSalaryEmp);
        const job = xss(req.body.JobEmp);

        const man = await emp.updateEmployee(tra, firstName, lastName, email, hours, bsalary, tsalary, job)
        console.log(man)
        if (man.length == 0) {
            res.render('error', { errorMsg: "No data to display" });
        } else {
            //res.render()
            //res.status(200);
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.post('/search', async(req, res) => {
    try {
        if ((!req.body.SearchEmp) || (typeof(req.body.SearchEmp) != 'string')) {
            res.status(400).render("error", { errorMsg: "Something wroung with the parameters" })
        }
        console.log(req.body.SearchEmp)
        const post = await emp.getEmployeeByUser(xss(req.body.SearchEmp));
        console.log("Post below")
        console.log(post)
        post["total_salary"] = post["total_salary"].toString();
        const dat = await man.getManagerByUserID(post.manager_ID)
        const ticketArray = await help.getHelpData(post.manager_ID)
        const employeeList = await emp.getEmployeesByManager(post.manager_ID)
        console.log(dat)
        res.render('templates/manager_details', { searchDetail: dat, userdata: post, tickets: ticketArray, employees: employeeList });
        // res.redirect('back')
        res.status(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});



module.exports = router;