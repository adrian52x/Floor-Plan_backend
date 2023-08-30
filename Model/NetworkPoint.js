import mongoose from "mongoose";
const { Schema, model } = mongoose;

const networkPointSchema = new Schema({
    name: { type: String, required: true },
    switchPort: { type: String, required: false },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false }
});

const NetworkPoint = model("NetworkPoint", networkPointSchema);

export default NetworkPoint;