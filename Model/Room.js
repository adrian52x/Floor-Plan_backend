import mongoose from "mongoose";
const { Schema, model } = mongoose;

const RoomSchema = new Schema({
  roomName: { type: String, unique: true },
  roomType: { type: String, default: null },
  floor: { type: String, default: null },
  equipment: { type: String, default: null }
});

const Room = model("Room", RoomSchema);

export default Room;