require('dotenv').config()
const mysql = require('mysql2'
)

const dbCon = mysql.createConnection({
    host        :   process.env.db_host,
    user        :   process.env.db_user,
    password    :   process.env.db_pass,
    database    :   process.env.db_name,
    connectionLimit: '5'
})

dbCon.connect(err=>{
    if ( err ) throw new Error(`Error connecting to the DB ${err}`)
    console.log(`${process.env.db_name} Database Conneted`)
})

module.exports = dbCon