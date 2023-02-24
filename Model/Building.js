import mongoose from "mongoose";
const { Schema, model } = mongoose;

const buildingSchema = new Schema({
  name: { type: String, require: true, unique: true },
  lng: { type: Number, require: true},
  lat: { type: Number, require: true },
  location: { type: String, require: true},
  floors: { type: Array, default: null}
});

const Building = model("Building", buildingSchema);

export default Building;