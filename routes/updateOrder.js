const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken')
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');



router.post('/update', async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL);
    // console.log('DATA',req.data);
    console.log('BOODYY', req.body);
    const id = req.body.orderId;
    const companydet = req.body.companyDetails;
    const someDate = req.body.serviceDate;
    const createDate = new Date(someDate.date);
    // createDate.setHours(someDate.hour,0,0,0)
    // createDate.setHours(someDate.hour)
    console.log('CREATE DATE',createDate);
    let order = await Order.findById(id);
    console.log('Order Customer',order.companyDetails)
    const customer = await Customer.findById(order.companyDetails);
    console.log('company DEET',companydet)
    const asddd = await Customer.findByIdAndUpdate(order.companyDetails,{...customer, companydet},{},(err, doc)=>{
        if(err) console.log(err);
        console.log('doc',doc);
    })
    console.log('Customer',asddd)

    mongoose.disconnect();
    
    // if(order){
    // }
    // console.log('ASDF')
    //1 Get the Order
    //2Get the customer
    //3 Update customer
    //4Update order
    res.send('AAA');
})


module.exports = router