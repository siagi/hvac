const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    const authToken = req.headers.token;
    console.log('headers',req.headers);
    console.log('auth token',authToken)
    if(authToken){
        jwt.verify(authToken,process.env.JWT_SECRET,(err,data)=>{
            if(err) res.status(403).json("Token is not valid");
            req.data = data;
            next();

        });
    }else{
        return res.status(401).json("You are not autheticated")
    }
}

module.exports = {verifyToken};