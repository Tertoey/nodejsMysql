const {check} = require('express-validator')

exports.resetPassValidation = [
    check("password","Password must be 6 characters long and contain at least one number").isLength({min:6}),
    check("otp","OTP must be 4 digit number").not().isEmpty().isInt(),
]