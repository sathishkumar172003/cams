const express = require('express')
const router = express.Router()
const { check , body} = require('express-validator')

const bcrypt = require('bcryptjs')

const userController = require('../controller/user')
const authController = require('../controller/auth')

const User = require('../model/user')

const isAuth = require('../middlewares/is_auth')


router.get('/sign', authController.signup)


router.post('/sign', [check('email').isEmail().withMessage('Please enter a valid email ').normalizeEmail().
                    custom(async (value, {req}) => {
                        await User.findOne({where: {email : value}})
                        .then(user =>{
                            if(!user){
                                return true
                            }
                            throw new Error('This email is alreay takebn')
                           
                        })
                      
                    }), 
                     body('password').isLength({min:8}).withMessage('Password must be minimum of 8 characters!').trim().
                     custom(async (value, {req}) =>{
                        if(value != req.body.confirmPassword){
                            throw new Error('Password didn\'t match ')
                        }
                     }), ]
,                    authController.postSign)


router.get('/login',authController.login)

router.post('/login', [check('email').isEmail().withMessage('Please enter a valid email ').normalizeEmail().
custom(async (value, {req}) => {
    await User.findOne({where: {email : value}})
    .then(user =>{
        if(!user){
            throw new Error(' email doesnt exists!')
        } 
        return true
       
    })
  
}), 
body('password').trim().custom(async (value, {req}) =>{
    await User.findOne({where: {email : email}}).then(user => {
        if(user){
            let isUser = bcrypt.compareSync(value, user.password)
            if(!isUser){
                throw new Error('Password is incorrect ')
            }
        }
    })
})], authController.postLogin)



router.get('/userpage', isAuth, userController.userPage)

router.get('/logout',isAuth, authController.logout )


router.get('/getApplications', isAuth, userController.getApplicationsRouter)

router.get('/resetpassword',isAuth, authController.resetPassword)


router.post('/resetpassword',isAuth, authController.postResetPassword)

router.get('/updateuser',isAuth, userController.updateUser)


router.post('/updateuser', isAuth, userController.postUpdateUser)

router.get('/payment', isAuth,userController.getPayment)

router.get('/notifications', isAuth,userController.getNotification)

module.exports = router

