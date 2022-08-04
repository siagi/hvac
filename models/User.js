const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username:{type:String,required:true,unique:false},
        password:{type:String,required:true},
        name:{type:String,required:true},
        surname:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        phone:{type:String,unique:true},
        avatarId:{type:String},
        avatarLink:{type:String}

    },
    {timestamps:true}
)

module.exports = mongoose.model("User",UserSchema)