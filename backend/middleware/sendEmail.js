const nodemailer = require("nodemailer");
const Constants = require('../Constants');
var ejs = require("ejs");
const { EMAIL_AUTH,USER_EMAIL_FROM } = require("../Constants");

const sendEmail = async (emailTo, subject,data) => {

 let apiObj=data
 console.log("dynamic values",apiObj)
    
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: Constants.MAIL_PORT,
            type: "SMTP",
            host: "smtp.gmail.com",
            secure: true,
            auth: {
                user: EMAIL_AUTH.user,
                pass: EMAIL_AUTH.pass,

            },
        });

// Test purpose only....
            if (transporter) {
                var mainOptions = {
                    from:  'Nyurtech<' + EMAIL_AUTH.user + '>',
                    // to: "<lubaidkhan111@gmail.com>",
                    to:`<${emailTo}>`,
                    //  cc:"<nyurtecht@techcare.com>",
                    subject: subject,
                    // text: text,
                    html: data,
                    replyTo: EMAIL_AUTH.user
                };
                console.log(mainOptions)
                await transporter.sendMail({
                    ...mainOptions

                });
                 transporter.close();
            } 


        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;