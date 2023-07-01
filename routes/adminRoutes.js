const express = require('express')

const router = express.Router()

const adminController = require('../controller/admin')


router.get('/', adminController.adminPage)

router.get('/register', adminController.adminGetRegister)   

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


module.exports = router;
