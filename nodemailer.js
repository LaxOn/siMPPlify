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

//app.use('/api', apiRoutes);

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

// accepts post request to create js files
app.post('/saveInfo',saveToText);

app.get('/getInfo',getText);

app.post('/sendMail',sendTheMail);

app.post('/processEmailBody',processTheEmailBody);


function saveToText(req,res) {
    console.log(req.params.json)
    console.log(req.body)
    res.status(200).send("good")
    fs.writeFileSync('./data.js',req.params.json,'utf-8')
    if (err)  return console.log(err);
}

function getText(req,res) {
    console.log(req.params.json)
    console.log(req.body)
    res.status(200).send("good")
    fs.writeFileSync('./data.js',req.params.json,'utf-8')
    if (err)  return console.log(err);
}

function sendTheMail(req,res) {
    console.log(req.params.json)
    console.log(req.body)
    res.status(200).send("good")
    fs.writeFileSync('./data.js',req.params.json,'utf-8')
    if (err)  return console.log(err);
}
function processTheEmailBody(req,res) {
    console.log(req.params.json)
    console.log(req.body)
    res.status(200).send("good")
    fs.writeFileSync('./data.js',req.params.json,'utf-8')
    if (err)  return console.log(err);
}









function getEmailTemplate(info) {
    let template = ""
    if (info.isApprove === 1) template = approveTemplate
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


//isNotCustom
// we populate the message with the replacements
// we send when submit

//isCustom
// send it 

// let info ={
//     isApprove: 0,
//     isCustom:0,
//     mppName: "Bryan L.",
//     billLongName: "Bill to delegalize Zebra Mussel",
//     billShortName: "Bill Zebra Mussel",
//     clientName: "Client 1",
//     clientEmail: "brmlacso@edu.uwaterloo.ca",
//     mppEmail:"democracyyey@gmail.com",
//     text: "textarea value"
// }

// sendMailTo(info2);