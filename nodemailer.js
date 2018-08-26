var env = require('node-env-file');
env(__dirname + '/.env');
const fs = require('fs');
const nodemailer = require('nodemailer');
const approveTemplate = require("./approveTemplate.js")
const disapproveTemplate = require("./disapproveTemplate.js")

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const app = express();
const util = require('util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }))


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname)));

app.get('', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

// setting and starting up the server
const port = process.env.PORT || '1234';
const server = http.createServer(app)
server.listen(port);
console.log("Server started on localhost:" + port);

app.get('index.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/sendMail',(req,res) => {
    sendMailTo(req.body)
    res.status(200).send("good")
});

app.post('/processEmailBody',(req,res)=> {
    res.status(200).send(getEmailTemplate(req.body))
});





function getEmailTemplate(info) {
    let template = ""
    if (info.isApprove == 1) template = approveTemplate
    else template = disapproveTemplate
    let resultTemplate = template.replace("<mppName>",info.mppName)
                        .replace("<billLongName>",info.billLongName)
                        .replace("<billShortName>",info.billShortName)
                        .replace("<clientName>",info.clientName)
    return resultTemplate

}

function sendMailTo(info) {
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
        from: info.clientName + "<"+ info.clientEmail +">",
        replyTo: info.clientEmail,
        to: info.mppEmail,
        subject: info.isApprove ? "Support " + info.billShortName : "Do not support " + info.billShortName,
        text: info.text,
    }

    transporter.sendMail(mailOptions).catch((err)=> {
        console.log(err)
    });
}
