//importing modules 
const bcrypt  = require('bcryptjs')

const client = require('../util/mailTransporter')




//importing models
const User = require('../model/user')
const Application = require('../model/application')
const { json } = require('body-parser')



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
    username = req.body.username
    email = req.body.email
    password = req.body.password
    studentPic = req.body.studentPic

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

            const sender = {
                email: "sthshkmr172003@gmail.com",
                name: " Sathish Kumar Node js Developer",
              };
              const recipients = [
                {
                  email: "sthshkmr172003@gmail.com",
                }
              ];
              
              
           
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
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    } else {
        message = null;
    }
    res.render('users/login', {isLoggedIn : isLoggedIn, message: message})
 
            
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




