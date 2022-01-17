const mongoose = require("mongoose");

const RaportSchema = new mongoose.Schema(
    {
        customer_id:{type: mongoose.Types.ObjectId},
        cleaning_the_heat_exchanger_of_the_indoor_unit:{type:Boolean},
        cleaning_the_heat_exchanger_of_the_outdoor_unit:{type:Boolean},
        recharging_the_refrigerant:{type:Boolean},
        amount_of_recharging_the_refrigerant:{type:Number},
        type_of_recharging_the_refrigerant:{type:String},
        pressure_checking:{type:String},
        electrics_condition_checking:{type:Boolean},
        airflow_temperature_checking:{type:Boolean},
        evaporation_temperature_checking:{type:Boolean},
    },
    {timestamps:true}
)

module.exports = mongoose.model("Raport",RaportSchema)