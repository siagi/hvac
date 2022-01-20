const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken');
const Note = require('../models/Note');

router.get('/allfororder/',verifyToken,async(req,res)=>{
    try {
        const order = req.body.order
        const notes = await Note.find({order_id:order.order_id});
        res.status(200).json(notes);

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

router.post('/add',verifyToken,async(req,res)=>{
    
    const note = new Note({
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

router.put('/edit/:id',verifyToken,async(req,res)=>{
    try {
        const note = await Note.findOneAndUpdate(req.params.id,
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

router.delete('/delete/:id',verifyToken,async(req,res)=>{
    try {
        const note = await Note.findOneAndDelete(req.params.id);
            res.status(200).json(note);
    } catch (error) {
        res.status(500).json(error);
        
    }
})

module.exports = router;