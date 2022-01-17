const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        customer_id:{type: mongoose.Types.ObjectId,required:true},
        order_id:{type: mongoose.Types.ObjectId,required:true},
        user_id:{type:String,required:true},
        description:{type:String,required:true}
        
    },
    {timestamps:true}
)

module.exports = mongoose.model("Note",NoteSchema)