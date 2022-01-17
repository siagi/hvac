const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken');
const Device = require('../models/Device');

router.get('/:id',verifyToken,async(req,res)=>{

    try {
        const device = await Device.findById(req.params.id);
            res.status(200).json(device);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.get('/all',verifyToken,async(req,res)=>{

    try {
        const device = await Device.find({});
            res.status(200).json(device);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.post('/add',verifyToken,async(req,res)=>{

    const newDevice = new Device({
        producer:req.body.producer,
        model:req.body.model,
        serial_number:req.body.serial_number,
        power:req.body.power,
        type_of_indoor_unit:req.body.type_of_indoor_unit,
        type_of_refrigerant:req.body.type_of_refrigerant,
        production_year:req.body.production_year,
        mass_of_regrigerant:req.body.mass_of_regrigerant
    })

    try {
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
        
    } catch (error) {
        res.status(500).json(error);
    }

    
})

router.put('/edit/:id',verifyToken,async (req,res)=>{

    try {
        const device = await Device.findOneAndUpdate(req.params.id,
             {
             $set:req.body,
            },
            {new:true}
        );
            res.status(200).json(device);
    } catch (error) {
        res.status(500).json(error);
        
    }
})

router.delete('/:id',verifyToken,async(req,res)=>{

    try {
        const device = await Device.findOneAndDelete(req.params.id);
            res.status(200).json(device);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})



module.exports = router