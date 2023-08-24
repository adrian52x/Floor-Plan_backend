import mongoose from "mongoose";
const { Schema, model } = mongoose;

const pcSchema = new Schema({
    name: { type: String, required: true }, 
    lansweeper: { type: String, required: true }
});

const PC = model("PC", pcSchema);

export default PC;