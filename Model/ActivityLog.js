import mongoose from "mongoose";
const { Schema, model } = mongoose;

const activityLogSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userAction: { type: String, required: true },
    date: { type: String },
    time: { type: String }
});

const ActivityLog = model("ActivityLog", activityLogSchema);

export default ActivityLog;