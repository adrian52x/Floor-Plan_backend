import mongoose from "mongoose";
const { Schema, model } = mongoose;

const pcSchema = new Schema({
    name: { type: String, required: true }, 
    lansweeper: { type: String, required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false }

});
const PC = model("PC", pcSchema);

export default PC;