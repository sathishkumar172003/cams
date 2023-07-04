// ----------------------------------installing modules -------------------------------

const express = require('express')

const router = express.Router()

const adminController = require('../controller/admin')

const { check , body} = require('express-validator')

const bcrypt = require('bcryptjs')

const User = require('../model/user')

const upload = require('../util/upload')

const Admin = require("../model/admin")

const adminAuth = require('../middlewares/admin_auth')

// --------------------------homepage, register and login --------------------------------


router.get('/', adminAuth, adminController.adminPage)


// -----------------------------------admin controls ---------------------------------------

router.get('/register', adminController.adminGetRegister)   

router.post('/register', upload.single('studentPic'), [ body('email').isEmail().withMessage('Please enter a valid email ').
custom(async (value, {req}) => {
    await User.findOne({where: {email : value}})
    .then(user =>{
        if(!user){
            return true
        }
        throw new Error('This email is alreay takebn')
       
    })
  
}), body('password').isLength({min: 8, max:50}).withMessage('Please enter a strong password!')

],adminController.postRegister)

router.get('/login', adminController.adminLogin)

router.post("/login", [
    body('email').isEmail().withMessage('Please enter a valid email!').
    custom(async (value, {req}) => {
        await Admin.findOne({where: {email : value}}).then(user => {
            if(user){
                return true
            }
            throw new Error('Email does not exists!')
        })
    }),
    body('password').custom(async (value, {req}) => {
        await Admin.findOne({where: {email : req.body.email}}).then(user => {
            if(user){
                return bcrypt.compareSync(value, user.password)
            }
        }).then(isUser => {
            if(isUser){
               return true 
            } 
            throw new Error('password or email is incorrect !')
        })
    })

], adminController.adminPostLogin)


router.get('/adminpage',  adminAuth ,adminController.adminAccountPage)

router.get('/logout', adminAuth, adminController.adminLogout)

router.get('/updateadmin/:adminId', adminAuth, adminController.updateAdmin)

router.post('/updateadmin/:adminId', upload.single('studentPic'),  adminAuth, adminController.postUpdateAdmin)

// ------------------------------applications -----------------------------------------

router.get('/pendingapplications', adminAuth, adminController.pendingApplications)

router.get('/singleapplication/:appId',adminAuth, adminController.viewSingleApplication)

router.get('/updateapplication/:appId',adminAuth, adminController.getUpdateApplication)

router.post('/updateapplication/:appId', adminAuth, adminController.postUpdateApplication)

router.get('/acceptedapplications', adminAuth, adminController.acceptedApplications)

router.get('/rejectedapplications', adminAuth, adminController.rejectedApplications)


// --------------------------------courses------------------------------------

router.get('/addcourse', adminAuth, adminController.addCourse)

router.post('/addcourse',adminAuth,  adminController.postAddCourse)

router.get('/allcourses',adminAuth,  adminController.allCourses)

router.get('/removecourse/:cId',adminAuth,  adminController.removeCourse)

router.get('/updatecourse/:cId', adminAuth, adminController.updateCourse)

router.post('/updatecourse/:cId', adminAuth, adminController.postUpdateCourse)

// ---------------------------------notices------------------------------------

router.get('/allnotices',adminAuth,  adminController.allNotices)

router.get('/updatenotice/:nId', adminAuth, adminController.updateNotice)

router.post('/updatenotice/:nId', adminAuth, adminController.postUpdateNotice)

router.get('/removenotice/:nId', adminAuth, adminController.removeNotice)

router.get('/addnotice', adminAuth, adminController.addNotice)

router.post("/addnotice", adminAuth, adminController.postAddNotice)

// -----------------------------------------users--------------------------------------

router.get('/allusers', adminAuth, adminController.allUsers)

router.get('/adduser', adminAuth, adminController.addUser)

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
                      
                    })] , adminAuth, adminController.postAddUser)


router.get('/updateuser/:userId', adminAuth, adminController.updateUser)

router.post('/updateuser/:userId', upload.single('studentPic'), adminAuth, adminController.postUpdateUser)


// --------------------------------------exporting-----------------------------------


module.exports = router;
