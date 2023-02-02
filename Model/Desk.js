import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DeskSchema = new Schema({
  deskName: { type: String, unique: true },
  equipment: { type: String, default: null }
});

const Desk = model("Desk", DeskSchema);

export default Desk;