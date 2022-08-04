const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const nodemailer = require('nodemailer');

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform','https://mail.google.com/','https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/pubsub'];
const TOKEN_PATH = 'token.json';

async function sendGmailEmail(emailAddress, orderID) {
    // fs.readFile('./credentials.json', (err, content) => {
    //   if (err) return console.log('Error loading client secret file:', err);
    //   // Authorize a client with credentials, then call the Gmail API.
    //   authorize(JSON.parse(content), sendEmail, emailAddress);
    // });

    fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), sendEmail, emailAddress);
      });
    
    
      function authorize(credentials, callback, emailAddress) {
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
      
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getNewToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          // sendEmail(credentials,oAuth2Client);
          callback({credentials, oAuth2Client, emailAddress});
        });
      }
      
      /**
       * Get and store new token after prompting for user authorization, and then
       * execute the given callback with the authorized OAuth2 client.
       * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
       * @param {getEventsCallback} callback The callback for the authorized client.
       */
      function getNewToken(oAuth2Client, callback) {
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
            });
            callback(oAuth2Client);
          });
        });
      }
    
      
      /**
       * Lists the labels in the user's account.
       *
       * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
       */
    
      async function sendEmail({credentials,oAuth2Client, emailAddress}){
        // const gmail = google.gmail({version:'v1', auth});
        const {client_secret, client_id, redirect_uris} = credentials.web;
        try {
          const accessToken = await oAuth2Client.getAccessToken();
          const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
              type:'OAuth2',
              user:'zamowserwis24@gmail.com',
              clientId:client_id,
              clientSecret:client_secret,
              accessToken: accessToken.token
            },
          })
          const mailOptions = {
            from:'MC2 Serwis <zamowserwis24@gmail.om>',
            to: emailAddress,
            subject:`Nowe zamówienie nr ${orderID}`,
            text:'Hello from gmail email using API',
            html: `<div style="display: flex; flex-direction:column; justify-items: center; align-items: center; gap: 5px;">\n
            <img src="https://drive.google.com/file/d/1ugkBX5yTVIFaHDENVZoc8hFgMRdfqWql/view" width="200px" style="border-radius: 20px;"></img>\n
            <div style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-weight: bold; font-size: larger;">Dziękujemy za złożenie zamówienia w firmie MC2 Serwis.</div>\m
            <div style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-weight: bold; font-size: large;">Twój numer zamówienia to :${orderID} </div>\n
            <div style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size:medium; font-weight: bold;"> Bardzo prosimy o przejście do strony z formularzem aby uzupełnić dane do zgłoszenia oraz zaakepctować regulamin</div>\n
            <button style="margin-top: 20px;background-color:#004377; padding: 10px; color: white; border: 0; border-radius: 5px;"> Przejdz do formularza</button></div>`
          } 
    
          await transport.sendMail(mailOptions);
        } catch (error) {
          console.log('error',error)
        }
      }
  }





  // getLastestMails();

  module.exports = {sendGmailEmail}