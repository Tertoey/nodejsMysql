const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')
require('dotenv').config()
require('./db_connected/dbCon')

const userRouter = require('./router/router')
const webRouter = require('./router/webroute')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server error"
    res.status(err.statusCode).json({
        message : err.message
    })
})

app.use('/api',userRouter)
app.use('/',webRouter)

module.exports = app