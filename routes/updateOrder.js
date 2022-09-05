const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken')
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');



router.post('/update', async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL);
    // console.log('DATA',req.data);
    console.log('BOODYY', req.body.devices);
    const id = req.body.orderId;
    const companydet = req.body.companyDetails;
    const someDate = req.body.serviceDate;
    const createDate = new Date(someDate.date);
    // createDate.setHours(someDate.hour,0,0,0)
    // createDate.setHours(someDate.hour)
    console.log('CREATE DATE',createDate);
    let order = await Order.findById(id).updateOne({
        devices:req.body.devices,
        serviceDate:createDate,

    });
    const findCustomer = await Customer.findById(order.companyDetails).updateOne({
        name:companydet.name,
        nip:companydet.nip,
        street: companydet.street,
        postcode: companydet.postcode,
        city: companydet.city,
        phone:companydet.phone
    });
    
    console.log('Customer',findCustomer);

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