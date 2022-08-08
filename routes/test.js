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

const checkCredentials = () => {
    return new Promise((resolve, reject)=> {

        fs.readFile('./credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            authorizeGoogleAuth(JSON.parse(content), resolve);
          });
    })


}
let oAuth2Client;
const authorizeGoogleAuth = (credentials, resolve) => {
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


router.post('/test', async (req,response) =>{

    checkCredentials().then((e) => {
        return new Promise((resolve, reject) => {
            const gmail = google.gmail({version: 'v1',auth:e});
            gmail.users.threads.list({
              userId: 'me',
            }, (err, res) => {
              if (err) return console.log('The API returned an error: ' + err);
              const messages = res.data.threads;
              if (messages.length) {
                for(let i=0; i<messages.length; i++){
                    gmail.users.threads.get({
                        userId:'me',
                        id:messages[i].id
                    }, (err,res)=>{
                        if(err) console.log('err',err);
                        const from = res.data.messages[0].payload.headers.find((h)=>h['name']==='From')
                        const subject = res.data.messages[0].payload.headers.find((h)=>h['name']==='Subject');
                        let text;
                        if(res.data.messages[0].labelIds.includes('UNREAD')){
                            const body = gmail.users.messages.get({
                                userId:'me',
                                id:messages[i].id
                            })
                            body.then(async (b)=> {
                                // console.log('B',b.data.payload.parts[0].parts[0].body.data)
                                console.log(b.data.payload.parts[0].hasOwnProperty('parts'))
                                const data = b.data.payload.parts[0].hasOwnProperty('parts')  ? b.data.payload.parts[0].parts[0].body.data : b.data.payload.parts[0].body.data;
                                text = new Buffer.from(data, 'base64').toString('utf-8');
                                await mongoose.connect(process.env.MONGO_URL)
                                .then(()=>console.log("DB connection Successfull"))
                                .catch((error)=>console.log('MONGO ERROR',error));
                                return new Promise(async (resolve, reject)=>{
                                    let customer = await Customer.findOne({email:from.value});
                                    if(!customer){
                                        const newCustomer = new Customer({
                                            email:from.value,
                                            name:from.value,
                                            nip:Date.now()
                                        })
                                        customer = await newCustomer.save();
                                        console.log(customer)
                                    }
                                    const newOrder = new Order({
                                        customer:customer._id,
                                        description:text,
                                        title:subject.value
                                    })
                                    const savedOrder = await newOrder.save();
                                    console.log(savedOrder);
                                    const orderID = savedOrder._id
                                    resolve({from:from.value, orderID:orderID})
                                }).then(async result => {
                                    await new Promise(async (resolve, reject) => {
                                        const { from, orderID } = result;
                                        console.log('OAUTH22', oAuth2Client);
                                        try {
                                            const accessToken = await oAuth2Client.getAccessToken();
                                            const transport = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    type: 'OAuth2',
                                                    user: 'zamowserwis24@gmail.com',
                                                    clientId: oAuth2Client._clientId,
                                                    clientSecret: oAuth2Client._clientSecret,
                                                    accessToken: accessToken.token
                                                },
                                            });
                                            const mailOptions = {
                                                from: 'MC2 Serwis <zamowserwis24@gmail.om>',
                                                to: from,
                                                subject: `Nowe zamówienie nr ${orderID}`,
                                                text: `Dziękujemy za złożenie zamówienia na usługę serwisową. Nr złoszenia: ${orderID}`,
                                                html: `<h3>Dziękujemy za złożenie zamówienia na usługę serwisową. Nr złoszenia: ${orderID}</h3>`
                                            };
                                            await transport.sendMail(mailOptions);
                                            console.log('mail sent');
                                              gmail.users.messages.modify({
                                                userId:'me',
                                                id:messages[i].id,
                                                requestBody:{
                                                    removeLabelIds:['UNREAD']
                                                }
                                            })
                                            resolve();
                                        } catch (error) {
                                            console.log('error', error);
                                        }
                                    });
                                    console.log('Mongoose disconnect');
                                    console.log('i',i);
                                    console.log('messages length', messages.length)
                                    await mongoose.disconnect();
                                    
                                })
                            })
                        }
                    })
                    
                    // if(i === messages.length-1){
                    //    response.status(200).json({mail:'confirm'})
                    // }
                }
                // console.log('Labels:');
                // labels.forEach((label) => {
                //   console.log(`- ${label.name}`);
                // });
              } else {
                console.log('No labels found.');
                reject();
              }
            });
        })
    })
    response.status(200).json({mail:'confirm'})
    // console.log('oAuthClient')

    // const emails = []
    // const addEmail = (item) => {
    //    emails.push(item);
    //    console.log('adding...')
    // }
    // const checkTheEmail = async () => {
    //     console.log(emails)
    //     const emailsAccounts = []
        // for(let i=0; i<emails.length; i++){
        //     await mongoose.connect(process.env.MONGO_URL)
        //     .then(()=>console.log("DB connection Successfull"))
        //     .catch((error)=>console.log('MONGO ERROR',error));
        //     console.log('here1');
        //     const {from, subject, text} = emails[i];
        //     emailsAccounts.push(from);
            
        //     let customer = await Customer.findOne({email:from});
        //     if(!customer){
        //         const newCustomer = new Customer({
        //             email:from,
        //             name:from,
        //             nip:Date.now()
        //         })
        //         customer = await newCustomer.save();
        //         console.log(customer)
        //     }
        //     const newOrder = new Order({
        //         customer:customer._id,
        //         description:text,
        //         title:subject
        //     })
        //     const savedOrder = await newOrder.save();
        //     console.log(savedOrder);
        //     const orderID = savedOrder._id
        //     sendGmailEmail(from, orderID)
            
        //     await mongoose.disconnect();
        // }
    //     console.log('PO DODANIU DO DB ? ')
        
    //     // emailsAccounts.forEach((item)=>{
    //     // })
    // }
    // getLatestEmails(addEmail, checkTheEmail).then((a)=>{
    //     console.log('Finish')
    //     res.status(200).json({mail:'confirmed'})
    // });
    // console.log('???',getLatestEmails(addEmail, checkTheEmail))
    //     console.log(emails)
    // }, 5000)
    // console.log('DATA',req.data);
    // console.log('asdf')
    // await sendGmailEmail();
   
    // const o = await Order.findById('61e1aff70af1be59793b6715');
    // console.log('O',o);
})


module.exports = router