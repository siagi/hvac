const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
    {
        producer:{type:String,required:true},
        model:{type:Number},
        serial_number:{type:String,required:true,unique:true},
        power:{type:Number},
        type_of_indoor_unit:{type:String},
        type_of_refrigerant:{type:String},
        production_year:{type:Number},
        mass_of_regrigerant:{type:Number}
        
    },
    {timestamps:true}
)

module.exports = mongoose.model("Device",DeviceSchema)