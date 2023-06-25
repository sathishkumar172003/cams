const express = require('express')
const router = express.Router()


const userController = require('../controller/user')
const authController = require('../controller/auth')

const isAuth = require('../middlewares/is_auth')


router.get('/sign', authController.signup)


router.post('/sign', authController.postSign)


router.get('/login', authController.login)

router.post('/login', authController.postLogin)

router.post('/postApplication', userController.postApplication)

router.get('/userpage', isAuth, userController.userPage)

router.get('/logout',isAuth, authController.logout )


router.get('/getApplications', isAuth, userController.getApplicationsRouter)



module.exports = router

