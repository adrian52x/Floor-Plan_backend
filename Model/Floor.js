import mongoose from "mongoose";
const { Schema, model } = mongoose;

const floorSchema = new Schema({
    level: { type: Number, required: true },
    building_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
});

const Floor = model("Floor", floorSchema);

export default Floor;