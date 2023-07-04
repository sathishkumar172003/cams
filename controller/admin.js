
const Application = require('../model/application')
const Course = require('../model/courses')
const User = require('../model/user')
const Notice = require('../model/notices')
const Admin = require('../model/admin')
const bcrypt = require('bcryptjs')

const { validationResult } = require('express-validator')


// --------------------------homepage, login, register controls --------------------------

module.exports.adminPage = (req, res) => {

    let adminLogin = req.flash('adminLogin')
    if(adminLogin.length > 0){
        adminLogin = adminLogin[0]
    } else {
        adminLogin = null
    }

    let totApplications;
    let totCourses;
    let totUsers;
    let totNotices;
    Application.findAll()
    .then(applications => {
        
        totApplications = applications.length  
        return User.findAll()

    })
    .then(users =>{
        totUsers = users.length
        return Notice.findAll()
        
    })
    .then(notices => {
        totNotices = notices.length;
        return  Course.findAll()
    })
    .then(courses => {
        totCourses = courses.length
        res.render('admin/admin_homepage.ejs', {
            totApplications : totApplications,
            totCourses: totCourses, 
            totNotices: totNotices, 
            totUsers : totUsers, 
            adminLogin : adminLogin,
        current_admin : req.session.current_admin})
    })    
}


module.exports.adminGetRegister = (req, res) => {
    res.render('admin/admin-register.ejs', {message : null})
}

module.exports.postRegister = (req, res) => {
   

    //add validation error to the router to see if the emai already exists or not 

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.render('admin/admin-register.ejs', {message : errors.array()[0].msg})
    }

    bcrypt.hash(req.body.password, 12)
    .then(hashedPassword =>  {
        return Admin.create({
            adminName: req.body.adminName,
            email : req.body.email, 
            password : hashedPassword,
            profile : req.file.filename
        })
    })
    .then (admin => {
        
        // once the admin registered redirect to login page and then home page 
        req.flash('adminRegister', `admin account ${admin.adminName} created successfully !!`)
        req.session.save(err => {
            return res.redirect('/admin/login')
        })
    })

}


module.exports.adminLogin = (req, res) => {
    let adminRegister = req.flash('adminRegister')
    if(adminRegister.length > 0) {
        adminRegister = adminRegister[0]
    } else {
        adminRegister = null;
    }
    res.render('admin/admin-login.ejs', {message : null, adminRegister : adminRegister})
}

module.exports.adminPostLogin = (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.render('admin/admin-login.ejs', {message: errors.array()[0].msg, adminRegister : null })
    }

    Admin.findOne({where: {email : req.body.email}})
    .then(admin => {
        req.session.current_admin = admin 
        req.session.adminLoggedIn = true
        req.flash('adminLogin', `admin ${admin.adminName} has been successfully logged in !`)
        req.session.save(err => {
            return res.redirect('/admin')
        })
    })

}

module.exports.adminAccountPage =(req,res) => {

    let updateSuccess = req.flash('updateSuccess')
    if(updateSuccess.length > 0){
        updateSuccess = updateSuccess[0]
    } else {
        updateSuccess = null
    }

    let current_admin = req.session.current_admin
    res.render('admin/admin-page.ejs', {current_admin : current_admin, updateSuccess: updateSuccess})
    
}

module.exports.adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if(!err){
            res.redirect('/admin/login')
        }
        else {
            console.log(err)
        }

    })
  
}

module.exports.updateAdmin = (req, res) => {
    let adminId = req.params.adminId
    console.log(adminId)
    Admin.findOne({where: {
        id : adminId
    }})
    .then(admin => {

        res.render('admin/update-admin.ejs', {admin : admin})
    })
}

module.exports.postUpdateAdmin = (req, res) => {
    let adminId = req.params.adminId
    Admin.findOne({wher: {
        id: adminId
    }})
    .then(admin => {
        admin.update({
            adminName :req.body.adminName,
            profile :  req.file.filename
        })
        req.session.current_admin = admin
        return admin.save()
    })
    .then(result => {
        req.flash('updateSuccess', ` Admin account ${result.adminName} has been updated successfully !`)
        req.session.save(err => {
            res.redirect('/admin/adminpage')
        })
    })
}

// ----------------------------------applications ---------------------------------------

module.exports.pendingApplications = (req, res) => {

    let message = req.flash('formUpdateSuccess')
    if(message.length > 0){
        message  = message[0]
    } else {
        message = null
    }

    Application.findAll({where:{
        formStatus : 'pending'
    }})
    .then((applications) => {
        res.render('admin/pending_applications.ejs', {applications: applications, message : message, current_admin : req.session.current_admin})
    })
}

module.exports.viewSingleApplication = (req, res) => {
    let appId = req.params.appId ;
    Application.findOne({where: {
        id: appId
    }})
    .then(application => {
        res.render('admin/single_application.ejs',{application : application , current_admin : req.session.current_admin})
    })
    .catch(err => console.log(err))
    
}


module.exports.getUpdateApplication = (req, res) => {
    let appId = req.params.appId
    Application.findOne({where: {
        id  : appId
    }})
    .then(application => {
        
        res.render('admin/update_application.ejs', {application: application, current_admin : req.session.current_admin})
    })
    
}



module.exports.postUpdateApplication = (req, res) =>{
    let appId = req.params.appId

    
    let yearOfPassing10 = Number(req.body.sslcYearOfPassing)
    let percentage10 = Number(req.body.sslcPercentage)
    let yearOfPassing12 = Number(req.body.pucYearOfPassing)
    let percentage12 = Number(req.body.pucPercentage)


    Application.findOne({where: {
        id : appId
    }})
    .then(application => {
        application.update({
            DOB : req.body.dob,
            course : req.body.course,
            fatherName: req.body.fatherName,
            motherName : req.body.motherName,
            gender : req.body.gender,
            nationality : req.body.nationality,
            address : req.body.correspondanceAddress,
            category : req.body.category,

            yearOfPassing10 : yearOfPassing10,
            yearOfPassing12 : yearOfPassing12,
            board10 : req.body.sslcBoard,
            board12: req.body.pucBoard,
            stream10 : req.body.sslcStream,
            stream12 : req.body.pucStream,
            percentage10 : percentage10,
            percentage12 : percentage12,
            formStatus : req.body.formStatus

        })

        return application.save()
    })
    .then(application => {
        req.flash('formUpdateSuccess', `application id ${application.id} has been updated!`)
        req.session.save(err => {
            res.redirect('/admin/pendingapplications')
        })
    })
}

// -------------------------------------Accepted Applications-----------------------------------


module.exports.acceptedApplications = (req, res)  => {
    Application.findAll({where: {
        formStatus: 'Accepted'
    }})
    .then(applications => {
        res.render('admin/accepted-applications.ejs', {applications: applications , current_admin : req.session.current_admin})
    })
    
}



// -----------------------------------------Rejected Applications--------------------------------

module.exports.rejectedApplications = (req, res) => {
    Application.findAll({where: {
        formStatus: 'Rejected'
    }})
    .then(applications => {
        res.render('admin/rejected-applications.ejs', {applications: applications , current_admin : req.session.current_admin})
    })
}


// ---------------------------------------------courses--------------------------------------
module.exports.addCourse = (req, res) =>{

    let editing = req.query.editing
    // if course  add success 
    addCourseSuccess = req.flash('addCourseSuccess')
    if(addCourseSuccess.length > 0){
        addCourseSuccess = addCourseSuccess[0]
    }else {
        addCourseSuccess = null
    }

    // if course add is failed
    addCourseFailure = req.flash('addCourseFailure')
    if(addCourseFailure.length > 0){
        addCourseFailure = addCourseFailure[0]
    } else {
        addCourseFailure = null
    }
    res.render('admin/add-course.ejs', {addCourseSuccess : addCourseSuccess,
    addCourseFailure : addCourseFailure, editing:editing , current_admin : req.session.current_admin})
}

module.exports.postAddCourse = (req, res) => {

    // check if course already exists, if yes, then inform them 

    Course.findAll({where: {courseName: req.body.course}}).then(data => {
        if(data.length > 0  ){
            
            req.flash('addCourseFailure', `Course ${req.body.course} already exists!!`)
            req.session.save(err => {
                return res.redirect('addcourse')
            })
        }
        else  {
             const course = Course.create({
                department : req.body.department,
                courseName: req.body.course
            })
            return course
            
        }
    })
    .then(course => {
        req.flash('addCourseSuccess', `Course ${course.courseName} has been added successfully !`)
        req.session.save(err => {
            res.redirect('addcourse')
        })
        
    })
    .catch(err => console.log(err))
}

module.exports.allCourses = (req, res) => {

   
    let courseDelete = req.flash('courseDelete')
    let courseUpdate = req.flash('courseUpdate')
    if(courseDelete.length > 0){
        courseDelete = courseDelete[0]
    } else {
        courseDelete = null
    }

    if(courseUpdate.length > 0){
        courseUpdate = courseUpdate[0]
    } else {
        courseUpdate = null
    }

    Course.findAll().then(courses => {
        res.render('admin/all-courses.ejs', {courses: courses, courseDelete : courseDelete, courseUpdate : courseUpdate , current_admin : req.session.current_admin})
    }).catch(err => console.log(err))
    
}


module.exports.removeCourse = (req, res) =>{
    let cId = req.params.cId
    let course ;

    Course.findOne({where:{id:cId}}).then(data =>{
        course = data
        return data.destroy()
    })
    .then(result => {
        req.flash('courseDelete', `Course ${course.courseName} has been deleted successfully !`)
        req.session.save(err => {
            res.redirect('/admin/allcourses')
        })
    })
    .catch(err => console.log(err))
}


module.exports.updateCourse = (req, res) => {
    

    let cId = req.params.cId

    Course.findOne({where: {id :cId}})
    .then(course => {
        res.render('admin/update-course.ejs', { course : course , current_admin : req.session.current_admin})
    })
    .catch(err => console.log(err))

    
}


module.exports.postUpdateCourse = (req, res) => {
    let cId = req.params.cId
    let course;

    Course.findOne({where:{id : cId}}).then(data => {
        course = data
        data.update({
            department : req.body.department,
            courseName: req.body.course
        })
        return data.save()
    })
    .then(result => {
        req.flash('courseUpdate', `Course ${course.courseName} has been updated !!`)
        req.session.save(err => {
            res.redirect('/admin/allcourses')
        })
    })
    .catch(err => console.log(err))
}


// ------------------------------------------Notice -----------------------------------------


module.exports.allNotices = (req, res) =>{
    let updateNotice = req.flash('updateNotice')

    let removeNotice = req.flash('removeNotice')
    if(updateNotice.length > 0){
        updateNotice = updateNotice[0]
    } else {
        updateNotice = null
    }

    if(removeNotice.length > 0){
        removeNotice = removeNotice[0]
    } else {
        removeNotice = null
    }

    Notice.findAll()
    .then(notices => {
        res.render('admin/all-notices.ejs', {notices : notices, updateNotice : updateNotice, removeNotice: removeNotice , current_admin : req.session.current_admin})
    })
    .catch(err => console.log(err))

}


module.exports.updateNotice = (req, res) =>{
    let nId = req.params.nId
    Notice.findOne({where: {id : nId}})
    .then(notice => {
        res.render('admin/update-notice.ejs', {notice: notice , current_admin : req.session.current_admin})
    })
    .catch(err => console.log(err))

}

module.exports.postUpdateNotice = (req, res) =>{
    let nId = req.params.nId

    Notice.findOne({where:{id : nId}})
    .then(notice =>{
        notice.update({
            title : req.body.title,
            content : req.body.content
        })
        return notice.save()
    })
    .then(result => {
        req.flash('updateNotice', `Notice ${result.title} has been updated !!`)
        req.session.save(err => {
            return res.redirect('/admin/allnotices')
        })
    })
    .catch(err => console.log(err))
}


module.exports.removeNotice = (req, res) =>{
    let nId = req.params.nId 
    console.log(nId)
    let data 

    Notice.findOne({where: {id : nId}})
    .then(notice => {
        console.log(notice)
        data = notice
        return notice.destroy()
    })
    .then(result => {
        req.flash('removeNotice', `Notice ${data.title} has been deleted successfully !!`)
        req.session.save(err => {
            res.redirect('/admin/allnotices')
        })
    })
    .catch(err => console.log(err))
}

module.exports.addNotice = (req, res) => {
    let addNoticeSuccess = req.flash('addNoticeSuccess')
    if(addNoticeSuccess.length > 0){
        addNoticeSuccess = addNoticeSuccess[0]
    } else {
        addNoticeSuccess = null
    }
    res.render('admin/add-notice.ejs', {addNoticeSuccess : addNoticeSuccess , current_admin : req.session.current_admin})
}

module.exports.postAddNotice = (req, res) => {
    let title = req.body.title
    let content  = req.body.content 

    Notice.create({
        title : title,
        content : content
    })
    .then(notice => {
        req.flash('addNoticeSuccess',   `Notice ${notice.title } has been successfully added !`)
        req.session.save(err => {
            return res.redirect("/admin/addnotice")
        })
    })
}


// ------------------------------------------users---------------------------------------

module.exports.allUsers = (req, res) =>{
let message = req.flash('success')
let updateSuccess = req.flash('updateSuccess')

if(updateSuccess.length > 0){
    updateSuccess = updateSuccess[0]
} else {
    updateSuccess = null
}
if(message.length > 0){
    message = message[0]
} else {
    message = null
}

 User.findAll()
 .then(users => {
    res.render('admin/all-users.ejs', {users : users, message: message, updateSuccess: updateSuccess , current_admin : req.session.current_admin})
 })  
 .catch(err => console.log(err))
}


module.exports.addUser = (req, res) => {
    let message = req.flash('failure')
   

    if(message.length > 0){
        message = message[0]
    } else {
        message = null
    }
    res.render('admin/add-user.ejs', {validationError: [], message: message , current_admin : req.session.current_admin})
}



module.exports.postAddUser = (req, res) => {
    let hashedPassword;

    var errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.render('admin/add-user.ejs', {validationError : errors.array(), message : errors.array()[0].msg , current_admin : req.session.current_admin})
    }

    bcrypt.hash(req.body.password, 12)
    .then(hashedPassword => {
        hashedPassword = hashedPassword
        return User.create({
            username : req.body.username,
            email : req.body.email  , 
            password : hashedPassword,
            profile : req.file.filename
        })
    })
    .then(user => {
        req.flash('success',    `user ${user.email} has been successfully registered !`)
        req.session.save(err => {
            res.redirect('/admin/allusers')
        })
    })
    .catch(err => console.log(err))
   
}


module.exports.updateUser = (req, res) => {
    let userId = req.params.userId 
    User.findOne({where: {id : userId}})
    .then(user => {
        console.log(user.username)
        res.render('admin/update-user.ejs', {user : user , current_admin : req.session.current_admin})
    }) 
}


module.exports.postUpdateUser = (req, res) => {
    let userId = req.params.userId 

    User.findOne({where: {
        id : userId

    }})
    .then((user) => {
        if(user) {
            

            user.update({
               
                username: req.body.username,
                profile : req.file.filename   
            })
            return user.save()
        }
        
    })
    .then(result => {
        req.flash('updateSuccess', `user ${result.username} has been updated !`)
        req.session.save(err => {
            res.redirect("/admin/allusers")
        })
    })
    .catch(err => console.log(err))
}
