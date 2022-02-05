const google = require('../google/index')
const {Blob, Buffer} = require('buffer')
const {readFile} = require('fs/promises')
const util = require('util')


const router = require('express').Router();
router.post('/upload',(req,res)=>{
    const cb = (a) =>{
        console.log(a)
        console.log(req.body)

    };
    if(req.files){
        google.createAndUploadFile(req.files.File.data,cb)
    }else{
        cb()
    }
        // google.check(req.files.File.data)
    

    // console.log(await google.createAndUploadFile(req.files.File.data));
    // console.log('aa')
    // console.log(google.createAndUploadFile(req.files.File.data))
    // function doSomething() { 
    //     return new Promise((resolve,reject)=>{
    //        google.createAndUploadFile(req.files.File.data);
    //     })
    // }
    // console.log(doSomething().finally(a=>console.log(a)));


//    const id = google.createAndUploadFile(req.files.File.data)

//    console.log(google.createAndUploadFile(req.files.File.data))
// let link = '';

// const stuff = async () =>{

//     const id = await google.createAndUploadFile(req.files.File.data);
//     console.log(id);
//     const link = await google.generatePublicUrl(id);
//     console.log(link);

//     return link;
// }

// console.log(stuff());

// await google.generatePublicUrl(link);

// console.log(link)

// console.log(link);

    // const asdf = Buffer.from(req.files.File.data)
    
    // console.log(asdf);
    
    // const data  = new Uint8Array(req.files.File.data).buffer
 
    // const aaa = await writeFromStream(req.files.File.data)
    // const demoBuffer = req.files.File.data ;
    // const asdf = Uint8Array.from(demoBuffer);
    // console.log(asdf);
    // req.pipe(google.createAndUploadFile(req.files.File.data));
    // const link = await google.createAndUploadFile(req.files.File.data);

    // const asdf = async() =>{
    //     const asdf = await google.createAndUploadFile(req.files.File.data)
    // }

    // console.log(link)
    
    // google.generatePublicUrl('1VDQ04O0P91N_9T8HbsOyUjXVEraNW2we')
    // console.log(req.body.Name);
    
})

module.exports = router