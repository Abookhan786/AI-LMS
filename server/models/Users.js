import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
    name : {type:String, required:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required : true},
    role : {
        type : String,
        enum : ["instructor", "admin", "student"],
        default: student,
    },
},
{timestamp: true}
)
export default mongoose.model("User",UserSchema);


