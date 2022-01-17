const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken');
const Raport = require('../models/Raport');

router.get('/all',verifyToken, async(req,res)=>{

    try {
        const raport = await Raport.find({});
            res.status(200).json(raport);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.get('/:id',verifyToken, async(req,res)=>{

    try {
        const raport = await Raport.findById(req.params.id);
            res.status(200).json(raport);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.put('edit/:id',verifyToken, async(req,res)=>{

    try {
        const raport = await Raport.findOneAndUpdate(req.params.id,
             {
             $set:req.body,
            },
            {new:true}
        );
            res.status(200).json(raport);
    } catch (error) {
        res.status(500).json(error);
        
    }
    
})

router.delete('/delete/:id',verifyToken, async(req,res)=>{

    try {
        const raport = await Raport.findOneAndDelete(req.params.id);
            res.status(200).json(raport);
    } catch (error) {
        res.status(500).json(error);
        
    }

})

router.post('/add',verifyToken,async (req,res)=>{

    const newRaport = new Raport({
        customer_id:req.body.customer_id,
        cleaning_the_heat_exchanger_of_the_indoor_unit:req.body.cleaning_the_heat_exchanger_of_the_indoor_unit,
        cleaning_the_heat_exchanger_of_the_outdoor_unit:req.body.cleaning_the_heat_exchanger_of_the_outdoor_unit,
        recharging_the_refrigerant:req.body.recharging_the_refrigerant,
        amount_of_recharging_the_refrigerant:req.body.amount_of_recharging_the_refrigerant,
        type_of_recharging_the_refrigerant:req.body.type_of_recharging_the_refrigerant,
        pressure_checking:req.body.pressure_checking,
        electrics_condition_checking:req.body. electrics_condition_checking,
        airflow_temperature_checking:req.body.airflow_temperature_checking,
        evaporation_temperature_checking:req.body.evaporation_temperature_checking,
    })

    try {
        const savedRaport = await newRaport.save();
        res.status(201).json(savedRaport);
        
    } catch (error) {
        res.status(500).json(error);
    }

})


module.exports = router;