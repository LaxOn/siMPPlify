var env = require('node-env-file');
env(__dirname + '/.env');
const fs = require('fs');
const nodemailer = require('nodemailer');
const approveTemplate = require("./approveTemplate.js")
const disapproveTemplate = require("./disapproveTemplate.js")

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

module.exports = {getEmailTemplate,sendMailTo}


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