const Application = require('../model/application')
const User  = require('../model/user')
const {validationResult} = require("express-validator")

module.exports.getApplicationForm = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    res.render('application-form.ejs',{isLoggedIn : isLoggedIn, current_user: current_user, errorMessage : null})

}

module.exports.postApplication = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    
    console.log(current_user.id)



    const errors = validationResult(req)
        
    if(!errors.isEmpty()){
        console.log
        //what if user has made some mistakes in entering the form 
        return res.render('application-form.ejs',{isLoggedIn : isLoggedIn, current_user: current_user, errorMessage : errors.array()[0].msg})

    }

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
    
        
        res.render('users/application_submitted.ejs', {current_user:current_user, application:result,isLoggedIn : isLoggedIn, current_user: current_user, view: false})
    })
    .catch(err => console.log(err))
}


module.exports.deleteApplication = (req,res) => {
    let appId = req.params.appId;
    console.log(appId)
    let current_user = req.session.current_user
    User.findOne({where :{
        id : current_user.id
    }})
    .then((user) => {
        // console.log(user)
        return Application.findOne({
            id : appId
        })
    })
    .then((application)=>{
        application.destroy()
        req.flash('appDeletedSuccess', ` Your application id ${appId} has been deleted ! `)
        req.session.save((err)=> {
            res.redirect('/users/getApplications')
        })
    })
    .catch(err => console.log(err))
}



module.exports.getUpdate = (req, res) => {
    appId = req.params.appId;
    let isLoggedIn = req.session.isLoggedIn;
    let current_user = req.session.current_user
    Application.findOne({where: {
        id : appId
    }})
    .then((application) => {
        res.render('users/update-form.ejs',{isLoggedIn : isLoggedIn, current_user: current_user, application: application})
    })
    .catch(err => console.log(err))

}

module.exports.postUpdate = (req, res) => {
    appId = req.params.appId;
    Application.findOne({where : {
        id: appId
    }})
    .then((application) => {

        let date = new Date()
        let current_year = date.getFullYear()

        let birth_date = new Date(req.body.dob)
        var birth_year  = birth_date.getFullYear()
        let age = current_year - birth_year
         application.update({
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
        return application.save()
        
    })
    .then(result => {
        
        req.flash('updateSuccess', `your application id ${appId} has been succesfully updated !!`)
        req.session.save((err)=>{
            res.redirect('/users/getApplications')
        })
    })

}


module.exports.viewApplication = (req,res) => {
    current_user = req.session.current_user;
    isLoggedIn = req.session.isLoggedIn;
    appId = req.params.appId;
    Application.findOne({where : {
        id :appId
    }})
    .then((application) => {
        res.render('users/application_submitted.ejs', {application:application,isLoggedIn : isLoggedIn, current_user: current_user, view : true})
    })
}


