import mongoose from "mongoose";
const { Schema, model } = mongoose;

const departSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    floor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
});

const Department = model("Department", departSchema);

export default Department;