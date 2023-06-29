const express = require('express')
const {check, body} = require('express-validator')

// const multer = require('multer')
// const upload_mutter = require('../util/upload-middleware')
// const upload = multer({storage: upload_mutter.files.storage()})

const upload = require('../util/upload')


const router = express.Router()

const appController = require("../controller/application")
const isAuth = require('../middlewares/is_auth')



// const cpUpload = upload.fields([{ name: 'studentPic', maxCount: 1 }, { name: 'tc', maxCount: 8 }, {name: 'sslcMarksheet'}, {name: 'pucMarksheet'}])

const appUpload = upload.fields([{name: 'studentPic'}, {name: 'tc'}, {name: 'sslcMarksheet'}, {name: 'pucMarksheet'}])

router.get('/applicationForm', isAuth, appController.getApplicationForm)


router.post('/postApplication', appUpload, 
[
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
    ] ,appController.postApplication)


router.get('/:appId',  appController.deleteApplication)

router.get('/updateApplication/:appId', appController.getUpdate)

router.post('/updateApplication/:appId', appController.postUpdate)

router.get('/viewApplication/:appId', appController.viewApplication)

module.exports = router;
