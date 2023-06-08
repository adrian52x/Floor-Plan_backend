import mongoose from "mongoose";
const { Schema, model } = mongoose;

const buildingSchema = new Schema({
  name: { type: String, require: true, unique: true },
  location: { type: String, require: true},
});

const Building = model("Building", buildingSchema);

export default Building;