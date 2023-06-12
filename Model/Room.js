import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roomSchema = new Schema({
    name: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String, enum: ['meetingRoom', 'printerRoom', 'office', 'lab', 'room'] },
    floor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
});

const Room = model("Room", roomSchema);

export default Room;