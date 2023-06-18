const express = require('express')
const router = express.Router()

const userController = require('../controller/user')

router.get('/sign', userController.sign)


router.post('/sign', userController.postSign)


router.get('/login', userController.login)

router.post('/login', userController.postLogin)

router.post('/postApplication', userController.postApplication)

module.exports = router

