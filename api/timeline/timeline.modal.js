import mongoose, { Schema } from 'mongoose';
import timestamps from "mongoose-timestamp";

const timelineSchema = Schema({
    userId: String,
    timeline: Array,
}, { timestamps: { createdAt: 'created_at' } })

export const timelineList = mongoose.model('timelineDocument', timelineSchema);
