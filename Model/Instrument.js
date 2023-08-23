import mongoose from "mongoose";
const { Schema, model } = mongoose;

const instrumentSchema = new Schema({
    name: { type: String, required: true },
    assetId: { type: String, required: true }, 
    lansweeper: { type: String, required: true },
    actionRequired: { type: Boolean, required: false, default: false },
    description: { type: String, required: false },
});

const Instrument = model("Instrument", instrumentSchema);

export default Instrument;