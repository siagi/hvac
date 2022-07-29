const fs = require('fs/promises');
const fsnp = require('fs');
const readline = require('readline');
const {google, drive_v3, GoogleApis} = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');

async function getEmails (){
    const KEYFILEPATH = "C:\\Users\\micha\\Downloads\\hvacservice-339709-766408d1dd45.json";
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    
    console.log('test gmail')
}



async function createAndUploadFile(file,cb){

    
    const KEYFILEPATH = "C:\\Users\\micha\\Downloads\\hvacservice-339709-766408d1dd45.json";
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    
    const auth = new google.auth.JWT({
        keyFile:KEYFILEPATH,
        scopes:SCOPES
    })
    
    const driveService = google.drive({version:'v3',auth:auth})

   await fs.writeFile('./tmp/obrazek.jpg',file,()=>console.log('done'));
    

    let fileMetadata = {
        name:'logo.jpg',
        mimeType:'image/jpg'
    }
    

    let media = {
        mimeType:'image/jpg',
        body:fsnp.createReadStream('./tmp/obrazek.jpg')
    }
    
    return driveService.files.create({
        requestBody:fileMetadata,
        media:media,
        fields:'id,webViewLink',
    },async(err,file)=>{
        if(err){
            console.log(err)
        }else{
            await driveService.permissions.create({
                fileId:file.data.id,
                requestBody:{
                    role:'reader',
                    type:'anyone'
                }
            })
            cb(file.data)
            
            // console.log(file.data)
        }

    });

}

function check(file){

    console.log(createAndUploadFile(file))
}

// function generatePublicUrl(fileId){

//     const auth = new google.auth.JWT({
//         keyFile:KEYFILEPATH,
//         scopes:SCOPES
//     })
    
//     const driveService = google.drive({version:'v3',auth:auth})

//     try {
//         driveService.permissions.create({
//             fileId:fileId,
//             requestBody:{
//                 role:'reader',
//                 type:'anyone'
//             }
//         })




        
        // const result = driveService.files.get({
        //     fileId:fileId,
        //     fields:'webViewLink'
        // })
        
        // return new Promise((resolve,reject)=>{
        //     (err,result)=>{
        //         if(err)reject(err)
        //         else resolve(result)
        //     }
        // })
//         return result.data.webViewLink
//     } catch (error) {
//         console.log(error)
//     }
// }

module.exports = {createAndUploadFile,getEmails}

// createAndUploadFile().catch(console.error);
