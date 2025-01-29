import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName : {
        firstName : {
            type: String,
            required: true,
            minlength: [ 3, 'First Name must be atleast 3 characters long' ],
        },
        lastName : {
            type: String,
            //reuired: false,
            minlength: [3, 'Last Name must be atleast 3 characters long'],
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [6, 'Username must be atleast 6 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be atleast 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,  //This ensures that whenever we try to get the user details, the password will not be seleccted
        //minlength: [5,'Password must be atleast 5 characters long']
    },
    //SocketId is used here for live tracking of driver 
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET) ;
    return token ;
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password) ; 
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}


const userModel = mongoose.model('user', userSchema) ;

export default userModel;
