const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken')



router.get('/usertest', verifyToken, (req,res) =>{
    // console.log('DATA',req.data);
    res.send('AAA');
})


module.exports = router