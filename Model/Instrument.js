import mongoose from "mongoose";
const { Schema, model } = mongoose;

const instrumentSchema = new Schema({
    name: { type: String, required: true },
    bmram: { type: String, required: true }, 
    lansweeper: { type: String, required: true },
    actionRequired: { type: Boolean, required: false, default: false },
    note: { type: String, required: false, default: "N/A" },
    connectedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'PC', required: false },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false }
});



const Instrument = model("Instrument", instrumentSchema);

export default Instrument;