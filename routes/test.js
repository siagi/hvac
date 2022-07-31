const router = require('express').Router();
// const {verifyToken} = require('../middleware/verifyToken')

router.get('/test', (req,res) =>{
    // console.log('DATA',req.data);
    console.log('asdf')
    res.status(200).json({mail:'confirmed'});
})


module.exports = router