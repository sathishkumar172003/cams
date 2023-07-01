//importing modules 
const bcrypt  = require('bcryptjs')
const {Op} = require('sequelize')


const {validationResult} = require("express-validator")



//importing models
const User = require('../model/user')
const Application = require('../model/application')



// --------------------------------------sign in ----------------------------------//

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
    res.render('users/sign.ejs', {isLoggedIn: isLoggedIn, message: message,
    oldInputs : {email : "", confirmPassword: "", password : "", username: ''},
    validationError: [] })
}


module.exports.postSign = (req, res) =>{
    let isLoggedIn = req.session.isLoggedIn
    username = req.body.username
    email = req.body.email
    const confirmPassword = req.body.confirmPassword
    console.log(req.body)
    hashedPassword = bcrypt.hashSync(req.body.password, 12) 
   
    studentPic = req.file.filename
    console.log(req.file)

    

    

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        
        return res.status(422).render('users/sign.ejs', {isLoggedIn: isLoggedIn, message: errors.array()[0].msg,
        oldInputs : {email : email, username : username, password : req.body.password, confirmPassword : confirmPassword},
    validationError : errors.array()})

    }

    const new_user = User.create({
        username: username,
        email : email,
        password: hashedPassword,
        profile: studentPic
    })
    .then(user => {
        console.log(user)

    req.session.isLoggedIn = true
    req.session.current_user = user
    
           
    req.flash('success', 'your account has been succesfully created!! ')
    req.session.save((err)=>{
        return res.redirect('userpage')
            })
    })
    

    

}
  




                // ----------------------login------------------------------------// 


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
    res.render('users/login', {isLoggedIn : isLoggedIn, message: message, resetSuccess : resetSuccess,
    oldInputs : {email : '', password: ''},
validationError : []})
 
            
} 

    


module.exports.postLogin = (req, res) => {
    email = req.body.email
    password = req.body.password

    let isLoggedIn = req.session.isLoggedIn;

    
    

    const errors = validationResult(req)
    console.log(errors.array())
    if(!errors.isEmpty()){
        return res.status(422).render('users/login', {isLoggedIn : isLoggedIn, message: errors.array()[0].msg, resetSuccess : null,
        oldInputs :{email : email  , password : password},
    validationError : errors.array()
})
    }

 


    User.findOne({where:{
        email: email 
    }})
    .then(user => {
      
            req.session.isLoggedIn = true
            req.session.current_user = user
         // res.setHeader('set-Cookie' 'isLoggedIn=true')  // normal way of sending cookie to browser withour 3rd party packages 
            req.flash('success', 'you have succesfully logged in! ')
            req.session.save((err) => {
                res.redirect('userpage')
            })   
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


// --------------------------------------------UPDATING THE USER -----------------------

module.exports.updateUser = (req, res) => {
    let isLoggedIn =  req.session.isLoggedIn
    let current_user = req.session.current_user
    message = null
  

    res.render('users/update_user.ejs', {isLoggedIn : isLoggedIn, current_user : current_user ,
    validationMsg : null, validationError : null })

}




module.exports.postUpdateUser = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn
    let current_user = req.session.current_user

    let username = req.body.username
  
    let profile = req.file.filename
    //what if the email is already taken in that case check the
    //later implement this function so far it is assumed that user will give unique email 
    // if he gives the email which is already exists the app will crash . 

    
    
    

    User.findOne({where: {
        id : current_user.id

    }})
    .then((user) => {
        if(user) {
            

            user.update({
               
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
