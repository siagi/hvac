const google = require('../google/index');
const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');



router.post("/register",async (req,res)=>{

    const cb = async (a) =>{
        const newUser = new User({

            username:req.body.username,
            password:CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_PASS).toString(),
            name:req.body.name,
            surname:req.body.surname,
            email:req.body.email,
            phone:req.body.phone,
            avatarId:a.id,
            avatarLink:a.webViewLink
    
        })

          try {
                const savedUser =  await newUser.save();
                res.status(201).json(savedUser);
            } catch (error) {
                res.status(500).json(error);
            }
    
    };
    if(req.files){
        google.createAndUploadFile(req.files.file.data,cb)
    }else{
        cb()
    }
})

router.post("/login",async(req,res)=>{
    try {
        console.log(req.body)
        const user = await User.findOne({username:req.body.username});
        if(!user){
            res.status(401).json("Wrong credentials")
        };
        if(user){
            const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.SECRET_PASS);
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
            if(originalPassword !== req.body.password) {
                res.status(401).json("Wrong credentials")
            }else{
                const accessToken = jwt.sign({
                    id:user._id,
                    name:user.name,
                    surname:user.surname,
                    email:user.email,
                    phone:user.phone,
                    avatarId:user.avatarId,
                    avatarLink:user.avatarLink,
                    isAdmin:user.isAdmin,
                },process.env.JWT_SECRET,
                {expiresIn:'10d'})
                const {password, ...others} = user._doc
                res.status(201).json({token:accessToken,user:user})}
            }
           
        
    } catch (error) {
        console.log(error);
        // res.status(500).json(error);
    }
})

module.exports = router;