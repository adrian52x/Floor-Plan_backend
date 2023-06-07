import mongoose from "mongoose";
const { Schema, model } = mongoose;

const buildingObjectSchema = new Schema({
  name: { type: String, required: true},
  objectType: { type: String, required: true},
  floor: { type: Number, required: true},
  building: { type: String, required: true},
  equipment: { type: String, default: null }
}, {
  index: { unique: true, partialFilterExpression: { namn: { $exists: true }, building: { $exists: true }, floor: { $exists: true }, objectType: { $exists: true } } }
});


const buildingObject = model("buildingObject", buildingObjectSchema);

export default buildingObject;