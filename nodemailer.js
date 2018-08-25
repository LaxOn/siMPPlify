var env = require('node-env-file');
env(__dirname + '/.env');
const fs = require('fs');
const nodemailer = require('nodemailer');

function sendMailTo(clientName,clientEmail,mppEmail,subject,text) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: clientName + "<"+ clientEmail +">",
        replyTo: clientEmail,
        to: mppEmail,
        subject: subject,
        text: text,
    }

    transporter.sendMail(mailOptions).catch((err)=> {
        console.log(err)
    });
}

//sendMailTo("Bryan Lacson","brmlacso@edu.uwaterloo.ca", "democracyyey@gmail.com", "Mussels Act", "I don't want this act to pass.")
