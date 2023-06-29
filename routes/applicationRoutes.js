const express = require('express')
const {check, body} = require('express-validator')

const router = express.Router()

const appController = require("../controller/application")
const isAuth = require('../middlewares/is_auth')


router.get('/applicationForm', isAuth, appController.getApplicationForm)


router.post('/postApplication', [
    body('dob').
    custom(async (value, {req}) =>{
    let date = new Date()
    let current_year = date.getFullYear()

    let birth_date = new Date(req.body.dob)
    var birth_year  = birth_date.getFullYear()
    let age = current_year - birth_year
    if(age < 14){
        throw new Error("Age cannot be less than 14 ")
    }
    return true
    }),  
    body('sslcPercentage').isLength({max:100, min:30}).withMessage('SSLC Percentage can\'t be less than 30 and above 100'),
    body('pucPercentage').isLength({max:100, min:30}).withMessage('PUC Percentage can\'t be less than 30 and above 100')
    ] ,appController.postApplication)


router.get('/:appId',  appController.deleteApplication)

router.get('/updateApplication/:appId', appController.getUpdate)

router.post('/updateApplication/:appId', appController.postUpdate)

router.get('/viewApplication/:appId', appController.viewApplication)

module.exports = router;
