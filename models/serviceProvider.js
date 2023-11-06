import mongoose from "mongoose"


// Defination of schema
const serviceProviderSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    phoneNo:{type:String,required:true,trim:true},
    localAddress:{type:String,required:true,trim:true},
    city:{type:String,required:true,trim:true},
    district:{type:String,required:true,trim:true},
    state:{type:String,required:true,trim:true},
    pinCode:{type:String,required:true,trim:true},
    photoURL:{type:String,required:true,trim:true},
    profession:{type:String,required:true,trim:true}
})

// Model
const serviceProviderModel=mongoose.model("serviceProvider",serviceProviderSchema)

// export 
export default serviceProviderModel