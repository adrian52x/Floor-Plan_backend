import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roomInstrumentSchema = new Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    instrumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }
});

const RoomInstrument = model("RoomInstrument", roomInstrumentSchema);

export default RoomInstrument;