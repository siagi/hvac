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
        companyDetails:{type:mongoose.Types.ObjectId, required:false},
        devices:[
            {
                _id:{type:mongoose.Types.ObjectId, required:false},
                brand:{type:String, required:false},
                deviceType:{type:String, required:false},
                serviceType:{type:String, required:false},
                powerDevice:{type:String, required:false},
                refrigerant:{type:String, required:false},
                serialNumber:{type:String, required:false},
                deviceFaults:[
                    {type:String, required:false}
                ]
            }
        ],
        description:{type:String, required:true},
        title:{type:String, required:true},
        serviceDate:{type:Date},
        status:{type:String, required:false}
    },
    {timestamps:true}
)

module.exports = mongoose.model("Order",OrderSchema)