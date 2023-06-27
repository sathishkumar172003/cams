//importing modules 
const bcrypt  = require('bcryptjs')


const {validationResult} = require("express-validator")



//importing models
const User = require('../model/user')
const Application = require('../model/application')




module.exports.signup= (req, res)=>{
    let isLoggedIn = req.session.isLoggedIn
    if(isLoggedIn) {
        res.redirect('/')
    }
    let message = req.flash('info')
    if(message.length > 0){
        message = message[0]
    }
    else {
        message = null;
    }
    res.render('users/sign.ejs', {isLoggedIn: isLoggedIn, message: message})
}


module.exports.postSign = (req, res) =>{
    let isLoggedIn = req.session.isLoggedIn
    username = req.body.username
    email = req.body.email
    password = req.body.password
    studentPic = req.body.studentPic

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        
        return res.status(422).render('users/sign.ejs', {isLoggedIn: isLoggedIn, message: errors.array()[0].msg})

    }

    User.findOne({where: {
        email : email
    }})
    .then((user) => {

        if(user) {
            req.flash('info', 'email already taken')
            req.session.save((err) => {
                return res.redirect("sign")
            }) 
        }
        //if the user doesn't exist create one
        if (!user){
        
            return  bcrypt.hash(password, 12)
          
        }
         
    })
    .then((hashedPassword) =>{
        const new_user = User.build({
            username: username,
            email : email,
            password: hashedPassword,
            profile: studentPic
        })
        return new_user.save()
    })
    .then((user) => {
        if(user){
            req.session.isLoggedIn = true
            req.session.current_user = user
           
            req.flash('success', 'your account has been succesfully created!! ')
            req.session.save((err)=>{
                return res.redirect('userpage')
            })
        }
    })   
    .catch(err => console.log(err)) 
}



module.exports.login = (req, res) =>{
    let isLoggedIn = req.session.isLoggedIn
    if(isLoggedIn) {
        res.redirect('/')
    }

    let resetSuccess = req.flash('resetSuccess')
    if(resetSuccess.length > 0){
        resetSuccess = resetSuccess[0]
    }
    else {
        resetSuccess = null 
    }

    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    } else {
        message = null;
    }
    res.render('users/login', {isLoggedIn : isLoggedIn, message: message, resetSuccess : resetSuccess})
 
            
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
         // res.setHeader('set-Cookie' 'isLoggedIn=true')  // normal way of sending cookie to browser withour 3rd party packages 
            let isLoggedIn = req.session.isLoggedIn
            let current_user = req.session.current_user
            req.flash('success', 'you have succesfully logged in! ')
            req.session.save((err) => {
    
                res.redirect('userpage')
            })
            }
            else {
                req.flash('error', 'invalid password')
                req.session.save((err)=>{
                    res.redirect('login')
                })
                
            }

        }
        else {
            req.flash('error', 'invalid email')
            req.session.save((err)=>{
                res.redirect('login')
            })
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



module.exports.resetPassword = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn;
    let current_user = req.session.current_user;

    res.render('users/reset_password.ejs', {isLoggedIn :isLoggedIn, current_user : current_user})
}


module.exports.postResetPassword = (req, res) => {
    let email = req.body.email 
    let user;
    User.findOne({where:{
        email : email
    }})
    .then((data)=>{
        if(!data) {
            req.flash('info', 'email does not exists please create  new ')
            req.session.save((err)=>{
                res.redirect('sign')
            })
        } else {
            console.log(data)
            user = data
            
            return bcrypt.hash(req.body.password, 12)
        }
    })
    .then((hashedPassword) =>{
        user.password = hashedPassword
        return user.save()
    })
    .then((result) =>{
        req.flash('resetSuccess', 'your password has been succesfully updated !!!')
        req.session.save((err)=>{
            res.redirect('login')
        })
    })
    .catch(err => console.log(err))

}
