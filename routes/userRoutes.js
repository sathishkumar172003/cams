const express = require('express')
const router = express.Router()
const { check , body} = require('express-validator')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs')


const upload = require('../util/upload')


const userController = require('../controller/user')
const authController = require('../controller/auth')

const User = require('../model/user')

const isAuth = require('../middlewares/is_auth')



router.get('/sign', authController.signup)


router.post('/sign',   upload.single('studentPic') ,[ body('email').isEmail().withMessage('Please enter a valid email ').
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
                                             
                     ,authController.postSign)


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
body('password').custom(async (value, {req}) =>{
    await User.findOne({where: {email : email}}).then(user => {
        if(user){
             return bcrypt.compareSync(value, user.password)
            
        }
    }).then(isUser => {
        if(!isUser){
            throw new Error('Password is incorrect ')
        }
        return true
    })
})
]
, authController.postLogin)



router.get('/userpage', isAuth, userController.userPage)

router.get('/logout',isAuth, authController.logout )


router.get('/getApplications', isAuth, userController.getApplicationsRouter)

router.get('/resetpassword', authController.resetPassword)


router.post('/resetpassword', authController.postResetPassword)

router.get('/updateuser',isAuth, authController.updateUser)


router.post('/updateuser', upload.single('studentPic')
,isAuth, authController.postUpdateUser)

router.get('/payment', isAuth,userController.getPayment)

router.get('/notifications', isAuth,userController.getNotification)



router.get('/getpdf/:appId', isAuth, userController.getPdf)

module.exports = router

