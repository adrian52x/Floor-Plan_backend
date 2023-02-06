import mongoose from "mongoose";
const { Schema, model } = mongoose;

const buildingObjectSchema = new Schema({
  name: { type: String, unique: true },
  objectType: { type: String, default: null },
  floor: { type: String, default: null },
  equipment: { type: String, default: null }
});

const buildingObject = model("buildingObject", buildingObjectSchema);

export default buildingObject;