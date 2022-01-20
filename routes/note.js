const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken');
const Note = require('../models/Note');

router.get('/allfororder/',verifyToken,(req,res)=>{
    try {
        const order = req.body.order
        const notes = note.find({order_id:order.order_id});
        res.status(200).json(notes);

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

router.post('/add',verifyToken,(req,res)=>{
    
    const note = new note({
        customer_id:req.body.customer_id,
        order_id:req.body.order_id,
        user_id:req.body.user_id,
        description:req.body.description_id
    })
    
    try {
        const savednote = await note.save();
        res.status(200).json(savednote);
        
    } catch (error) {
        res.status(500).json(error);
        
    }
})

router.put('/edit/:id',verifyToken,(req,res)=>{
    try {
        const note = await note.findOneAndUpdate(req.params.id,
             {
             $set:req.body,
            },
            {new:true}
        );
            res.status(200).json(note);
    } catch (error) {
        res.status(500).json(error);
        
    }
})

router.delete('/delete/:id',verifyToken,(req,res)=>{
    try {
        const note = await note.findOneAndDelete(req.params.id);
            res.status(200).json(note);
    } catch (error) {
        res.status(500).json(error);
        
    }
})

module.exports = router;