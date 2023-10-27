const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const dbConnect = require('../db_connected/dbCon') 
const mail = require('../helper/sendmail')
const randomStr = require('randomstring')
const jwt = require('jsonwebtoken')


exports.register = (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    dbConnect.query(
        `SELECT * FROM user_login WHERE LOWER(email) = LOWER(${dbConnect.escape(
            req.body.email
        )})`,
        (err,result)=>{
            if(result&&result.length){
                return  res.json({status:"exist",message:"Email already exists"})
            }else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    dbConnect.execute(
                        'INSERT INTO user_login (fname, lname,email, password) VALUES (?,?,?,?)',
                        [req.body.fname, req.body.lname,req.body.email, hash],
                        // 'INSERT INTO user_login (fname, lname,email, password,image) VALUES (?,?,?,?,?)',
                        // [req.body.fname, req.body.lname,req.body.email, hash, `image/${req.file.filename}`],
                        function(err, results) {
                            if(results){
                                let mailSubject1 = "Mail Verification"
                                const randomToken1 = randomStr.generate()
                                // let content = `<p>Hello ${req.body.fname} 
                                // Please Verify <a>href = "http://127.0.0.1:3000/mail-verification?token=${randomToken}"</a> Your mail</p>`
                                let content1 = `Hello ${req.body.fname} Please Verify "http://127.0.0.1:8080/mail-verification?token=${randomToken1}" Your mail`
                                mail(req.body.email, mailSubject1, content1);
                                dbConnect.query('UPDATE user_login set token=? where email=?',[randomToken1,req.body.email],
                                function (err,result){
                                    if(result){
                                        console.log("mail sent")
                                        return res.json({status:"ok",message:"Sign up successful, Check you email to confirm"})
                                    }else{
                                        return res.json({status:err})
                                        
                                    }
                                })
                            }else{
                                return res.json({status:"err",message:err})    
                            }
                        })
                })
            }
        }
    )
}

exports.login = (req,res)=>{
    console.log(req.body.email)
    dbConnect.query(
        'SELECT * FROM user_login WHERE email = ?',
        [req.body.email],
        function (err, user){
            if(err){
                return res.json({messege:err})
            }
            if (user.length<1){
                return res.json({status:"error",message:'Email not found'})
            }
            dbConnect.query(
                'SELECT * FROM user_login WHERE email = ? AND is_verified = 1',
                [req.body.email],
                function (err, user){
                    if(err){
                        return res.json({messege:err})
                    }
                    if (user.length<1){
                        return res.json({status:"error",message:'Please verify your email'})
                    }
                    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                        if(result){
                            const token = jwt.sign({email: user[0].email},process.env.JWT_key,{expiresIn:'1m'})
                            console.log(token)
                            var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
                            var tmx2 = new Date(Date.now() - tzoffset).toISOString().slice(0, -1).replace(/T/, ' ').replace(/\..+/, '')
                            dbConnect.execute('UPDATE user_login set last_login=? WHERE email=?',[tmx2,req.body.email])
                            return res.json({status:"ok",message:'Login Successful',Token:token})
                        }else{
                            return res.json({status:"error",message:"Invalid Password"})
                        }
                    })
                })
        }
    )
}

exports.forgetPass = (req,res)=>{
    console.log(req.body.email)
    dbConnect.query(
        'SELECT * FROM user_login WHERE email = ?',
        [req.body.email],
        function (err, result){
            if(err){
                return res.json({messege:err})
            }
            if (result.length<1){
                return res.json({
                    status:"error",
                    messege:'Email not found'
                })
            }else{
                let mailSubject = "Reset password OTP"
                var otp = Math.floor(1000 + Math.random() * 9000);
                let content = `Hello Reset password please use ${otp} to reset password"`
                mail(req.body.email, mailSubject, content);
                dbConnect.query('UPDATE user_login set otp=? where email=?',[otp,req.body.email],
                function (err,result){
                    if(result){
                        console.log("mail sent")
                        return res.json({status:"ok",message:"Check Reset password otp at your email"})
                    }else{
                        return res.json({status:err})
                    }
                })
            }
        }
    )
}

exports.verifyMail = (req,res)=>{
    const token = req.query.token
    dbConnect.query('SELECT * FROM user_login where token=? limit 1',token,function(err,result){
        if(err){
            console.log(err.message)
        }if(result.length>0){
            dbConnect.query(`UPDATE user_login SET token = null, is_verified = 1 WHERE id = '${result[0].id}'`)
            console.log('Mail ok')
            return  res.render('mail-verification',{message: 'Mail Verified Succesfully!'})
        }
        else{
            return res.render('404_signup')
        }
    })
}

exports.resetPAss = (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    if (req.body.password != req.body.confirmpass){
        return res.json({
            status:"error",
            message:"Password & Confirm Password do not match"
        })
    }
    const otp = req.body.otp
    console.log(otp)
    dbConnect.query(`SELECT * FROM user_login WHERE otp=${otp}`,function(err,result){
        if(result.length<1){
            return res.json({
                status:"error",
                message:"OTP Validation"
            })
        }if(result.length>0){            
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
                var tmx2 = new Date(Date.now() - tzoffset).toISOString().slice(0, -1).replace(/T/, ' ').replace(/\..+/, '')
                dbConnect.query('UPDATE user_login SET password = ?, otp = null, update_at=? WHERE id =?',[hash,tmx2,result[0].id],function(err,result){
                    if(result){
                        return res.json({
                            status:"ok",
                            message:"Reset password Successfully"
                        })
                    }
                })
            })
        }
        else{
            return res.json({status:"error",message:"no otp"})
        }
    })
    
}

exports.authen = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token,process.env.JWT_key)
        dbConnect.query(
            'SELECT email FROM user_login ',
            function(err, results, fields) {
              console.log(results); // results contains rows returned by server
              console.log(fields); // fields contains extra meta data about results, if available
              res.json({
                status:"ok",
                message : results
            })
            })
    }catch(err){
        res.json({
            status:"error",
            message : err
        })
    }

}

// `INSERT INTO user_login (fname, lname,email, password ) VALUES ('${req.body.fname}','${req.body.lname}',${dbConnect.escape(req.body.email)},${dbConnect.escape(hash)})`
                        