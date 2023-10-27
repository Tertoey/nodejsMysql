const express = require('express')
const router = express.Router()
const {signUpValidation} = require('../helper/validation')
const {resetPassValidation} = require('../helper/validation_resetpass')
const userController = require('../controller/userController')
const dbConnect = require('../db_connected/dbCon') 
const path =require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/image'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)
    }
})

const filefilter = (req,file,cb)=>{
    (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')?
    cb(null,true):cb(null,false )
}

const upload = multer ({ 
    storage:storage,
    // limits:{fileSize :1024 * 1024},
    fileFilter:filefilter
})

router.get('/user',(req,res,next)=>{
    dbConnect.query(
        'SELECT email FROM user_login ',
        function(err, results, fields) {
          console.log(results); // results contains rows returned by server
          console.log(fields); // fields contains extra meta data about results, if available
          res.json({results})
        })
})



router.post('/login',userController.login)

router.post('/signup',signUpValidation,userController.register)
// router.post('/signup',upload.single('image'),signUpValidation,userController.register)

router.post('/authen',userController.authen)

router.post('/forget',userController.forgetPass)

router.post('/reset',resetPassValidation,userController.resetPAss)

// router.post('/reset',resetPassValidation,userController.resetPAss)

module.exports=router