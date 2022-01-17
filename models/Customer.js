const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,unique:true},
        nip:{type:Number,unique:true},
        street:{type:String},
        postcode:{type:String},
        city:{type:String},
        email:{type:String,required:true,unique:true},
        phone:{type:Number,unique:true},
        discount:{type:Number}
        
    },
    {timestamps:true}
)

module.exports = mongoose.model("Customer",CustomerSchema)