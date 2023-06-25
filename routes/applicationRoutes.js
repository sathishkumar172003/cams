const express = require('express')

const router = express.Router()

const appController = require("../controller/application")

router.get('/:appId',  appController.deleteApplication)

router.get('/updateApplication/:appId', appController.getUpdate)

router.post('/updateApplication/:appId', appController.postUpdate)

router.get('/viewApplication/:appId', appController.viewApplication)

module.exports = router;
