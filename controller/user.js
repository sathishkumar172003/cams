const { Op } = require("sequelize");
const fs = require('fs')
const path = require('path')

const fullpath = require('../util/fullpath')

const PDFDocument = require('pdfkit')

const { validationResult } = require('express-validator')


//importing models
const User = require('../model/user')
const Application = require('../model/application');
const { application } = require("express");




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







module.exports.getPayment = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    let user ;
    let acceptedApplications ;

    Application.findAll({where:{
        [Op.and] : [
            {studentId : current_user.id},
            {formStatus : 'Accepted'},
            {payment: false}
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


// --------------------------------------------GET PDG ------------------------------------

module.exports.getPdf = (req, res) => {
    
    const appId = req.params.appId

    var fileName = 'application' + "_" + appId + ".pdf"


    var filePath = path.join(fullpath, 'public', 'pdf', fileName)
    const doc = new PDFDocument()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename=' + filePath  )


    doc.pipe(fs.createWriteStream(filePath))
    doc.pipe(res)


    Application.findOne({where: {
        id: appId
    }})
    .then(application => {
        doc.image('/home/sathish/Nodejs/college-admission-system/public/images/Oxford_logo.jpeg'  ,250,20, {
            fit: [100, 100],
            align: 'center',
            valign: 'center'
          });
        
        doc.fontSize(20).text('The Oxford College of Science',150,120)
        doc.fontSize(14).text('No.32, 17th B Main, Sector IV, HSR Layout Bengaluru 560 102',100,145)
        doc.text('______________________________________________________')
    
        doc.fontSize(15).text(`Application id : ${appId}`,50,190)
        doc.text(`Student Name : ${req.session.current_user.username}`,50,210)
        doc.text(`Course Selected : ${application.course}`, 50,230)
        doc.text(`Date of Birth ${application.DOB}` , 50 , 250)
        doc.text(`Age : ${application.age}`, 50,270)
        doc.text(`Father Name : ${application.fatherName}`,50,290)
        doc.text(`Mother Name : ${application.motherName}`, 50, 310)
        doc.text(`Nationality: ${application.nationality}`, 50,330)
        doc.text(`Address : ${application.address} `,50 ,350)
    
        doc.text('______________________________________________________')
        doc.fontSize(16).text(`SSLC INFORMATION`,50,430)
        doc.fontSize(15).text(`Year of passing : ${application.yearOfPassing10}`, 50,460)
        doc.text(`Stream  : ${application.stream10}`,50,480)
        doc.text(`Board/University: ${application.board10}`, 50,500)
        doc.text(`Percentage : ${application.percentage10}`,50,520)
       

        doc.fontSize(16).text(`PUC INFORMATION`,330,430)
        doc.fontSize(15).text(`Year of passing : ${application.yearOfPassing12}`, 330,460)
        doc.text(`Stream  : ${application.stream12}`,330,480)
        doc.text(`Board/University: ${application.board12}`, 330,500)
        doc.text(`Percentage : ${application.percentage12}`,330,520)

        doc.text('______________________________________________________',50,540)
        doc.fontSize(16).text('Submitted Documents ',50,570)
        if(application.tc){
            doc.fontSize(15).text('Transfter Certificate', 50,600)
        }
        if(application.marksheet10){
            doc.fontSize(15).text('SSLC Marksheet',50,620)
        }
        if(application.marksheet12){
            doc.fontSize(15).text('PUC Marksheet',50,640)
        }

        doc.image('/home/sathish/Nodejs/college-admission-system/public/uploaded-images/' + application.profile ,380,170, {
            fit: [150, 150],
            align: 'center',
            valign: 'center'
          });
      
        doc.end()
    })


    



}
