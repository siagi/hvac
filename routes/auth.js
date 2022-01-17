const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

router.post("/register",async (req,res)=>{

    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        isAdmin:req.body.isAdmin,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_PASS).toString()
    })

    try {
        const savedUser =  await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log('something wrong ? ')
        res.status(500).json(error);
    }

})

router.post('/login',async(req,res)=>{
    try {
        
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
                    isAdmin:user.isAdmin,
                },process.env.JWT_SECRET,
                {expiresIn:'10d'})
                const {password, ...others} = user._doc
                res.status(201).json({...others,accessToken})}
            }
           
        
    } catch (error) {
        console.log(error);
        // res.status(500).json(error);
    }
})

module.exports = router;