const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken')



router.post('/update', (req,res) =>{
    // console.log('DATA',req.data);
    console.log('BOODYY', req.body)
    const someDate = req.body.serviceDate;
    const createDate = new Date(someDate.date);
    createDate.setHours(someDate.hour,0,0,0)
    // createDate.setHours(someDate.hour)
    console.log('CREATE DATE',createDate);
    // console.log('ASDF')
    res.send('AAA');
})


module.exports = router