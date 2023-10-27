const express = require('express')
const user_route = express()

user_route.set('view engine','ejs')
user_route.set('views','./views')
user_route.use(express.static('public'))

const userController = require('../controller/userController')

user_route.get('/mail-verification',userController.verifyMail)
// user_route.get('/reset',userController.resetPAss)

module.exports = user_route