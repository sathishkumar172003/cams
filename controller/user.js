//importing models
const User = require('../model/user')
const Application = require('../model/application')
module.exports.sign= (req, res)=>{
    res.render('users/sign.ejs')
}

module.exports.postSign = (req, res) =>{
    username = req.body.username
    email = req.body.email
    password = req.body.password
    studentPic = req.body.studentPic
    const new_user = User.create({
        username: username,
        email: email,
        password: password,
        profile : studentPic
    })
    .then(result => {
        return User.findOne({where: {email : email}})
    })
    .then((data) => {
        let user = data
        res.render('users/welcome_page', {user : user })
    })
  

    
}


module.exports.login = (req, res) =>{
    let isLoggedIn = req.session.isLoggedIn
    if(isLoggedIn) {
        res.redirect('/')
    }

    res.render('users/login.ejs', {isLoggedIn : isLoggedIn})
}


module.exports.postLogin = (req, res) => {
    email = req.body.email
    password = req.body.password

    User.findOne({where:{
        email: email,
        password: password 
    }})
    .then(user => {
        console.log(user.username)
        // using express-session to send the session cookie 
        req.session.isLoggedIn = true
        // using cookie-parse to send the cookie 
        // res.cookie('token name', 'SathishKumar@17', {
        //     maxAge:5000, // it takes time in seconds after the specified time the cookie will be expired.
        //     HTTPonly:true, // makes the cookies in-accessible using javascript # we can access the cookies using document.cookie (js)
        //     secure: true, // rejects the if its not happening in https or in other words, it accepts the cookies only if it comes from https requst
        //     sameSite: 'lax', // prevents third parties from accessing cookies that belongs to our website 
        //     expires: new Date('17 06 2023'), // cookie will be expired when the specified date comes
        // })
        // res.setHeader('set-Cookie', 'isLoggedIn=true')  // normal way of sending cookie to browser withour 3rd party packages 
        res.render('users/welcome_page', {user: user, isLoggedIn : isLoggedIn})
    })
    .catch(err => console.log('match not found'))
}




module.exports.postApplication = (req, res) => {
    const course = req.body.course
    const fatherName = req.body.fatherName
    const motherName = req.body.motherName
    const gender = req.body.gender
    const percentage10 = req.body.sslcPercentage
    const percentage12 = req.body.pucPercentage
    const profile = req.body.studentPic
    const DOB = req.body.dob
    const nationality = req.body.nationality
    const address = req.body.correspondanceAddress
    const category = req.body.category
    const yearOfPassing10 = req.body.sslcYearOfPassing
    const yearOfPassing12 = req.body.pucYearOfPassing
    const board10 = req.body.sslcBoard
    const board12 = req.body.pucBoard
   

    const stream10 = req.body.sslcStream
    const stream12 = req.body.pucStream
    const tc = req.body.tc
    const marksheet10 = req.body.sslcMarksheet
    const marksheet12  = req.body.pucMarksheet
    const formStatus = req.body.status

    let user

    User.findOne({where: {
        id : 18
    }})
    .then((data) => {
        user = data
       
        let new_application = user.createApplication({
            course: course,
            fatherName: fatherName,
            motherName: motherName,
            gender: gender,
            percentage10: percentage10,
            percentage12: percentage12,
            profile: profile,
            DOB: DOB,
            nationality: nationality,
            address : address,
            category: category,
            yearOfPassing10: yearOfPassing10,
            yearOfPassing: yearOfPassing12,
            board12: board12,
            board10: board10,
            stream10: stream10,
            stream12:stream12,
            tc: tc,
            marksheet10: marksheet10,
            marksheet12: marksheet12,
            formStatus: formStatus 
    
        })

        return new_application
    })

   
 .then(result => {
        console.log(result)
        
        res.render('users/application_submitted.ejs', {user: user, application:result})
    })
    .catch(err => console.log(err))
}





