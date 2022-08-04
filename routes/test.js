const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order')
const { getLatestEmails } = require('../google/getLastestEmails');
const {sendGmailEmail} = require('../google/sendEmail')
const Customer = require('../models/Customer');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const nodemailer = require('nodemailer');

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform','https://mail.google.com/','https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/pubsub'];
const TOKEN_PATH = 'token.json';
// const {verifyToken} = require('../middleware/verifyToken')

/*
WORKFLOW:
1.
2.
3.
4.
5.

*/

router.post('/test', async (req,res) =>{
    const emails = []
    const addEmail = (item) => {
       emails.push(item);
       console.log('adding...')
    }
    const checkTheEmail = async () => {
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>console.log("DB connection Successfull"))
        .catch((error)=>console.log(error));
        for(let i=0; i<emails.length; i++){
            const {from, subject, text} = emails[i];
            console.log('TEXT', text)
            let customer = await Customer.findOne({email:from});
            if(!customer){
                const newCustomer = new Customer({
                    email:from
                })
                customer = await newCustomer.save();
                console.log(customer)
            }

            const newOrder = new Order({
                customer:customer._id,
                description:text,
                title:subject
            })
            const savedOrder = await newOrder.save();
            console.log(savedOrder);
            // const mail = await sendGmailEmail(from);
            // console.log('mail',mail);
            // const prom = new Promise((resolve, reject)=>{
            //     const mail = sendGmailEmail(from);
            //     resolve(mail)
            // })
            // prom.then((result)=> console.log('RESULT',result))
            fs.readFile('./credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Gmail API.
                authorize(JSON.parse(content), sendEmail);
              });
            
            
              function authorize(credentials, callback) {
                const {client_secret, client_id, redirect_uris} = credentials.web;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);
              
                // Check if we have previously stored a token.
                fs.readFile(TOKEN_PATH, (err, token) => {
                  if (err) return getNewToken(oAuth2Client, callback);
                  oAuth2Client.setCredentials(JSON.parse(token));
                  // sendEmail(credentials,oAuth2Client);
                  callback({credentials, oAuth2Client});
                });
              }

              const sendEmail = async ({credentials, oAuth2Client}) => {
                  try {
                    const accessToken = await oAuth2Client.getAccessToken();
                    const transport = nodemailer.createTransport({
                      service:'gmail',
                      auth:{
                        type:'OAuth2',
                        user:'zamowserwis24@gmail.com',
                        clientId:credentials.client_id,
                        clientSecret:credentials.client_secret,
                        accessToken: accessToken.token
                      },
                    })
                    const mailOptions = {
                      from:'ZamowSerwis24 <zamowserwis24@gmail.om>',
                      to: from,
                      subject:'New zamowserwis24',
                      text:'Hello from gmail email using API',
                      html: '<h1>Hello from gmail email using API</h1>'
                    } 
              
                    await transport.sendMail(mailOptions);
                  } catch (error) {
                    console.log('error',error)
                  }
                }
        }
        await mongoose.disconnect();
    }
    getLatestEmails(addEmail, checkTheEmail);

    //     console.log(emails)
    // }, 5000)
    // console.log('DATA',req.data);
    // console.log('asdf')
    // await sendGmailEmail();
   
    // const o = await Order.findById('61e1aff70af1be59793b6715');
    // console.log('O',o);
    // await mongoose.disconnect();


    res.status(200).json({mail:'confirmed'});
})


module.exports = router