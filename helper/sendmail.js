const nodemailer = require("nodemailer");
require('dotenv').config()

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.email_host,
            // service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.email_user,
                pass: process.env.email_pass,
            },
        });

        await transporter.sendMail({
            from: process.env.email_user,
            to: email,
            subject: subject,
            text: text,
            // html:`<h1>Email Confirmation</h1>
            // <h2>Hello ${email}</h2>
            // <p>Thank you for signup. Please confirm your email by clicking on the following link</p>
            // </div>`,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;