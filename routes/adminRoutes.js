const express = require('express')

const router = express.Router()

const adminController = require('../controller/admin')


router.get('/', adminController.adminPage)

router.get('/register', adminController.adminGetRegister)   





module.exports = router;
