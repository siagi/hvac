const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        type:{
            gwarancyjny:{
                awaria:{type:String,required:false},
                serwis:{type:String, required:false}
            },
            pogwarancyjny:{
                awaria:{type:String,required:false},
                serwis:{type:String, required:false}
            }
        },
        customer:{type:mongoose.Types.ObjectId, required:false},
        devices:[
            {
                _id:{type:mongoose.Types.ObjectId, required:false}
            }
        ],
        description:{type:String, required:true},
        title:{type:String, required:true}
    },
    {timestamps:true}
)

module.exports = mongoose.model("Order",OrderSchema)