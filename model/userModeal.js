const mongoose =require("mongoose");


const userSchema=mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    isAdmin:{
        type:Boolean,
        require:true
    },
    password:{
        type:String,
        require:true
    }
}
   
)

module.exports = mongoose.model("user" , userSchema )
