const { Op } = require("sequelize");


//importing models
const User = require('../model/user')
const Application = require('../model/application');
const { application } = require("express");


module.exports.postApplication = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    
    console.log(current_user.id)

    User.findOne({where: {
        id : current_user.id
    }})

    .then((user) => {
        let date = new Date()
        let current_year = date.getFullYear()

        let birth_date = new Date(req.body.dob)
        var birth_year  = birth_date.getFullYear()
        let age = current_year - birth_year

        let new_application =  user.createApplication({
            course: req.body.course,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            gender: req.body.gender,
            percentage10: req.body.sslcPercentage,
            percentage12: req.body.pucPercentage,
            profile: req.body.studentPic,
            DOB: req.body.dob,
            age : age, 
            nationality: req.body.nationality,
            address : req.body.correspondanceAddress,
            category:  req.body.category,
            yearOfPassing10: req.body.sslcYearOfPassing,
            yearOfPassing12:  req.body.pucYearOfPassing,
            board12: req.body.pucBoard,
            board10: req.body.sslcBoard,
            stream10: req.body.sslcStream,
            stream12:req.body.pucStream,
            tc:  req.body.tc,
            marksheet10: req.body.sslcMarksheet,
            marksheet12: req.body.pucMarksheet,
            formStatus:  req.body.status 
    
        })

        

        return new_application
    })

   
 .then(result => {
        console.log(result)
    
        
        res.render('users/application_submitted.ejs', {current_user:current_user, application:result,isLoggedIn : isLoggedIn, current_user: current_user})
    })
    .catch(err => console.log(err))
}

module.exports.userPage = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user

    userUpdateSuccess = req.flash('userUpdateSuccess')
    if(userUpdateSuccess.length > 0){
        userUpdateSuccess = userUpdateSuccess[0]
    } else {
        userUpdateSuccess = null
    }

    let message = req.flash('success')
    if(message.length > 0){
        message = message[0]
    } else {
        message =null;
    }

    res.render('users/welcome_page.ejs', {isLoggedIn: isLoggedIn, current_user: current_user, message : message, userUpdateSuccess: userUpdateSuccess})   
}


module.exports.getApplicationsRouter = (req, res) => {
    // let user;
    // let applications ;

    let current_user = req.session.current_user
    let message = req.flash('appDeletedSuccess')
    let updateMessage = req.flash('updateSuccess')
    if (updateMessage.length > 0){
        updateMessage = updateMessage[0]
    }else {
        updateMessage = null
    }
    if(message.length > 0){
        message = message[0]
    } else {
        message = null;

    }

    User.findOne({where : {
        id : current_user.id
    }})
    .then(user => {
        return user.getApplications()
    })
    .then(applications => {
        res.render('users/user_applications', {applications: applications, isLoggedIn: req.session.isLoggedIn, current_user : current_user, message : message, updateMessage : updateMessage})
    })
    .catch(err => console.log(err))
}




module.exports.updateUser = (req, res) => {
    let isLoggedIn =  req.session.isLoggedIn
    let current_user = req.session.current_user
    message = null
  

    res.render('users/update_user.ejs', {isLoggedIn : isLoggedIn, current_user : current_user })

}


module.exports.postUpdateUser = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user

    let username = req.body.username
    let email = req.body.email 
    let profile = req.body.studentPic


    //what if the email is already taken in that case check the
    //later implement this function so far it is assumed that user will give unique email 
    // if he gives the email which is already exists the app will crash . 



    User.findOne({where: {
        id : current_user.id

    }})
    .then((user) => {
        if(user) {

            user.update({
                email : email,
                username: username,
                profile : profile    
            })
            return user.save()
        }
        
    })
    .then((user) => {
        req.session.current_user = user;

        
        req.flash('userUpdateSuccess', `${username} has been updated successfully !!!`)
        req.session.save((err) => {
            res.redirect('userpage')
        })
    })
    .catch(err => console.log(err))

}


module.exports.getPayment = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    let user ;
    let acceptedApplications ;

    Application.findAll({where:{
        [Op.and] : [
            {studentId : current_user.id},
            {formStatus : 'Accepted'}
        ]
    }})
    .then(applications => {
        console.log(applications)
        if(applications.length == 0) {
            message = true
        } else {
            message = false
            return applications
        }
    })
    .then(applications => {
        res.render('users/payment.ejs', {isLoggedIn: isLoggedIn, current_user: current_user, message : message, applications :applications})

    })
    .catch(err => console.log(err))

}


module.exports.getNotification =(req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user  = req.session.current_user

    Application.findAll({where:{
        [Op.and] : [
            {studentId : current_user.id},
            {formStatus : 'Accepted'},
            {payment : 0 }

        ]
    }
    })
    .then(applications => {
        if(applications.length == 0){
            message  = true
        } else {
            message = false
            return applications;
        }
    })
    .then(applications => {
        res.render('users/notification.ejs', {isLoggedIn: isLoggedIn, current_user: current_user,message : message , applications : applications})

    })
    .catch(err => console.log(err))


}