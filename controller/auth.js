//importing modules 
const bcrypt  = require('bcryptjs')



//importing models
const User = require('../model/user')
const Application = require('../model/application')



module.exports.signup= (req, res)=>{
    let isLoggedIn = req.session.isLoggedIn
    if(isLoggedIn) {
        res.redirect('/')
    }
    res.render('users/sign.ejs', {isLoggedIn: isLoggedIn})
}


module.exports.postSign = (req, res) =>{
    username = req.body.username
    email = req.body.email
    password = req.body.password
    studentPic = req.body.studentPic

    User.findOne({where: {
        email : email
    }})
    .then((user) => {
        //if the user doesn't exist create one
        if (!user){
            let hashedPassword = bcrypt.hashSync(password, 12)
            return new_user = User.create({
                username: username,
                email : email,
                password: hashedPassword,
                profile: studentPic
            })
        }
        // if the user exists just redirect to home
        res.redirect('/')
    })
    .then((user) => {
        req.session.isLoggedIn = true
        req.session.current_user = user
        res.render('users/welcome_page',{current_user : req.session.current_user, isLoggedIn : req.session.isLoggedIn})

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
        email: email 
    }})
    .then(user => {
        if(user){
            console.log(user.username)
            let isUser = bcrypt.compareSync(password, user.password)

            if(isUser){
            // using express-session to send the session cookie 
            req.session.isLoggedIn = true
            req.session.current_user = user
            // using cookie-parse to send the cookie 
            // res.cookie('token name', 'SathishKumar@17', {
            //     maxAge:5000, // it takes time in seconds after the specified time the cookie will be expired.
            //     HTTPonly:true, // makes the cookies in-accessible using javascript # we can access the cookies using document.cookie (js)
            //     secure: true, // rejects the if its not happening in https or in other words, it accepts the cookies only if it comes from https requst
            //     sameSite: 'lax', // prevents third parties from accessing cookies that belongs to our website 
            //     expires: new Date('17 06 2023'), // cookie will be expired when the specified date comes
            // })
            // res.setHeader('set-Cookie', 'isLoggedIn=true')  // normal way of sending cookie to browser withour 3rd party packages 
            let isLoggedIn = req.session.isLoggedIn
            let current_user = req.session.current_user
            
            // saving cookies in browser may take some seconds, so if we render page before saving it may throw error 
            // so if we want to continue some operation only after saving session we call use save() method that takes 
            // functions as its arguments that will be executed after session gets saved
            req.session.save((err) => {
                res.render('users/welcome_page', {user: user, isLoggedIn : isLoggedIn, current_user: current_user})
    
            })
            }
            else {
                res.send('<h1> Your password is incorrect </h1> ')
            }

        }
        else {
            res.redirect('/users/login')
        }

        
     
    })
    .catch(err => console.log('match not found'))
}





module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if(!err){
            res.redirect('/')
        }
        else {
            console.log(err)
        }

    })
  
}


