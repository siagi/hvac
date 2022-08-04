const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        name:{type:String,required:false, unique:false},
        nip:{type:Number,unique:true},
        street:{type:String},
        postcode:{type:String},
        city:{type:String},
        email:{type:String,required:true,unique:true},
        phone:{type:Number,unique:false},
        discount:{type:Number}
        
    },
    {timestamps:true}
)

module.exports = mongoose.model("Customer",CustomerSchema)