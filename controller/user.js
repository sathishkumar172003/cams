//importing models
const User = require('../model/user')
const Application = require('../model/application')


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
    let message = req.flash('success')
    if(message.length > 0){
        message = message[0]
    } else {
        message =null;
    }

    res.render('users/welcome_page.ejs', {isLoggedIn: isLoggedIn, current_user: current_user, message : message})   
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



