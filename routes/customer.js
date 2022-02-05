const { verifyToken } = require('../middleware/verifyToken');
const Customer = require('../models/Customer');

const router = require('express').Router();

router.get('/customer/:id',verifyToken,async(req,res)=>{

    try {
        const customer = await Customer.findById(req.params.id);
            res.status(200).json(customer);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.get('/all',verifyToken, async(req,res)=>{

    try {
        const customer = await Customer.find({});
            res.status(200).json(customer);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.post('/add',verifyToken,async (req,res)=>{

    console.log('wywolano')

    const newCustomer = new Customer({
        name:req.body.name,
        nip:req.body.nip,
        street:req.body.street,
        postcode:req.body.postcode,
        city:req.body.city,
        email:req.body.email,
        phone:req.body.phone,
        discount:req.body.discount
    })

    try {
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
        
    } catch (error) {
        res.status(500).json(error);
    }

})

router.put('/edit/:id',verifyToken,async (req,res)=>{

    try {
        const customer = await Customer.findOneAndUpdate(req.params.id,
             {
             $set:req.body,
            },
            {new:true}
        );
            res.status(200).json(customer);
    } catch (error) {
        res.status(500).json(error);
        
    }

})

router.delete('/delete/:id',verifyToken, async(req,res)=>{

    try {
        const customer = await Customer.findOneAndDelete(req.params.id);
            res.status(200).json(customer);
    } catch (error) {
        res.status(500).json(error);
        
    }

})


module.exports = router;