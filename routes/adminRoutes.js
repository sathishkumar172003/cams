// ----------------------------------installing modules -------------------------------

const express = require('express')

const router = express.Router()

const adminController = require('../controller/admin')

const { check , body} = require('express-validator')

const User = require('../model/user')

const upload = require('../util/upload')

// --------------------------homepage, register and login --------------------------------


router.get('/', adminController.adminPage)

router.get('/register', adminController.adminGetRegister)   


// ------------------------------applications -----------------------------------------

router.get('/pendingapplications', adminController.pendingApplications)

router.get('/singleapplication/:appId', adminController.viewSingleApplication)

router.get('/updateapplication/:appId', adminController.getUpdateApplication)

router.post('/updateapplication/:appId', adminController.postUpdateApplication)

router.get('/acceptedapplications', adminController.acceptedApplications)

router.get('/rejectedapplications', adminController.rejectedApplications)


// --------------------------------courses------------------------------------

router.get('/addcourse', adminController.addCourse)

router.post('/addcourse', adminController.postAddCourse)

router.get('/allcourses', adminController.allCourses)

router.get('/removecourse/:cId', adminController.removeCourse)

router.get('/updatecourse/:cId', adminController.updateCourse)

router.post('/updatecourse/:cId', adminController.postUpdateCourse)

// ---------------------------------notices------------------------------------

router.get('/allnotices', adminController.allNotices)

router.get('/updatenotice/:nId', adminController.updateNotice)

router.post('/updatenotice/:nId', adminController.postUpdateNotice)

router.get('/removenotice/:nId', adminController.removeNotice)

router.get('/addnotice', adminController.addNotice)

router.post("/addnotice", adminController.postAddNotice)

// -----------------------------------------users--------------------------------------

router.get('/allusers', adminController.allUsers)

router.get('/adduser', adminController.addUser)

router.post('/adduser', upload.single('studentPic'),[body('password').isLength({min:8, max:50}).withMessage('Please enter a strong password'),
body('email').isEmail().withMessage('Please enter a valid email ').
                    custom(async (value, {req}) => {
                        await User.findOne({where: {email : value}})
                        .then(user =>{
                            if(!user){
                                return true
                            }
                            throw new Error('This email is alreay taken')
                           
                        })
                      
                    })],adminController.postAddUser)


router.get('/updateuser/:userId', adminController.updateUser)

router.post('/updateuser/:userId', upload.single('studentPic'),adminController.postUpdateUser)


// --------------------------------------exporting-----------------------------------


module.exports = router;
