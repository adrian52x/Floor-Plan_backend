import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roomSchema = new Schema({
    name: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String },
    floor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
    position: [{
        left: { type: Number},
        top: { type: Number},
        width: { type: Number},
        height: { type: Number}
    }]
});

const Room = model("Room", roomSchema);

export default Room;