import mongoose from "mongoose";
const { Schema, model } = mongoose;

const networkPointSchema = new Schema({
    portName: { type: String, required: true },
    switchPort: { type: String, required: false },
});

const NetworkPoint = model("NetworkPoint", networkPointSchema);

export default NetworkPoint;