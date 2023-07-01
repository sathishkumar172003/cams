
const Course = require('../model/courses')
const Notice = require('../model/notices')



module.exports.homepage = (req, res)=>{
    // console.log(req.cookies['token name']) //normal way of fetching the cookie 
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    res.render('home.ejs', {isLoggedIn : isLoggedIn, current_user: current_user})
}

module.exports.about = (req, res)=>{  
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user  
    res.render('about.ejs', {isLoggedIn : isLoggedIn, current_user: current_user})
}

module.exports.admission =  (req, res)=>{
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    res.render('admission.ejs', {isLoggedIn : isLoggedIn, current_user: req.session.current_user})
}


module.exports.eligibility = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user
    res.render('eligibility.ejs', {isLoggedIn : isLoggedIn, current_user: current_user})
}


module.exports.courses = (req,res) => {
    Course.findAll()
    .then(courses => {
        res.render('courses.ejs', {isLoggedIn: req.session.isLoggedIn, current_user : req.session.current_user,
        courses: courses} )
    })
    .catch(err => console.log(err))
}

// ------------------------------------------NOTICE----------------------------------------------


module.exports.notices = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user

    Notice.findAll()
    .then( notices => {
        res.render('notices.ejs', {isLoggedIn: isLoggedIn, current_user: current_user, notices: notices})
    })
    .catch(err => console.log(err))
}