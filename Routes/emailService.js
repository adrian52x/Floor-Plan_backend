import nodemailer from "nodemailer";
import Router from "express";
const router = Router();


router.post('/api/sendmail', async (req, res) => {
    try {
        
        const timeAndDate = new Date();
        const output = `
            <p>Our customer service received your inquiry and we will be back to you as soon as possible</p>
            <h3>Contact details</h3>
            <ul>
                <li>Name: ${req.body.fullName} </li>
                <li>Subject: ${req.body.subject} </li>
                <li>Type: ${req.body.type} | ${req.body.number}</li>
                <li>Date & time: ${timeAndDate} </li>
            </ul>
            <h3>Message</h3>
            <p>${req.body.message}</p>    
        `;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASS, // generated ethereal password
            },
            tls:{
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"AGC Digital Floor Plan', // sender address
            to: req.body.email, // list of receivers
            subject: "AGC DFP - New inquiry", // Subject line
            text: "", // plain text body
            html: output, // html body
        });

        console.log("Message sent: %s", info.messageId); 

    } catch (error) {
        console.log(error);
    }
  
});


export default router;