const express  = require('express')

const router = express.Router()

const collegeController = require('../controller/college')


router.get('/', collegeController.homepage)

router.get('/about', collegeController.about)

router.get('/admission',collegeController.admission)


router.get('/applicationForm', collegeController.getApplicationForm)


router.get('/eligibility', collegeController.eligibility)

module.exports = router