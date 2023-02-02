import mongoose from "mongoose";
const { Schema, model } = mongoose;

const buildingSchema = new Schema({
  buildingName: { type: String, unique: true },
  location: { type: String, default: null }
});

const Building = model("Building", buildingSchema);

export default Building;