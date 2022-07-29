const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform','https://mail.google.com/','https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/pubsub'];
const TOKEN_PATH = 'token.json';

fs.readFile('./credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listLabels);
  });

  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
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
  function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.watch({
      userId: 'me',
      topicName: "projects/mc2serwis/topics/zamowserwis",
      labelIds: ["INBOX"],
    })
    gmail.users.threads.list({
      userId: 'me',
    }, (err, res) => {
        console.log('RES',res.data)
      if (err) return console.log('The API returned an error: ' + err);
      const messages = res.data.threads;
      if (messages.length) {
        messages.forEach((item)=>{
            gmail.users.threads.get({
                userId:'me',
                id:item.id
            }, (err,res)=>{
                // console.log('RES',res)
                if(err) console.log('err',err);
                const subject = res.data.messages[0].payload.headers.find((h)=>h['name']==='Subject');
                const text = res.data.snippet
                console.log(res.data.messages[0].labelIds.includes('UNREAD'))
                console.log('subject',subject.value);
                console.log('text',res.data.messages[0].snippet);
            })
        })
        // console.log('Labels:');
        // labels.forEach((label) => {
        //   console.log(`- ${label.name}`);
        // });
      } else {
        console.log('No labels found.');
      }
    });
  }