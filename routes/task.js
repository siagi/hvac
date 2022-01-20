const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken');
const Task = require('../models/Task');

router.get('/allfororder/',verifyToken, async (req,res)=>{
    try {
        const order = req.body.order
        const tasks = await Task.find({order_id:order.order_id});
        res.status(200).json(tasks);

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

router.post('/add',verifyToken,async (req,res)=>{
    
    const task = new Task({
        customer_id:req.body.customer_id,
        order_id:req.body.order_id,
        user_id:req.body.user_id,
        description:req.body.description_id
    })
    
    try {
        const savedTask = await task.save();
        res.status(200).json(savedTask);
        
    } catch (error) {
        res.status(500).json(error);
        
    }
})

router.put('/edit/:id',verifyToken,async (req,res)=>{
    try {
        const task = await Task.findOneAndUpdate(req.params.id,
             {
             $set:req.body,
            },
            {new:true}
        );
            res.status(200).json(task);
    } catch (error) {
        res.status(500).json(error);
        
    }
})

router.delete('/delete/:id',verifyToken,async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete(req.params.id);
            res.status(200).json(task);
    } catch (error) {
        res.status(500).json(error);
        
    }
})

module.exports = router;