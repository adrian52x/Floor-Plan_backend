import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false},
    userRights: { 
        type: [String], 
        enum: ['admin', 'editor', 'viewer'], // specify the different types of rights here
        default: ['editor'] // set the default right
    }
});

const User = model("User", userSchema);

export default User;