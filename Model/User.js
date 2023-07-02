import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false}
});

const User = model("User", userSchema);

export default User;