const express = require('express')
const router = express.Router()
const { check , body} = require('express-validator')



const userController = require('../controller/user')
const authController = require('../controller/auth')

const User = require('../model/user')

const isAuth = require('../middlewares/is_auth')


router.get('/sign', authController.signup)


router.post('/sign', [check('email').isEmail().withMessage('Please enter a valid email ').
                    custom(async (value, {req}) => {
                        await User.findOne({where: {email : value}})
                        .then(user =>{
                            if(!user){
                                return true
                            }
                            throw new Error('This email is alreay takebn')
                           
                        })
                      
                    }), 
                     body('password').isLength({min:8}).withMessage('Password must be minimum of 8 characters!').
                     custom(async (value, {req}) =>{
                        if(value != req.body.confirmPassword){
                            throw new Error('Password didn\'t match ')
                        }
                     }), ]
,                    authController.postSign)


router.get('/login', authController.login)

router.post('/login', authController.postLogin)

router.post('/postApplication', userController.postApplication)

router.get('/userpage', isAuth, userController.userPage)

router.get('/logout',isAuth, authController.logout )


router.get('/getApplications', isAuth, userController.getApplicationsRouter)

router.get('/resetpassword', authController.resetPassword)


router.post('/resetpassword', authController.postResetPassword)

router.get('/updateuser', userController.updateUser)


router.post('/updateuser', userController.postUpdateUser)

router.get('/payment', userController.getPayment)

router.get('/notifications', userController.getNotification)

module.exports = router

