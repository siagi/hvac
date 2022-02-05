const fs = require('fs/promises');
const fsnp = require('fs');
const readline = require('readline');
const {google, drive_v3, GoogleApis} = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');

const KEYFILEPATH = "C:\\Users\\micha\\Downloads\\hvacservice-339709-766408d1dd45.json";

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// const auth2 = new google.auth.GoogleAuth({
//     keyFile:KEYFILEPATH,
//     scopes:SCOPES
// });

const auth = new google.auth.JWT({
    keyFile:KEYFILEPATH,
    scopes:SCOPES
})

const driveService = google.drive({version:'v3',auth:auth})

async function createAndUploadFile(file){
    

    // driveService.files.list({
    //     pageSize: 10,
    //     fields: 'nextPageToken, files(id, name)',
    //   }, (err, res) => {
    //     if (err) return console.log('The API returned an error: ' + err);
    //     const files = res.data.files;
    //     if (files.length) {
    //       console.log('Files:');
    //       files.map((file) => {
    //         console.log(`${file.name} (${file.id})`);
    //       });
    //     } else {
    //       console.log('No files found.');
    //     }
    //   });
    
    // const file = await driveService.files.get({fileId:'1v7yegViqR916E7m5-8eIYmzrrEGmr_Hx'})
    
    // const dest = fs.createWriteStream('./image.jpg');

    // const file = await driveService.files.get({fileId:'1wVj-pfAR4BllTS1NyvUKV5C-t21t6g00'});
    // console.log(file.data.exportLinks);

    // driveService.files.get(
    //     {
    //     fileId:'1wVj-pfAR4BllTS1NyvUKV5C-t21t6g00',
    //     alt:'media',

    //     },
    //     {
    //         responseType:'stream',
    //     },
    //     (err,res)=>{
    //         res.data
    //         .on('end', () => {
    //             console.log('Done');
    //         }).on('error', err => {
    //             console.log('Error', err);
    //         }).pipe(dest);
    //     }
    // )

    // fs.writeFile('./image.jpg',file.data,(err)=>console.log(err));
    // const readStream = fs.createReadStream(file.data.parents);
    // readStream.on('open',()=>{
    //     readStream.pipe(fs.createWriteStream('tmp/anylogo.jpg'));
    // })
    // console.log(file.data);

    // console.log(filesList.data);
    // const drives = await driveService.teamdrives.list()
    // console.log(drives.headers)

    fs.writeFile('./tmp/obrazek.jpg',file,()=>console.log('done'));
    

    let fileMetadata = {
        name:'logo.jpg',
        mimeType:'image/jpg'
    }
    

    let media = {
        mimeType:'image/jpg',
        body:fsnp.createReadStream('./tmp/obrazek.jpg')
    }
    
    driveService.files.create({
        requestBody:fileMetadata,
        media:media,
        fields:'id',
    },async (err,file)=>{
        if(err){
            console.log(err)
        }else{
            
            // console.log(file.data.id)
            const auth = new google.auth.JWT({
                keyFile:KEYFILEPATH,
                scopes:SCOPES
            })
            
            const driveService = google.drive({version:'v3',auth:auth})
        
            try {
               driveService.permissions.create({
                    fileId:file.data.id,
                    requestBody:{
                        role:'reader',
                        type:'anyone'
                    }
                })
        
                const result = await driveService.files.get({
                    fileId:file.data.id,
                    fields:'webViewLink'
                })
                
                // return new Promise((resolve,reject)=>{
                //     (err,result)=>{
                //         if(err)reject(err)
                //         else resolve(result)
                //     }
                // })
                // console.log(result.data.webViewLink)
                // console.log(result.data)
                // console.log(result.data);
                return result.data.webViewLink;
            } catch (error) {
                console.log(error)
            }




            // const link = await generatePublicUrl(file.data.id);
            // return link
            // const generateLink = () => {
            //    const link = generatePublicUrl(file.data.id);
            //    return link
            // }
            // return generateLink()
            
            // return generatePublicUrl(file.data.id)
        }
    });

    // console.log(id);

    // return id

    // return id;
    // return link


    // generatePublicUrl();
    
}

function generatePublicUrl(fileId){

    const auth = new google.auth.JWT({
        keyFile:KEYFILEPATH,
        scopes:SCOPES
    })
    
    const driveService = google.drive({version:'v3',auth:auth})

    try {
        driveService.permissions.create({
            fileId:fileId,
            requestBody:{
                role:'reader',
                type:'anyone'
            }
        })




        
        const result = driveService.files.get({
            fileId:fileId,
            fields:'webViewLink'
        })
        
        // return new Promise((resolve,reject)=>{
        //     (err,result)=>{
        //         if(err)reject(err)
        //         else resolve(result)
        //     }
        // })
        return result.data.webViewLink
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createAndUploadFile,generatePublicUrl}

// createAndUploadFile().catch(console.error);
