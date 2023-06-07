import mongoose from "mongoose";
const { Schema, model } = mongoose;

const instrumentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
});

const Instrument = model("Instrument", instrumentSchema);

export default Instrument;