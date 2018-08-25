var env = require('node-env-file');
env(__dirname + '/.env');
const fs = require('fs');
const nodemailer = require('nodemailer');
const approveTemplate = require("./approveTemplate.js")
const disapproveTemplate = require("./disapproveTemplate.js")

function getEmailBody(info) {
    
    let template = ""
    if (info.isApprove === 1) template = approveTemplate
    else template = disapproveTemplate
    // console.log(template)
    let resultEmail = template.replace("<mppName>",info.mppName)
                        .replace("<billLongName>",info.billLongName)
                        .replace("<billShortName>",info.billShortName)
                        .replace("<reasons>",info.reasons)
                        .replace("<clientName>",info.clientName)

    if ("address" in info) resultEmail = resultEmail.replace("<address>",info.address)
    else resultEmail = resultEmail.replace("<address>","")

    if ("phone" in info) resultEmail = resultEmail.replace("<phone>",info.phone)
    else resultEmail = resultEmail.replace("<phone>","")

    if ("flaws" in info) resultEmail = resultEmail.replace("<flaws>",info.flaws)
    else resultEmail = resultEmail.replace("<flaws>","")

    if ("recommendations" in info) resultEmail = resultEmail.replace("<recommendations>",info.recommendations)
    else resultEmail = resultEmail.replace("<recommendations>","")

    return resultEmail

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
        text: getEmailBody(info),
    }

    transporter.sendMail(mailOptions).catch((err)=> {
        console.log(err)
    });
}

let info2 ={
    isApprove: 0,
    mppName: "Bryan L.",
    billLongName: "Bill to delegalize Zebra Mussel",
    billShortName: "Bill Zebra Mussel",
    reasons: "I don't like it",
    clientName: "Client 1",
    clientEmail: "brmlacso@edu.uwaterloo.ca",
    address:"100 Middle of Nowhere dr.",
    phone:"416-666-6666",
    flaws:"it's flawed",
    recommendations:"help",
    mppEmail:"democracyyey@gmail.com",
}

sendMailTo(info2);