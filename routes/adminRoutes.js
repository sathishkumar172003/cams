const express = require('express')

const router = express.Router()

const adminController = require('../controller/admin')


router.get('/', adminController.adminPage)

router.get('/register', adminController.adminGetRegister)   

router.get('/pendingapplications', adminController.pendingApplications)

router.get('/singleapplication/:appId', adminController.viewSingleApplication)

router.get('/updateapplication/:appId', adminController.getUpdateApplication)


module.exports = router;
