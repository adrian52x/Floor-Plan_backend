import mongoose from "mongoose";
const { Schema, model } = mongoose;

const departSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    floor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
    position: [{
        left: { type: Number},
        top: { type: Number},
        width: { type: Number},
        height: { type: Number},
        color: { type: String}
    }]
});

const Department = model("Department", departSchema);

export default Department;