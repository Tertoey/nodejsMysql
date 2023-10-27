const {check} = require('express-validator')

exports.signUpValidation = [
    check('fname','Firstname is required').not().isEmpty(),
    check('lname','Lastname is required').not().isEmpty(),
    check("email", "Please enter a valid email").not().isEmpty().isEmail(),
    // check("email", "Please enter a valid email").isEmail().normalizeEmail({gmail_remove_dots:true}),
    check("password","Password must be 6 characters long and contain at least one number").isLength({min:6})
    // ,check("image").custom((value,{req})=>{
    //     if(req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png' ){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }).withMessage('please upload an image type PNG, JPG')
]