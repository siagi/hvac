const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order')
const { getLatestEmails } = require('../google/getLastestEmails');
const {sendGmailEmail} = require('../google/sendEmail')
const Customer = require('../models/Customer');
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform','https://mail.google.com/','https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/pubsub'];
const TOKEN_PATH = 'token.json';
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { gmail } = require('googleapis/build/src/apis/gmail');
const nodemailer = require('nodemailer');
const {checkAvailableDate} = require('./order')
// const {verifyToken} = require('../middleware/verifyToken')

/*
WORKFLOW:
1.Authorize gmail client check token.



2.
3.
4.
5.

*/
//1.

let oAuth2Client;
const checkCredentials = async () => {
    return await new Promise((resolve, reject)=> {

        fs.readFile('./credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            authorizeGoogleAuth(JSON.parse(content), resolve);
          });
    })


}
const authorizeGoogleAuth = (credentials, resolve) => {
  console.log('here1');
    const {client_secret, client_id, redirect_uris} = credentials.web;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewGoogleToken(oAuth2Client, resolve);
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve(oAuth2Client);
    });
}

function getNewGoogleToken(oAuth2Client, resolve) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
          resolve(oAuth2Client);
        });
      });
    });
  }



router.post('/test', async (req,response) => {

  try {
    const availableDays = await checkAvailableDate();
    console.log('AVAILABLE DAYS',availableDays);
    const oAuth = await checkCredentials();
    const gmailClient = google.gmail({version: 'v1',auth:oAuth});
    gmailClient.users.watch({
      userId: 'me',
      topicName: "projects/mc2serwis/topics/zamowserwis",
      labelIds: ["UNREAD"],
    })
    const threadsList = await gmailClient.users.threads.list({
      userId: 'me',
    });
    const messages = threadsList.data.threads;
    if(messages && messages.length > 0){
      for(let i = 0; i < messages.length; i++){
        const threadDetails = await gmailClient.users.threads.get({
          userId:'me',
          id:messages[i].id
        })
        if(threadDetails.data.messages[0].labelIds.includes('UNREAD')){
            const fromEmailAddress = threadDetails.data.messages[0].payload.headers.find((h) => h['name'] === 'From').value;
            const subjectEmail = threadDetails.data.messages[0].payload.headers.find((h)=>h['name'] === 'Subject').value;
            const messageDetails = await gmailClient.users.messages.get({
              userId:'me',
              id:messages[i].id
            })
            const messageBody = messageDetails.data.payload.parts[0].hasOwnProperty('parts')  ? messageDetails.data.payload.parts[0].parts[0].body.data : messageDetails.data.payload.parts[0].body.data;
            const messageText = await new Buffer.from(messageBody, 'base64').toString('utf-8');
            await mongoose.connect(process.env.MONGO_URL);
            let customer = await Customer.findOne({email:fromEmailAddress});
            if(!customer){
                const newCustomer = new Customer({
                    email:fromEmailAddress,
                    name:'',
                    nip:'',
                    street:'',
                    postcode:'',
                    city:'',
                    phone:0,
                    discount:0
                })
                customer = await newCustomer.save();
            }
            const newOrder = new Order({
              companyDetails:customer._id,
              devices:[],
              description:messageText,
              title:subjectEmail,
              serviceDate:null
            })
            console.log(newOrder);
            const savedOrder = await newOrder.save();
            const orderID = savedOrder._id
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'zamowserwis24@gmail.com',
                    clientId: oAuth._clientId,
                    clientSecret: oAuth._clientSecret,
                    accessToken: accessToken.token
                },
            });
            const mailOptions = {
                from: 'MC2 Serwis <zamowserwis24@gmail.com>',
                to: fromEmailAddress,
                subject: `Powierdzenie nowego zamówienia nr ${orderID}`,
                text: `Dziękujemy za złożenie zamówienia na usługę serwisową. Nr złoszenia: ${orderID}`,
                html: `<h3>Dziękujemy za złożenie zamówienia na usługę serwisową. Nr złoszenia: ${orderID}</h3> <a href="http://localhost:3000/form-details/?id=${orderID}&days[]=${availableDays[0]}&days[]=${availableDays[1]}&days[]=${availableDays[2]}&days[]=${availableDays[3]}&days[]=${availableDays[4]}&days[]=${availableDays[5]}&days[]=${availableDays[6]}&days[]=${availableDays[7]}&days[]=${availableDays[8]}&days[]=${availableDays[9]}&days[]=${availableDays[10]}&days[]=${availableDays[11]}">link text</a>`
            };
            const mailSent = await transport.sendMail(mailOptions);
            if(mailSent.accepted){
              await gmailClient.users.messages.delete({
                userId:'me',
                id:messages[i].id
              })
              console.log('DONE OPERATION')
              await mongoose.disconnect();
              console.log(i),
              console.log(messages.length-1)
              if(i === messages.length - 1){
               
                const cleanThreadsList = await gmailClient.users.threads.list({
                  userId: 'me',
                  labelIds:['SENT']
                });
                const allCleanMessages = cleanThreadsList.data.threads;

                // for await (const msg of allCleanMessages){
                //   await gmailClient.users.messages.delete({
                //     userId:'me',
                //     id:msg.id
                //   })
                // }
                allCleanMessages.map(async (msg)=> {
                  try {
                    await gmailClient.users.messages.delete({
                      userId:'me',
                      id:msg.id,
                    })
                  } catch (error) {
                    console.log('problem with deleting message',error);
                  }
                })
                console.log('here0')
                return response.status(200).json({operataion:'completed'});
              }
      
            }
        } else {
          console.log('here1')
          return response.status(200).json({operataion:'there is no more emails'})
        }
      } 
    } else {
      console.log('here2')
      return response.status(200).json({operataion:'there is no new emails'})
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({error:error})
  }

})


module.exports = router